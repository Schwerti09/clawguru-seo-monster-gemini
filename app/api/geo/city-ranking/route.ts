import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/i18n"
import { getTopCities, type GeoCity } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

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

const PROBE_TIMEOUT_MS = 8_000
/** Safe slug pattern: only lowercase alphanumerics and hyphens, no path traversal. */
const SAFE_SLUG_RE = /^[a-z0-9-]+$/i

async function probeUrl(url: string): Promise<{ status: number; finalUrl?: string }> {
  const res = await fetch(url, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) })
  if ((res.status === 307 || res.status === 308) && res.headers.get("location")) {
    const rawLocation = res.headers.get("location") || ""
    const nextUrl = new URL(rawLocation, url).toString()
    // Only follow redirects that stay within our own origin to prevent open redirects.
    if (!nextUrl.startsWith(BASE_URL)) {
      return { status: res.status, finalUrl: url }
    }
    const second = await fetch(nextUrl, { redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) })
    return { status: second.status, finalUrl: nextUrl }
  }
  return { status: res.status, finalUrl: url }
}

function scoreCity(city: GeoCity, status: number, maxPopulation: number): number {
  const healthScore = status === 200 ? 100 : 0
  const priorityScore = Math.max(0, Math.min(100, city.priority))
  const popScore = maxPopulation > 0 ? Math.round((city.population / maxPopulation) * 100) : 0
  // Strong SEO weighting: availability first, then business priority, then market size
  return Math.round(healthScore * 0.7 + priorityScore * 0.2 + popScore * 0.1)
}

export async function GET(req: NextRequest) {
  const rawLocale = (req.nextUrl.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const locale = SUPPORTED_LOCALES.includes(rawLocale as any) ? rawLocale : DEFAULT_LOCALE
  const rawSlug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const slug = SAFE_SLUG_RE.test(rawSlug) ? rawSlug : "aws-ssh-hardening-2026"
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24", 10) || 24
  const cities = await getTopCities(limit)
  const maxPopulation = Math.max(1, ...cities.map((c) => c.population || 0))

  const results = await Promise.allSettled(
    cities.map(async (city) => {
      const url = `${BASE_URL}/${locale}/runbook/${slug}-${city.slug}`
      const probe = await probeUrl(url)
      return {
        ...city,
        status: probe.status,
        healthy: probe.status === 200,
        finalUrl: probe.finalUrl,
        rankingScore: scoreCity(city, probe.status, maxPopulation),
      } as RankedCity
    })
  )
  const ranked: RankedCity[] = results.map((result, i) => {
    if (result.status === "fulfilled") return result.value
    const city = cities[i]
    return { ...city, status: 0, healthy: false, rankingScore: scoreCity(city, 0, maxPopulation) }
  })

  ranked.sort((a, b) => b.rankingScore - a.rankingScore || b.priority - a.priority || b.population - a.population)
  const healthy = ranked.filter((r) => r.healthy).length

  return NextResponse.json(
    {
      ok: true,
      locale,
      slug,
      totalCities: ranked.length,
      healthyCities: healthy,
      healthScore: Math.round((healthy / Math.max(1, ranked.length)) * 100),
      generatedAt: new Date().toISOString(),
      cities: ranked,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60, max-age=300",
      },
    }
  )
}

