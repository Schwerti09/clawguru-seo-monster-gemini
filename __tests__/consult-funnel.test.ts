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
  })
})
