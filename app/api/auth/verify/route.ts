import { NextRequest, NextResponse } from "next/server"
import { verifyMagicToken, signSessionToken, USER_SESSION_COOKIE } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"

  const token = req.nextUrl.searchParams.get("token") || ""
  if (!token) {
    return NextResponse.redirect(new URL("/account?error=missing_token", origin))
  }

  const payload = verifyMagicToken(token)
  if (!payload) {
    return NextResponse.redirect(new URL("/account?error=invalid_token", origin))
  }

  const sessionToken = signSessionToken(payload.email)
  const res = NextResponse.redirect(new URL("/account", origin))
  res.cookies.set({
    name: USER_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
  return res
}
