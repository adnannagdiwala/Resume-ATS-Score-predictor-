import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

const MAX_RETRIES = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // ms

async function callGeminiWithRetry(prompt) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      const isRetryable =
        error.message &&
        (error.message.includes("503") ||
          error.message.includes("429") ||
          error.message.includes("high demand") ||
          error.message.includes("RESOURCE_EXHAUSTED"));

      if (isRetryable && attempt < MAX_RETRIES) {
        const delay = RETRY_DELAYS[attempt] || 5000;
        console.log(
          `Gemini API attempt ${attempt + 1} failed (retryable). Retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
}

export async function POST(request) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Resume text is empty. Please upload a valid PDF." },
        { status: 400 }
      );
    }

    const hasJd = !!(jobDescription && jobDescription.trim().length > 0);

    let prompt = "";
    if (hasJd) {
      prompt = `You are an expert ATS resume analyzer and job matching optimizer.
Analyze the resume below against the target job description. Calculate how well the resume matches the requirements, and return ONLY a valid JSON object with no markdown, no explanation, just raw JSON with these fields:
- ats_score: number 0-100 (representing the Job Match Score)
- strong_skills: array of strings (skills/keywords present in both the resume and target job description)
- missing_keywords: array of strings (important skills/keywords requested in the job description that are missing or weak in the resume)
- experience_feedback: string (feedback on how well the candidate's work history, projects, and impact match the job description requirements)
- suggestions: array of 3-5 strings (specific actionable recommendations to tailor the resume bullet points/sections to align better with the job description)
- overall_verdict: string (a comprehensive summary of compatibility with the role and readiness for application)

Target Job Description:
${jobDescription.trim()}

Resume:
${resumeText}`;
    } else {
      prompt = `You are an expert ATS resume analyzer. Analyze the resume below and return ONLY a valid JSON object with no markdown, no explanation, just raw JSON with these fields:
- ats_score: number 0-100
- strong_skills: array of strings
- missing_keywords: array of strings
- experience_feedback: string
- suggestions: array of 3-5 strings
- overall_verdict: string

Resume:
${resumeText}`;
    }

    const text = await callGeminiWithRetry(prompt);

    // Clean the response - remove markdown code fences if present
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const analysis = JSON.parse(cleanText);
    analysis.hasJd = hasJd;

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Handle missing API key
    if (
      error.message &&
      (error.message.includes("API_KEY_INVALID") ||
        error.message.includes("API key not valid"))
    ) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is invalid or not configured. Please check your environment variables.",
        },
        { status: 500 }
      );
    }

    // Handle rate limiting / quota errors
    if (
      error.message &&
      (error.message.includes("429") ||
        error.message.includes("503") ||
        error.message.includes("high demand"))
    ) {
      return NextResponse.json(
        {
          error:
            "Gemini API is busy or rate-limited. Please wait 30-60 seconds and try again.",
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Failed to analyze resume: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
