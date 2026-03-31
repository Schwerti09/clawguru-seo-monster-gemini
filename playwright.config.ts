import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright configuration for ClawGuru payment-flow E2E tests.
 *
 * Environment variables used by tests (set in .env.test.local or your shell):
 *   ACCESS_TOKEN_SECRET  – must match the secret used by the running Next.js server
 *   BASE_URL             – override the base URL (default: http://localhost:3000)
 *
 * Run:
 *   npm run test:e2e          – headless, all browsers
 *   npm run test:e2e:ui       – interactive Playwright UI
 *   npm run test:e2e:headed   – headed Chromium
 */
export default defineConfig({
  testDir: "./e2e",
  /* Fail the build on CI if you accidentally left test.only in the source. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Parallel workers */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter */
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "playwright-report", open: "never" }]]
    : [["list"], ["html", { outputFolder: "playwright-report", open: "on-failure" }]],

  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    /* Collect trace on first retry */
    trace: "on-first-retry",
    /* Record video on failure */
    video: "on-first-retry",
    /* Screenshot on failure */
    screenshot: "only-on-failure",
    /* Accept German locale used by the app */
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Start the Next.js dev server before running tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      /* Use a fixed test secret so token helpers can sign matching tokens */
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ?? "playwright-test-secret-32-bytes!!",
      /**
       * Comma-separated Stripe session IDs that the /success page should treat
       * as "paid" without calling the real Stripe API.  Add new IDs here when
       * writing tests that exercise the paid-session flow.
       */
      E2E_PAID_SESSION_IDS: [
        "cs_test_paid_success_4242424242424242",
        "cs_test_activate_valid_playwright",
      ].join(","),
    },
  },

  /* Output folder for test artifacts */
  outputDir: "test-results/",
})
