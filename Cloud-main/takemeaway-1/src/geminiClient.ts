// src/geminiClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ Missing Gemini API key! Add VITE_GEMINI_API_KEY to your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Correct method for v1 API
export const getGeminiModel = (model = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model });
};
