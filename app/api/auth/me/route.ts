import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken, USER_SESSION_COOKIE } from "@/lib/auth"
import { verifyAccessToken } from "@/lib/access-token"

export const runtime = "nodejs"

export async function GET() {
  const jar = await cookies()

  // 1) Legacy / password-session flow
  const sessionToken = jar.get(USER_SESSION_COOKIE)?.value
  if (sessionToken) {
    const session = verifySessionToken(sessionToken)
    if (session) {
      return NextResponse.json({
        authenticated: true,
        authType: "session",
        email: session.email,
      })
    }
  }

  // 2) Stripe activate / access-token flow
  const accessToken = jar.get("claw_access")?.value
  if (accessToken) {
    const access = verifyAccessToken(accessToken)
    if (access) {
      return NextResponse.json({
        authenticated: true,
        authType: "access",
        plan: access.plan,
        customerId: access.customerId,
        subscriptionId: access.subscriptionId ?? null,
        email: null,
      })
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 })
}