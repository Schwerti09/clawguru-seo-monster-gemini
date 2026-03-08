import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getOrigin } from "@/lib/origin"
import { isStripeActive, apiUnavailableResponse } from "@/lib/api-guard"

export const dynamic = "force-dynamic"

type Product = "daypass" | "pro" | "team" | "msp" | "enterprise"

function getPriceId(product: Product) {
  const teamPriceId =
    process.env.STRIPE_PRICE_TEAM ||
    process.env.STRIPE_PRISE_TEAM

  if (product === "daypass") return process.env.STRIPE_PRICE_DAYPASS
  if (product === "pro") return process.env.STRIPE_PRICE_PRO
  if (product === "msp") return process.env.STRIPE_PRICE_MSP
  if (product === "enterprise") {
    return process.env.STRIPE_PRICE_ENTERPRISE || teamPriceId
  }

  return teamPriceId
}

function getMode(product: Product): "payment" | "subscription" {
  return product === "daypass" ? "payment" : "subscription"
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim()

  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  return new Stripe(key, {
    apiVersion: "2024-06-20",
  })
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

    const affiliateRef: string | undefined =
      typeof body?.affiliate_ref === "string" && body.affiliate_ref.length > 0
        ? body.affiliate_ref.slice(0, 64)
        : undefined

    const price = getPriceId(product)

    if (!price) {
      return NextResponse.json(
        { error: "Checkout für dieses Produkt ist aktuell nicht verfügbar." },
        { status: 503 }
      )
    }

    const origin = getOrigin(req)
    const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancel_url = `${origin}/pricing?canceled=1`
    const mode = getMode(product)

    const session = await stripe.checkout.sessions.create({
      mode,
      allow_promotion_codes: true,
      line_items: [{ price, quantity: 1 }],
      success_url,
      cancel_url,
      customer_email: email,

      ...(mode === "payment"
        ? { customer_creation: "always" as const }
        : {}),

      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },

      metadata: {
        product,
        ...(email ? { email } : {}),
        ...(affiliateRef ? { affiliate_ref: affiliateRef } : {}),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    )
  }
}