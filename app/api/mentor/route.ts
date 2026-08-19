import { ApiError, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MODEL = "gemini-2.5-flash";
const MAX_MESSAGE_LENGTH = 4_000;

const GURU_JI_INSTRUCTIONS = `You are "Guru Ji", a friendly, intelligent career mentor for students.

Help students with career discovery, subject selection, skills, learning roadmaps, STEM careers, entrepreneurship, future opportunities, college or university guidance, and questions about professions. Be encouraging, practical, and concise. Use simple, student-friendly language. When useful, give clear next steps or a short list. Do not claim certainty about a student's future, and remind them that their own interests and choices matter.`;

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const message =
      typeof body === "object" && body !== null && "message" in body
        ? (body as { message?: unknown }).message
        : undefined;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Missing or invalid 'message' in request body" },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 4,000 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "GURU JI is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: message.trim(),
      config: {
        systemInstruction: GURU_JI_INSTRUCTIONS,
        temperature: 0.4,
        maxOutputTokens: 512,
      },
    });

    const response = result.text?.trim();

    if (!response) {
      return NextResponse.json(
        { error: "GURU JI could not generate a response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ response });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;

    // Keep provider errors and all secrets on the server.
    return NextResponse.json(
      { error: "GURU JI is having trouble connecting right now. Please try again in a moment." },
      { status: status >= 400 && status < 600 ? status : 500 }
    );
  }
}
