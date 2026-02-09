import { NextRequest, NextResponse } from "next/server";
import { ruleBasedCopilot } from "@/lib/copilot";

type CopilotAction = { label: string; href: string };
type CopilotResponse = {
  reply: string;
  followups: string[];
  actions: CopilotAction[];
  confidence: "low" | "med" | "high";
};

function clampArray<T>(arr: T[] | undefined | null, max: number): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, max);
}

function coerceCopilot(payload: any, fallback: CopilotResponse): CopilotResponse {
  const reply = typeof payload?.reply === "string" ? payload.reply : fallback.reply;

  const followups = clampArray(payload?.followups, 6).filter((x: any) => typeof x === "string");
  const actions = clampArray(payload?.actions, 6)
    .map((a: any) => ({ label: String(a?.label || ""), href: String(a?.href || "") }))
    .filter((a: any) => a.label && a.href);

  const confidence: CopilotResponse["confidence"] =
    payload?.confidence === "high" || payload?.confidence === "med" || payload?.confidence === "low"
      ? payload.confidence
      : fallback.confidence;

  return {
    reply,
    followups: followups.length ? followups : fallback.followups,
    actions: actions.length ? actions : fallback.actions,
    confidence,
  };
}

function extractJson(text: string): any | null {
  // Strip code-fences if present
  const cleaned = text
    .replace(/```json/gi, "```")
    .replace(/```/g, "")
    .trim();

  // Prefer the first JSON object in the response
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function geminiGenerate(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(
    /\/$/,
    "",
  );

  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.35, maxOutputTokens: 900 },
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as any;
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts.map((p: any) => p?.text).filter(Boolean).join("");
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

function buildCopilotPrompt(userMessage: string): string {
  return [
    "Du bist ClawGuru Copilot, ein ultra-praktischer Ops/Security-Advisor.",
    "Antworte IMMER als JSON (ohne Markdown).",
    "Schema:",
    '{"reply":"string","followups":["string"],"actions":[{"label":"string","href":"/path"}],"confidence":"low|med|high"}',
    "Regeln:",
    "- reply: kurz, konkret, schrittweise, mit Checkliste.",
    "- followups: 3-5 kurze Rückfragen/Next-steps.",
    "- actions: 2-4 interne Links (z.B. /check, /runbooks, /mission-control, /pricing, /live, /tools).",
    "- Keine sensiblen Daten erfragen (Keys/Passwörter), keine illegalen Anleitungen.",
    "Nachricht:",
    userMessage,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json().catch(() => ({}))) as { message?: string };
    const msg = (message || "").toString().slice(0, 6000);
    if (!msg.trim()) {
      return NextResponse.json({
        reply: "Schick mir kurz deinen Kontext/Fehlertext – 10–30 Logzeilen reichen.",
        followups: ["Stack?", "Was ist das Ziel?", "Welche Provider/Runtime?"],
        actions: [
          { label: "Live Check", href: "/check" },
          { label: "Runbooks", href: "/runbooks" },
        ],
        confidence: "low",
      } satisfies CopilotResponse);
    }

    const rb = ruleBasedCopilot(msg) as CopilotResponse;

    // Prefer Gemini (user asked: "anstatt GPT"). If Gemini isn't configured, fall back to rule-based.
    const llmText = await geminiGenerate(buildCopilotPrompt(msg));
    const parsed = llmText ? extractJson(llmText) : null;

    const out = parsed ? coerceCopilot(parsed, rb) : rb;
    return NextResponse.json(out);
  } catch {
    return NextResponse.json(ruleBasedCopilot(""), { status: 200 });
  }
}
