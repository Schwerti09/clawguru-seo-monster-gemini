import { NextRequest, NextResponse } from "next/server";
import { ruleBasedCopilot } from "@/lib/copilot";
import { ensureReadyWithin, search as searchRunbooks } from "@/lib/runbooks-index";

type CopilotAction = { label: string; href: string };
type CopilotResponse = {
  reply: string;
  followups: string[];
  actions: CopilotAction[];
  confidence: "low" | "medium" | "high";
};

function clampArray<T>(arr: T[] | undefined | null, max: number): T[] {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, max);
}

function coerceCopilot(payload: unknown, fallback: CopilotResponse): CopilotResponse {
  const p = payload as Record<string, unknown>;
  const reply = typeof p?.reply === "string" ? p.reply : fallback.reply;

  const followups = clampArray(p?.followups as string[] | undefined, 6).filter((x) => typeof x === "string");
  const actions = clampArray(p?.actions as { label?: unknown; href?: unknown }[] | undefined, 6)
    .map((a) => ({ label: String(a?.label || ""), href: String(a?.href || "") }))
    .filter((a) => a.label && a.href);

  const confidence: CopilotResponse["confidence"] =
    p?.confidence === "high" || p?.confidence === "medium" || p?.confidence === "low"
      ? p.confidence as CopilotResponse["confidence"]
      : fallback.confidence;

  return {
    reply,
    followups: followups.length ? followups : fallback.followups,
    actions: actions.length ? actions : fallback.actions,
    confidence,
  };
}

function extractJson(text: string): unknown {
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
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return null;
  const text = parts.map((p: { text?: string }) => p?.text).filter(Boolean).join("");
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

function buildCopilotPrompt(userMessage: string): string {
  return [
    "Du bist ClawGuru Copilot, ein ultra-praktischer Ops/Security-Advisor.",
    "Antworte IMMER als JSON (ohne Markdown).",
    "Schema:",
    '{"reply":"string","followups":["string"],"actions":[{"label":"string","href":"/path"}],"confidence":"low|medium|high"}',
    "Regeln:",
    "- reply: kurz, konkret, schrittweise, mit Checkliste.",
    "- followups: 3-5 kurze Rückfragen/Next-steps.",
    "- actions: 2-4 interne Links (z.B. /check, /runbooks, /mission-control, /pricing, /live, /tools).",
    "- Keine sensiblen Daten erfragen (Keys/Passwörter), keine illegalen Anleitungen.",
    "Nachricht:",
    userMessage,
  ].join("\n");
}

function buildMermaidFlow(problem: string, topTitles: string[]): string {
  const safe = (s: string) => s.replace(/[^a-z0-9\- ]/gi, "").slice(0, 40);
  const p = safe(problem) || "Problem";
  const t1 = safe(topTitles[0] || "Runbook A");
  const t2 = safe(topTitles[1] || "Runbook B");
  const t3 = safe(topTitles[2] || "Runbook C");
  return [
    "```mermaid",
    "flowchart LR",
    `  A[${p}] --> B{Assess}`,
    `  B --> C[${t1}]`,
    `  B --> D[${t2}]`,
    `  B --> E[${t3}]`,
    "  C --> F[Verify]",
    "  D --> F[Verify]",
    "  E --> F[Verify]",
    "```",
  ].join("\n");
}

function toKebab(s: string): string {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function enrichWithRunbooks(message: string, base: CopilotResponse): Promise<CopilotResponse> {
  try {
    await ensureReadyWithin(1200);
    const res = searchRunbooks(message, [], 1, 6);
    const items = Array.isArray(res?.items) ? res.items.slice(0, 6) : [];
    const top = items[0];

    const clawAvg = items.length
      ? Math.round(
          Math.max(
            0,
            Math.min(
              100,
              items.reduce((s: number, r: any) => s + (r.clawScore ?? 60), 0) / items.length,
            ),
          ),
        )
      : 0;

    const recLines = items.map((r: any) => `• ${r.title} — /runbook/${encodeURIComponent(r.slug)}`);
    const mermaid = buildMermaidFlow(message, items.map((r: any) => r.title));

    const explain = base.reply || "";
    const richReply = [
      `Problem: ${message}`,
      "\nErklärung:",
      explain,
      "\nRunbook-Empfehlungen (aus 4,2 Millionen):",
      recLines.join("\n"),
      "\nNext Steps:",
      "1) Check Exposure & Logs",
      "2) Wende das passende Runbook an",
      "3) Verifiziere mit /check und Monitoring",
      `\nClawScore: ~${clawAvg} · Vertrauen: ${base.confidence}`,
      "\nDiagramm:",
      mermaid,
      "\nDeep Links:",
      `• Oracle: /oracle?q=${encodeURIComponent(message)}`,
      `• Summon: /summon?q=${encodeURIComponent(top?.title || message)}`,
      "• Mycelium: /mycelium",
      "• Neuro: /neuro",
    ].join("\n");

    const actions: CopilotAction[] = [
      { label: "Runbooks", href: "/runbooks" },
      { label: "Oracle Vorhersage", href: `/oracle?q=${encodeURIComponent(message)}` },
      { label: "Summon Suche", href: `/summon?q=${encodeURIComponent(top?.title || message)}` },
      { label: "Mycelium Graph", href: "/mycelium" },
      { label: "Neuro Playbooks", href: "/neuro" },
    ];
    if (top?.slug) actions.unshift({ label: `Top Runbook: ${top.title}`, href: `/runbook/${encodeURIComponent(toKebab(top.slug))}` });

    return {
      ...base,
      reply: richReply,
      actions,
      followups: base.followups?.length ? base.followups : [
        "Zeig mir ein konkretes Runbook",
        "Wie verifiziere ich den Fix?",
        "Gibt es Risiken/Tradeoffs?",
        "Wie automatisiere ich das mit Neuro?",
      ],
    };
  } catch {
    return base;
  }
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

    const base = parsed ? coerceCopilot(parsed, rb) : rb;
    const out = await enrichWithRunbooks(msg, base);
    return NextResponse.json(out);
  } catch {
    return NextResponse.json(ruleBasedCopilot(""), { status: 200 });
  }
}
