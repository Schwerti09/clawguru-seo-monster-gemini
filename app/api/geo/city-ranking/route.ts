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

async function ensureChinaCitiesExist() {
  console.log("🚀 China Mega Expansion: Checking cities...")
  
  const checkQuery = `SELECT city_slug FROM geo_cities WHERE city_slug IN ('beijing', 'shanghai', 'guangzhou', 'shenzhen')`
  const existing = await dbQuery(checkQuery)
  
  if (existing.rows.length === 4) {
    console.log("✅ China cities already exist")
    return
  }
  
  console.log("🔧 Creating China cities...")
  
  const CHINA_CITIES = [
    {
      city_slug: "beijing",
      name_de: "Peking", 
      name_en: "Beijing",
      country_code: "CN",
      priority: 95,
      population: 21540000,
      title: "Beijing Security Operations Center",
      summary: "Leading cybersecurity solutions for Beijing's financial district and tech enterprises. Specialized in Chinese compliance and regulatory frameworks.",
      tags: ["china", "beijing", "cybersecurity", "compliance", "financial-services", "tech-hub"],
      clawScore: 88,
      content_depth: 85,
      local_relevance: 90,
      technical_accuracy: 88
    },
    {
      city_slug: "shanghai",
      name_de: "Shanghai",
      name_en: "Shanghai", 
      country_code: "CN",
      priority: 94,
      population: 24280000,
      title: "Shanghai Security Operations Center",
      summary: "Advanced security operations for Shanghai's international business district and fintech companies. Expert in cross-border data protection.",
      tags: ["china", "shanghai", "cybersecurity", "fintech", "international-business", "data-protection"],
      clawScore: 89,
      content_depth: 86,
      local_relevance: 91,
      technical_accuracy: 89
    },
    {
      city_slug: "guangzhou",
      name_de: "Kanton",
      name_en: "Guangzhou",
      country_code: "CN", 
      priority: 88,
      population: 15300000,
      title: "Guangzhou Security Operations Center",
      summary: "Comprehensive security solutions for Guangzhou's manufacturing and logistics sectors. Specialized in industrial cybersecurity and supply chain protection.",
      tags: ["china", "guangzhou", "cybersecurity", "manufacturing", "logistics", "industrial-security"],
      clawScore: 87,
      content_depth: 84,
      local_relevance: 89,
      technical_accuracy: 87
    },
    {
      city_slug: "shenzhen",
      name_de: "Shenzhen",
      name_en: "Shenzhen",
      country_code: "CN",
      priority: 89,
      population: 17560000,
      title: "Shenzhen Security Operations Center", 
      summary: "Cutting-edge security operations for Shenzhen's tech innovation hub and startup ecosystem. Expert in cloud security and emerging technologies.",
      tags: ["china", "shenzhen", "cybersecurity", "tech-hub", "startups", "cloud-security", "innovation"],
      clawScore: 90,
      content_depth: 87,
      local_relevance: 92,
      technical_accuracy: 90
    }
  ]
  
  for (const city of CHINA_CITIES) {
    // Insert city
    const upsertCityQuery = `
      INSERT INTO geo_cities (city_slug, name_de, name_en, country_code, priority, population, title, summary, tags, claw_score, lastmod, rollout_stage, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'canary', true)
      ON CONFLICT (city_slug) DO UPDATE SET
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        tags = EXCLUDED.tags,
        claw_score = EXCLUDED.claw_score,
        lastmod = EXCLUDED.lastmod,
        rollout_stage = EXCLUDED.rollout_stage,
        is_active = EXCLUDED.is_active
    `
    
    await dbQuery(upsertCityQuery, [
      city.city_slug,
      city.name_de,
      city.name_en,
      city.country_code,
      city.priority,
      city.population,
      city.title,
      city.summary,
      JSON.stringify(city.tags),
      city.clawScore,
      new Date().toISOString().split('T')[0]
    ])
    
    // Insert quality metrics
    const qualityScore = Math.min(95, city.clawScore - 2)
    const upsertQualityQuery = `
      INSERT INTO geo_city_quality_metrics (city_slug, quality_score, content_depth, local_relevance, technical_accuracy, last_updated)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (city_slug) DO UPDATE SET
        quality_score = EXCLUDED.quality_score,
        content_depth = EXCLUDED.content_depth,
        local_relevance = EXCLUDED.local_relevance,
        technical_accuracy = EXCLUDED.technical_accuracy,
        last_updated = EXCLUDED.last_updated
    `
    
    await dbQuery(upsertQualityQuery, [
      city.city_slug,
      qualityScore,
      city.content_depth,
      city.local_relevance,
      city.technical_accuracy,
      new Date().toISOString()
    ])
    
    console.log(`✅ ${city.city_slug} created`)
  }
  
  console.log("🎉 China Mega Expansion completed!")
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
  
  // China Mega Expansion: Auto-create China cities if requested
  if (req.nextUrl.searchParams.get("china") === "1") {
    await ensureChinaCitiesExist()
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

