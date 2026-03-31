/**
 * Smoke tests: Dashboard loads correctly for each tier and the
 * Shadow Realm overlay appears / disappears as expected.
 *
 * Strategy: inject a signed claw_access cookie (via test helper) and
 * visit /dashboard.  No real Stripe calls are made.
 */

import { test, expect } from "@playwright/test"
import { setCookieForPlan, clearAccessCookie } from "../helpers/auth"

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000"

// Tabs that are locked for the explorer (free) tier
const LOCKED_TABS = ["mycelium", "tools", "executions"]
// Tabs accessible to every tier
const OPEN_TABS = ["overview", "billing"]

test.describe("Dashboard – Shadow Realm Overlay", () => {
  // ── Explorer (unauthenticated) ──────────────────────────────────────────

  test.describe("Explorer tier (no cookie)", () => {
    test("dashboard loads without auth", async ({ page }) => {
      await page.goto("/dashboard")
      await expect(page).toHaveURL(/dashboard/)
      // The page title should indicate ClawGuru dashboard
      await expect(page).toHaveTitle(/Dashboard.*ClawGuru|ClawGuru.*Dashboard/i)
    })

    test("overview tab is visible without auth", async ({ page }) => {
      await page.goto("/dashboard")
      // overview tab should be accessible
      const overviewTab = page.getByRole("button", { name: /overview/i }).first()
      await expect(overviewTab).toBeVisible()
    })

    for (const tab of LOCKED_TABS) {
      test(`Shadow Realm overlay is shown on locked "${tab}" tab`, async ({
        page,
      }) => {
        await page.goto("/dashboard")
        // Click the locked tab
        const tabBtn = page
          .getByRole("button", { name: new RegExp(tab, "i") })
          .first()
        await tabBtn.click()
        // The Shadow Realm overlay should be visible
        const overlay = page
          .getByText("SHADOW REALM")
          .or(page.locator('[class*="shadow-realm"]'))
          .or(page.locator('[data-testid="shadow-realm-overlay"]'))
        await expect(overlay.first()).toBeVisible({ timeout: 5_000 })
      })
    }
  })

  // ── Day Pass tier ───────────────────────────────────────────────────────

  test.describe("Day Pass tier", () => {
    test.beforeEach(async ({ context }) => {
      await setCookieForPlan(context, { plan: "daypass" }, BASE_URL)
    })

    test("dashboard loads with daypass cookie", async ({ page }) => {
      await page.goto("/dashboard")
      await expect(page).toHaveURL(/dashboard/)
    })

    for (const tab of LOCKED_TABS) {
      test(`Shadow Realm is NOT shown on "${tab}" tab for daypass`, async ({
        page,
      }) => {
        await page.goto("/dashboard")
        const tabBtn = page
          .getByRole("button", { name: new RegExp(tab, "i") })
          .first()
        await tabBtn.click()
        // Shadow Realm overlay must NOT be visible
        const overlay = page
          .getByText("SHADOW REALM")
          .or(page.locator('[data-testid="shadow-realm-overlay"]'))
        await expect(overlay.first()).not.toBeVisible({ timeout: 3_000 })
      })
    }

    test("daypass tier indicator is shown", async ({ page }) => {
      await page.goto("/dashboard")
      // The dashboard shows the current plan; "Day Pass" or "daypass" should appear
      await expect(
        page
          .getByText(/day.?pass/i)
          .or(page.getByText(/24h/i))
          .first(),
      ).toBeVisible()
    })
  })

  // ── Pro tier ────────────────────────────────────────────────────────────

  test.describe("Pro tier", () => {
    test.beforeEach(async ({ context }) => {
      await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    })

    test("dashboard loads with pro cookie", async ({ page }) => {
      await page.goto("/dashboard")
      await expect(page).toHaveURL(/dashboard/)
    })

    for (const tab of [...LOCKED_TABS, ...OPEN_TABS]) {
      test(`tab "${tab}" is accessible for pro tier`, async ({ page }) => {
        await page.goto("/dashboard")
        const tabBtn = page
          .getByRole("button", { name: new RegExp(tab, "i") })
          .first()
        await tabBtn.click()
        // No shadow realm for pro
        const overlay = page
          .getByText("SHADOW REALM")
          .or(page.locator('[data-testid="shadow-realm-overlay"]'))
        await expect(overlay.first()).not.toBeVisible({ timeout: 3_000 })
      })
    }
  })

  // ── Shadow Realm upgrade button ─────────────────────────────────────────

  test("upgrade button inside Shadow Realm is clickable", async ({ page }) => {
    await page.goto("/dashboard")
    // Click a locked tab (e.g. mycelium)
    const myceliumTab = page
      .getByRole("button", { name: /mycelium/i })
      .first()
    await myceliumTab.click()
    // The overlay should show an upgrade button
    const upgradeBtn = page
      .getByRole("button", { name: /freischalten|upgrade|control/i })
      .first()
    await expect(upgradeBtn).toBeVisible({ timeout: 5_000 })
    await upgradeBtn.click()
    // After clicking, an upgrade modal or redirect to /pricing should follow
    // Accept either outcome: modal visible OR navigated to /pricing
    const isModal = await page
      .locator('[role="dialog"], [data-testid="upgrade-modal"]')
      .isVisible()
      .catch(() => false)
    const isPricingPage = page.url().includes("/pricing")
    expect(isModal || isPricingPage).toBe(true)
  })

  // ── Session expiry ──────────────────────────────────────────────────────

  test("expired cookie shows explorer (Shadow Realm) view", async ({
    context,
    page,
  }) => {
    // Set a token that is already expired (negative expiresInSeconds)
    await setCookieForPlan(context, { plan: "pro", expiresInSeconds: -1 }, BASE_URL)
    await page.goto("/dashboard")
    // The server will reject the token → explorer tier → Shadow Realm visible
    const myceliumTab = page
      .getByRole("button", { name: /mycelium/i })
      .first()
    await myceliumTab.click()
    const overlay = page
      .getByText("SHADOW REALM")
      .or(page.locator('[data-testid="shadow-realm-overlay"]'))
    await expect(overlay.first()).toBeVisible({ timeout: 5_000 })
  })
})
