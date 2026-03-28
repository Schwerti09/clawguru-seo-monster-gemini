import { NextRequest, NextResponse } from "next/server";
import { ruleBasedCopilot } from "@/lib/copilot";

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

async function geminiGenerate(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("[GEMINI] No API key configured");
    return null;
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(
    /\/$/,
    "",
  );

  const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 900 },
      }),
    });

    console.log("[GEMINI] Response status:", res.status);
    if (!res.ok) {
      const errText = await res.text();
      console.log("[GEMINI] Error response:", errText.substring(0, 200));
      return null;
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts;
    if (!Array.isArray(parts)) {
      console.log("[GEMINI] No content parts in response");
      return null;
    }

    const text = parts.map((p: { text?: string }) => p?.text).filter(Boolean).join("");
    const result = typeof text === "string" && text.trim() ? text.trim() : null;
    console.log("[GEMINI] Generated text length:", result?.length || 0, "First 100 chars:", result?.substring(0, 100));
    return result;
  } catch (err) {
    console.error("[GEMINI] Fetch error:", err instanceof Error ? err.message : String(err));
    return null;
  }
}

async function deepseekGenerate(prompt: string): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";
  const base = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Antworte ausschließlich mit validem JSON ohne Markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

async function openaiGenerate(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const url = `${base}/chat/completions`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "Antworte ausschließlich mit validem JSON ohne Markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        stream: false,
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
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

    // Provider-Reihenfolge: DeepSeek -> OpenAI -> Gemini (wie gewünscht)
    // Optional kann AI_PROVIDER die Reihenfolge an den Anfang verschieben
    const desiredOrder = ["deepseek", "openai", "gemini"] as const;
    const preferred = (process.env.AI_PROVIDER || "").toLowerCase();
    const ordered = preferred && desiredOrder.includes(preferred as any)
      ? ([preferred, ...desiredOrder.filter((p) => p !== preferred)] as typeof desiredOrder)
      : desiredOrder;

    let parsed: unknown = null;
    for (const provider of ordered) {
      let text: string | null = null;
      if (provider === "deepseek") text = await deepseekGenerate(prompt);
      else if (provider === "openai") text = await openaiGenerate(prompt);
      else if (provider === "gemini") text = await geminiGenerate(prompt);

      if (!text) continue;
      parsed = extractJson(text);
      if (parsed) {
        console.log(`[COPILOT] provider=${provider} ok`);
        break;
      } else {
        console.log(`[COPILOT] provider=${provider} invalid_json`);
      }
    }

    const out = parsed ? coerceCopilot(parsed, rb) : rb;
    return NextResponse.json(out);
  } catch (err) {
    console.error("[COPILOT_ERROR]", err);
    return NextResponse.json(ruleBasedCopilot(""), { status: 200 });
  }
}
