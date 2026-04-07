import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

async function checkGemini(): Promise<{ provider: string; ok: boolean; status?: number; ratelimited?: boolean; error?: string; errorBody?: string; model?: string; keyPrefix?: string }> {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim()
  // Strip surrounding quotes / accidental "Bearer " prefix
  let key = apiKey
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) key = key.slice(1, -1).trim()
  if (key.toLowerCase().startsWith("bearer ")) key = key.slice(7).trim()
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
  const base = (process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "")
  if (!key) return { provider: "gemini", ok: false, error: "missing_api_key" }
  const keyPrefix = key.slice(0, 8) + "..."
  try {
    const url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Return JSON: {\"ok\":true} (no markdown)" }] }], generationConfig: { temperature: 0, maxOutputTokens: 64 } }),
    })
    const ok = res.ok
    let errorBody: string | undefined
    if (!ok) {
      errorBody = await res.text().catch(() => "(unreadable)")
      errorBody = errorBody.slice(0, 500)
    }
    return { provider: "gemini", ok, status: res.status, ratelimited: res.status === 429, model, keyPrefix, errorBody }
  } catch (e) {
    return { provider: "gemini", ok: false, error: e instanceof Error ? e.message : String(e), model, keyPrefix }
  }
}

async function checkOpenAI(): Promise<{ provider: string; ok: boolean; status?: number; ratelimited?: boolean; error?: string }> {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")
  if (!apiKey) return { provider: "openai", ok: false, error: "missing_api_key" }
  try {
    const url = `${base}/chat/completions`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: "{\"ok\":true}" }], temperature: 0 }),
    })
    return { provider: "openai", ok: res.ok, status: res.status, ratelimited: res.status === 429 }
  } catch (e) {
    return { provider: "openai", ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

async function checkDeepseek(): Promise<{ provider: string; ok: boolean; status?: number; ratelimited?: boolean; error?: string }> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat"
  const base = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1").replace(/\/$/, "")
  if (!apiKey) return { provider: "deepseek", ok: false, error: "missing_api_key" }
  try {
    const url = `${base}/chat/completions`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: "{\"ok\":true}" }], temperature: 0 }),
    })
    return { provider: "deepseek", ok: res.ok, status: res.status, ratelimited: res.status === 429 }
  } catch (e) {
    return { provider: "deepseek", ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const only = url.searchParams.get("provider") // gemini|openai|deepseek

  const tasks: Array<Promise<any>> = []
  if (!only || only === "gemini") tasks.push(checkGemini())
  if (!only || only === "openai") tasks.push(checkOpenAI())
  if (!only || only === "deepseek") tasks.push(checkDeepseek())

  const results = await Promise.all(tasks)
  return NextResponse.json({ ts: Date.now(), results })
}
