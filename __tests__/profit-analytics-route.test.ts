jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}))

jest.mock("@/lib/admin-auth", () => ({
  adminCookieName: jest.fn(() => "claw_admin"),
  verifyAdminToken: jest.fn(),
}))

jest.mock("@/lib/api-usage", () => ({
  getEndpointCounts: jest.fn(),
  getTopIps: jest.fn(),
  getActiveBlocks: jest.fn(),
}))

jest.mock("@/lib/check-funnel", () => ({
  getCheckFunnelSnapshotPersistent: jest.fn(),
}))

jest.mock("@/lib/autopilot-retention", () => ({
  evaluateRetentionSignals: jest.fn(),
}))

import { cookies } from "next/headers"
import { verifyAdminToken } from "@/lib/admin-auth"
import { getEndpointCounts, getTopIps, getActiveBlocks } from "@/lib/api-usage"
import { getCheckFunnelSnapshotPersistent } from "@/lib/check-funnel"
import { evaluateRetentionSignals } from "@/lib/autopilot-retention"
import { GET } from "@/app/api/admin/profit-analytics/route"

describe("GET /api/admin/profit-analytics", () => {
  it("returns consult source group rollups for admin funnel", async () => {
    ;(cookies as jest.Mock).mockResolvedValue({
      get: () => ({ value: "valid-token" }),
    })
    ;(verifyAdminToken as jest.Mock).mockReturnValue({ v: 1, u: "admin", iat: 1, exp: 9_999_999_999 })
    ;(getEndpointCounts as jest.Mock).mockReturnValue({})
    ;(getTopIps as jest.Mock).mockReturnValue([])
    ;(getActiveBlocks as jest.Mock).mockReturnValue([])
    ;(evaluateRetentionSignals as jest.Mock).mockReturnValue({ overallLevel: "watch", signals: [] })
    ;(getCheckFunnelSnapshotPersistent as jest.Mock).mockResolvedValue({
      pageViews24h: 90,
      checkStarts24h: 70,
      checkResults24h: 60,
      pricingClicks24h: 40,
      checkoutStarts24h: 18,
      checkoutRedirects24h: 14,
      checkoutErrors24h: 1,
      bookingClicks24h: 10,
      consultingBookingClicks24h: 8,
      retentionNudgeImpressions24h: 0,
      retentionNudgeClicks24h: 0,
      retentionNudgeDismisses24h: 0,
      shareClicks24h: 0,
      methodikClicks24h: 0,
      hardeningClicks24h: 0,
      bookingSources24h: [
        { source: "consulting_pricing_pro", count: 6 },
        { source: "enterprise_api_cta", count: 2 },
        { source: "newsletter_footer_cta", count: 2 },
      ],
    })

    const response = await GET()
    expect(response.status).toBe(200)
    const body = await response.json()

    expect(body.funnel.consultSourceGroups.pricingSlots.count).toBe(6)
    expect(body.funnel.consultSourceGroups.enterpriseCta.count).toBe(2)
    expect(body.funnel.consultSourceGroups.other.count).toBe(2)
    expect(body.funnel.consultDominantSourceGroup).toBe("pricingSlots")
    expect(["info", "warn", "page"]).toContain(body.funnel.consultHealth.routing.severity)
    expect(["none", "slack", "pagerduty"]).toContain(body.funnel.consultHealth.routing.action)
    expect(Array.isArray(body.funnel.consultHealth.alertFlags)).toBe(true)
    expect(body.funnel.consultHealth.webhooksConfigured).toEqual({
      warnWebhookConfigured: false,
      pageWebhookConfigured: false,
    })
    expect(body.funnel.consultHealth.notifyTelemetry).toEqual(
      expect.objectContaining({
        attempted: expect.any(Number),
        sent: expect.any(Number),
        failed: expect.any(Number),
        windows: expect.objectContaining({
          h24: expect.objectContaining({
            successRatePct: expect.any(Number),
            failureRatePct: expect.any(Number),
          }),
          d7: expect.objectContaining({
            successRatePct: expect.any(Number),
          }),
          d30: expect.objectContaining({
            successRatePct: expect.any(Number),
          }),
        }),
        trend: expect.objectContaining({
          successRateDelta7dVs24hPct: expect.any(Number),
          failureRateDelta7dVs24hPct: expect.any(Number),
        }),
      })
    )
  })
})
