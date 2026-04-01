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
  const expected = process.env.GEO_AUTO_PRUNE_SECRET || process.env.GEO_REVALIDATE_SECRET || ""
  if (!expected) return false
  const auth = req.headers.get("authorization") || ""
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : ""
  const header = req.headers.get("x-geo-prune-secret") || ""
  const query = req.nextUrl.searchParams.get("secret") || ""
  const provided = bearer || header || query
  return provided === expected
}

export async function POST(req: NextRequest) {
  if (!hasSecret(req)) return unauthorized()

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1"
  const locale = (req.nextUrl.searchParams.get("locale") || "de").toLowerCase()
  const slug = req.nextUrl.searchParams.get("slug") || "aws-ssh-hardening-2026"
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || process.env.GEO_MATRIX_SITEMAP_CITY_LIMIT || "24", 10) || 24
  const minHealth = parseInt(req.nextUrl.searchParams.get("minHealth") || process.env.GEO_AUTO_PRUNE_MIN_HEALTH || "80", 10) || 80
  const maxPriority = parseInt(req.nextUrl.searchParams.get("maxPriority") || process.env.GEO_AUTO_PRUNE_MAX_PRIORITY || "70", 10) || 70

  const rankingUrl = new URL(req.url)
  rankingUrl.pathname = "/api/geo/city-ranking"
  rankingUrl.searchParams.set("locale", locale)
  rankingUrl.searchParams.set("slug", slug)
  rankingUrl.searchParams.set("limit", String(limit))

  const rankingRes = await fetch(rankingUrl.toString(), { cache: "no-store" })
  const ranking = await rankingRes.json().catch(() => null)
  if (!ranking?.cities || !Array.isArray(ranking.cities)) {
    return NextResponse.json({ error: "ranking unavailable" }, { status: 502 })
  }

  const healthScore = Number(ranking.healthScore ?? 0)
  const candidates = ranking.cities
    .filter((city: any) => !city.healthy && Number(city.priority) <= maxPriority)
    .map((city: any) => city.slug)

  if (dryRun || healthScore >= minHealth || candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      healthScore,
      minHealth,
      maxPriority,
      wouldDeactivate: candidates,
      deactivated: [],
    })
  }

  const updated = await dbQuery<{ slug: string }>(
    `UPDATE geo_cities
     SET is_active = false, updated_at = NOW()
     WHERE slug = ANY($1::text[])
       AND is_active = true
     RETURNING slug`,
    [candidates]
  )

  await invalidateGeoCitiesCache()
  revalidateTag("geo-cities-active")

  return NextResponse.json({
    ok: true,
    dryRun: false,
    healthScore,
    minHealth,
    maxPriority,
    deactivated: updated.rows.map((r) => r.slug),
  })
}

