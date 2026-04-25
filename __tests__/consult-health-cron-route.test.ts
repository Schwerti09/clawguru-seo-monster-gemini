jest.mock("@/lib/check-funnel", () => ({
  getCheckFunnelSnapshotPersistent: jest.fn(),
}))

jest.mock("@/lib/profit-funnel", () => ({
  buildProfitFunnel: jest.fn(),
}))

jest.mock("@/lib/consult-health-notify", () => ({
  maybeNotifyConsultHealthAlerts: jest.fn(),
  consultHealthWebhookEnvSnapshot: jest.fn(() => ({
    warnWebhookConfigured: true,
    pageWebhookConfigured: false,
  })),
}))

import { NextRequest } from "next/server"
import { getCheckFunnelSnapshotPersistent } from "@/lib/check-funnel"
import { buildProfitFunnel } from "@/lib/profit-funnel"
import { maybeNotifyConsultHealthAlerts } from "@/lib/consult-health-notify"
import { GET } from "@/app/api/consult-health/cron/route"

describe("GET /api/consult-health/cron", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "secret123"
  })

  afterEach(() => {
    delete process.env.CRON_SECRET
    jest.clearAllMocks()
  })

  it("returns 401 without valid CRON secret", async () => {
    const req = new NextRequest("https://clawguru.org/api/consult-health/cron")
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it("builds funnel and triggers notify when authorized", async () => {
    ;(getCheckFunnelSnapshotPersistent as jest.Mock).mockResolvedValue({
      pricingClicks24h: 40,
      bookingClicks24h: 20,
    })
    ;(buildProfitFunnel as jest.Mock).mockReturnValue({
      consultHealth: {
        score: 52,
        level: "watch",
        alertFlags: ["checkout_error_pressure"],
        routing: { severity: "warn", action: "slack", reason: "watch state" },
        reasons: ["elevated checkout error rate"],
      },
    })

    const req = new NextRequest("https://clawguru.org/api/consult-health/cron?secret=secret123")
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(buildProfitFunnel).toHaveBeenCalled()
    expect(maybeNotifyConsultHealthAlerts).toHaveBeenCalled()
    expect(body.notifiedCandidate).toBe(true)
    expect(body.consultHealth.webhooksConfigured.warnWebhookConfigured).toBe(true)
  })
})
