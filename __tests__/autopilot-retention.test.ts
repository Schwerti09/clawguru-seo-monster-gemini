import { evaluateRetentionSignals } from "@/lib/autopilot-retention"

describe("autopilot retention signals", () => {
  it("flags healthy funnel when conversion and errors are stable", () => {
    const summary = evaluateRetentionSignals({
      pricingClicks24h: 100,
      checkoutStarts24h: 70,
      checkoutRedirects24h: 62,
      checkoutErrors24h: 3,
      bookingClicks24h: 40,
      consultingBookingClicks24h: 24,
    })
    expect(summary.overallLevel).toBe("healthy")
    expect(summary.signals.find((s) => s.key === "checkout_errors")?.level).toBe("healthy")
    expect(summary.signals.find((s) => s.key === "consult_booking_share")?.level).toBe("healthy")
  })

  it("flags critical funnel when starts are low and errors are high", () => {
    const summary = evaluateRetentionSignals({
      pricingClicks24h: 120,
      checkoutStarts24h: 10,
      checkoutRedirects24h: 4,
      checkoutErrors24h: 5,
      bookingClicks24h: 8,
      consultingBookingClicks24h: 1,
    })
    expect(summary.overallLevel).toBe("critical")
    expect(summary.signals.some((s) => s.level === "critical")).toBe(true)
  })
})
