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
    consultInsights: consult.insights,
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
