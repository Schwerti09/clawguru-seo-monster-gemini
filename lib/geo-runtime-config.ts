import { dbQuery } from "@/lib/db"

export type GeoSitemapMode = "normal" | "conservative"

export type GeoSitemapRuntimeLimits = {
  mode: GeoSitemapMode
  cityLimit: number
  cityPool: number
  seedLimit: number
  reason: string
  updatedAt?: string
}

const CONFIG_KEY = "geo_sitemap_runtime_limits"
const MEM_TTL_MS = 30_000
let memCache: { value: GeoSitemapRuntimeLimits; expiresAt: number } | null = null

function toInt(value: string | undefined, fallback: number, min: number, max: number): number {
  const parsed = parseInt(value || "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, Math.round(value)))
}

export function getDefaultGeoSitemapRuntimeLimits(): GeoSitemapRuntimeLimits {
  const cityLimit = toInt(process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT, 24, 1, 80)
  const cityPool = toInt(process.env.GEO_MATRIX_SITEMAP_CITY_POOL, 72, cityLimit, 240)
  const seedLimit = toInt(process.env.GEO_MATRIX_SITEMAP_SEED_LIMIT, 8, 1, 20)
  return {
    mode: "normal",
    cityLimit,
    cityPool: Math.max(cityLimit, cityPool),
    seedLimit,
    reason: "env-default",
  }
}

function normalizeStored(value: any, fallback: GeoSitemapRuntimeLimits): GeoSitemapRuntimeLimits {
  const mode: GeoSitemapMode = value?.mode === "conservative" ? "conservative" : "normal"
  const cityLimit = clamp(Number(value?.cityLimit ?? fallback.cityLimit), 1, 80)
  const cityPool = clamp(Number(value?.cityPool ?? fallback.cityPool), cityLimit, 240)
  const seedLimit = clamp(Number(value?.seedLimit ?? fallback.seedLimit), 1, 20)
  const reason = typeof value?.reason === "string" && value.reason.length > 0 ? value.reason : fallback.reason
  const updatedAt = typeof value?.updatedAt === "string" ? value.updatedAt : undefined
  return { mode, cityLimit, cityPool, seedLimit, reason, updatedAt }
}

export async function getGeoSitemapRuntimeLimits(): Promise<GeoSitemapRuntimeLimits> {
  const now = Date.now()
  if (memCache && memCache.expiresAt > now) return memCache.value

  const fallback = getDefaultGeoSitemapRuntimeLimits()
  try {
    const result = await dbQuery<{ value_json: any; updated_at: string }>(
      `SELECT value_json, updated_at
       FROM geo_runtime_config
       WHERE key = $1
       LIMIT 1`,
      [CONFIG_KEY]
    )
    if (result.rowCount === 0) {
      memCache = { value: fallback, expiresAt: now + MEM_TTL_MS }
      return fallback
    }
    const row = result.rows[0]
    const parsed = normalizeStored(
      { ...(row.value_json || {}), updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined },
      fallback
    )
    memCache = { value: parsed, expiresAt: now + MEM_TTL_MS }
    return parsed
  } catch (err: any) {
    // Table may not exist yet in early rollout; keep sitemap working with env defaults.
    if (err?.code === "42P01") {
      memCache = { value: fallback, expiresAt: now + MEM_TTL_MS }
      return fallback
    }
    throw err
  }
}

export async function setGeoSitemapRuntimeLimits(
  input: Omit<GeoSitemapRuntimeLimits, "updatedAt">
): Promise<GeoSitemapRuntimeLimits> {
  const fallback = getDefaultGeoSitemapRuntimeLimits()
  const value = normalizeStored(input, fallback)
  const stored = {
    mode: value.mode,
    cityLimit: value.cityLimit,
    cityPool: value.cityPool,
    seedLimit: value.seedLimit,
    reason: value.reason,
  }
  await dbQuery(
    `INSERT INTO geo_runtime_config (key, value_json, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET
       value_json = EXCLUDED.value_json,
       updated_at = NOW()`,
    [CONFIG_KEY, JSON.stringify(stored)]
  )
  const updatedAt = new Date().toISOString()
  const out = { ...value, updatedAt }
  memCache = { value: out, expiresAt: Date.now() + MEM_TTL_MS }
  return out
}
