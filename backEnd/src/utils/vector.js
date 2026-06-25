import { ai } from "../config/gemini.js";

export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA?.length || !vecB?.length) return 0;

  const dotProduct = vecA.reduce((sum, a, i) => sum + a * (vecB[i] || 0), 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

export const generateEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  if (!response?.embeddings?.[0]?.values) {
    throw new Error("Failed to generate embeddings.");
  }

  return response.embeddings[0].values;
};