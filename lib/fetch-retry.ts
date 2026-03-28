export type RetryOptions = {
  retries?: number
  baseDelayMs?: number
  retryOn?: number[]
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, options?: RetryOptions): Promise<Response> {
  const retries = options?.retries ?? 3
  const base = options?.baseDelayMs ?? 500
  const retryOn = new Set(options?.retryOn ?? [429, 503, 502, 504])

  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(input as any, init as any)
      if (!retryOn.has(res.status)) return res
      lastErr = new Error(`HTTP ${res.status}`)
    } catch (e) {
      lastErr = e
    }

    if (attempt < retries) {
      const jitter = Math.random() * 0.4 + 0.8 // 0.8..1.2
      const delay = Math.round(base * Math.pow(2, attempt) * jitter)
      await sleep(delay)
      continue
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}
