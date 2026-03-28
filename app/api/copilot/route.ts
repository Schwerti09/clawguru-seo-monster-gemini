import { NextRequest, NextResponse } from "next/server";
import { ruleBasedCopilot } from "@/lib/copilot";
import { generateOrdered, type AiProvider } from "@/lib/ai/providers";
import { logTelemetry } from "@/lib/ops/telemetry";
import { getRequestId } from "@/lib/ops/request-id";

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
  if (!text || typeof text !== "string") return null;
  
  // Strip code-fences if present
  const cleaned = text
    .replace(/```json\n?/gi, "")
    .replace(/```\n?/g, "")
    .trim();

  if (!cleaned) return null;

  try {
    // Try direct JSON parse first
    return JSON.parse(cleaned);
  } catch {
    // If direct parse fails, try to extract JSON object
    let braceCount = 0;
    let jsonStart = -1;
    let jsonEnd = -1;

    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === "{") {
        if (braceCount === 0) jsonStart = i;
        braceCount++;
      } else if (cleaned[i] === "}") {
        braceCount--;
        if (braceCount === 0 && jsonStart !== -1) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        return JSON.parse(cleaned.substring(jsonStart, jsonEnd));
      } catch {
        return null;
      }
    }

    return null;
  }
}

function buildCopilotPrompt(userMessage: string): string {
  const schema = JSON.stringify({
    reply: "string - kurz, konkret, schrittweise",
    followups: ["string - 3-5 Rückfragen"],
    actions: [{ label: "string", href: "string - Pfad wie /tools oder /check" }],
    confidence: "low | medium | high"
  }, null, 2);

  return `Du bist ClawGuru Copilot, ein Ops/Security-Advisor für DevOps, Infrastruktur und Security-Härtung.

WICHTIG: Du antwortest AUSSCHLIESSLICH als valides JSON. Kein weiterer Text, keine Markdown-Fences, kein Code-Block.

JSON Schema (exakt einhalten):
${schema}

Richtlinien für deine Antwort:
- "reply": Kurz, konkret, actionable. Mit Checkliste wenn relevant. 2-4 Sätze max.
- "followups": 3-5 kurze Fragen/Suggestions (jeweils 5-15 Wörter).
- "actions": 2-4 interne ClawGuru-Links. Nur erlaubte Pfade: /tools, /runbooks, /check, /pricing, /live, /mission-control, /vault, /security.
- "confidence": "low" wenn viele Infos fehlen, "medium" wenn teilweise klar, "high" wenn praxis-actionable.

Sicherheit:
- Nie Passwörter/Keys abfragen oder sensitive Daten sammeln.
- Keine illegalen oder unethischen Anleitungen.

Benutzer-Anfrage:
${userMessage}`;
}

export async function POST(req: NextRequest) {
  try {
    const t0 = Date.now();
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
    const prompt = buildCopilotPrompt(msg);
    const { parsed, provider } = await generateOrdered(prompt, process.env.AI_PROVIDER as AiProvider | undefined);

    const out = parsed ? coerceCopilot(parsed, rb) : rb;

    try {
      const requestId = getRequestId(req.headers);
      logTelemetry("copilot.provider_used", {
        requestId,
        provider: provider || "fallback",
        usedFallback: !parsed,
        messageLength: msg.length,
        durationMs: Date.now() - t0,
      });
    } catch {}
    return NextResponse.json(out);
  } catch (err) {
    console.error("[COPILOT_ERROR]", err);
    return NextResponse.json(ruleBasedCopilot(""), { status: 200 });
  }
}
