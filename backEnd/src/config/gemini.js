import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const atsSchema = {
  type: "OBJECT",
  properties: {
    match_score: { type: "NUMBER" },
    summary: { type: "STRING" },
    missing_criteria: { type: "ARRAY", items: { type: "STRING" } },
    strengths: { type: "ARRAY", items: { type: "STRING" } },
    suggested_resume_improvements: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: [
    "match_score",
    "summary",
    "missing_criteria",
    "strengths",
    "suggested_resume_improvements",
  ],
};