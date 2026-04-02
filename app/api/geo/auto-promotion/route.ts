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
    process.env.GEO_AUTO_PROMOTION_SECRET ||
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!expected) return false
  const auth = req.headers.get("authorization") || ""
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const header = req.headers.get("x-geo-auto-promotion-secret") || ""
  const query = req.nextUrl.searchParams.get("secret") || ""
  const provided = bearer || header || query
  return provided === expected
}

function toInt(raw: string | null, fallback: number, min: number, max: number) {
  const parsed = parseInt(raw || "", 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, parsed))
}

export async function POST(req: NextRequest) {
  if (!hasSecret(req)) return unauthorized()

  const dryRun = req.nextUrl.searchParams.get("dryRun") !== "0"
  const locale = (req.nextUrl.searchParams.get("locale") || "de").toLowerCase()
  const lookbackDays = toInt(
    req.nextUrl.searchParams.get("lookbackDays") || process.env.GEO_AUTO_PROMOTE_LOOKBACK_DAYS || "7",
    7,
    1,
    30
  )
  const minAvgQuality = toInt(
    req.nextUrl.searchParams.get("minAvgQuality") || process.env.GEO_AUTO_PROMOTE_MIN_AVG_QUALITY || "84",
    84,
    1,
    100
  )
  const minVariants = toInt(
    req.nextUrl.searchParams.get("minVariants") || process.env.GEO_AUTO_PROMOTE_MIN_VARIANTS || "3",
    3,
    1,
    100
  )
  const maxPromotions = toInt(
    req.nextUrl.searchParams.get("maxPromotions") || process.env.GEO_AUTO_PROMOTE_MAX_PROMOTIONS || "10",
    10,
    1,
    100
  )

  const candidatesRes = await dbQuery<{
    city_slug: string
    avg_quality: string
    variants: string
  }>(
    `SELECT
       g.city_slug AS city_slug,
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
     LIMIT $5`,
    [locale, String(lookbackDays), minVariants, minAvgQuality, maxPromotions]
  )

  const candidates = candidatesRes.rows.map((r) => ({
    citySlug: r.city_slug,
    avgQuality: Number(r.avg_quality || 0),
    variants: Number(r.variants || 0),
  }))

  if (dryRun || candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      locale,
      lookbackDays,
      minAvgQuality,
      minVariants,
      maxPromotions,
      promoted: [],
      candidates,
    })
  }

  const promoteSlugs = candidates.map((c) => c.citySlug)
  const updated = await dbQuery<{ slug: string }>(
    `UPDATE geo_cities
     SET rollout_stage = 'stable', updated_at = NOW()
     WHERE slug = ANY($1::text[])
       AND is_active = true
       AND rollout_stage = 'canary'
     RETURNING slug`,
    [promoteSlugs]
  )

  await invalidateGeoCitiesCache()
  revalidateTag("geo-cities-active")

  return NextResponse.json({
    ok: true,
    dryRun: false,
    locale,
    lookbackDays,
    minAvgQuality,
    minVariants,
    maxPromotions,
    candidates,
    promoted: updated.rows.map((r) => r.slug),
  })
}

