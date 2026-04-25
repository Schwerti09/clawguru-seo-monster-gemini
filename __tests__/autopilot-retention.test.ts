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

  it("keeps consult-share in watch when booking sample is too small", () => {
    const summary = evaluateRetentionSignals({
      pricingClicks24h: 100,
      checkoutStarts24h: 60,
      checkoutRedirects24h: 50,
      checkoutErrors24h: 2,
      bookingClicks24h: 8,
      consultingBookingClicks24h: 1,
    })

    const consultSignal = summary.signals.find((s) => s.key === "consult_booking_share")
    expect(consultSignal?.level).toBe("watch")
    expect(consultSignal?.message).toContain("insufficient sample")
    expect(consultSignal?.message).toContain("8 booking clicks")
  })

  it("uses stricter consult-share thresholds at higher booking volume", () => {
    const summary = evaluateRetentionSignals({
      pricingClicks24h: 120,
      checkoutStarts24h: 80,
      checkoutRedirects24h: 70,
      checkoutErrors24h: 3,
      bookingClicks24h: 50,
      consultingBookingClicks24h: 14,
    })

    const consultSignal = summary.signals.find((s) => s.key === "consult_booking_share")
    expect(consultSignal?.score).toBe(28)
    expect(consultSignal?.level).toBe("critical")
    expect(consultSignal?.message).toContain("critical <30%")
  })
})
