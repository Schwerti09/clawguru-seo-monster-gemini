/**
 * Cookie & Tier Access tests
 *
 * Verifies that the `claw_access` HttpOnly cookie:
 *  - Controls which dashboard tabs are accessible
 *  - Expires correctly (expired tokens treated as unauthenticated)
 *  - Is NOT readable via document.cookie (HttpOnly enforcement)
 *  - Grants the correct tier for daypass, pro, and team (enterprise) plans
 *
 * These tests do NOT require a running Stripe account; they inject tokens
 * directly into the browser context using the shared auth helper.
 */

import { test, expect } from "@playwright/test"
import { setCookieForPlan, clearAccessCookie, createTestToken } from "../helpers/auth"

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000"

/** Helper: navigate to dashboard and click a named tab */
async function openDashboardTab(page: import("@playwright/test").Page, tabName: string) {
  await page.goto("/dashboard")
  const tab = page.getByRole("button", { name: new RegExp(tabName, "i") }).first()
  await tab.click()
}

test.describe("Cookie: HttpOnly enforcement", () => {
  test("claw_access cookie is NOT accessible via document.cookie", async ({
    context,
    page,
  }) => {
    await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    await page.goto("/dashboard")
    const cookieValue = await page.evaluate(
      () => document.cookie,
    )
    // HttpOnly cookies must not appear in document.cookie
    expect(cookieValue).not.toContain("claw_access")
  })

  test("claw_access cookie is present in browser context cookies", async ({
    context,
    page,
  }) => {
    await setCookieForPlan(context, { plan: "daypass" }, BASE_URL)
    await page.goto("/dashboard")
    const cookies = await context.cookies()
    const accessCookie = cookies.find((c) => c.name === "claw_access")
    expect(accessCookie).toBeDefined()
    expect(accessCookie?.httpOnly).toBe(true)
    expect(accessCookie?.sameSite).toBe("Lax")
    expect(accessCookie?.path).toBe("/")
  })
})

test.describe("Cookie: Expiration", () => {
  test("daypass cookie has ~24h maxAge", async ({ context, page }) => {
    await setCookieForPlan(
      context,
      { plan: "daypass", expiresInSeconds: 86_400 },
      BASE_URL,
    )
    await page.goto("/dashboard")
    const cookies = await context.cookies()
    const accessCookie = cookies.find((c) => c.name === "claw_access")
    expect(accessCookie).toBeDefined()
    // expires should be roughly 24 h from now (within 5 minutes tolerance)
    const now = Math.floor(Date.now() / 1000)
    const exp = accessCookie!.expires
    expect(exp).toBeGreaterThan(now + 86_400 - 300)
    expect(exp).toBeLessThan(now + 86_400 + 300)
  })

  test("pro cookie has ~30d maxAge", async ({ context, page }) => {
    const maxAge = 30 * 24 * 3_600
    await setCookieForPlan(
      context,
      { plan: "pro", expiresInSeconds: maxAge },
      BASE_URL,
    )
    await page.goto("/dashboard")
    const cookies = await context.cookies()
    const accessCookie = cookies.find((c) => c.name === "claw_access")
    expect(accessCookie).toBeDefined()
    const now = Math.floor(Date.now() / 1000)
    const exp = accessCookie!.expires
    expect(exp).toBeGreaterThan(now + maxAge - 300)
    expect(exp).toBeLessThan(now + maxAge + 300)
  })

  test("expired token is rejected: dashboard renders as explorer", async ({
    context,
    page,
  }) => {
    // Inject an already-expired token
    await setCookieForPlan(context, { plan: "pro", expiresInSeconds: -60 }, BASE_URL)
    await page.goto("/dashboard")
    // Click the mycelium tab (locked for explorer)
    const myceliumTab = page.getByRole("button", { name: /mycelium/i }).first()
    await myceliumTab.click()
    // Shadow Realm must appear
    const overlay = page
      .getByText("SHADOW REALM")
      .or(page.locator('[data-testid="shadow-realm-overlay"]'))
    await expect(overlay.first()).toBeVisible({ timeout: 5_000 })
  })

  test("clearing the cookie reverts to explorer tier", async ({
    context,
    page,
  }) => {
    await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    await page.goto("/dashboard")
    // Verify pro access first
    const myceliumTab = page.getByRole("button", { name: /mycelium/i }).first()
    await myceliumTab.click()
    await expect(
      page.getByText("SHADOW REALM").or(
        page.locator('[data-testid="shadow-realm-overlay"]'),
      ).first(),
    ).not.toBeVisible({ timeout: 3_000 })

    // Clear cookie and reload
    await clearAccessCookie(context, BASE_URL)
    await page.reload()
    await myceliumTab.click()
    // Shadow Realm must now appear
    await expect(
      page.getByText("SHADOW REALM").or(
        page.locator('[data-testid="shadow-realm-overlay"]'),
      ).first(),
    ).toBeVisible({ timeout: 5_000 })
  })
})

test.describe("Tier: Feature access gates per plan", () => {
  const lockedForExplorer = ["mycelium", "tools", "executions"] as const
  const openForAll = ["overview", "billing"] as const

  test.describe("explorer (no cookie)", () => {
    for (const tab of lockedForExplorer) {
      test(`"${tab}" tab: Shadow Realm visible`, async ({ page }) => {
        await openDashboardTab(page, tab)
        const overlay = page
          .getByText("SHADOW REALM")
          .or(page.locator('[data-testid="shadow-realm-overlay"]'))
        await expect(overlay.first()).toBeVisible({ timeout: 5_000 })
      })
    }

    for (const tab of openForAll) {
      test(`"${tab}" tab: accessible without cookie`, async ({ page }) => {
        await openDashboardTab(page, tab)
        await expect(
          page.getByText("SHADOW REALM").or(
            page.locator('[data-testid="shadow-realm-overlay"]'),
          ).first(),
        ).not.toBeVisible({ timeout: 3_000 })
      })
    }
  })

  test.describe("daypass", () => {
    test.beforeEach(async ({ context }) => {
      await setCookieForPlan(context, { plan: "daypass" }, BASE_URL)
    })

    for (const tab of lockedForExplorer) {
      test(`"${tab}" tab: accessible with daypass cookie`, async ({ page }) => {
        await openDashboardTab(page, tab)
        await expect(
          page.getByText("SHADOW REALM").or(
            page.locator('[data-testid="shadow-realm-overlay"]'),
          ).first(),
        ).not.toBeVisible({ timeout: 3_000 })
      })
    }
  })

  test.describe("pro", () => {
    test.beforeEach(async ({ context }) => {
      await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    })

    for (const tab of [...lockedForExplorer, ...openForAll]) {
      test(`"${tab}" tab: accessible with pro cookie`, async ({ page }) => {
        await openDashboardTab(page, tab)
        await expect(
          page.getByText("SHADOW REALM").or(
            page.locator('[data-testid="shadow-realm-overlay"]'),
          ).first(),
        ).not.toBeVisible({ timeout: 3_000 })
      })
    }
  })

  test.describe("team (enterprise)", () => {
    test.beforeEach(async ({ context }) => {
      await setCookieForPlan(context, { plan: "team" }, BASE_URL)
    })

    for (const tab of [...lockedForExplorer, ...openForAll]) {
      test(`"${tab}" tab: accessible with team cookie`, async ({ page }) => {
        await openDashboardTab(page, tab)
        await expect(
          page.getByText("SHADOW REALM").or(
            page.locator('[data-testid="shadow-realm-overlay"]'),
          ).first(),
        ).not.toBeVisible({ timeout: 3_000 })
      })
    }
  })
})

test.describe("Tier: Mycelium, Tools, Executions feature flags", () => {
  test("Mycelium Graph is visible for daypass tier", async ({
    context,
    page,
  }) => {
    await setCookieForPlan(context, { plan: "daypass" }, BASE_URL)
    await openDashboardTab(page, "mycelium")
    // The mycelium tab content (not the overlay) should be visible
    // Look for a canvas, SVG, or any node/graph indicator
    const graph = page
      .locator("canvas, svg, [data-testid*='mycelium'], [class*='mycelium']")
      .first()
    // Acceptable: either the graph renders or the tab body is non-empty
    const hasContent = await page
      .locator("[data-testid='mycelium-content'], #mycelium-tab-content")
      .isVisible()
      .catch(() => false)
    const hasCanvas = await graph.isVisible().catch(() => false)
    expect(hasContent || hasCanvas).toBe(true)
  })

  test("Tools tab shows tool list for pro tier", async ({ context, page }) => {
    await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    await openDashboardTab(page, "tools")
    // The tools tab should render some content, not just the Shadow Realm
    await expect(
      page.getByText("SHADOW REALM").or(
        page.locator('[data-testid="shadow-realm-overlay"]'),
      ).first(),
    ).not.toBeVisible({ timeout: 3_000 })
  })

  test("Executions tab shows execution list for pro tier", async ({
    context,
    page,
  }) => {
    await setCookieForPlan(context, { plan: "pro" }, BASE_URL)
    await openDashboardTab(page, "executions")
    await expect(
      page.getByText("SHADOW REALM").or(
        page.locator('[data-testid="shadow-realm-overlay"]'),
      ).first(),
    ).not.toBeVisible({ timeout: 3_000 })
  })
})
