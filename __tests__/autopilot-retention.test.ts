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
      pricingClicks7d: 650,
      checkoutStarts7d: 430,
      checkoutErrors7d: 18,
      bookingClicks7d: 210,
      consultingBookingClicks7d: 126,
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
      pricingClicks7d: 800,
      checkoutStarts7d: 140,
      checkoutErrors7d: 58,
      bookingClicks7d: 45,
      consultingBookingClicks7d: 10,
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
      pricingClicks7d: 620,
      checkoutStarts7d: 390,
      checkoutErrors7d: 16,
      bookingClicks7d: 9,
      consultingBookingClicks7d: 1,
    })

    const consultSignal = summary.signals.find((s) => s.key === "consult_booking_share")
    expect(consultSignal?.level).toBe("watch")
    expect(consultSignal?.message).toContain("insufficient sample")
    expect(consultSignal?.message).toContain("24h sample: 8 booking clicks")
  })

  it("uses stricter consult-share thresholds at higher booking volume", () => {
    const summary = evaluateRetentionSignals({
      pricingClicks24h: 120,
      checkoutStarts24h: 80,
      checkoutRedirects24h: 70,
      checkoutErrors24h: 3,
      bookingClicks24h: 50,
      consultingBookingClicks24h: 14,
      pricingClicks7d: 780,
      checkoutStarts7d: 510,
      checkoutErrors7d: 22,
      bookingClicks7d: 330,
      consultingBookingClicks7d: 92,
    })

    const consultSignal = summary.signals.find((s) => s.key === "consult_booking_share")
    expect(consultSignal?.score).toBe(28)
    expect(consultSignal?.level).toBe("critical")
    expect(consultSignal?.message).toContain("critical <30%")
  })

  it("uses 7d consult share as retention gate to avoid noisy 24h spikes", () => {
    const summary = evaluateRetentionSignals({
      pricingClicks24h: 110,
      checkoutStarts24h: 72,
      checkoutRedirects24h: 64,
      checkoutErrors24h: 2,
      bookingClicks24h: 40,
      consultingBookingClicks24h: 26, // 65% 24h healthy
      pricingClicks7d: 740,
      checkoutStarts7d: 470,
      checkoutErrors7d: 21,
      bookingClicks7d: 210,
      consultingBookingClicks7d: 58, // 27.6% 7d critical
    })

    const consultSignal = summary.signals.find((s) => s.key === "consult_booking_share")
    expect(consultSignal?.level).toBe("critical")
    expect(consultSignal?.message).toContain("27.6% (7d)")
  })
})
