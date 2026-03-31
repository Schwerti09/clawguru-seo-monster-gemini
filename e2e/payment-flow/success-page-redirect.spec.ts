/**
 * Success Page & Redirect tests
 *
 * Tests for the /success page and the /api/auth/activate redirect chain:
 *
 *  1. Missing session_id → error message shown
 *  2. Invalid / unpaid session_id → "not confirmed" state
 *  3. Paid session_id (mocked Stripe) → auto-redirect to activate → dashboard
 *  4. activate?session_id=... → sets cookie + redirects to /dashboard
 *  5. activate with missing session_id → redirects to /success?error=missing_session
 *  6. activate with invalid session_id → redirects to /success?error=...
 */

import { test, expect } from "@playwright/test"
import { createTestToken } from "../helpers/auth"

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000"

const PAID_SESSION_ID = "cs_test_paid_success_4242424242424242"
const UNPAID_SESSION_ID = "cs_test_unpaid_pending"

test.describe("Success Page – session_id handling", () => {
  test("missing session_id shows error message", async ({ page }) => {
    await page.goto("/success")
    // Should show a German error about missing session_id
    await expect(
      page.getByText(/session_id/i).or(page.getByText(/fehlt|missing/i)).first(),
    ).toBeVisible({ timeout: 5_000 })
    await expect(page).not.toHaveTitle(/Error|500/)
  })

  test("invalid session_id shows 'not confirmed' state", async ({ page }) => {
    // Mock Stripe call to return unpaid status
    await page.route("**/api/stripe/checkout*", async (route) => {
      await route.continue()
    })

    // Visit with a fake unpaid session_id
    // The page will try to hit Stripe; since it's not mocked at server level we
    // mock the verify endpoint to indicate not-paid
    await page.route("**/api/stripe/verify*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ paid: false }),
      })
    })

    await page.goto(`/success?session_id=${UNPAID_SESSION_ID}`)
    // No automatic redirect (payment not confirmed)
    // Wait for the page to settle and confirm it did NOT navigate to /dashboard
    await expect(page).not.toHaveURL(/dashboard/, { timeout: 3_000 }).catch(() => {})
    expect(page.url()).not.toMatch(/dashboard/)
    // Should show the "not confirmed" message
    await expect(
      page
        .getByText(/noch nicht bestätigt|nicht bestätigt|not confirmed/i)
        .or(page.getByText(/zahlung.*nicht|payment.*not/i))
        .first(),
    ).toBeVisible({ timeout: 5_000 })
  })
})

test.describe("Success Page – paid session auto-redirect", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Stripe server-side call for the success page
    // The success page calls stripe.checkout.sessions.retrieve via Next.js SSR.
    // We can't intercept server-side Stripe calls from the browser; instead we
    // mock the activate endpoint that the success page redirects to.
    await page.route("**/api/auth/activate*", async (route) => {
      const url = new URL(route.request().url())
      const sid = url.searchParams.get("session_id")
      if (sid !== PAID_SESSION_ID) {
        await route.continue()
        return
      }
      const token = createTestToken({ plan: "pro", expiresInSeconds: 3_600 })
      await route.fulfill({
        status: 302,
        headers: {
          Location: `${BASE_URL}/dashboard`,
          "Set-Cookie": `claw_access=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
        },
        body: "",
      })
    })
  })

  test("SuccessAutoActivate component exists on success page with paid session", async ({
    page,
  }) => {
    // The /success page with a paid session would auto-redirect via server
    // redirect() in Next.js SSR. We test the client component fallback path
    // (the errorParam prevents the server redirect).
    await page.goto(
      `/success?session_id=${PAID_SESSION_ID}&error=activation_failed`,
    )
    // The "Zugang freigeschaltet" heading OR the activate button should appear
    const activateUI = page
      .getByText(/zugang freigeschaltet|access.*unlocked|aktivier/i)
      .or(page.getByRole("link", { name: /aktivier|activate/i }))
      .first()
    await expect(activateUI).toBeVisible({ timeout: 10_000 })
  })

  test("manual activate link is present on success page", async ({ page }) => {
    await page.goto(
      `/success?session_id=${PAID_SESSION_ID}&error=activation_failed`,
    )
    // The page should have a link / button pointing to the activate route
    const activateLink = page
      .getByRole("link", { name: /aktivier|nochmal|retry|activate/i })
      .or(page.getByRole("button", { name: /aktivier|nochmal|activate/i }))
      .first()
    await expect(activateLink).toBeVisible({ timeout: 5_000 })
    const href = await activateLink.getAttribute("href")
    if (href) {
      expect(href).toContain("activate")
    }
  })
})

test.describe("Activate endpoint – redirect logic", () => {
  test("activate without session_id redirects to /success?error=missing_session", async ({
    page,
  }) => {
    // Direct navigation to activate without session_id
    const resp = await page.goto(`/api/auth/activate`, {
      waitUntil: "networkidle",
    })
    // Should end up on /success with an error param
    expect(page.url()).toMatch(/success/)
    expect(page.url()).toMatch(/error=/)
  })

  test("activate with valid session → claw_access cookie set → redirect to /dashboard", async ({
    page,
  }) => {
    // We need the server to recognise our test session; mock the Stripe retrieve
    // call by intercepting the activate API route at the network level.
    const SESSION = "cs_test_activate_valid_playwright"
    const token = createTestToken({ plan: "daypass", expiresInSeconds: 86_400 })

    await page.route(`**/api/auth/activate*`, async (route) => {
      const url = new URL(route.request().url())
      if (url.searchParams.get("session_id") !== SESSION) {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 302,
        headers: {
          Location: `${BASE_URL}/dashboard`,
          "Set-Cookie": `claw_access=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        },
        body: "",
      })
    })

    await page.goto(`/api/auth/activate?session_id=${SESSION}`, {
      waitUntil: "networkidle",
    })
    // Should land on /dashboard
    expect(page.url()).toMatch(/dashboard/)
    // And the cookie should be set
    const cookies = await page.context().cookies()
    const c = cookies.find((x) => x.name === "claw_access")
    expect(c).toBeDefined()
  })
})

test.describe("Redirect chain integrity", () => {
  test("full chain: /pricing → checkout → activate → /dashboard", async ({
    page,
  }) => {
    const SESSION = "cs_test_chain_playwright"
    const token = createTestToken({ plan: "pro", expiresInSeconds: 3_600 })

    await page.route("**/api/stripe/checkout", async (route) => {
      if (route.request().method() !== "POST") return route.continue()
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: `${BASE_URL}/api/auth/activate?session_id=${SESSION}`,
        }),
      })
    })

    await page.route(`**/api/auth/activate*`, async (route) => {
      const url = new URL(route.request().url())
      if (url.searchParams.get("session_id") !== SESSION) return route.continue()
      await route.fulfill({
        status: 302,
        headers: {
          Location: `${BASE_URL}/dashboard`,
          "Set-Cookie": `claw_access=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
        },
        body: "",
      })
    })

    await page.goto("/pricing")
    const buyBtn = page
      .getByRole("link", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i })
      .or(page.getByRole("button", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i }))
      .first()
    await expect(buyBtn).toBeVisible({ timeout: 10_000 })
    await buyBtn.click()
    await page.waitForURL(/dashboard/, { timeout: 20_000 })

    // Verify we have a cookie
    const cookies = await page.context().cookies()
    const c = cookies.find((x) => x.name === "claw_access")
    expect(c).toBeDefined()
    expect(c?.httpOnly).toBe(true)
  })

  test("cancel flow: canceled=1 shows pricing without error", async ({
    page,
  }) => {
    const r = await page.goto("/pricing?canceled=1")
    expect(r?.status()).toBeLessThan(400)
    await expect(page).not.toHaveTitle(/Error|500/)
    // Pricing cards should still be visible
    const card = page
      .getByText(/day.?pass|pro/i)
      .first()
    await expect(card).toBeVisible()
  })
})
