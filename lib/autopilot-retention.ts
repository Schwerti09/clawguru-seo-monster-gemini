export type RetentionSignalLevel = "healthy" | "watch" | "critical"

export type RetentionInput = {
  pricingClicks24h: number
  checkoutStarts24h: number
  checkoutRedirects24h: number
  checkoutErrors24h: number
  bookingClicks24h: number
  consultingBookingClicks24h: number
  pricingClicks7d: number
  checkoutStarts7d: number
  checkoutErrors7d: number
  bookingClicks7d: number
  consultingBookingClicks7d: number
}

export type RetentionSignal = {
  key: "checkout_errors" | "click_to_start_dropoff" | "start_to_redirect_dropoff" | "consult_booking_share"
  level: RetentionSignalLevel
  score: number
  message: string
}

export type RetentionSummary = {
  overallLevel: RetentionSignalLevel
  signals: RetentionSignal[]
}

function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0
  return (numerator / denominator) * 100
}

function classifyConsultBookingShare(sharePct: number, bookingClicks24h: number): {
  level: RetentionSignalLevel
  thresholdLabel: string
  sampleLabel: string
} {
  if (bookingClicks24h === 0) {
    return {
      level: "watch",
      thresholdLabel: "insufficient sample",
      sampleLabel: "0 booking clicks",
    }
  }
  if (bookingClicks24h < 12) {
    return {
      level: "watch",
      thresholdLabel: "insufficient sample",
      sampleLabel: `${bookingClicks24h} booking clicks`,
    }
  }

  // Calibrated buckets: stricter expectations once volume is high enough.
  const highVolume = bookingClicks24h >= 40
  const criticalThreshold = highVolume ? 30 : 25
  const watchThreshold = highVolume ? 55 : 50
  const level: RetentionSignalLevel =
    sharePct < criticalThreshold ? "critical" : sharePct < watchThreshold ? "watch" : "healthy"
  return {
    level,
    thresholdLabel: `critical <${criticalThreshold}% · watch <${watchThreshold}%`,
    sampleLabel: `${bookingClicks24h} booking clicks`,
  }
}

export function evaluateRetentionSignals(input: RetentionInput): RetentionSummary {
  const clickToStartPct = pct(input.checkoutStarts24h, input.pricingClicks24h)
  const startToRedirectPct = pct(input.checkoutRedirects24h, input.checkoutStarts24h)
  const errorRatePct = pct(input.checkoutErrors24h, input.checkoutStarts24h)
  const consultBookingSharePct = pct(input.consultingBookingClicks24h, input.bookingClicks24h)
  const consultBookingShare7dPct = pct(input.consultingBookingClicks7d, input.bookingClicks7d)

  const checkoutErrorsLevel: RetentionSignalLevel =
    errorRatePct >= 25 ? "critical" : errorRatePct >= 10 ? "watch" : "healthy"
  const clickToStartLevel: RetentionSignalLevel =
    clickToStartPct < 20 ? "critical" : clickToStartPct < 45 ? "watch" : "healthy"
  const startToRedirectLevel: RetentionSignalLevel =
    startToRedirectPct < 60 ? "critical" : startToRedirectPct < 80 ? "watch" : "healthy"
  const consultShare24h = classifyConsultBookingShare(consultBookingSharePct, input.bookingClicks24h)
  const consultShare7d = classifyConsultBookingShare(consultBookingShare7dPct, input.bookingClicks7d)
  const consultBookingShareLevel: RetentionSignalLevel =
    consultShare7d.level === "critical"
      ? "critical"
      : consultShare7d.level === "watch" || consultShare24h.level === "watch"
        ? "watch"
        : "healthy"

  const severity = { healthy: 0, watch: 1, critical: 2 } as const
  const overallLevel: RetentionSignalLevel =
    severity[checkoutErrorsLevel] >= 2 ||
    severity[clickToStartLevel] >= 2 ||
    severity[startToRedirectLevel] >= 2 ||
    severity[consultBookingShareLevel] >= 2
      ? "critical"
      : severity[checkoutErrorsLevel] >= 1 ||
        severity[clickToStartLevel] >= 1 ||
        severity[startToRedirectLevel] >= 1 ||
        severity[consultBookingShareLevel] >= 1
        ? "watch"
        : "healthy"

  return {
    overallLevel,
    signals: [
      {
        key: "checkout_errors",
        level: checkoutErrorsLevel,
        score: Math.round(errorRatePct * 10) / 10,
        message: `Checkout error rate is ${Math.round(errorRatePct * 10) / 10}% over 24h.`,
      },
      {
        key: "click_to_start_dropoff",
        level: clickToStartLevel,
        score: Math.round(clickToStartPct * 10) / 10,
        message: `Click-to-start conversion is ${Math.round(clickToStartPct * 10) / 10}% over 24h.`,
      },
      {
        key: "start_to_redirect_dropoff",
        level: startToRedirectLevel,
        score: Math.round(startToRedirectPct * 10) / 10,
        message: `Start-to-redirect conversion is ${Math.round(startToRedirectPct * 10) / 10}% over 24h.`,
      },
      {
        key: "consult_booking_share",
        level: consultBookingShareLevel,
        score: Math.round(consultBookingSharePct * 10) / 10,
        message:
          `Consult booking share is ${Math.round(consultBookingSharePct * 10) / 10}% (24h) ` +
          `and ${Math.round(consultBookingShare7dPct * 10) / 10}% (7d). ` +
          `24h sample: ${consultShare24h.sampleLabel}; 7d sample: ${consultShare7d.sampleLabel}; ` +
          `active thresholds: ${consultShare7d.thresholdLabel}.`,
      },
    ],
  }
}
