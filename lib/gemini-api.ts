import { getCircuitBreaker } from "@/lib/circuit-breaker"

export type GeminiRequest = {
  prompt: string
  temperature?: number
  maxOutputTokens?: number
  timeoutMs?: number
  model?: string
  baseUrl?: string
  apiKey?: string
}

type GeminiQueueTask = {
  prompt: string
  model: string
  temperature: number
  maxOutputTokens: number
  enqueuedAt: string
}

const LOCAL_QUEUE: GeminiQueueTask[] = []
const LOCAL_QUEUE_LIMIT = 100
// URL path length guard for Upstash REST payloads.
const MAX_QUEUE_PAYLOAD_BYTES = 2000

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function queueGeminiTask(task: GeminiQueueTask): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  const encoded = encodeURIComponent(JSON.stringify(task))
  if (!url || !token) {
    if (LOCAL_QUEUE.length >= LOCAL_QUEUE_LIMIT) {
      LOCAL_QUEUE.shift()
    }
    LOCAL_QUEUE.push(task)
    return
  }
  if (encoded.length > MAX_QUEUE_PAYLOAD_BYTES) {
    if (LOCAL_QUEUE.length >= LOCAL_QUEUE_LIMIT) {
      LOCAL_QUEUE.shift()
    }
    LOCAL_QUEUE.push(task)
    return
  }
  const key = process.env.GEMINI_QUEUE_KEY || "gemini:queue"
  await fetch(`${url}/rpush/${key}/${encoded}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => undefined)
}

function extractText(data: unknown): string | null {
  const parts = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] })?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return null
  const text = parts.map((p) => p?.text ?? "").join("").trim()
  return text.length > 0 ? text : null
}

export async function callGeminiWithBackoff(opts: GeminiRequest): Promise<string | null> {
  const apiKey = opts.apiKey || process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const model = opts.model || process.env.GEMINI_MODEL || "gemini-1.5-flash"
  const baseUrl = (opts.baseUrl || process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/$/, "")
  const temperature = opts.temperature ?? 0.35
  const maxOutputTokens = opts.maxOutputTokens ?? 1200
  const timeoutMs = opts.timeoutMs ?? 30_000

  const breaker = getCircuitBreaker("gemini-api")
  if (!breaker.isCallAllowed()) {
    await queueGeminiTask({ prompt: opts.prompt, model, temperature, maxOutputTokens, enqueuedAt: new Date().toISOString() })
    return null
  }

  const url = `${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
  const payload = {
    contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
    generationConfig: { temperature, maxOutputTokens },
  }

  const defaultBackoff = [500, 1000, 2000]
  const backoff = (process.env.GEMINI_BACKOFF_MS ?? "")
    .split(",")
    .map((value) => parseInt(value.trim(), 10))
    .filter((value) => Number.isFinite(value) && value > 0)
  const retrySchedule = backoff.length > 0 ? backoff : defaultBackoff
  const maxAttempts = retrySchedule.length + 1
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(timeoutMs),
      })

      if (res.status === 429 || res.status === 503) {
        if (attempt < maxAttempts - 1) {
          await sleep(retrySchedule[attempt] ?? retrySchedule[retrySchedule.length - 1])
          continue
        }
        breaker.recordFailure()
        await queueGeminiTask({ prompt: opts.prompt, model, temperature, maxOutputTokens, enqueuedAt: new Date().toISOString() })
        return null
      }

      if (!res.ok) {
        breaker.recordFailure()
        return null
      }

      const data = await res.json()
      const text = extractText(data)
      if (text) {
        breaker.recordSuccess()
        return text
      }

      breaker.recordFailure()
      return null
    } catch {
      if (attempt < maxAttempts - 1) {
        await sleep(retrySchedule[attempt] ?? retrySchedule[retrySchedule.length - 1])
        continue
      }
      breaker.recordFailure()
      await queueGeminiTask({ prompt: opts.prompt, model, temperature, maxOutputTokens, enqueuedAt: new Date().toISOString() })
      return null
    }
  }

  return null
}
