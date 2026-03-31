/**
 * Shared authentication helpers for Playwright E2E tests.
 *
 * These utilities generate valid `claw_access` cookies using the same
 * HMAC-SHA256 signing logic as `lib/access-token.ts`.  The secret must
 * match the value of ACCESS_TOKEN_SECRET that the running Next.js server
 * uses (see playwright.config.ts webServer.env).
 */

import crypto from "crypto"
import type { BrowserContext } from "@playwright/test"

export type TestPlan = "daypass" | "pro" | "team"

/** Must match the secret injected by playwright.config.ts webServer.env */
const TEST_SECRET =
  process.env.ACCESS_TOKEN_SECRET ?? "playwright-test-secret-32-bytes!!"

// ─── Token helpers (mirror of lib/access-token.ts) ────────────────────────

function b64url(input: Buffer | string): string {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input, "utf-8")
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

export interface TestTokenOptions {
  plan: TestPlan
  /** Seconds from now until the token expires (default: 1 hour) */
  expiresInSeconds?: number
  customerId?: string
  subscriptionId?: string
}

/**
 * Create a signed `claw_access` token value for use in tests.
 */
export function createTestToken({
  plan,
  expiresInSeconds = 3_600,
  customerId = "cus_test_playwright",
  subscriptionId,
}: TestTokenOptions): string {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    v: 1,
    plan,
    customerId,
    ...(plan !== "daypass"
      ? { subscriptionId: subscriptionId ?? "sub_test_playwright" }
      : {}),
    iat: now,
    exp: now + expiresInSeconds,
  }

  const body = b64url(JSON.stringify(payload))
  const sig = crypto.createHmac("sha256", TEST_SECRET).update(body).digest()
  return `${body}.${b64url(sig)}`
}

/**
 * Inject a `claw_access` cookie into the given browser context so that the
 * Next.js app treats the session as authenticated with the specified tier.
 *
 * Usage:
 *   const context = await browser.newContext()
 *   await setCookieForPlan(context, { plan: 'pro' })
 *   const page = await context.newPage()
 */
export async function setCookieForPlan(
  context: BrowserContext,
  options: TestTokenOptions,
  baseURL = "http://localhost:3000",
): Promise<void> {
  const token = createTestToken(options)
  await context.addCookies([
    {
      name: "claw_access",
      value: token,
      domain: new URL(baseURL).hostname,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      expires:
        Math.floor(Date.now() / 1000) + (options.expiresInSeconds ?? 3_600),
    },
  ])
}

/**
 * Remove `claw_access` cookie from the given browser context (simulate logout).
 */
export async function clearAccessCookie(
  context: BrowserContext,
  baseURL = "http://localhost:3000",
): Promise<void> {
  await context.clearCookies({ name: "claw_access", domain: new URL(baseURL).hostname })
}
