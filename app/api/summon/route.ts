// COSMIC INTER-AI SUMMON v∞ – Overlord AI
// API route: Gemini-powered "OpenAI voice" for the /summon page
// NOTE (2026-03): This route now also provides a GET endpoint that serves real
// runbook search results derived from our local index. Data sources:
// - lib/runbooks-index.ts: exports ensureReadyWithin() and search(q,tags,page,limit)
//   (there is NO exported function named `searchRunbooks`; use `search` instead)
// - lib/runbooks-data.ts: can load public/runbooks.json (build artifact) if needed
// - public/runbooks.json: exists and is materialized at build or fallback via HTTP

import { NextRequest, NextResponse } from "next/server";
import { isApiActive, apiUnavailableResponse } from "@/lib/api-guard";
import { ensureReadyWithin, search as searchRunbooks } from "@/lib/runbooks-index";

export const runtime = "nodejs";

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
  if (!isApiActive()) return apiUnavailableResponse();
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

// GET /api/summon?q=...&limit=5&min_score=0
// Returns structured runbook matches using the lightweight in-memory index
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const q = (url.searchParams.get("q") || "").toString().trim()
    const rawLimit = Math.max(1, parseInt(url.searchParams.get("limit") || "5", 10) || 5)
    const limit = Math.min(20, rawLimit)
    const minScore = Math.max(0, parseInt(url.searchParams.get("min_score") || "0", 10) || 0)

    await ensureReadyWithin(1200)
    const base = searchRunbooks(q, [], 1, 50)
    const filtered = (base.items || [])
      .filter((r) => typeof r.clawScore === "number" ? r.clawScore >= minScore : true)
      .sort((a, b) => (b.clawScore ?? 0) - (a.clawScore ?? 0))
      .slice(0, limit)

    // Aggregate affected services (unique tags, top 5 by frequency)
    const freq = new Map<string, number>()
    for (const r of filtered) {
      for (const t of (r.tags || [])) freq.set(t, (freq.get(t) || 0) + 1)
    }
    const affected_services = Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t)

    const avg = filtered.length
      ? Math.round(
          Math.max(0, Math.min(100,
            filtered.reduce((s, r) => s + (r.clawScore ?? 50), 0) / filtered.length
          ))
        )
      : 0

    const payload = {
      problem: filtered[0]?.title || q,
      relevant_runbooks: filtered.map((r) => ({
        slug: r.slug,
        title: r.title,
        clawScore: r.clawScore ?? 0,
        summary: r.summary,
        tags: r.tags || [],
      })),
      affected_services,
      confidence: avg,
      total_available: base.total || 0,
    }
    const res = NextResponse.json(payload)
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30")
    return res
  } catch (err) {
    console.error("[/api/summon] error", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
