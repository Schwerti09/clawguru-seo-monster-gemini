import crypto from "crypto"

type AdminSession = {
  v: 1
  u: string
  iat: number
  exp: number
}

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function b64urlDecode(input: string) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4))
  const s = input.replace(/-/g, "+").replace(/_/g, "/") + pad
  return Buffer.from(s, "base64")
}

function sign(data: string, secret: string) {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest())
}

function getAdminSessionSecret(): string {
  const direct =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.ACCESS_TOKEN_SECRET ||
    ""
  if (direct) return direct
  const u = process.env.ADMIN_USER_NAME || process.env.ADMIN_USERNAME || ""
  const p = process.env.ADMIN_PASSWORT || process.env.ADMIN_PASSWORD || ""
  const seed = `${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"}|${u}|${p}`
  return crypto.createHash("sha256").update(seed).digest("hex")
}

export function issueAdminToken(username: string, ttlSeconds = 60 * 60 * 8) {
  const secret = getAdminSessionSecret()

  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSession = { v: 1, u: username, iat: now, exp: now + ttlSeconds }
  const body = b64url(JSON.stringify(payload))
  const sig = sign(body, secret)
  return `${body}.${sig}`
}

export function verifyAdminToken(token: string) {
  const secret = getAdminSessionSecret()
  if (!secret) return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = sign(body, secret)

  // timing-safe compare
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  if (!crypto.timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(b64urlDecode(body).toString("utf-8")) as AdminSession
    const now = Math.floor(Date.now() / 1000)
    if (payload.v !== 1) return null
    if (!payload.u) return null
    if (payload.exp <= now) return null
    return payload
  } catch {
    return null
  }
}

export function adminCookieName() {
  return "claw_admin"
}
