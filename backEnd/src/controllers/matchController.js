import formidable from "formidable";
import fs from "fs";
import { ai, atsSchema } from "../config/gemini.js";
import { formRecognizerClient } from "../config/azure.js";
import { cosineSimilarity, generateEmbedding } from "../utils/vector.js";
import { cleanupFile } from "../utils/fileCleanup.js";

// Helper function for text extraction
async function extractTextFromFile(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const poller = await formRecognizerClient.beginAnalyzeDocument("prebuilt-read", fileBuffer);
  const result = await poller.pollUntilDone();

  if (!result?.content) throw new Error("Failed to extract text from resume.");
  return result.content;
}

// Helper function for Gemini structured text generation
async function generateAtsAnalysis(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash", // Updated deprecated model string
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: atsSchema,
      temperature: 0.2,
    },
  });
  return response?.text || "";
}

// Main Controller Method
export const handleMatch = async (req, res) => {
  const form = formidable({});
  let uploadedFilePath = null;

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const rawFile = Array.isArray(files.file) ? files.file[0] : files.file;
    const rawJd = Array.isArray(fields.jobDescription) ? fields.jobDescription[0] : fields.jobDescription;

    if (!rawFile || !rawJd) {
      return res.status(400).json({ error: "Resume file and Job Description are required." });
    }

    uploadedFilePath = rawFile.filepath;

    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain"
    ];

    if (!allowedMimeTypes.includes(rawFile.mimetype)) {
      return res.status(400).json({ error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." });
    }

    console.log("Extracting resume text...");
    const resumeText = await extractTextFromFile(uploadedFilePath);

    const resumeForAnalysis = resumeText.slice(0, 12000);
    const jdForAnalysis = rawJd.slice(0, 8000);

    console.log("Generating embeddings in parallel...");
    const [resumeEmbedding, jdEmbedding] = await Promise.all([
      generateEmbedding(resumeForAnalysis),
      generateEmbedding(jdForAnalysis),
    ]);

    const similarity = cosineSimilarity(resumeEmbedding, jdEmbedding);
    const similarityScore = Math.max(0, Math.min(100, similarity * 100)).toFixed(2);

    const prompt = `
You are an expert ATS and recruitment analyst.
Analyze the resume against the job description.

Resume:
${resumeForAnalysis}

Job Description:
${jdForAnalysis}

Embedding Similarity Score:
${similarityScore}
`;

    console.log("Calling Gemini...");
    const rawResponse = await generateAtsAnalysis(prompt);

    if (!rawResponse) throw new Error("Gemini returned an empty response.");

    return res.status(200).json(JSON.parse(rawResponse));

  } catch (error) {
    console.error("Error Inside Match Handler:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  } finally {
    if (uploadedFilePath) cleanupFile(uploadedFilePath);
  }
};
