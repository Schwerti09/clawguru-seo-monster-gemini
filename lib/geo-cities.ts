import { unstable_cache } from "next/cache"
import { dbQuery } from "@/lib/db"

export type GeoCity = {
  id: string
  slug: string
  name_de: string
  name_en: string
  country_code: string
  priority: number
  population: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const MEM_TTL_MS = 5 * 60 * 1000
let memCache: { cities: GeoCity[]; expiresAt: number } | null = null
const REDIS_KEY = "geo:cities:active:v1"
const REDIS_TTL_SECONDS = 60 * 30
let redisClientPromise: Promise<any | null> | null = null

async function getRedisClient() {
  if (redisClientPromise) return redisClientPromise
  redisClientPromise = (async () => {
    const redisUrl = process.env.REDIS_URL || ""
    if (!redisUrl) return null
    try {
      const { createClient } = await import("redis")
      const client = createClient({ url: redisUrl })
      client.on("error", () => {
        // best-effort cache layer: swallow redis errors
      })
      await client.connect()
      return client
    } catch {
      return null
    }
  })()
  return redisClientPromise
}

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_REST_URL || ""
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_REST_TOKEN || ""
  return { url: url.replace(/\/$/, ""), token }
}

async function redisGetCities(): Promise<GeoCity[] | null> {
  const redis = await getRedisClient()
  if (redis) {
    try {
      const raw = await redis.get(REDIS_KEY)
      if (raw && typeof raw === "string") {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // continue with REST fallback
    }
  }

  const { url, token } = redisConfig()
  if (!url || !token) return null
  try {
    const res = await fetch(`${url}/get/${REDIS_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = await res.json()
    const val = json?.result
    if (!val || typeof val !== "string") return null
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

async function redisSetCities(cities: GeoCity[]) {
  const redis = await getRedisClient()
  if (redis) {
    try {
      await redis.set(REDIS_KEY, JSON.stringify(cities), { EX: REDIS_TTL_SECONDS })
      return
    } catch {
      // continue with REST fallback
    }
  }

  const { url, token } = redisConfig()
  if (!url || !token) return
  try {
    const payload = encodeURIComponent(JSON.stringify(cities))
    await fetch(`${url}/set/${REDIS_KEY}/${payload}?EX=${REDIS_TTL_SECONDS}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
  } catch {
    // best effort
  }
}

async function redisDeleteCitiesCache() {
  const redis = await getRedisClient()
  if (redis) {
    try {
      await redis.del(REDIS_KEY)
      return
    } catch {
      // continue with REST fallback
    }
  }

  const { url, token } = redisConfig()
  if (!url || !token) return
  try {
    await fetch(`${url}/del/${REDIS_KEY}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
  } catch {
    // best effort
  }
}

const queryAllActiveCities = unstable_cache(
  async (): Promise<GeoCity[]> => {
    const fromRedis = await redisGetCities()
    if (fromRedis && fromRedis.length > 0) return fromRedis

    const rows = await dbQuery<GeoCity>(
      `SELECT id, slug, name_de, name_en, country_code, priority, population, is_active, created_at, updated_at
       FROM geo_cities
       WHERE is_active = true
       ORDER BY priority DESC, population DESC, slug ASC`
    )
    await redisSetCities(rows.rows)
    return rows.rows
  },
  ["geo-cities-active-v1"],
  { revalidate: 60 * 30, tags: ["geo-cities-active"] }
)

export async function getAllActiveCities(): Promise<GeoCity[]> {
  const now = Date.now()
  if (memCache && memCache.expiresAt > now) return memCache.cities
  const cities = await queryAllActiveCities()
  memCache = { cities, expiresAt: now + MEM_TTL_MS }
  return cities
}

export async function getCityBySlug(slug: string): Promise<GeoCity | null> {
  const norm = slug.toLowerCase().replace(/[^a-z0-9]/g, "")
  const all = await getAllActiveCities()
  return all.find((c) => c.slug === norm) ?? null
}

export async function getTopCities(limit: number): Promise<GeoCity[]> {
  const safe = Math.max(1, Math.min(500, limit))
  const all = await getAllActiveCities()
  return all.slice(0, safe)
}

export async function invalidateGeoCitiesCache() {
  memCache = null
  await redisDeleteCitiesCache()
}

