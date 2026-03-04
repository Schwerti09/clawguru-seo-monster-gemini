/**
 * Minimal Magic Link Auth
 * Signed JWTs using Node.js built-in crypto (HMAC-SHA256).
 * Pattern mirrors lib/access-token.ts – no extra dependencies needed.
 *
 * Required env var: MAGIC_LINK_SECRET (falls back to ACCESS_TOKEN_SECRET / NEXTAUTH_SECRET)
 */

import crypto from "crypto"

export type MagicLinkPayload = {
  email: string
  iat: number
  exp: number
}

export type UserSession = {
  email: string
  iat: number
  exp: number
}

export const USER_SESSION_COOKIE = "cg_user"

// ── Helpers ─────────────────────────────────────────────────────────────────

function b64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf-8")
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function b64urlToBuf(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4))
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64")
}

function getSecret(): string {
  const s =
    process.env.MAGIC_LINK_SECRET ||
    process.env.ACCESS_TOKEN_SECRET ||
    process.env.NEXTAUTH_SECRET
  if (!s) throw new Error("Missing MAGIC_LINK_SECRET")
  if (!process.env.MAGIC_LINK_SECRET) {
    console.warn(
      "[auth] MAGIC_LINK_SECRET not set – falling back to alternate secret. " +
        "Set MAGIC_LINK_SECRET explicitly in production."
    )
  }
  return s
}

function signToken(payload: object): string {
  const body = b64url(JSON.stringify(payload))
  const sig = crypto.createHmac("sha256", getSecret()).update(body).digest()
  return `${body}.${b64url(sig)}`
}

function verifyToken<T extends object>(token: string): T | null {
  try {
    const [body, sig] = token.split(".")
    if (!body || !sig) return null
    const expected = crypto.createHmac("sha256", getSecret()).update(body).digest()
    const got = b64urlToBuf(sig)
    if (got.length !== expected.length) return null
    if (!crypto.timingSafeEqual(got, expected)) return null
    return JSON.parse(b64urlToBuf(body).toString("utf-8")) as T
  } catch {
    return null
  }
}

// ── Magic Link Token (short-lived, 45 min) ───────────────────────────────────

export function signMagicToken(email: string): string {
  const now = Math.floor(Date.now() / 1000)
  return signToken({ email, iat: now, exp: now + 60 * 45 } satisfies MagicLinkPayload)
}

export function verifyMagicToken(token: string): MagicLinkPayload | null {
  const payload = verifyToken<MagicLinkPayload>(token)
  if (!payload?.email || !payload.exp) return null
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp <= now) return null
  return payload
}

/** Returns true if the token has a valid signature but is expired.
 *  Returns false for tokens with an invalid signature or missing fields. */
export function isExpiredMagicToken(token: string): boolean {
  const payload = verifyToken<MagicLinkPayload>(token)
  if (!payload?.email || !payload.exp) return false
  const now = Math.floor(Date.now() / 1000)
  return payload.exp <= now
}

// ── Session Token (long-lived, 30 days) ─────────────────────────────────────

export function signSessionToken(email: string): string {
  const now = Math.floor(Date.now() / 1000)
  return signToken({ email, iat: now, exp: now + 60 * 60 * 24 * 30 } satisfies UserSession)
}

export function verifySessionToken(token: string): UserSession | null {
  const payload = verifyToken<UserSession>(token)
  if (!payload?.email || !payload.exp) return null
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp <= now) return null
  return payload
}
