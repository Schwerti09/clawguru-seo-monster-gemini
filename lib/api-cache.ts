/**
 * API Response Cache – TTL-based in-memory cache
 *
 * Purpose: expensive API calls (security-intel lookups, AI generation, third-party
 * enrichment) cost money and compute.  Identical requests within a TTL window
 * should be served from cache without re-running the pipeline.
 *
 * Usage:
 *   const cached = apiCacheGet<MyType>("hash:abc123")
 *   if (cached !== null) return cached
 *   const result = await expensiveOperation()
 *   apiCacheSet("hash:abc123", result, 3600) // 1-hour TTL
 *   return result
 *
 * In production replace this with a Redis client:
 *   GET / SETEX with JSON serialisation.
 */

interface CacheEntry<T> {
  value: T
  /** Unix ms when this entry expires */
  expiresAt: number
}

// Generic in-memory store.  Keys are arbitrary strings (e.g. "hash:<sha256>").
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const store = new Map<string, CacheEntry<any>>()

/** Minimum TTL allowed (seconds) */
const MIN_TTL_S = 60
/** Maximum TTL allowed (seconds) – 24 hours */
const MAX_TTL_S = 60 * 60 * 24

/**
 * Retrieve a cached value.
 *
 * @returns The cached value, or `null` if absent / expired.
 */
export function apiCacheGet<T>(key: string): T | null {
  const entry = store.get(key) as CacheEntry<T> | undefined
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

/**
 * Store a value in the cache.
 *
 * @param key     Cache key (should be deterministic from the request inputs)
 * @param value   Value to cache (must be JSON-serialisable for Redis compat)
 * @param ttlSeconds  Time-to-live in seconds.  Clamped to [60, 86400].
 */
export function apiCacheSet<T>(key: string, value: T, ttlSeconds: number): void {
  const ttl = Math.max(MIN_TTL_S, Math.min(MAX_TTL_S, ttlSeconds))
  store.set(key, { value, expiresAt: Date.now() + ttl * 1000 })

  // Opportunistically prune expired entries (~1% of writes)
  if (Math.random() < 0.01) {
    apiCachePrune()
  }
}

/**
 * Explicitly remove an entry (e.g. after a data update).
 */
export function apiCacheDelete(key: string): void {
  store.delete(key)
}

/**
 * Remove all expired entries.
 */
export function apiCachePrune(): void {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) {
      store.delete(key)
    }
  }
}

/** Current number of (possibly expired) entries – for monitoring. */
export function apiCacheSize(): number {
  return store.size
}

/**
 * Build a deterministic cache key from an object.
 * Sorts keys so `{a:1,b:2}` and `{b:2,a:1}` produce the same key.
 */
export function buildCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sorted = Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .sort(([a], [b]) => a.localeCompare(b))
  )
  return `${prefix}:${JSON.stringify(sorted)}`
}
