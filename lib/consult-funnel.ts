export const CONSULT_SOURCE_KEYS = [
  "consulting_pricing_starter",
  "consulting_pricing_pro",
  "consulting_pricing_scale",
  "consulting_bottom_cta",
  "enterprise_api_cta",
] as const

export type ConsultSourceKey = typeof CONSULT_SOURCE_KEYS[number]
export type BookingSourceRow = { source: string; count: number }

type ConsultRates = {
  pricingToBookingPct: number
  consultingBookingSharePct: number
  starterSlotBookingPct: number
  proSlotBookingPct: number
  scaleSlotBookingPct: number
  bottomCtaBookingPct: number
  enterpriseCtaBookingPct: number
}

type ConsultSourceSnapshot = {
  consultSourceCounts: Record<ConsultSourceKey, number>
  rates: ConsultRates
}

function safeRate(num: number, den: number): number {
  return den > 0 ? Math.round((num / den) * 1000) / 10 : 0
}

export function buildConsultSourceSnapshot(input: {
  pricingClicks: number
  bookingClicks: number
  consultingBookingClicks: number
  bookingSources24h: BookingSourceRow[]
}): ConsultSourceSnapshot {
  const sourceMap = new Map<string, number>(input.bookingSources24h.map((s) => [s.source, s.count]))
  const consultSourceCounts = CONSULT_SOURCE_KEYS.reduce<Record<ConsultSourceKey, number>>((acc, key) => {
    acc[key] = sourceMap.get(key) ?? 0
    return acc
  }, {} as Record<ConsultSourceKey, number>)

  return {
    consultSourceCounts,
    rates: {
      pricingToBookingPct: safeRate(input.bookingClicks, input.pricingClicks),
      consultingBookingSharePct: safeRate(input.consultingBookingClicks, input.bookingClicks),
      starterSlotBookingPct: safeRate(consultSourceCounts.consulting_pricing_starter, input.bookingClicks),
      proSlotBookingPct: safeRate(consultSourceCounts.consulting_pricing_pro, input.bookingClicks),
      scaleSlotBookingPct: safeRate(consultSourceCounts.consulting_pricing_scale, input.bookingClicks),
      bottomCtaBookingPct: safeRate(consultSourceCounts.consulting_bottom_cta, input.bookingClicks),
      enterpriseCtaBookingPct: safeRate(consultSourceCounts.enterprise_api_cta, input.bookingClicks),
    },
  }
}
