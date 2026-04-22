// Sentinel AI Tutor — minimal backend.
//
// Accepts a turn of chat plus mission context. Tries providers in order:
//   1) Ollama local  (aya-expanse preferred, falls back to any running model)
//   2) Gemini cloud  (GEMINI_API_KEY + gemini-2.5-flash-lite)
//   3) Graceful no-key stub (helpful guidance without an LLM)
//
// The whole thing is stateless — the client keeps conversation history and
// sends it on every turn. That keeps the route safe to run on any runtime
// (Netlify / Vercel / Railway) with no shared state.

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface IncomingMessage {
  role: "user" | "assistant"
  content: string
}
interface MissionContext {
  slug: string
  title: string
  brief: string
  goals: Array<{ id: string; label: string; hint?: string; done: boolean }>
  recentHistory: string[]
}
interface IncomingBody {
  messages: IncomingMessage[]
  mission?: MissionContext
  locale?: string
}

const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434"
const OLLAMA_MODEL_PREFERRED = process.env.SENTINEL_OLLAMA_MODEL || "aya-expanse:32b"
const OLLAMA_TIMEOUT_MS = parseInt(process.env.SENTINEL_OLLAMA_TIMEOUT_MS || "30000", 10)

function systemPrompt(locale: string, mission?: MissionContext): string {
  const base = `You are Sentinel, the ClawGuru Academy AI tutor. You help a learner complete a hands-on security defense mission inside a simulated Linux terminal.

RULES
- Answer in the learner's language: ${locale || "de"}. If unsure, default to English.
- Keep answers short (2–5 sentences), practical, and specific to the mission.
- Never give away the whole solution in one shot. Nudge with the next best step.
- If asked off-topic, gently redirect back to the mission.
- Assume the learner can type commands; tell them *which* command, not paragraphs of theory.
- Do NOT invent files or commands that are not in the mission.
- If a goal is already done, celebrate it briefly and point to the next goal.`

  if (!mission) return base

  const goalList = mission.goals
    .map((g) => `  - [${g.done ? "x" : " "}] ${g.label}${g.hint ? `  (hint: ${g.hint})` : ""}`)
    .join("\n")
  const recent = mission.recentHistory.length
    ? mission.recentHistory.slice(-6).map((c) => `  $ ${c}`).join("\n")
    : "  (no commands yet)"

  return `${base}

MISSION: ${mission.title}
BRIEF: ${mission.brief}

GOALS:
${goalList}

LEARNER'S RECENT COMMANDS:
${recent}`
}

function stubReply(locale: string, mission?: MissionContext): string {
  const nextGoal = mission?.goals.find((g) => !g.done)
  const de = (locale || "de").startsWith("de")
  if (nextGoal) {
    return de
      ? `Sentinel ist offline (kein LLM konfiguriert). Nächstes Ziel: **${nextGoal.label}**${nextGoal.hint ? ` — versuch \`${nextGoal.hint}\`` : ""}.`
      : `Sentinel is offline (no LLM configured). Next goal: **${nextGoal.label}**${nextGoal.hint ? ` — try \`${nextGoal.hint}\`` : ""}.`
  }
  return de
    ? "Sentinel ist offline — aber es sieht aus, als wären alle Goals erledigt. Gut gemacht."
    : "Sentinel is offline — but it looks like all goals are done. Nice work."
}

async function tryOllama(messages: IncomingMessage[], sys: string): Promise<string | null> {
  try {
    // Discover an available model. Prefer the configured one; otherwise use
    // whatever the user has pulled locally (first entry).
    const controller = new AbortController()
    const tagsTimeout = setTimeout(() => controller.abort(), 3000)
    const tagsRes = await fetch(`${OLLAMA_URL}/api/tags`, { signal: controller.signal }).catch(() => null)
    clearTimeout(tagsTimeout)
    if (!tagsRes || !tagsRes.ok) return null
    const tagsJson = (await tagsRes.json()) as { models?: Array<{ name: string }> }
    const avail = tagsJson.models?.map((m) => m.name) ?? []
    if (avail.length === 0) return null
    const model = avail.includes(OLLAMA_MODEL_PREFERRED) ? OLLAMA_MODEL_PREFERRED : avail[0]

    const chatController = new AbortController()
    const chatTimeout = setTimeout(() => chatController.abort(), OLLAMA_TIMEOUT_MS)
    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: chatController.signal,
      body: JSON.stringify({
        model,
        stream: false,
        messages: [{ role: "system", content: sys }, ...messages],
        options: { temperature: 0.3, num_predict: 400 },
      }),
    }).catch(() => null)
    clearTimeout(chatTimeout)
    if (!res || !res.ok) return null
    const data = (await res.json()) as { message?: { content?: string } }
    const text = data.message?.content?.trim()
    return text && text.length > 0 ? text : null
  } catch {
    return null
  }
}

async function tryGemini(messages: IncomingMessage[], sys: string): Promise<string | null> {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim()
  if (!apiKey) return null
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "")
  const model = process.env.SENTINEL_GEMINI_MODEL || "gemini-2.5-flash-lite"

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 25000)
    const res = await fetch(`${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: sys }] },
        contents,
        generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
      }),
    })
    clearTimeout(t)
    if (!res.ok) return null
    const data = (await res.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    const parts = data.candidates?.[0]?.content?.parts
    if (!Array.isArray(parts)) return null
    const text = parts.map((p) => p.text ?? "").join("").trim()
    return text.length > 0 ? text : null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  let body: IncomingBody
  try {
    body = (await req.json()) as IncomingBody
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages_required" }, { status: 400 })
  }
  // Clamp input: prevent abuse / context blowups.
  const messages = body.messages.slice(-12).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content ?? "").slice(0, 2000),
  })) as IncomingMessage[]
  const locale = (body.locale || "de").slice(0, 8)
  const sys = systemPrompt(locale, body.mission)

  // Provider chain
  const ollama = await tryOllama(messages, sys)
  if (ollama) return NextResponse.json({ reply: ollama, provider: "ollama" })

  const gemini = await tryGemini(messages, sys)
  if (gemini) return NextResponse.json({ reply: gemini, provider: "gemini" })

  return NextResponse.json({ reply: stubReply(locale, body.mission), provider: "stub" })
}
