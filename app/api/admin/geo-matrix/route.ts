import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { dbQuery } from "@/lib/db"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

async function isAdmin() {
  const token = (await cookies()).get(adminCookieName())?.value || ""
  return token ? verifyAdminToken(token) : null
}

export async function GET(req: Request) {
  const session = await isAdmin()
  if (!session) return unauthorized()

  const url = new URL(req.url)
  const locale = (url.searchParams.get("locale") || "").toLowerCase()
  const citySlug = (url.searchParams.get("city") || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  const baseSlug = (url.searchParams.get("baseSlug") || "").toLowerCase()
  const limitRaw = Number(url.searchParams.get("limit") || 50)
  const limit = Math.max(1, Math.min(500, Number.isFinite(limitRaw) ? limitRaw : 50))

  const filters: string[] = []
  const params: Array<string | number> = []

  if (locale) {
    params.push(locale)
    filters.push(`locale = $${params.length}`)
  }
  if (citySlug) {
    params.push(citySlug)
    filters.push(`city_slug = $${params.length}`)
  }
  if (baseSlug) {
    params.push(baseSlug)
    filters.push(`base_slug = $${params.length}`)
  }

  params.push(limit)
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : ""

  const [itemsRes, aggRes] = await Promise.all([
    dbQuery(
      `SELECT id, locale, base_slug, city_slug, variant_slug, city_name, region_name, country_code,
              local_title, local_summary, links_json, quality_score, model, updated_at, created_at
       FROM geo_variant_matrix
       ${where}
       ORDER BY updated_at DESC
       LIMIT $${params.length}`,
      params
    ),
    dbQuery<{
      variants_24h: string
      avg_quality_24h: string
      distinct_cities_24h: string
      distinct_bases_24h: string
    }>(
      `SELECT
         COUNT(*)::text AS variants_24h,
         COALESCE(ROUND(AVG(quality_score))::text, '0') AS avg_quality_24h,
         COUNT(DISTINCT city_slug)::text AS distinct_cities_24h,
         COUNT(DISTINCT base_slug)::text AS distinct_bases_24h
       FROM geo_variant_matrix
       WHERE updated_at >= NOW() - INTERVAL '24 hours'`
    ),
  ])

  return NextResponse.json({
    items: itemsRes.rows,
    stats24h: aggRes.rows[0] ?? {
      variants_24h: "0",
      avg_quality_24h: "0",
      distinct_cities_24h: "0",
      distinct_bases_24h: "0",
    },
  })
}

