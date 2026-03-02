import { base64UrlDecode, base64UrlEncode, decodeUtf8, hmacSha256, timingSafeEqual } from "@/lib/edge-crypto"

type AdminSession = {
  v: 1
  u: string
  iat: number
  exp: number
}

async function sign(data: string, secret: string) {
  const sig = await hmacSha256(secret, data)
  return base64UrlEncode(sig)
}

export async function issueAdminToken(username: string, ttlSeconds = 60 * 60 * 8) {
  const secret = process.env.ADMIN_SESSION_SECRET || ""
  if (!secret) throw new Error("ADMIN_SESSION_SECRET missing")

  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSession = { v: 1, u: username, iat: now, exp: now + ttlSeconds }
  const body = base64UrlEncode(JSON.stringify(payload))
  const sig = await sign(body, secret)
  return `${body}.${sig}`
}

export async function verifyAdminToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || ""
  if (!secret) return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = await sign(body, secret)

  // timing-safe compare
  const a = base64UrlDecode(sig)
  const b = base64UrlDecode(expected)
  if (!timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(decodeUtf8(base64UrlDecode(body))) as AdminSession
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
