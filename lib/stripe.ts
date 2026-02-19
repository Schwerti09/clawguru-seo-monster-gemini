import Stripe from "stripe"

// Server-only Stripe client.
// Required env vars:
// - STRIPE_SECRET_KEY
const key = process.env.STRIPE_SECRET_KEY

if (!key) {
  console.warn("WARN: STRIPE_SECRET_KEY is missing in lib/stripe.ts. Ensure environment variables are set.")
}

export const stripe = new Stripe(key || "", {
  // Use a pinned API version if you want stricter stability:
  // apiVersion: "2024-06-20" as any
})
