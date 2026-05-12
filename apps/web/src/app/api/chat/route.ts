import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  systemPrompt: string;
  ragContext: string;
  messages: ChatMessage[];
};

function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));
}

// 기본: Gemini 3.1 Flash Lite. 계정에 없으면 다음 후보로 폴백합니다.
// https://ai.google.dev/gemini-api/docs/models
const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
] as const;

function getModelCandidates(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  if (!preferred) return [...FALLBACK_MODELS];
  return [...new Set([preferred, ...FALLBACK_MODELS])];
}

function extractRetryAfterSeconds(message: string): number | null {
  // Gemini error strings sometimes include "Please retry in 38.1s" or a JSON snippet with retryDelay:"38s"
  const m1 = message.match(/Please retry in\s+(\d+(?:\.\d+)?)s/i);
  if (m1?.[1]) return Math.max(1, Math.ceil(Number(m1[1])));
  const m2 = message.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (m2?.[1]) return Math.max(1, Number(m2[1]));
  return null;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY in environment" },
      { status: 500 }
    );
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { systemPrompt, ragContext, messages } = body ?? {};
  if (!systemPrompt || !ragContext || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "systemPrompt, ragContext, messages are required" },
      { status: 400 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  

  try {
    const contents = toGeminiContents(messages);
    const systemInstruction = `${systemPrompt}\n\n[Context]\n${ragContext}`;

    let lastError: unknown;
    const modelCandidates = getModelCandidates();
    for (const candidate of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: candidate,
          systemInstruction
        });

        const result = await model.generateContent({
          contents,
          generationConfig: {
            temperature: 0.7
          }
        });

        const text = result.response.text();
        return NextResponse.json({ text, model: candidate });
      } catch (e) {
        lastError = e;
        const message = e instanceof Error ? e.message : String(e);
        // If model is not found / unsupported, try next candidate.
        if (message.includes("404") || message.includes("not found")) continue;
        throw e;
      }
    }

    const message =
      lastError instanceof Error ? lastError.message : "Unknown error";
    return NextResponse.json(
      { error: message, triedModels: modelCandidates },
      { status: 500 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      const retryAfterSeconds = extractRetryAfterSeconds(message);
      return NextResponse.json(
        { error: message, retryAfterSeconds },
        {
          status: 429,
          headers: retryAfterSeconds
            ? { "retry-after": String(retryAfterSeconds) }
            : undefined
        }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

