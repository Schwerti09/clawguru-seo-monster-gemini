import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken, USER_SESSION_COOKIE } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET() {
  const jar = await cookies()
  const token = jar.get(USER_SESSION_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  const session = verifySessionToken(token)
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, email: session.email })
}
