import { createHash } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { dbQuery } from "@/lib/db"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n"
import { getAllActiveCities, mergeTopCitiesWithCanary, type GeoCity } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

const PROBE_TIMEOUT_MS = 8_000
/** Hard cap for ranking probes (URL health checks). Canary cities are always unioned in addition to top-N. */
const MAX_CITY_LIMIT = 200
const CACHE_TTL_MS = 30_000
const SAFE_SLUG_RE = /^[a-z0-9-]+$/i
const responseCache = new Map<string, { expiresAt: number; payload: any }>()

type RankedCity = {
  slug: string
  name_de: string
  name_en: string
  country_code: string
  priority: number
  population: number
  status: number
  healthy: boolean
  finalUrl?: string
  rankingScore: number
}

async function probeUrl(url: string): Promise<{ status: number; finalUrl?: string }> {
  const res = await fetch(url, {
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
  })
  if ((res.status === 307 || res.status === 308) && res.headers.get("location")) {
    const nextUrl = new URL(res.headers.get("location") || "", url)
    // Security hardening: only follow redirects on our own domain.
    if (nextUrl.origin !== BASE_URL) {
      return { status: 0, finalUrl: nextUrl.toString() }
    }
    const second = await fetch(nextUrl.toString(), {
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    })
    return { status: second.status, finalUrl: nextUrl.toString() }
  }
  return { status: res.status, finalUrl: url }
}

function scoreCity(city: GeoCity, status: number, maxPopulation: number): number {
  const healthScore = status === 200 ? 100 : 0
  const priorityScore = Math.max(0, Math.min(100, city.priority))
  const popScore = maxPopulation > 0 ? Math.round((city.population / maxPopulation) * 100) : 0
  // Strong SEO weighting: availability first, then business priority, then market size.
  return Math.round(healthScore * 0.7 + priorityScore * 0.2 + popScore * 0.1)
}

export async function GET(req: NextRequest) {
  const startedAt = Date.now()
  const localeRaw = (req.nextUrl.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const locale = SUPPORTED_LOCALES.includes(localeRaw as any) ? localeRaw : DEFAULT_LOCALE
  const slugRaw = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const slug = SAFE_SLUG_RE.test(slugRaw) ? slugRaw : "aws-ssh-hardening-2026"

  const forceRefresh = req.nextUrl.searchParams.get("forceRefresh") === "1"
  if (forceRefresh) {
    responseCache.clear()
  }

  const parsedLimit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24", 10) || 24
  const limit = Math.max(1, Math.min(MAX_CITY_LIMIT, parsedLimit))

  const all = await getAllActiveCities()
  const canarySlugRes = await dbQuery<{ slug: string }>(
    `SELECT slug
     FROM geo_cities
     WHERE is_active = true
       AND rollout_stage = 'canary'
     ORDER BY priority DESC, population DESC, slug ASC`
  )
  const dbCanarySlugs = canarySlugRes.rows
    .map((r) => String(r.slug || "").trim())
    .filter((s): s is string => Boolean(s))
  const memCanarySlugs = all.filter((c) => c.rollout_stage === "canary").map((c) => c.slug)
  const canaryFinger = createHash("sha256")
    .update([...new Set([...memCanarySlugs, ...dbCanarySlugs])].sort().join("\0"))
    .digest("hex")
    .slice(0, 16)
  const cacheKey = `${locale}:${slug}:${limit}:u${canaryFinger}`
  const cached = responseCache.get(cacheKey)
  if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.payload, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
      },
    })
  }

  let citiesForRanking = mergeTopCitiesWithCanary(all, limit)
  const seenSlugs = new Set(citiesForRanking.map((c) => c.slug))
  for (const s of dbCanarySlugs) {
    if (!s || seenSlugs.has(s)) continue
    const match = all.find((c) => c.slug === s)
    if (!match) continue
    citiesForRanking.push(match)
    seenSlugs.add(s)
  }

  const topSliceLen = Math.min(limit, all.length)
  const canaryUnionExtras = citiesForRanking.length - topSliceLen
  const maxPopulation = Math.max(1, ...citiesForRanking.map((c) => c.population || 0))

  const rankedResults = await Promise.allSettled(
    citiesForRanking.map(async (city): Promise<RankedCity> => {
      const url = `${BASE_URL}/${locale}/runbook/${slug}-${city.slug}`
      try {
        const probe = await probeUrl(url)
        return {
          ...city,
          status: probe.status,
          healthy: probe.status === 200,
          finalUrl: probe.finalUrl,
          rankingScore: scoreCity(city, probe.status, maxPopulation),
        }
      } catch {
        return {
          ...city,
          status: 0,
          healthy: false,
          rankingScore: scoreCity(city, 0, maxPopulation),
        }
      }
    })
  )

  const ranked: RankedCity[] = rankedResults.map((result, idx) => {
    if (result.status === "fulfilled") return result.value
    const city = citiesForRanking[idx]
    return {
      ...city,
      status: 0,
      healthy: false,
      rankingScore: scoreCity(city, 0, maxPopulation),
    }
  })

  ranked.sort((a, b) => b.rankingScore - a.rankingScore || b.priority - a.priority || b.population - a.population)
  const healthy = ranked.filter((r) => r.healthy).length
  const durationMs = Date.now() - startedAt

  const payload = {
    ok: true,
    locale,
    slug,
    rankingTopN: limit,
    canaryUnionExtras,
    totalCities: ranked.length,
    healthyCities: healthy,
    healthScore: Math.round((healthy / Math.max(1, ranked.length)) * 100),
    durationMs,
    generatedAt: new Date().toISOString(),
    cities: ranked,
  }
  if (!forceRefresh) responseCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, payload })

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
    },
  })
}

