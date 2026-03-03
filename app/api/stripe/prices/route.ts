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
 *   STRIPE_PRICE_TEAM (Enterprise/custom contact)
 */
export async function GET() {
  if (!isStripeActive()) return apiUnavailableResponse()

  return NextResponse.json({
    daypass: {
      priceId: process.env.STRIPE_PRICE_DAYPASS ?? null,
      amount: 700,   // cents
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
      priceId: null,
      amount: null,
      currency: null,
      interval: "custom",
    },
  })
}
