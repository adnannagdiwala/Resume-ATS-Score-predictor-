import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is not set. Add it to your Vercel Environment Variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
