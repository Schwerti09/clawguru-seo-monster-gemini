import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getOrigin } from "@/lib/origin"
import { isStripeActive, apiUnavailableResponse } from "@/lib/api-guard"

export const dynamic = "force-dynamic"

type Product = "daypass" | "pro" | "team" | "msp" | "enterprise"

function getPriceId(product: Product) {
  // We keep env names short on purpose. These are Stripe *Price* IDs.
  // - daypass: one-time payment
  // - pro/team: recurring monthly subscriptions
  // - msp: recurring annual subscription (White Label MSP license)
  // - enterprise: recurring monthly subscription (Enterprise API)
  //
  // STRIPE_PRISE_TEAM is accepted as a legacy alias for STRIPE_PRICE_TEAM
  // to handle a common mis-spelling of the env var name.
  const teamPriceId =
    process.env.STRIPE_PRICE_TEAM ||
    process.env.STRIPE_PRISE_TEAM // legacy typo alias
  if (product === "daypass") return process.env.STRIPE_PRICE_DAYPASS
  if (product === "pro") return process.env.STRIPE_PRICE_PRO
  if (product === "msp") return process.env.STRIPE_PRICE_MSP
  // Enterprise falls back to the team price when STRIPE_PRICE_ENTERPRISE is not set
  if (product === "enterprise") return process.env.STRIPE_PRICE_ENTERPRISE || teamPriceId
  return teamPriceId
}

function getMode(product: Product): "payment" | "subscription" {
  return product === "daypass" ? "payment" : "subscription"
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured")
  return new Stripe(key, { apiVersion: "2024-06-20" })
}

/**
 * Returns the preferred payment currency for a customer based on their country code.
 * US customers pay in USD; all other countries use EUR by default to minimise
 * foreign-exchange conversion losses.
 *
 * @param country - ISO 3166-1 alpha-2 country code (e.g. "US", "DE"), case-insensitive
 */
function getCurrency(country?: string): string {
  if (!country) return "eur"
  return country.toUpperCase() === "US" ? "usd" : "eur"
}

export async function POST(req: NextRequest) {
  if (!isStripeActive()) return apiUnavailableResponse()
  try {
    const stripe = getStripe()
    const body = await req.json().catch(() => ({}))
    const product: Product =
      (["pro", "team", "daypass", "msp", "enterprise"] as const).includes(body?.product)
        ? body.product
        : "daypass"
    const email: string | undefined =
      typeof body?.email === "string" ? body.email : undefined
    // Optional country hint passed by the frontend (e.g. from geolocation or a form field)
    const country: string | undefined =
      typeof body?.country === "string" ? body.country : undefined
    // Optional affiliate reference (e.g. set via /go/:slug cookie or query param)
    const affiliateRef: string | undefined =
      typeof body?.affiliate_ref === "string" && body.affiliate_ref.length > 0
        ? body.affiliate_ref.slice(0, 64) // cap length for Stripe metadata
        : undefined

    const price = getPriceId(product)
    if (!price) {
      return NextResponse.json(
        { error: "Checkout für dieses Produkt ist aktuell nicht verfügbar. Bitte kontaktiere enterprise@clawguru.org" },
        { status: 503 }
      )
    }

    const origin = getOrigin(req)
    const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancel_url = `${origin}/pricing?canceled=1`

    const session = await stripe.checkout.sessions.create({
      mode: getMode(product),
      allow_promotion_codes: true,
      line_items: [{ price, quantity: 1 }],
      success_url,
      cancel_url,
      customer_email: email,
      // Automatically calculate and collect VAT / Sales Tax
      automatic_tax: { enabled: true },
      // Collect billing address so Stripe Tax can determine the correct rate
      billing_address_collection: "required",
      // Allow B2B customers to enter their Tax ID (USt-IdNr.) so that the
      // Reverse Charge mechanism applies automatically ($0 tax for EU companies)
      tax_id_collection: { enabled: true },
      // Set currency based on customer location to minimise FX losses
      currency: getCurrency(country),
      metadata: {
        product,
        ...(email ? { email } : {}),
        ...(country ? { country } : {}),
        ...(affiliateRef ? { affiliate_ref: affiliateRef } : {})
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    )
  }
}
