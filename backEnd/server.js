import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import formidable from "formidable";
import fs from "fs";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------
// Gemini Client
// ----------------------------------

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ----------------------------------
// Vector Similarity
// ----------------------------------

const cosineSimilarity = (vecA, vecB) => {
  if (!vecA?.length || !vecB?.length) return 0;

  const dotProduct = vecA.reduce(
    (sum, a, i) => sum + a * (vecB[i] || 0),
    0
  );

  const magnitudeA = Math.sqrt(
    vecA.reduce((sum, a) => sum + a * a, 0)
  );

  const magnitudeB = Math.sqrt(
    vecB.reduce((sum, b) => sum + b * b, 0)
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

// ----------------------------------
// Gemini Embeddings
// ----------------------------------

const em = async (text) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  if (!response?.embeddings?.[0]?.values) {
    throw new Error("Failed to generate embeddings.");
  }

  return response.embeddings[0].values;
};

// ----------------------------------
// Gemini Analysis
// ----------------------------------

async function gpt(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  return (
    response?.text ||
    response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ""
  );
}

// ----------------------------------
// Azure Form Recognizer
// ----------------------------------

const formRecognizerClient = new DocumentAnalysisClient(
  process.env.FORM_RECOGNIZER_ENDPOINT,
  new AzureKeyCredential(process.env.FORM_RECOGNIZER_API_KEY)
);

async function extractTextFromFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);

  const poller = await formRecognizerClient.beginAnalyzeDocument(
    "prebuilt-read",
    fileBuffer
  );

  const result = await poller.pollUntilDone();

  if (!result?.content) {
    throw new Error("Failed to extract text from resume.");
  }

  return result.content;
}

// ----------------------------------
// Utility
// ----------------------------------

function stripCodeFence(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}

// ----------------------------------
// ATS Match Endpoint
// ----------------------------------

app.post("/api/match", async (req, res) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form Parse Error:", err);

      return res.status(400).json({
        error: "Failed to process form data.",
      });
    }

    const rawFile = Array.isArray(files.file)
      ? files.file[0]
      : files.file;

    const rawJd = Array.isArray(fields.jobDescription)
      ? fields.jobDescription[0]
      : fields.jobDescription;

    if (!rawFile || !rawJd) {
      return res.status(400).json({
        error: "Resume file and Job Description are required.",
      });
    }

    try {
      console.log("Extracting resume text...");

      const resumeText = await extractTextFromFile(
        rawFile.filepath
      );

      console.log(
        "Resume Characters:",
        resumeText.length
      );

      console.log(
        "JD Characters:",
        rawJd.length
      );

      // Optional truncation for very large files
      const resumeForAnalysis = resumeText.slice(0, 12000);
      const jdForAnalysis = rawJd.slice(0, 8000);

      console.log("Generating embeddings...");

      const resumeEmbedding = await em(resumeForAnalysis);
      const jdEmbedding = await em(jdForAnalysis);

      const similarity = cosineSimilarity(
        resumeEmbedding,
        jdEmbedding
      );

      const similarityScore = Math.max(
        0,
        Math.min(100, similarity * 100)
      ).toFixed(2);

      console.log(
        "Similarity Score:",
        similarityScore
      );

      const prompt = `
You are an expert ATS and recruitment analyst.

Analyze the resume against the job description.

Generate ONLY valid JSON.

Do not include markdown.
Do not include explanations.
Do not wrap the JSON in code blocks.

Schema:
{
  "match_score": number,
  "summary": string,
  "missing_criteria": string[],
  "strengths": string[],
  "suggested_resume_improvements": string[]
}

Resume:
${resumeForAnalysis}

Job Description:
${jdForAnalysis}

Embedding Similarity Score:
${similarityScore}
`;

      console.log("Calling Gemini...");

      const rawResponse = await gpt(prompt);

      console.log("Gemini Response:");
      console.log(rawResponse);

      if (!rawResponse) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      const cleanedJson = stripCodeFence(rawResponse);

      let parsed;

      try {
        parsed = JSON.parse(cleanedJson);
      } catch (jsonError) {
        console.error(
          "Invalid JSON Returned:",
          cleanedJson
        );

        return res.status(500).json({
          error: "Gemini returned invalid JSON.",
          rawResponse: cleanedJson,
        });
      }

      cleanupFile(rawFile.filepath);

      return res.status(200).json(parsed);
    } catch (error) {
      console.error(
        "Error Inside Match Handler:",
        error
      );

      cleanupFile(rawFile?.filepath);

      return res.status(500).json({
        error: error.message || "Internal Server Error",
      });
    }
  });
});

// ----------------------------------
// Health Check
// ----------------------------------

app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "AI ATS Backend",
  });
});

// ----------------------------------
// Start Server
// ----------------------------------

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});