import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = body?.message;
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'message' in request body" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Routing verification fallback (server-only) while debugging
    if (!apiKey) {
      return NextResponse.json({ response: "GURU JI backend works" }, { status: 200 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${encodeURIComponent(
      apiKey
    )}`;

    const payload = {
      prompt: { text: message },
      temperature: 0.2,
      maxOutputTokens: 512,
    };

    const apiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const apiText = await apiRes.text();

    if (!apiRes.ok) {
      return NextResponse.json({ error: "Generative API error", details: apiText }, { status: apiRes.status });
    }

    let parsed: any = null;
    try {
      parsed = JSON.parse(apiText);
    } catch {
      parsed = null;
    }

    const responseText =
      parsed?.candidates?.[0]?.content?.[0]?.text ||
      parsed?.outputs?.[0]?.content?.[0]?.text ||
      parsed?.text ||
      (parsed && JSON.stringify(parsed)) ||
      apiText;

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}