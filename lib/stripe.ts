import Stripe from "stripe"

// Server-only Stripe client.
// Required env vars:
// - STRIPE_SECRET_KEY

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  return stripe
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
})
