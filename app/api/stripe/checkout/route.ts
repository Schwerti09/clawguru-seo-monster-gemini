import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getOrigin } from "@/lib/origin"

export const dynamic = "force-dynamic"

type Product = "daypass" | "pro" | "team"

function getPriceId(product: Product) {
  // We keep env names short on purpose. These are Stripe *Price* IDs.
  // - daypass: one-time payment
  // - pro/team: recurring monthly subscriptions
  if (product === "daypass") return process.env.STRIPE_PRICE_DAYPASS
  if (product === "pro") return process.env.STRIPE_PRICE_PRO
  return process.env.STRIPE_PRICE_TEAM
}

function getMode(product: Product): "payment" | "subscription" {
  return product === "daypass" ? "payment" : "subscription"
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY fehlt")
  return new Stripe(key, { apiVersion: "2024-06-20" })
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await req.json().catch(() => ({}))
    const product: Product =
      body?.product === "pro" || body?.product === "team" || body?.product === "daypass"
        ? body.product
        : "daypass"
    const email: string | undefined =
      typeof body?.email === "string" ? body.email : undefined

    const price = getPriceId(product)
    if (!price) {
      return NextResponse.json(
        {
          error:
            product === "daypass"
              ? "STRIPE_PRICE_DAYPASS fehlt in der Umgebung."
              : product === "pro"
                ? "STRIPE_PRICE_PRO fehlt in der Umgebung."
                : "STRIPE_PRICE_TEAM fehlt in der Umgebung."
        },
        { status: 500 }
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
      metadata: {
        product,
        ...(email ? { email } : {})
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Checkout failed" },
      { status: 500 }
    )
  }
}
