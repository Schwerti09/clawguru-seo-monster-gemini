import { buildConsultSourceSnapshot } from "@/lib/consult-funnel"

describe("consult funnel source snapshot", () => {
  it("builds slot counts and rates from booking sources", () => {
    const snapshot = buildConsultSourceSnapshot({
      pricingClicks: 200,
      bookingClicks: 50,
      consultingBookingClicks: 35,
      bookingSources24h: [
        { source: "consulting_pricing_starter", count: 10 },
        { source: "consulting_pricing_pro", count: 12 },
        { source: "consulting_bottom_cta", count: 8 },
        { source: "enterprise_api_cta", count: 5 },
      ],
    })

    expect(snapshot.consultSourceCounts.consulting_pricing_starter).toBe(10)
    expect(snapshot.consultSourceCounts.consulting_pricing_scale).toBe(0)
    expect(snapshot.rates.pricingToBookingPct).toBe(25)
    expect(snapshot.rates.consultingBookingSharePct).toBe(70)
    expect(snapshot.rates.proSlotBookingPct).toBe(24)
    expect(snapshot.rates.bottomCtaBookingPct).toBe(16)
    expect(snapshot.insights.topSource).toBe("consulting_pricing_pro")
    expect(snapshot.insights.topSourceSharePct).toBe(24)
    expect(snapshot.insights.sourceConcentrationLevel).toBe("balanced")
  })

  it("flags concentration risk when one source dominates", () => {
    const snapshot = buildConsultSourceSnapshot({
      pricingClicks: 80,
      bookingClicks: 10,
      consultingBookingClicks: 8,
      bookingSources24h: [
        { source: "consulting_bottom_cta", count: 8 },
        { source: "consulting_pricing_starter", count: 1 },
      ],
    })

    expect(snapshot.insights.topSource).toBe("consulting_bottom_cta")
    expect(snapshot.insights.topSourceSharePct).toBe(80)
    expect(snapshot.insights.sourceConcentrationLevel).toBe("critical")
  })

  it("normalizes duplicate and invalid source rows", () => {
    const snapshot = buildConsultSourceSnapshot({
      pricingClicks: 100,
      bookingClicks: 20,
      consultingBookingClicks: 10,
      bookingSources24h: [
        { source: "consulting_pricing_pro", count: 3.9 },
        { source: "consulting_pricing_pro", count: 2 },
        { source: "", count: 5 },
        { source: "consulting_bottom_cta", count: -2 },
      ],
    })

    expect(snapshot.bookingSources24hNormalized.find((r) => r.source === "consulting_pricing_pro")?.count).toBe(5)
    expect(snapshot.bookingSources24hNormalized.find((r) => r.source === "unknown")?.count).toBe(5)
    expect(snapshot.bookingSources24hNormalized.find((r) => r.source === "consulting_bottom_cta")?.count).toBe(0)
  })
})
