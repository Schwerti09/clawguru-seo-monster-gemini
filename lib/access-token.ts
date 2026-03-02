import { base64UrlDecode, base64UrlEncode, decodeUtf8, hmacSha256, timingSafeEqual } from "@/lib/edge-crypto"

export type AccessPlan = "daypass" | "pro" | "team"

export type AccessTokenPayload = {
  v: 1
  plan: AccessPlan
  customerId: string
  // For subscriptions
  subscriptionId?: string
  // Unix seconds
  exp: number
  iat: number
}

export async function signAccessToken(payload: AccessTokenPayload) {
  // IMPORTANT: Never fall back to unrelated secrets (e.g. STRIPE_SECRET_KEY).
  // This token is used for user access. Treat it like a JWT secret.
  const secret = process.env.ACCESS_TOKEN_SECRET || process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error("Missing ACCESS_TOKEN_SECRET (or NEXTAUTH_SECRET)")
  const body = base64UrlEncode(JSON.stringify(payload))
  const sig = await hmacSha256(secret, body)
  return `${body}.${base64UrlEncode(sig)}`
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || process.env.NEXTAUTH_SECRET
    if (!secret) return null
    const [body, sig] = token.split(".")
    if (!body || !sig) return null
    const expected = await hmacSha256(secret, body)
    const got = base64UrlDecode(sig)
    if (!timingSafeEqual(got, expected)) return null
    const payload = JSON.parse(decodeUtf8(base64UrlDecode(body))) as AccessTokenPayload
    if (!payload?.exp || !payload?.plan || !payload?.customerId) return null
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp <= now) return null
    return payload
  } catch {
    return null
  }
}
