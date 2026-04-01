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
  const includeInactive = url.searchParams.get("includeInactive") === "1"
  const rows = await dbQuery(
    `SELECT id, slug, name_de, name_en, country_code, priority, population, is_active, created_at, updated_at
     FROM geo_cities
     ${includeInactive ? "" : "WHERE is_active = true"}
     ORDER BY priority DESC, population DESC, slug ASC`
  )
  return NextResponse.json({ items: rows.rows })
}

export async function POST(req: Request) {
  const session = await isAdmin()
  if (!session) return unauthorized()

  const body = await req.json().catch(() => null)
  if (!body?.slug || !body?.name_de || !body?.name_en || !body?.country_code) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 })
  }

  const priority = Math.max(1, Math.min(100, Number(body.priority ?? 50)))
  const population = Math.max(0, Number(body.population ?? 0))
  const isActive = body.is_active !== false

  const result = await dbQuery(
    `INSERT INTO geo_cities (slug, name_de, name_en, country_code, priority, population, is_active)
     VALUES ($1, $2, $3, UPPER($4), $5, $6, $7)
     ON CONFLICT (slug) DO UPDATE SET
       name_de = EXCLUDED.name_de,
       name_en = EXCLUDED.name_en,
       country_code = EXCLUDED.country_code,
       priority = EXCLUDED.priority,
       population = EXCLUDED.population,
       is_active = EXCLUDED.is_active,
       updated_at = NOW()
     RETURNING id, slug, name_de, name_en, country_code, priority, population, is_active, created_at, updated_at`,
    [
      String(body.slug).toLowerCase().replace(/[^a-z0-9]/g, ""),
      String(body.name_de),
      String(body.name_en),
      String(body.country_code),
      priority,
      population,
      isActive,
    ]
  )

  return NextResponse.json({ ok: true, item: result.rows[0] })
}

export async function PATCH(req: Request) {
  const session = await isAdmin()
  if (!session) return unauthorized()

  const body = await req.json().catch(() => null)
  if (!body?.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 })
  }

  const updates: string[] = []
  const values: any[] = []
  let idx = 1

  function add(field: string, value: any) {
    updates.push(`${field} = $${idx++}`)
    values.push(value)
  }

  if (typeof body.name_de === "string") add("name_de", body.name_de)
  if (typeof body.name_en === "string") add("name_en", body.name_en)
  if (typeof body.country_code === "string") add("country_code", body.country_code.toUpperCase())
  if (typeof body.priority !== "undefined") add("priority", Math.max(1, Math.min(100, Number(body.priority))))
  if (typeof body.population !== "undefined") add("population", Math.max(0, Number(body.population)))
  if (typeof body.is_active === "boolean") add("is_active", body.is_active)

  if (!updates.length) {
    return NextResponse.json({ error: "no updatable fields provided" }, { status: 400 })
  }

  updates.push(`updated_at = NOW()`)
  values.push(String(body.slug).toLowerCase().replace(/[^a-z0-9]/g, ""))

  const result = await dbQuery(
    `UPDATE geo_cities
     SET ${updates.join(", ")}
     WHERE slug = $${idx}
     RETURNING id, slug, name_de, name_en, country_code, priority, population, is_active, created_at, updated_at`,
    values
  )

  if (result.rowCount === 0) {
    return NextResponse.json({ error: "city not found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true, item: result.rows[0] })
}

