import { buildProfitFunnel } from "@/lib/profit-funnel"

describe("profit funnel contract", () => {
  it("returns stable funnel shape with consult metrics", () => {
    const funnel = buildProfitFunnel(
      {
        pageViews24h: 150,
        checkStarts24h: 120,
        checkResults24h: 100,
        pricingClicks24h: 60,
        checkoutStarts24h: 30,
        checkoutRedirects24h: 24,
        checkoutErrors24h: 3,
        bookingClicks24h: 20,
        consultingBookingClicks24h: 15,
        retentionNudgeImpressions24h: 40,
        retentionNudgeClicks24h: 8,
        retentionNudgeDismisses24h: 6,
        shareClicks24h: 12,
        methodikClicks24h: 5,
        hardeningClicks24h: 4,
        bookingSources24h: [
          { source: "consulting_pricing_pro", count: 7 },
          { source: "enterprise_api_cta", count: 5 },
        ],
      },
      11
    )

    expect(funnel.pricingClicks).toBe(60)
    expect(funnel.bookingClicks).toBe(20)
    expect(funnel.consultSourceCounts.consulting_pricing_pro).toBe(7)
    expect(funnel.consultInsights.topSource).toBe("consulting_pricing_pro")
    expect(funnel.rates.pricingToBookingPct).toBe(33.3)
    expect(funnel.rates.consultingBookingSharePct).toBe(75)
    expect(funnel.rates.checkoutStartToCompletePct).toBe(36.7)
  })
})
