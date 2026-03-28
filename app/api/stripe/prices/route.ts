import { NextResponse } from "next/server"
import { isStripeActive, apiUnavailableResponse } from "@/lib/api-guard"

export const dynamic = "force-dynamic"

/**
 * GET /api/stripe/prices
 *
 * Returns the configured Stripe Price IDs and their display prices from env.
 * No Stripe API call is made here – we just surface the env-configured values
 * so the client can show accurate pricing without an extra round-trip.
 *
 * Expected env vars (Stripe Price IDs):
 *   STRIPE_PRICE_DAYPASS
 *   STRIPE_PRICE_PRO
 *   STRIPE_PRICE_TEAM     (Team plan; also used as enterprise fallback)
 *   STRIPE_PRICE_ENTERPRISE (Enterprise API; falls back to STRIPE_PRICE_TEAM)
 *   STRIPE_PRISE_TEAM     (legacy typo alias for STRIPE_PRICE_TEAM)
 */
export async function GET() {
  if (!isStripeActive()) return apiUnavailableResponse()

  const teamPriceId =
    process.env.STRIPE_PRICE_TEAM ||
    process.env.STRIPE_PRISE_TEAM ||
    null

  return NextResponse.json({
    daypass: {
      priceId: process.env.STRIPE_PRICE_DAYPASS ?? null,
      amount: 900,   // cents
      currency: "eur",
      interval: "one_time",
    },
    pro: {
      priceId: process.env.STRIPE_PRICE_PRO ?? null,
      amount: 1499,  // cents
      currency: "eur",
      interval: "month",
    },
    enterprise: {
      priceId: process.env.STRIPE_PRICE_ENTERPRISE || teamPriceId,
      amount: null,
      currency: null,
      interval: "custom",
    },
  })
}
