import { buildConsultSourceSnapshot, type BookingSourceRow } from "@/lib/consult-funnel"

export type ProfitFunnelInput = {
  pageViews24h: number
  checkStarts24h: number
  checkResults24h: number
  pricingClicks24h: number
  checkoutStarts24h: number
  checkoutRedirects24h: number
  checkoutErrors24h: number
  bookingClicks24h: number
  consultingBookingClicks24h: number
  retentionNudgeImpressions24h: number
  retentionNudgeClicks24h: number
  retentionNudgeDismisses24h: number
  shareClicks24h: number
  methodikClicks24h: number
  hardeningClicks24h: number
  bookingSources24h: BookingSourceRow[]
}

type ConsultHealth = {
  score: number
  level: "healthy" | "watch" | "critical"
  alertFlags: Array<"low_conversion" | "low_consult_mix" | "source_concentration" | "checkout_error_pressure">
  routing: {
    severity: "info" | "warn" | "page"
    action: "none" | "slack" | "pagerduty"
    reason: string
  }
  reasons: string[]
}

type ConsultSourceGroupKey = "pricingSlots" | "bottomCta" | "enterpriseCta" | "other"

function safeRate(num: number, den: number): number {
  return den > 0 ? Math.round((num / den) * 1000) / 10 : 0
}

export function buildProfitFunnel(input: ProfitFunnelInput, checkoutCompleted: number) {
  const consult = buildConsultSourceSnapshot({
    pricingClicks: input.pricingClicks24h,
    bookingClicks: input.bookingClicks24h,
    consultingBookingClicks: input.consultingBookingClicks24h,
    bookingSources24h: input.bookingSources24h,
  })

  const checkoutErrorRatePct = safeRate(input.checkoutErrors24h, input.checkoutStarts24h)
  const consultHealthScoreRaw =
    consult.rates.pricingToBookingPct * 0.35 +
    consult.rates.consultingBookingSharePct * 0.35 +
    (100 - Math.min(100, consult.insights.topSourceSharePct)) * 0.15 +
    (100 - Math.min(100, checkoutErrorRatePct)) * 0.15
  const consultHealthScore = Math.max(0, Math.min(100, Math.round(consultHealthScoreRaw * 10) / 10))
  const consultHealthLevel: ConsultHealth["level"] =
    consultHealthScore < 40 ? "critical" : consultHealthScore < 70 ? "watch" : "healthy"
  const consultHealthAlertFlags: ConsultHealth["alertFlags"] = []
  const consultHealthReasons: string[] = []
  if (consult.rates.pricingToBookingPct < 15) {
    consultHealthAlertFlags.push("low_conversion")
    consultHealthReasons.push("low pricing-to-booking conversion")
  }
  if (consult.rates.consultingBookingSharePct < 30) {
    consultHealthAlertFlags.push("low_consult_mix")
    consultHealthReasons.push("low consult share in booking mix")
  }
  if (consult.insights.sourceConcentrationLevel !== "balanced") {
    consultHealthAlertFlags.push("source_concentration")
    consultHealthReasons.push("high source concentration risk")
  }
  if (checkoutErrorRatePct >= 10) {
    consultHealthAlertFlags.push("checkout_error_pressure")
    consultHealthReasons.push("elevated checkout error rate")
  }
  const shouldPage =
    consultHealthScore < 35 ||
    (consultHealthAlertFlags.includes("low_conversion") &&
      consultHealthAlertFlags.includes("checkout_error_pressure"))
  const shouldWarn = !shouldPage && (consultHealthAlertFlags.length >= 2 || consultHealthScore < 60)
  const consultHealthRouting: ConsultHealth["routing"] = shouldPage
    ? {
        severity: "page",
        action: "pagerduty",
        reason: "critical consult degradation with conversion and checkout pressure",
      }
    : shouldWarn
      ? {
          severity: "warn",
          action: "slack",
          reason: "consult health watch state requires operator review",
        }
      : {
          severity: "info",
          action: "none",
          reason: "consult health within expected envelope",
        }

  const consultHealth: ConsultHealth = {
    score: consultHealthScore,
    level: consultHealthLevel,
    alertFlags: consultHealthAlertFlags,
    routing: consultHealthRouting,
    reasons: consultHealthReasons.length > 0 ? consultHealthReasons : ["stable consult funnel signals"],
  }
  const sourceGroupsRaw: Record<ConsultSourceGroupKey, number> = {
    pricingSlots: 0,
    bottomCta: 0,
    enterpriseCta: 0,
    other: 0,
  }
  for (const source of consult.bookingSources24hNormalized) {
    const label = source.source
    const count = source.count
    if (label.startsWith("consulting_pricing_")) sourceGroupsRaw.pricingSlots += count
    else if (label === "consulting_bottom_cta") sourceGroupsRaw.bottomCta += count
    else if (label === "enterprise_api_cta") sourceGroupsRaw.enterpriseCta += count
    else sourceGroupsRaw.other += count
  }
  const sourceGroups = {
    pricingSlots: {
      count: sourceGroupsRaw.pricingSlots,
      sharePct: safeRate(sourceGroupsRaw.pricingSlots, input.bookingClicks24h),
    },
    bottomCta: {
      count: sourceGroupsRaw.bottomCta,
      sharePct: safeRate(sourceGroupsRaw.bottomCta, input.bookingClicks24h),
    },
    enterpriseCta: {
      count: sourceGroupsRaw.enterpriseCta,
      sharePct: safeRate(sourceGroupsRaw.enterpriseCta, input.bookingClicks24h),
    },
    other: {
      count: sourceGroupsRaw.other,
      sharePct: safeRate(sourceGroupsRaw.other, input.bookingClicks24h),
    },
  }
  const dominantSourceGroup =
    (Object.entries(sourceGroupsRaw).sort((a, b) => b[1] - a[1])[0]?.[0] as ConsultSourceGroupKey | undefined) ?? "other"

  return {
    landingPageViews: input.pageViews24h,
    pricingClicks: input.pricingClicks24h,
    checkoutStarted: input.checkoutStarts24h,
    checkoutRedirected: input.checkoutRedirects24h,
    checkoutErrors: input.checkoutErrors24h,
    bookingClicks: input.bookingClicks24h,
    consultingBookingClicks: input.consultingBookingClicks24h,
    bookingSources24h: consult.bookingSources24hNormalized,
    consultSourceCounts: consult.consultSourceCounts,
    consultSourceGroups: sourceGroups,
    consultDominantSourceGroup: dominantSourceGroup,
    consultInsights: consult.insights,
    consultHealth,
    checkoutCompleted,
    rates: {
      clickToCheckoutStartPct: safeRate(input.checkoutStarts24h, input.pricingClicks24h),
      ...consult.rates,
      checkoutStartToRedirectPct: safeRate(input.checkoutRedirects24h, input.checkoutStarts24h),
      checkoutStartToCompletePct: safeRate(checkoutCompleted, input.checkoutStarts24h),
      redirectToCompletePct: safeRate(checkoutCompleted, input.checkoutRedirects24h),
      retentionNudgeCtrPct: safeRate(input.retentionNudgeClicks24h, input.retentionNudgeImpressions24h),
    },
    retentionNudges: {
      impressions24h: input.retentionNudgeImpressions24h,
      clicks24h: input.retentionNudgeClicks24h,
      dismisses24h: input.retentionNudgeDismisses24h,
    },
    note: `24h: starts ${input.checkStarts24h}, results ${input.checkResults24h}, shares ${input.shareClicks24h}, methodology clicks ${input.methodikClicks24h}, hardening link clicks ${input.hardeningClicks24h}, bookings ${input.bookingClicks24h} (${input.consultingBookingClicks24h} consult/enterprise sources).`,
  }
}
