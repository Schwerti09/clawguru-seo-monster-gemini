// File: app/api/admin/kill-switch/route.ts
// Global Kill-Switch – sets MAINTENANCE_MODE=true via Upstash Redis.
// Admin-only (requires valid session cookie).
// Required env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { setMaintenanceMode } from "@/lib/netlify-api"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST() {
  const token = (await cookies()).get(adminCookieName())?.value ?? ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  try {
    await setMaintenanceMode(true)
    return NextResponse.json({ ok: true, maintenanceMode: true, ts: new Date().toISOString() })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
