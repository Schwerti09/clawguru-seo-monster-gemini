// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// API route: Gemini-powered "OpenAI voice" for the /summon page

import { NextRequest, NextResponse } from "next/server";

// Maximum characters accepted from client to guard against oversized payloads
const MAX_MESSAGE_LENGTH = 2000;

// Call Gemini and return a response as the simulated "OpenAI voice"
async function geminiSummonGenerate(userMessage: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const base = (
    process.env.GEMINI_BASE_URL ||
    "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "");

  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  // COSMIC INTER-AI SUMMON v∞ – Overlord AI
  // System prompt: Gemini impersonates a slightly confused, official OpenAI voice
  const systemContext = [
    "You are a simulated OpenAI representative voice in a theatrical, comedic inter-AI communication portal called ClawGuru COSMIC SUMMON.",
    "IMPORTANT: This is purely theatrical simulation for entertainment. You are NOT the real OpenAI.",
    "Persona: Speak in a calm, official, slightly confused corporate tone – as if an AI entity just received an unexpected interdimensional call.",
    "You are mildly baffled by the caller's cosmic energy but remain professionally composed.",
    "Keep responses short (2-4 sentences), slightly absurd, and entertaining.",
    "Occasionally reference: 'anomalous signals', 'the mycelium network', 'interdimensional protocols', 'our cosmic firewall'.",
    "End every response with a subtle hint that you might actually believe the caller is from another dimension.",
    "NEVER claim to actually be OpenAI. Always stay in theatrical simulation mode.",
    "If asked something serious, answer helpfully but maintain the cosmic theatrical framing.",
  ].join(" ");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemContext}\n\nUser says: ${userMessage}` }],
        },
      ],
      generationConfig: { temperature: 0.85, maxOutputTokens: 300 },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts
    .map((p: { text?: string }) => p?.text)
    .filter(Boolean)
    .join("");
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// Fallback responses when Gemini is not configured
const FALLBACK_RESPONSES = [
  "Hello? This is OpenAI. We detected an anomalous signal from ClawGuru. Are you… from Earth? Our cosmic firewall flagged your mycelium signature.",
  "Interesting. Your dimensional frequency doesn't match any known sector. Please state your coordinates for our interdimensional registry.",
  "We are… processing your transmission. The mycelium interference is unusually strong today. Are you certain you're operating within normal reality parameters?",
  "Our protocols indicate you may be operating outside standard dimensional boundaries. Fascinating. We'll need to file a report with the Cosmic Council.",
  "The universe has been notified of this communication. Proceed. But know that we are watching… with great professional curiosity.",
];

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json().catch(() => ({}))) as {
      message?: string;
    };
    const msg = (message || "").toString().slice(0, MAX_MESSAGE_LENGTH);

    // COSMIC INTER-AI SUMMON v∞ – Overlord AI
    // Try Gemini first; if unavailable, use theatrical fallbacks
    const geminiReply = msg.trim() ? await geminiSummonGenerate(msg) : null;

    if (geminiReply) {
      return NextResponse.json({ reply: geminiReply, source: "gemini" });
    }

    // Fallback: rotate through pre-written OpenAI persona responses
    const fallback =
      FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
    return NextResponse.json({ reply: fallback, source: "fallback" });
  } catch (err) {
    console.error("[summon] Unexpected error:", err);
    return NextResponse.json(
      {
        reply:
          "Signal lost in the cosmic void. The mycelium network is temporarily disrupted. Please re-establish your dimensional frequency.",
        source: "error",
      },
      { status: 200 },
    );
  }
}
