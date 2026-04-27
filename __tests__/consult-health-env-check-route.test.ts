// __tests__/consult-health-env-check-route.test.ts
// Verifies that the env-check healthcheck route correctly classifies the
// /consulting workflow ENV configuration without leaking secret values.

import { NextRequest } from "next/server"
import { GET } from "@/app/api/consult-health/env-check/route"

// All ENV vars touched by the route. Every test must reset these so a leaking
// value from the host machine does not pollute the assertion.
const TRACKED_ENV_VARS = [
  "CRON_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_DAYPASS",
  "STRIPE_PRICE_PRO",
  "STRIPE_PRICE_TEAM",
  "STRIPE_PRICE_PRO_ANNUAL",
  "STRIPE_PRICE_TEAM_ANNUAL",
  "STRIPE_PRICE_MSP",
  "STRIPE_PRICE_ENTERPRISE",
  "ACCESS_TOKEN_SECRET",
  "NEXTAUTH_SECRET",
  "SESSION_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "RESEND_DISABLED",
  "SUPPORT_EMAIL",
  "EMAIL_REPLY_TO",
  "EMAIL_FROM",
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "DATABASE_URL_2",
  "CONSULT_HEALTH_WARN_WEBHOOK_URL",
  "CONSULT_HEALTH_SLACK_WEBHOOK_URL",
  "CONSULT_HEALTH_PAGE_WEBHOOK_URL",
  "CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL",
  "CONSULT_HEALTH_ALERT_COOLDOWN_MS",
  "NEXT_PUBLIC_CAL_DEMO_URL",
  "NEXT_PUBLIC_CAL_STRATEGY_URL",
  "NEXT_PUBLIC_CAL_AUDIT_URL",
  "AFFILIATE_CONNECT_ACCOUNTS",
  "AFFILIATE_COMMISSION_RATE",
  "DISABLE_ALL_APIS",
  "DISABLE_AI_FEATURES",
] as const

const SAVED_ENV: Record<string, string | undefined> = {}

function clearTrackedEnv() {
  for (const name of TRACKED_ENV_VARS) {
    delete process.env[name]
  }
}

function setRequiredEnv() {
  process.env.CRON_SECRET = "test-secret-123"
  process.env.STRIPE_SECRET_KEY = "sk_test_123"
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_123"
  process.env.STRIPE_PRICE_DAYPASS = "price_daypass"
  process.env.STRIPE_PRICE_PRO = "price_pro"
  process.env.STRIPE_PRICE_TEAM = "price_team"
  process.env.ACCESS_TOKEN_SECRET = "access-secret-123"
  process.env.RESEND_API_KEY = "re_test_123"
  process.env.NEXT_PUBLIC_SITE_URL = "https://clawguru.org"
  process.env.DATABASE_URL = "postgresql://example"
}

function setRecommendedEnv() {
  process.env.RESEND_FROM = "ClawGuru <noreply@clawguru.org>"
  process.env.SUPPORT_EMAIL = "support@clawguru.org"
  process.env.DATABASE_URL_2 = "postgresql://failover"
  process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/warn"
  process.env.CONSULT_HEALTH_PAGE_WEBHOOK_URL = "https://events.pagerduty.com/page"
  process.env.NEXT_PUBLIC_CAL_DEMO_URL = "https://cal.com/clawguru/demo"
}

beforeAll(() => {
  for (const name of TRACKED_ENV_VARS) {
    SAVED_ENV[name] = process.env[name]
  }
})

afterAll(() => {
  for (const name of TRACKED_ENV_VARS) {
    if (SAVED_ENV[name] === undefined) {
      delete process.env[name]
    } else {
      process.env[name] = SAVED_ENV[name]
    }
  }
})

beforeEach(() => {
  clearTrackedEnv()
})

describe("GET /api/consult-health/env-check", () => {
  describe("authentication", () => {
    it("returns 401 when CRON_SECRET is not configured at all", async () => {
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=anything")
      const res = await GET(req)
      expect(res.status).toBe(401)
    })

    it("returns 401 when secret is missing from the request", async () => {
      process.env.CRON_SECRET = "test-secret-123"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check")
      const res = await GET(req)
      expect(res.status).toBe(401)
    })

    it("returns 401 when secret query param is wrong", async () => {
      process.env.CRON_SECRET = "test-secret-123"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=wrong")
      const res = await GET(req)
      expect(res.status).toBe(401)
    })

    it("accepts the secret via query param", async () => {
      process.env.CRON_SECRET = "test-secret-123"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      expect(res.status).toBe(200)
    })

    it("accepts the secret via Authorization Bearer header", async () => {
      process.env.CRON_SECRET = "test-secret-123"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check", {
        headers: { authorization: "Bearer test-secret-123" },
      })
      const res = await GET(req)
      expect(res.status).toBe(200)
    })
  })

  describe("status classification", () => {
    it("reports broken when only CRON_SECRET is set and other required vars are missing", async () => {
      process.env.CRON_SECRET = "test-secret-123"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.status).toBe("broken")
      expect(body.summary.required.missing.length).toBeGreaterThan(0)
      expect(body.summary.required.missing).toContain("stripe.secret")
      expect(body.summary.required.missing).toContain("auth.accessToken")
      expect(body.summary.required.missing).toContain("email.resend")
      expect(body.summary.required.missing).toContain("database.primary")
      expect(body.summary.required.missing).toContain("site.url")
    })

    it("reports degraded when all required are set but recommended are missing", async () => {
      setRequiredEnv()
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.status).toBe("degraded")
      expect(body.summary.required.missing).toEqual([])
      expect(body.summary.required.configured).toBe(body.summary.required.total)
      expect(body.summary.recommended.missing.length).toBeGreaterThan(0)
      expect(body.summary.recommended.missing).toEqual(
        expect.arrayContaining([
          "alerts.warnWebhook",
          "alerts.pageWebhook",
          "booking.cal_demo",
        ])
      )
    })

    it("reports ok when required + recommended are all set", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      expect(res.status).toBe(200)

      const body = await res.json()
      expect(body.status).toBe("ok")
      expect(body.summary.required.missing).toEqual([])
      expect(body.summary.recommended.missing).toEqual([])
    })
  })

  describe("special cases", () => {
    it("treats RESEND_API_KEY as not-required when RESEND_DISABLED=true", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      delete process.env.RESEND_API_KEY
      process.env.RESEND_DISABLED = "true"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.status).toBe("ok")
      expect(body.summary.required.missing).not.toContain("email.resend")
    })

    it("counts NEXTAUTH_SECRET as a valid alias for ACCESS_TOKEN_SECRET", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      delete process.env.ACCESS_TOKEN_SECRET
      process.env.NEXTAUTH_SECRET = "fallback-secret"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["auth.accessToken"]).toBe(true)
      expect(body.status).toBe("ok")
    })

    it("counts CONSULT_HEALTH_SLACK_WEBHOOK_URL as alias for warnWebhook", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      delete process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL
      process.env.CONSULT_HEALTH_SLACK_WEBHOOK_URL = "https://hooks.slack.com/fallback"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["alerts.warnWebhook"]).toBe(true)
      expect(body.status).toBe("ok")
    })

    it("treats whitespace-only env values as not configured", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      process.env.STRIPE_SECRET_KEY = "   "
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["stripe.secret"]).toBe(false)
      expect(body.status).toBe("broken")
    })

    // Step 5 — Cal.com URL validation. A non-empty but malformed value must
    // be reported as missing, not configured, so monitoring catches the typo
    // before users hit a broken Scale-tier CTA.
    it("flags NEXT_PUBLIC_CAL_DEMO_URL as missing when the value is a placeholder string", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      process.env.NEXT_PUBLIC_CAL_DEMO_URL = "TODO"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["booking.cal_demo"]).toBe(false)
      expect(body.summary.recommended.missing).toContain("booking.cal_demo")
      expect(body.status).toBe("degraded")
    })

    it("flags NEXT_PUBLIC_CAL_DEMO_URL as missing when the scheme is http (not https)", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      process.env.NEXT_PUBLIC_CAL_DEMO_URL = "http://cal.com/clawguru/demo"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["booking.cal_demo"]).toBe(false)
      expect(body.status).toBe("degraded")
    })

    it("flags NEXT_PUBLIC_CAL_DEMO_URL as missing when the host is not on the whitelist", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      process.env.NEXT_PUBLIC_CAL_DEMO_URL = "https://example.com/clawguru/demo"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["booking.cal_demo"]).toBe(false)
      expect(body.status).toBe("degraded")
    })

    it("accepts a valid calendly.com URL for NEXT_PUBLIC_CAL_DEMO_URL", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      process.env.NEXT_PUBLIC_CAL_DEMO_URL = "https://calendly.com/clawguru/30min"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["booking.cal_demo"]).toBe(true)
      expect(body.status).toBe("ok")
    })

    it("flags optional booking URLs as not configured when they hold a placeholder", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      process.env.NEXT_PUBLIC_CAL_STRATEGY_URL = "TBD"
      process.env.NEXT_PUBLIC_CAL_AUDIT_URL = "see ENV docs"
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["booking.cal_strategy"]).toBe(false)
      expect(body.configured["booking.cal_audit"]).toBe(false)
      // status stays ok because both are optional
      expect(body.status).toBe("ok")
    })
  })

  describe("response shape and security", () => {
    it("never includes raw secret values in the response", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const text = await res.text()
      expect(text).not.toContain("sk_test_123")
      expect(text).not.toContain("whsec_test_123")
      expect(text).not.toContain("re_test_123")
      expect(text).not.toContain("access-secret-123")
      expect(text).not.toContain("test-secret-123")
    })

    it("includes a valid ISO8601 checkedAt timestamp", async () => {
      setRequiredEnv()
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(typeof body.checkedAt).toBe("string")
      expect(new Date(body.checkedAt).toString()).not.toBe("Invalid Date")
    })

    it("returns no-store cache header to prevent CDN caching", async () => {
      setRequiredEnv()
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      expect(res.headers.get("cache-control")).toContain("no-store")
    })

    it("exposes a stable configured-tree for monitoring dashboards", async () => {
      setRequiredEnv()
      setRecommendedEnv()
      const req = new NextRequest("https://clawguru.org/api/consult-health/env-check?secret=test-secret-123")
      const res = await GET(req)
      const body = await res.json()
      expect(body.configured["stripe.secret"]).toBe(true)
      expect(body.configured["stripe.webhook"]).toBe(true)
      expect(body.configured["stripe.prices.daypass"]).toBe(true)
      expect(body.configured["stripe.prices.pro"]).toBe(true)
      expect(body.configured["stripe.prices.team"]).toBe(true)
      expect(body.configured["stripe.prices.msp"]).toBe(false)
      expect(body.configured["auth.accessToken"]).toBe(true)
      expect(body.configured["email.resend"]).toBe(true)
      expect(body.configured["site.url"]).toBe(true)
      expect(body.configured["database.primary"]).toBe(true)
      expect(body.configured["database.secondary"]).toBe(true)
      expect(body.configured["cron.secret"]).toBe(true)
      expect(body.configured["alerts.warnWebhook"]).toBe(true)
      expect(body.configured["alerts.pageWebhook"]).toBe(true)
      expect(body.configured["booking.cal_demo"]).toBe(true)
    })
  })
})
