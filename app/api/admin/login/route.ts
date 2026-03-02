import { NextRequest, NextResponse } from "next/server"
import { adminCookieName, issueAdminToken } from "@/lib/admin-auth"
import { encodeUtf8, timingSafeEqual } from "@/lib/edge-crypto"

export const runtime = "edge"

function json(status: number, body: unknown) {
  return NextResponse.json(body, { status })
}

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json().catch(() => ({ user: "", pass: "" }))

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || ""
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ""

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !(process.env.ADMIN_SESSION_SECRET || "")) {
    return json(500, { error: "Admin ENV missing" })
  }

  if (typeof user !== "string" || typeof pass !== "string") {
    return json(400, { error: "Invalid payload" })
  }

  // timing-safe compare
  const okUser = user === ADMIN_USERNAME
  const a = encodeUtf8(pass)
  const b = encodeUtf8(ADMIN_PASSWORD)
  const okPass = a.length === b.length && a.length > 0 && timingSafeEqual(a, b)

  if (!(okUser && okPass)) {
    return json(401, { error: "Wrong credentials" })
  }

  const token = await issueAdminToken(ADMIN_USERNAME)

  const res = json(200, { ok: true })
  res.cookies.set({
    name: adminCookieName(),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8
  })
  return res
}
