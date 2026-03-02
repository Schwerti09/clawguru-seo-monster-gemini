import Stripe from "stripe"

const STRIPE_API_VERSION = "2024-06-20" as const

// Server-only Stripe client.
// Required env vars:
// - STRIPE_SECRET_KEY
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: STRIPE_API_VERSION,
  httpClient: Stripe.createFetchHttpClient(),
})
