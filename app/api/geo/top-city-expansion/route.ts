import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { dbQuery } from "@/lib/db"
import { invalidateGeoCitiesCache } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

function hasSecret(req: NextRequest) {
  const expected =
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!expected) return false
  const auth = req.headers.get("authorization") || ""
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const header = req.headers.get("x-geo-expansion-secret") || ""
  const query = req.nextUrl.searchParams.get("secret") || ""
  const provided = bearer || header || query
  return provided === expected
}

export async function POST(req: NextRequest) {
  if (!hasSecret(req)) return unauthorized()

  const dryRun = req.nextUrl.searchParams.get("dryRun") !== "0"
  const locale = (req.nextUrl.searchParams.get("locale") || "de").toLowerCase()
  const slug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24", 10) || 24
  const minHealth = parseInt(req.nextUrl.searchParams.get("minHealth") || process.env.GEO_EXPANSION_MIN_HEALTH || "88", 10) || 88
  const maxActivate = Math.max(1, Math.min(10, parseInt(req.nextUrl.searchParams.get("maxActivate") || process.env.GEO_EXPANSION_MAX_ACTIVATE || "3", 10) || 3))
  const minPriority = Math.max(1, Math.min(100, parseInt(req.nextUrl.searchParams.get("minPriority") || process.env.GEO_EXPANSION_MIN_PRIORITY || "60", 10) || 60))
  const minPopulation = Math.max(0, parseInt(req.nextUrl.searchParams.get("minPopulation") || process.env.GEO_EXPANSION_MIN_POPULATION || "500000", 10) || 500000)

  const rankingUrl = new URL(req.url)
  rankingUrl.pathname = "/api/geo/city-ranking"
  rankingUrl.searchParams.set("locale", locale)
  rankingUrl.searchParams.set("slug", slug)
  rankingUrl.searchParams.set("limit", String(limit))

  const rankingRes = await fetch(rankingUrl.toString(), {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  })
  const ranking = await rankingRes.json().catch(() => null)
  const healthScore = Number(ranking?.healthScore ?? 0)

  const candidatesRes = await dbQuery<{
    slug: string
    name_de: string
    name_en: string
    country_code: string
    priority: number
    population: number
  }>(
    `SELECT slug, name_de, name_en, country_code, priority, population
     FROM geo_cities
     WHERE is_active = false
       AND priority >= $1
       AND population >= $2
     ORDER BY priority DESC, population DESC, slug ASC
     LIMIT $3`,
    [minPriority, minPopulation, maxActivate]
  )
  const candidates = candidatesRes.rows

  const totalsRes = await dbQuery<{
    inactive_total: string
    priority_pass: string
    population_pass: string
  }>(
    `SELECT
       COUNT(*) FILTER (WHERE is_active = false)::text AS inactive_total,
       COUNT(*) FILTER (WHERE is_active = false AND priority >= $1)::text AS priority_pass,
       COUNT(*) FILTER (WHERE is_active = false AND priority >= $1 AND population >= $2)::text AS population_pass
     FROM geo_cities`,
    [minPriority, minPopulation]
  )
  const totals = totalsRes.rows[0] || { inactive_total: "0", priority_pass: "0", population_pass: "0" }
  const debug = {
    inactiveTotal: Number(totals.inactive_total || 0),
    passPriority: Number(totals.priority_pass || 0),
    passPopulation: Number(totals.population_pass || 0),
    selected: candidates.length,
    blockedByHealth: healthScore < minHealth,
  }

  if (dryRun || healthScore < minHealth || candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      healthScore,
      minHealth,
      maxActivate,
      minPriority,
      minPopulation,
      debug,
      wouldActivate: candidates,
      activated: [],
    })
  }

  const slugs = candidates.map((c) => c.slug)
  const updated = await dbQuery<{ slug: string }>(
    `UPDATE geo_cities
     SET is_active = true,
         rollout_stage = 'canary',
         updated_at = NOW()
     WHERE slug = ANY($1::text[])
       AND is_active = false
     RETURNING slug`,
    [slugs]
  )

  await invalidateGeoCitiesCache()
  revalidateTag("geo-cities-active")

  return NextResponse.json({
    ok: true,
    dryRun: false,
    healthScore,
    minHealth,
    maxActivate,
    minPriority,
    minPopulation,
    debug,
    wouldActivate: candidates,
    activated: updated.rows.map((r) => r.slug),
  })
}
