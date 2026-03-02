// app/api/admin/block-ip/route.ts
// Manually block an IP for 24 h via the Wall of Shame dashboard.

import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { blockIp } from "@/lib/api-usage"

export const runtime = "nodejs"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST(request: NextRequest) {
  const token = cookies().get(adminCookieName())?.value ?? ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  let ip: string
  try {
    const body = await request.json()
    ip = String(body?.ip ?? "").trim()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!ip) {
    return NextResponse.json({ error: "ip is required" }, { status: 400 })
  }

  const ok = blockIp(ip)
  if (!ok) {
    return NextResponse.json({ error: "Invalid IP" }, { status: 400 })
  }

  return NextResponse.json({ ok: true, ip, blockedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() })
}
