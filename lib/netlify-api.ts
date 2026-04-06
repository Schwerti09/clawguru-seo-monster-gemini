// lib/netlify-api.ts
// Maintenance mode toggle – Vercel-compatible via Upstash Redis.
// Falls back to MAINTENANCE_MODE env var for read when Redis is unavailable.
//
// Renamed from netlify-api.ts to preserve import compatibility.
// No Netlify dependencies remain.

const REDIS_KEY = "clawguru:maintenance_mode"

async function redisGet(key: string): Promise<string | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const json = (await res.json()) as { result: string | null }
    return json.result ?? null
  } catch {
    return null
  }
}

async function redisSet(key: string, value: string): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not configured")
  const res = await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Redis SET failed: ${res.status}`)
}

/** Returns the current maintenance mode state (Redis → env var fallback). */
export async function getMaintenanceMode(): Promise<boolean> {
  const val = await redisGet(REDIS_KEY)
  if (val !== null) return val === "true" || val === "1"
  return process.env.MAINTENANCE_MODE === "true"
}

/** Sets maintenance mode on/off. Persisted in Upstash Redis. */
export async function setMaintenanceMode(enabled: boolean): Promise<void> {
  await redisSet(REDIS_KEY, enabled ? "true" : "false")
}
