// app/api/admin/maintenance/route.ts
// Admin API route to read and toggle MAINTENANCE_MODE via the Netlify API.
// Secured by admin session cookie.

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { getMaintenanceMode, setMaintenanceMode } from "@/lib/netlify-api"

export const runtime = "edge"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

/** GET – return current MAINTENANCE_MODE status */
export async function GET() {
  const token = cookies().get(adminCookieName())?.value || ""
  const session = token ? await verifyAdminToken(token) : null
  if (!session) return unauthorized()

  try {
    const enabled = await getMaintenanceMode()
    return NextResponse.json({ enabled })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/** POST – toggle MAINTENANCE_MODE; body: { enabled: boolean } */
export async function POST(req: Request) {
  const token = cookies().get(adminCookieName())?.value || ""
  const session = token ? await verifyAdminToken(token) : null
  if (!session) return unauthorized()

  let body: { enabled?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  if (typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "enabled must be boolean" }, { status: 400 })
  }

  try {
    await setMaintenanceMode(body.enabled)
    return NextResponse.json({ ok: true, enabled: body.enabled })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
