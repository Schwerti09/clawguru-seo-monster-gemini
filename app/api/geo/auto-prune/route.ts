import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { dbQuery } from "@/lib/db"
import { invalidateGeoCitiesCache } from "@/lib/geo-cities"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function clampPriority(value: number) {
  return Math.max(1, Math.min(100, Math.round(value)))
}

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
  const prioritySyncEnabled = (process.env.GEO_PRIORITY_SYNC_ENABLED ?? "1") === "1"

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
  const priorityUpdates = ranking.cities
    .map((city: any) => {
      const current = clampPriority(Number(city.priority ?? 50))
      const rankingScore = Math.max(0, Math.min(100, Number(city.rankingScore ?? 0)))
      const healthy = Boolean(city.healthy)
      let target = clampPriority(current * 0.65 + rankingScore * 0.35)
      // Penalize unstable pages and mildly reward very healthy pages.
      if (!healthy) target = clampPriority(target - 8)
      else if (rankingScore >= 90) target = clampPriority(target + 3)
      const delta = target - current
      return {
        slug: String(city.slug || ""),
        current,
        target,
        delta,
      }
    })
    .filter((x: any) => x.slug && Math.abs(x.delta) >= 3)

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      healthScore,
      minHealth,
      maxPriority,
      wouldDeactivate: candidates,
      prioritySyncEnabled,
      wouldUpdatePriority: prioritySyncEnabled ? priorityUpdates : [],
      deactivated: [],
    })
  }

  const priorityChanged: Array<{ slug: string; from: number; to: number }> = []
  if (prioritySyncEnabled && priorityUpdates.length > 0) {
    for (const item of priorityUpdates) {
      const updated = await dbQuery<{ slug: string; priority: number }>(
        `UPDATE geo_cities
         SET priority = $2, updated_at = NOW()
         WHERE slug = $1
         RETURNING slug, priority`,
        [item.slug, item.target]
      )
      if (updated.rowCount > 0) {
        priorityChanged.push({
          slug: item.slug,
          from: item.current,
          to: item.target,
        })
      }
    }
  }

  let updatedRows: Array<{ slug: string }> = []
  if (healthScore < minHealth && candidates.length > 0) {
    const updated = await dbQuery<{ slug: string }>(
      `UPDATE geo_cities
       SET is_active = false, updated_at = NOW()
       WHERE slug = ANY($1::text[])
         AND is_active = true
       RETURNING slug`,
      [candidates]
    )
    updatedRows = updated.rows
  }

  await invalidateGeoCitiesCache()
  revalidateTag("geo-cities-active")

  return NextResponse.json({
    ok: true,
    dryRun: false,
    healthScore,
    minHealth,
    maxPriority,
    prioritySyncEnabled,
    priorityUpdatedCount: priorityChanged.length,
    priorityUpdated: priorityChanged,
    deactivated: updatedRows.map((r) => r.slug),
  })
}

