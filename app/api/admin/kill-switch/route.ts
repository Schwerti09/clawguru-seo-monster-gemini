// File: app/api/admin/kill-switch/route.ts
// Global Kill-Switch – toggles MAINTENANCE_MODE env var via Netlify API.
// Admin-only (requires valid session cookie).
// Required env vars: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST() {
  const token = (await cookies()).get(adminCookieName())?.value ?? ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  const netlifyToken = process.env.NETLIFY_AUTH_TOKEN
  const siteId = process.env.NETLIFY_SITE_ID

  if (!netlifyToken || !siteId) {
    return NextResponse.json(
      { error: "NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID not configured" },
      { status: 503 }
    )
  }

  try {
    // Set MAINTENANCE_MODE=true in Netlify environment variables
    const res = await fetch(
      `https://api.netlify.com/api/v1/sites/${encodeURIComponent(siteId)}/env`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${netlifyToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            key: "MAINTENANCE_MODE",
            scopes: ["runtime", "post_processing"],
            values: [{ context: "all", value: "true" }],
          },
        ]),
      }
    )

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      return NextResponse.json(
        { error: `Netlify API error: ${res.status}`, detail: body },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true, maintenanceMode: true, ts: new Date().toISOString() })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
