import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getOrigin } from "@/lib/origin"
import { isValidAffCode, META_AFF_CODE } from "@/lib/affiliate"

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

    // Affiliate code: passed explicitly from BuyButton (cookie value)
    const rawAffCode: unknown = body?.affCode
    const affCode: string | undefined =
      isValidAffCode(rawAffCode) ? rawAffCode : undefined

    // Self-referral guard: look up the affiliate's registered Stripe Customer
    // record to compare their email against the buyer's email.
    // Fallback: also block if the buyer's email local-part (stripped of +tags)
    // exactly matches the affiliate code.
    let isSelfReferral = false
    if (affCode && email) {
      // Heuristic: strip +tags from local-part, lowercase, compare
      const localPart = email.split("@")[0].replace(/\+.*$/, "").toLowerCase()
      if (localPart === affCode.toLowerCase()) {
        isSelfReferral = true
      } else {
        // Stripe-backed check: find the affiliate's own customer record and
        // compare their email to the buyer's email.
        try {
          const affiliateRecords = await stripe.customers.search({
            query: `metadata["${META_AFF_CODE}"]:"${affCode}" AND metadata["affiliate"]:"true"`,
            limit: 1,
          })
          if (affiliateRecords.data.length > 0) {
            const affCustomer = affiliateRecords.data[0]
            if (
              !affCustomer.deleted &&
              affCustomer.email &&
              affCustomer.email.toLowerCase() === email.toLowerCase()
            ) {
              isSelfReferral = true
            }
          }
        } catch {
          // Stripe search unavailable – fall through; heuristic check above is enough
        }
      }
    }

    const effectiveAffCode = isSelfReferral ? undefined : affCode

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
      // client_reference_id links the affiliate code to the session for
      // easy lookup in webhooks without expanding the full object.
      ...(effectiveAffCode ? { client_reference_id: effectiveAffCode } : {}),
      metadata: {
        product,
        ...(email ? { email } : {}),
        // Store affiliate code in metadata so it survives to invoice.paid
        ...(effectiveAffCode ? { [META_AFF_CODE]: effectiveAffCode } : {})
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
