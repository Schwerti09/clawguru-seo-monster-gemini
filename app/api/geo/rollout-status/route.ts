import { NextRequest, NextResponse } from "next/server"
import { getGeoSitemapRuntimeLimits, getDefaultGeoSitemapRuntimeLimits } from "@/lib/geo-runtime-config"
import { dbQuery } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

function hasSecret(req: NextRequest): boolean {
  const expected =
    process.env.GEO_ROLLOUT_STATUS_SECRET ||
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_SITEMAP_GUARDRAIL_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!expected) return false
  const auth = req.headers.get("authorization") || ""
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const header = req.headers.get("x-geo-rollout-secret") || ""
  const query = req.nextUrl.searchParams.get("secret") || ""
  const provided = bearer || header || query
  return provided === expected
}

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

function toInt(value: string | null, fallback: number, min: number, max: number): number {
  const parsed = parseInt(value || "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

export async function GET(req: NextRequest) {
  if (!hasSecret(req)) return unauthorized()

  const sampleLimit = toInt(req.nextUrl.searchParams.get("sampleLimit"), 8, 1, 30)
  const verbose = req.nextUrl.searchParams.get("verbose") === "1"
  const includeRanking = req.nextUrl.searchParams.get("includeRanking") === "1" || verbose
  const locale = (req.nextUrl.searchParams.get("locale") || "de").toLowerCase()
  const slug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const rankingLimit = toInt(req.nextUrl.searchParams.get("rankingLimit"), 24, 1, 120)
  const autoPromoteMinQuality = toInt(
    req.nextUrl.searchParams.get("autoPromoteMinQuality") || process.env.GEO_AUTO_PROMOTE_MIN_AVG_QUALITY || "84",
    84,
    1,
    100
  )
  const autoPromoteMinVariants = toInt(
    req.nextUrl.searchParams.get("autoPromoteMinVariants") || process.env.GEO_AUTO_PROMOTE_MIN_VARIANTS || "3",
    3,
    1,
    100
  )
  const autoPromoteLookbackDays = toInt(
    req.nextUrl.searchParams.get("autoPromoteLookbackDays") || process.env.GEO_AUTO_PROMOTE_LOOKBACK_DAYS || "7",
    7,
    1,
    30
  )

  const countRes = await dbQuery<{
    is_active: boolean
    rollout_stage: "canary" | "stable"
    count: string
  }>(
    `SELECT is_active, rollout_stage, COUNT(*)::text AS count
     FROM geo_cities
     GROUP BY is_active, rollout_stage`
  )

  const counters = {
    activeStable: 0,
    activeCanary: 0,
    inactiveStable: 0,
    inactiveCanary: 0,
    total: 0,
  }
  for (const row of countRes.rows) {
    const n = parseInt(row.count || "0", 10) || 0
    counters.total += n
    if (row.is_active && row.rollout_stage === "stable") counters.activeStable += n
    if (row.is_active && row.rollout_stage === "canary") counters.activeCanary += n
    if (!row.is_active && row.rollout_stage === "stable") counters.inactiveStable += n
    if (!row.is_active && row.rollout_stage === "canary") counters.inactiveCanary += n
  }

  let activeCanaryRows: Array<{
    slug: string
    priority: number
    population: number
    updated_at: string
  }> = []
  let activeStableRows: Array<{
    slug: string
    priority: number
    population: number
    updated_at: string
  }> = []
  if (verbose) {
    const activeCanaryRes = await dbQuery<{
      slug: string
      priority: number
      population: number
      updated_at: string
    }>(
      `SELECT slug, priority, population, updated_at
       FROM geo_cities
       WHERE is_active = true
         AND rollout_stage = 'canary'
       ORDER BY priority DESC, population DESC, updated_at DESC
       LIMIT $1`,
      [sampleLimit]
    )

    const activeStableRes = await dbQuery<{
      slug: string
      priority: number
      population: number
      updated_at: string
    }>(
      `SELECT slug, priority, population, updated_at
       FROM geo_cities
       WHERE is_active = true
         AND rollout_stage = 'stable'
       ORDER BY priority DESC, population DESC, updated_at DESC
       LIMIT $1`,
      [sampleLimit]
    )
    activeCanaryRows = activeCanaryRes.rows
    activeStableRows = activeStableRes.rows
  }

  let ranking: any = null
  if (includeRanking) {
    const rankingUrl = new URL(req.url)
    rankingUrl.pathname = "/api/geo/city-ranking"
    rankingUrl.searchParams.set("locale", locale)
    rankingUrl.searchParams.set("slug", slug)
    rankingUrl.searchParams.set("limit", String(rankingLimit))
    try {
      const rankingRes = await fetch(rankingUrl.toString(), {
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      })
      ranking = await rankingRes.json().catch(() => null)
    } catch {
      ranking = null
    }
  }

  const autoPromotePreviewRes = await dbQuery<{
    city_slug: string
    avg_quality: string
    variants: string
  }>(
    `SELECT
       g.city_slug,
       ROUND(AVG(g.quality_score))::text AS avg_quality,
       COUNT(*)::text AS variants
     FROM geo_variant_matrix g
     JOIN geo_cities c ON c.slug = g.city_slug
     WHERE g.locale = $1
       AND g.updated_at >= NOW() - ($2::text || ' days')::interval
       AND c.is_active = true
       AND c.rollout_stage = 'canary'
     GROUP BY g.city_slug
     HAVING COUNT(*) >= $3
       AND AVG(g.quality_score) >= $4
     ORDER BY AVG(g.quality_score) DESC, COUNT(*) DESC
     LIMIT 12`,
    [locale, String(autoPromoteLookbackDays), autoPromoteMinVariants, autoPromoteMinQuality]
  )

  const runtimeLimits = await getGeoSitemapRuntimeLimits()
  const defaultLimits = getDefaultGeoSitemapRuntimeLimits()

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    mode: verbose ? "verbose" : "fast",
    rollout: counters,
    sample: verbose
      ? {
          activeCanary: activeCanaryRows,
          activeStable: activeStableRows,
        }
      : undefined,
    sitemapRuntimeLimits: runtimeLimits,
    sitemapDefaultLimits: defaultLimits,
    rankingSnapshot: ranking
      ? {
          locale,
          slug,
          healthScore: ranking.healthScore,
          healthyCities: ranking.healthyCities,
          totalCities: ranking.totalCities,
          durationMs: ranking.durationMs,
        }
      : null,
    autoPromotionPreview: {
      locale,
      lookbackDays: autoPromoteLookbackDays,
      minAvgQuality: autoPromoteMinQuality,
      minVariants: autoPromoteMinVariants,
      readyCities: autoPromotePreviewRes.rows.map((r) => ({
        slug: r.city_slug,
        avgQuality: Number(r.avg_quality || 0),
        variants: Number(r.variants || 0),
      })),
    },
  })
}
