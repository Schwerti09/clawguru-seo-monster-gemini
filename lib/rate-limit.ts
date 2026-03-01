/**
 * Smart Rate Limiting – Token Bucket implementation
 *
 * Two-tier protection:
 *  - Soft limit: per authenticated user/token (configurable, default 30 req/min)
 *  - Hard limit: per IP address (configurable, default 100 req/min)
 *
 * Each bucket refills continuously at `rate` tokens per second.
 * A request consumes 1 token. If the bucket is empty the request is rejected.
 *
 * In production swap the in-memory Maps for Redis with the same interface.
 */

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean
  /** Remaining tokens in the bucket */
  remaining: number
  /** Unix timestamp (ms) when the bucket will be full again */
  resetAt: number
  /** Which limit was hit, if any */
  limitedBy?: "soft" | "hard"
}

interface Bucket {
  tokens: number
  lastRefill: number // ms
}

// In-memory stores – one bucket per key.
// In a multi-instance deployment replace these with a Redis client.
const softBuckets = new Map<string, Bucket>()
const hardBuckets = new Map<string, Bucket>()

/** Prune buckets that have been idle for more than 10 minutes to avoid leaks. */
const IDLE_TTL_MS = 10 * 60 * 1000

function pruneMap(map: Map<string, Bucket>, capacity: number) {
  const now = Date.now()
  for (const [key, bucket] of map) {
    // Full bucket that hasn't been touched recently can be removed
    if (bucket.tokens >= capacity && now - bucket.lastRefill > IDLE_TTL_MS) {
      map.delete(key)
    }
  }
}

/**
 * Consume one token from a bucket, refilling it first based on elapsed time.
 *
 * @param map       The bucket store
 * @param key       Unique identifier for this bucket
 * @param capacity  Maximum number of tokens (burst capacity)
 * @param rate      Tokens added per second (= steady-state requests/second)
 */
function consume(
  map: Map<string, Bucket>,
  key: string,
  capacity: number,
  rate: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  let bucket = map.get(key)

  if (!bucket) {
    bucket = { tokens: capacity, lastRefill: now }
  }

  // Refill tokens based on elapsed time
  const elapsed = (now - bucket.lastRefill) / 1000 // seconds
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * rate)
  bucket.lastRefill = now

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    map.set(key, bucket)
    const remaining = Math.floor(bucket.tokens)
    return { allowed: true, remaining, resetAt: now + Math.ceil((capacity - bucket.tokens) / rate) * 1000 }
  }

  map.set(key, bucket)
  // Time until at least 1 token is available again
  const waitMs = Math.ceil((1 - bucket.tokens) / rate) * 1000
  return { allowed: false, remaining: 0, resetAt: now + waitMs }
}

export interface RateLimitConfig {
  /** Per-user soft limit: max requests per minute (default: 30) */
  softLimitPerMinute?: number
  /** Per-IP hard limit: max requests per minute (default: 100) */
  hardLimitPerMinute?: number
}

/**
 * Check rate limits for an incoming request.
 *
 * @param ip      The client IP address (extracted from headers)
 * @param userId  Optional authenticated user/token identifier
 * @param config  Override default limits
 */
export function checkRateLimit(
  ip: string,
  userId?: string,
  config: RateLimitConfig = {}
): RateLimitResult {
  const softCap = config.softLimitPerMinute ?? 30
  const hardCap = config.hardLimitPerMinute ?? 100

  // Token rate = capacity / 60s so the bucket refills fully in one minute
  const softRate = softCap / 60
  const hardRate = hardCap / 60

  // Hard limit check (always applied – keyed by IP)
  const hard = consume(hardBuckets, `ip:${ip}`, hardCap, hardRate)
  if (!hard.allowed) {
    return { allowed: false, remaining: 0, resetAt: hard.resetAt, limitedBy: "hard" }
  }

  // Soft limit check (only when a userId is known)
  if (userId) {
    const soft = consume(softBuckets, `user:${userId}`, softCap, softRate)
    if (!soft.allowed) {
      return { allowed: false, remaining: 0, resetAt: soft.resetAt, limitedBy: "soft" }
    }
    return { allowed: true, remaining: Math.min(soft.remaining, hard.remaining), resetAt: soft.resetAt }
  }

  // Periodically clean up idle buckets (cheap, ~1% of calls)
  if (Math.random() < 0.01) {
    pruneMap(hardBuckets, hardCap)
    pruneMap(softBuckets, softCap)
  }

  return { allowed: true, remaining: hard.remaining, resetAt: hard.resetAt }
}

/**
 * Extract the real client IP from Next.js / Cloudflare / Vercel headers.
 * Falls back to "unknown" when no IP can be determined.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-real-ip") ||
    (headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "unknown"
  )
}
