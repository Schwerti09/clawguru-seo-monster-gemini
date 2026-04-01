/**
 * Best-effort rate limit for server actions (Node isolate).
 * For distributed accuracy, add Redis/Upstash later; env tunes limits without deploy.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

function maxRequests(): number {
  const n = parseInt(process.env.ROAST_RATE_LIMIT_MAX ?? "10", 10)
  return Number.isFinite(n) && n >= 1 ? n : 10
}

function windowMs(): number {
  const n = parseInt(process.env.ROAST_RATE_LIMIT_WINDOW_MS ?? String(15 * 60_000), 10)
  return Number.isFinite(n) && n >= 30_000 ? n : 15 * 60_000
}

export function checkRoastServerRateLimit(clientKey: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const key = `roast:${clientKey}`
  const max = maxRequests()
  const win = windowMs()
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + win })
    return { ok: true }
  }

  if (entry.count < max) {
    entry.count++
    return { ok: true }
  }

  return { ok: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
}
