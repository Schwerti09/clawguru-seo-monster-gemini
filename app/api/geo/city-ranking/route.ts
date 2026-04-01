import { NextRequest, NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"
import { DEFAULT_LOCALE } from "@/lib/i18n"
import { getTopCities, type GeoCity } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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
  const res = await fetch(url, { redirect: "manual", cache: "no-store" })
  if ((res.status === 307 || res.status === 308) && res.headers.get("location")) {
    const nextUrl = new URL(res.headers.get("location") || "", url).toString()
    const second = await fetch(nextUrl, { redirect: "manual", cache: "no-store" })
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
  const locale = (req.nextUrl.searchParams.get("locale") || DEFAULT_LOCALE).toLowerCase()
  const slug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24", 10) || 24
  const cities = await getTopCities(limit)
  const maxPopulation = Math.max(1, ...cities.map((c) => c.population || 0))

  const ranked: RankedCity[] = []
  for (const city of cities) {
    const url = `${BASE_URL}/${locale}/runbook/${slug}-${city.slug}`
    try {
      const probe = await probeUrl(url)
      ranked.push({
        ...city,
        status: probe.status,
        healthy: probe.status === 200,
        finalUrl: probe.finalUrl,
        rankingScore: scoreCity(city, probe.status, maxPopulation),
      })
    } catch {
      ranked.push({
        ...city,
        status: 0,
        healthy: false,
        rankingScore: scoreCity(city, 0, maxPopulation),
      })
    }
  }

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

