import crypto from "crypto"

export const USER_SESSION_COOKIE = "claw_session"

type SessionPayload = {
  v: 1
  email: string
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

function getSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET
  // Derive a session-specific secret from ACCESS_TOKEN_SECRET to maintain
  // separation of concerns: the derived secret is different from the source key.
  if (process.env.ACCESS_TOKEN_SECRET) {
    return crypto
      .createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
      .update("claw_session_secret_v1")
      .digest("hex")
  }
  throw new Error(
    "SESSION_SECRET, ADMIN_SESSION_SECRET, or ACCESS_TOKEN_SECRET environment variable is not set"
  )
}

function sign(data: string, secret: string) {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest())
}

export function signSessionToken(username: string, ttlSeconds = 60 * 60 * 24 * 30): string {
  const secret = getSecret()
  const now = Math.floor(Date.now() / 1000)
  const payload: SessionPayload = { v: 1, email: username, iat: now, exp: now + ttlSeconds }
  const body = b64url(JSON.stringify(payload))
  const sig = sign(body, secret)
  return `${body}.${sig}`
}

export function verifySessionToken(token: string): { email: string } | null {
  const secret = getSecret()
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = sign(body, secret)

  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  if (!crypto.timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(b64urlDecode(body).toString("utf-8")) as SessionPayload
    const now = Math.floor(Date.now() / 1000)
    if (payload.v !== 1) return null
    if (!payload.email) return null
    if (payload.exp <= now) return null
    return { email: payload.email }
  } catch {
    return null
  }
}

export const isAdmin = () => false;
export default { isAdmin, signSessionToken, verifySessionToken, USER_SESSION_COOKIE };
