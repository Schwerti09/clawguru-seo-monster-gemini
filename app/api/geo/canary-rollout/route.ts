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
    process.env.GEO_CANARY_ROLLOUT_SECRET ||
    process.env.GEO_EXPANSION_SECRET ||
    process.env.GEO_AUTO_PRUNE_SECRET ||
    process.env.GEO_REVALIDATE_SECRET ||
    ""
  if (!expected) return false
  const auth = req.headers.get("authorization") || ""
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const header = req.headers.get("x-geo-canary-secret") || ""
  const query = req.nextUrl.searchParams.get("secret") || ""
  const provided = bearer || header || query
  return provided === expected
}

export async function POST(req: NextRequest) {
  if (!hasSecret(req)) return unauthorized()

  const dryRun = req.nextUrl.searchParams.get("dryRun") !== "0"
  const locale = (req.nextUrl.searchParams.get("locale") || "de").toLowerCase()
  const slug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const limit = Math.max(
    1,
    Math.min(120, parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_CANARY_ROLLOUT_LIMIT || "80", 10) || 80)
  )
  const minRankingScore = Math.max(
    1,
    Math.min(100, parseInt(req.nextUrl.searchParams.get("minRankingScore") || process.env.GEO_CANARY_PROMOTE_MIN_RANKING_SCORE || "86", 10) || 86)
  )

  const rankingUrl = new URL(req.url)
  rankingUrl.pathname = "/api/geo/city-ranking"
  rankingUrl.searchParams.set("locale", locale)
  rankingUrl.searchParams.set("slug", slug)
  rankingUrl.searchParams.set("limit", String(limit))
  rankingUrl.searchParams.set("forceRefresh", "1")
  const rankingRes = await fetch(rankingUrl.toString(), {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  })
  const ranking = await rankingRes.json().catch(() => null)
  const rankedCities = Array.isArray(ranking?.cities) ? ranking.cities : []

  const canaryRes = await dbQuery<{ slug: string }>(
    `SELECT slug
     FROM geo_cities
     WHERE is_active = true
       AND rollout_stage = 'canary'
     ORDER BY priority DESC, population DESC, slug ASC`
  )
  const canarySet = new Set(canaryRes.rows.map((r) => r.slug))
  const canaryRanked = rankedCities.filter((city: any) => canarySet.has(String(city.slug || "")))
  const withStatus200 = canaryRanked.filter((city: any) => city.status === 200)
  const withRanking = withStatus200.filter((city: any) => Number(city.rankingScore || 0) >= minRankingScore)
  const promote = withRanking.map((city: any) => String(city.slug))

  const debug = {
    totalRanked: rankedCities.length,
    canaryRanked: canaryRanked.length,
    belowStatus200: canaryRanked.length - withStatus200.length,
    belowMinRankingScore: withStatus200.length - withRanking.length,
    selected: promote.length,
  }

  if (dryRun || promote.length === 0) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      locale,
      slug,
      minRankingScore,
      canaryCount: canarySet.size,
      debug,
      wouldPromote: promote,
      promoted: [],
    })
  }

  const updated = await dbQuery<{ slug: string }>(
    `UPDATE geo_cities
     SET rollout_stage = 'stable', updated_at = NOW()
     WHERE slug = ANY($1::text[])
       AND rollout_stage = 'canary'
       AND is_active = true
     RETURNING slug`,
    [promote]
  )

  await invalidateGeoCitiesCache()
  revalidateTag("geo-cities-active")

  return NextResponse.json({
    ok: true,
    dryRun: false,
    locale,
    slug,
    minRankingScore,
    canaryCount: canarySet.size,
    debug,
    promoted: updated.rows.map((r) => r.slug),
  })
}
