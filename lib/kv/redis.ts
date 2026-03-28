export function redisAvailable(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

async function redisCommand<T = any>(...cmd: (string | number)[]): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL as string
  const token = process.env.UPSTASH_REDIS_REST_TOKEN as string
  if (!url || !token) return null
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd.map((c) => (typeof c === "number" ? String(c) : c))),
    // Upstash expects array of command parts too; but also supports single command arrays.
  })
  if (!res.ok) return null
  const data = await res.json().catch(() => null)
  // Upstash returns { result: any }
  return (data && (data.result ?? data)) ?? null
}

export async function redisSetJSON(key: string, value: any, ttlSec?: number): Promise<boolean> {
  const payload = JSON.stringify(value)
  if (ttlSec && ttlSec > 0) {
    const r = await redisCommand("SET", key, payload, "EX", ttlSec)
    return r === "OK"
  }
  const r = await redisCommand("SET", key, payload)
  return r === "OK"
}

export async function redisGetJSON<T = any>(key: string): Promise<T | null> {
  const r = (await redisCommand("GET", key)) as string | null
  if (!r || typeof r !== "string") return null
  try { return JSON.parse(r) as T } catch { return null }
}

export async function redisLPushJSON(key: string, value: any): Promise<number | null> {
  const payload = JSON.stringify(value)
  const r = await redisCommand("LPUSH", key, payload)
  if (typeof r === "number") return r
  if (typeof r === "string") { const n = Number(r); return isNaN(n) ? null : n }
  return null
}

export async function redisLRangeJSON<T = any>(key: string, start: number, stop: number): Promise<T[]> {
  const r = (await redisCommand("LRANGE", key, start, stop)) as string[] | null
  if (!Array.isArray(r)) return []
  const out: T[] = []
  for (const item of r) {
    try { out.push(JSON.parse(item)) } catch { /* ignore */ }
  }
  return out
}

export async function redisLLen(key: string): Promise<number> {
  const r = await redisCommand("LLEN", key)
  if (typeof r === "number") return r
  if (typeof r === "string") { const n = Number(r); return isNaN(n) ? 0 : n }
  return 0
}
