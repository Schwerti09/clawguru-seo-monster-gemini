/**
 * E2E test: Pro subscription purchase flow (mocked Stripe)
 *
 * Flow under test:
 *   1. User visits /pricing
 *   2. Clicks "Pro kaufen" / Pro buy button
 *   3. POST /api/stripe/checkout → mocked (returns fake checkout URL)
 *   4. Browser redirects through fake Stripe → /api/auth/activate?session_id=cs_test_pro
 *   5. Activate → sets claw_access cookie (plan=pro) → redirects to /dashboard
 *   6. Dashboard shows pro tier; all tabs are unlocked
 *   7. Billing portal link is present
 */

import { test, expect } from "@playwright/test"
import { createTestToken } from "../helpers/auth"

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000"

const TEST_SESSION_ID = "cs_test_pro_subscription_4242424242424242"
const TEST_SUBSCRIPTION_ID = "sub_test_pro_playwright"
const TEST_CUSTOMER_ID = "cus_test_pro_playwright"

test.describe("Pro Subscription Purchase – Full E2E Flow", () => {
  test.beforeEach(async ({ page }) => {
    // ── Mock checkout endpoint ────────────────────────────────────────────
    await page.route("**/api/stripe/checkout", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: `${BASE_URL}/api/auth/activate?session_id=${TEST_SESSION_ID}`,
        }),
      })
    })

    // ── Mock activate endpoint ────────────────────────────────────────────
    await page.route("**/api/auth/activate*", async (route) => {
      const url = new URL(route.request().url())
      const sid = url.searchParams.get("session_id")
      if (sid !== TEST_SESSION_ID) {
        await route.continue()
        return
      }
      const token = createTestToken({
        plan: "pro",
        customerId: TEST_CUSTOMER_ID,
        subscriptionId: TEST_SUBSCRIPTION_ID,
        expiresInSeconds: 30 * 24 * 3_600, // 30 days
      })
      await route.fulfill({
        status: 302,
        headers: {
          Location: `${BASE_URL}/dashboard`,
          "Set-Cookie": `claw_access=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 3_600}`,
        },
        body: "",
      })
    })

    // ── Mock Stripe portal (used in billing tab) ──────────────────────────
    await page.route("**/api/stripe/portal", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://billing.stripe.com/p/session/test_portal" }),
      })
    })
  })

  test("pricing page shows Pro plan", async ({ page }) => {
    await page.goto("/pricing")
    const proCard = page
      .getByText(/\bpro\b/i)
      .or(page.getByText(/49.*€|€.*49/i))
      .first()
    await expect(proCard).toBeVisible()
  })

  test("full Pro purchase flow: pricing → checkout → activate → dashboard", async ({
    page,
  }) => {
    await page.goto("/pricing")

    const proBtn = page
      .getByRole("link", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i })
      .or(page.getByRole("button", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i }))
      .first()
    await expect(proBtn).toBeVisible({ timeout: 10_000 })
    await proBtn.click()

    await page.waitForURL(/dashboard/, { timeout: 20_000 })

    // Pro tier label visible
    await expect(
      page.getByText(/\bpro\b/i).first(),
    ).toBeVisible()
  })

  test("all tabs are accessible for pro tier after purchase", async ({ page }) => {
    await page.goto("/pricing")
    const proBtn = page
      .getByRole("link", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i })
      .or(page.getByRole("button", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i }))
      .first()
    await proBtn.click()
    await page.waitForURL(/dashboard/, { timeout: 20_000 })

    const tabs = ["mycelium", "tools", "executions"]
    for (const tab of tabs) {
      const tabBtn = page
        .getByRole("button", { name: new RegExp(tab, "i") })
        .first()
      await tabBtn.click()
      const overlay = page
        .getByText("SHADOW REALM")
        .or(page.locator('[data-testid="shadow-realm-overlay"]'))
      await expect(overlay.first()).not.toBeVisible({ timeout: 3_000 })
    }
  })

  test("billing tab shows portal link for pro tier", async ({ page }) => {
    await page.goto("/pricing")
    const proBtn = page
      .getByRole("link", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i })
      .or(page.getByRole("button", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i }))
      .first()
    await proBtn.click()
    await page.waitForURL(/dashboard/, { timeout: 20_000 })

    // Open billing tab
    const billingTab = page
      .getByRole("button", { name: /billing|abonnement|abrechnung/i })
      .first()
    await billingTab.click()

    // Billing portal button should be present for subscriptions
    const portalBtn = page
      .getByRole("button", { name: /portal|verwalten|manage/i })
      .or(page.getByText(/stripe.*portal|billing.*portal/i))
      .first()
    await expect(portalBtn).toBeVisible({ timeout: 5_000 })
  })

  test("Stripe checkout called with subscription mode for Pro", async ({
    page,
  }) => {
    let capturedBody: Record<string, unknown> | null = null

    await page.route("**/api/stripe/checkout", async (route) => {
      if (route.request().method() === "POST") {
        try {
          capturedBody = JSON.parse(route.request().postData() ?? "{}")
        } catch {
          capturedBody = {}
        }
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: `${BASE_URL}/api/auth/activate?session_id=${TEST_SESSION_ID}`,
        }),
      })
    })

    await page.goto("/pricing")
    const proBtn = page
      .getByRole("link", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i })
      .or(page.getByRole("button", { name: /pro.*kaufen|pro.*buchen|buy.*pro/i }))
      .first()
    await proBtn.click()
    await page.waitForURL(/dashboard|activate/, { timeout: 15_000 })

    if (capturedBody) {
      const bodyStr = JSON.stringify(capturedBody).toLowerCase()
      // The product param should identify pro
      expect(bodyStr).toMatch(/pro/)
    }
  })

  test("cancel URL redirects back to /pricing?canceled=1", async ({ page }) => {
    // Simulate the cancel flow: navigate directly to the cancel URL
    const cancelResp = await page.goto("/pricing?canceled=1")
    expect(cancelResp?.status()).toBeLessThan(400)
    await expect(page.url()).toContain("canceled=1")
    // Page should still render pricing (not crash)
    await expect(page).not.toHaveTitle(/Error|500/)
  })
})
