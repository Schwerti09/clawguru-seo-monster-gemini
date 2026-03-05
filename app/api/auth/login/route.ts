import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { signSessionToken, USER_SESSION_COOKIE } from "@/lib/auth"

export const runtime = "nodejs"

/** Per-IP rate limit: max 5 attempts per 10 minutes */
const RATE_LIMIT_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const loginAttempts = new Map<string, { count: number; firstAt: number }>()

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

function timingSafeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) {
    // Always run comparison to avoid length-based timing leaks
    crypto.timingSafeEqual(aBuf, aBuf)
    return false
  }
  return crypto.timingSafeEqual(aBuf, bBuf)
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const now = Date.now()

    // Rate limiting
    const entry = loginAttempts.get(ip)
    if (entry) {
      if (now - entry.firstAt < RATE_LIMIT_MS) {
        if (entry.count >= MAX_ATTEMPTS) {
          const retryAfterSec = Math.ceil((RATE_LIMIT_MS - (now - entry.firstAt)) / 1000)
          return NextResponse.json(
            { error: `Zu viele Versuche. Bitte in ${retryAfterSec}s erneut versuchen.` },
            { status: 429 }
          )
        }
        entry.count++
      } else {
        // Window expired – reset
        loginAttempts.delete(ip)
      }
    }

    // Prune stale entries
    for (const [key, val] of loginAttempts) {
      if (now - val.firstAt >= RATE_LIMIT_MS) loginAttempts.delete(key)
    }

    const body = await req.json().catch(() => ({}))
    const username = typeof body?.username === "string" ? body.username.trim() : ""
    const password = typeof body?.password === "string" ? body.password : ""

    if (!username || !password) {
      return NextResponse.json({ error: "Benutzername und Passwort erforderlich" }, { status: 400 })
    }

    const expectedUsername =
      process.env.ADMIN_USER_NAME || process.env.ADMIN_USERNAME || ""
    const expectedPassword =
      process.env.ADMIN_PASSWORT || process.env.ADMIN_PASSWORD || ""

    if (!expectedUsername || !expectedPassword) {
      console.error("[login] ADMIN_USERNAME / ADMIN_PASSWORD nicht konfiguriert")
      return NextResponse.json(
        { error: "Login ist derzeit nicht verfügbar." },
        { status: 503 }
      )
    }

    const usernameOk = timingSafeEqual(username, expectedUsername)
    const passwordOk = timingSafeEqual(password, expectedPassword)

    if (!usernameOk || !passwordOk) {
      // Track failed attempt
      const existing = loginAttempts.get(ip)
      if (existing && now - existing.firstAt < RATE_LIMIT_MS) {
        existing.count++
      } else {
        loginAttempts.set(ip, { count: 1, firstAt: now })
      }
      return NextResponse.json(
        { error: "Benutzername oder Passwort falsch." },
        { status: 401 }
      )
    }

    // Success – clear rate limit record for this IP
    loginAttempts.delete(ip)

    const sessionToken = signSessionToken(username)
    const res = NextResponse.json({ ok: true })
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
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[login] Fehler:", message)
    return NextResponse.json({ error: "Login fehlgeschlagen." }, { status: 500 })
  }
}
