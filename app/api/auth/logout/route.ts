import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyAccessToken } from "@/lib/access-token"
import { denyToken } from "@/lib/token-deny-list"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  // Revoke the current access token immediately so it cannot be reused
  // even within its remaining validity window.
  const token = cookies().get("claw_access")?.value || ""
  if (token) {
    const payload = verifyAccessToken(token)
    if (payload) {
      denyToken(token, payload.exp, "logout")
    }
  }

  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const res = NextResponse.redirect(new URL("/", origin))
  res.cookies.set({ name: "claw_access", value: "", maxAge: 0, path: "/" })
  return res
}
