import { NextRequest, NextResponse } from "next/server"
import { getOrigin } from "@/lib/origin"
import { isStripeActive, apiUnavailableResponse } from "@/lib/api-guard"
import { getStripe } from "@/lib/stripe"
import { logTelemetry } from "@/lib/ops/telemetry"
import { getRequestId } from "@/lib/ops/request-id"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
type Product = "daypass" | "pro" | "team" | "msp" | "enterprise"

function getPriceId(product: Product, annual = false) {
  if (product === "daypass") return process.env.STRIPE_PRICE_DAYPASS
  if (product === "pro") return (annual && process.env.STRIPE_PRICE_PRO_ANNUAL) || process.env.STRIPE_PRICE_PRO
  if (product === "team") return (annual && process.env.STRIPE_PRICE_TEAM_ANNUAL) || process.env.STRIPE_PRICE_TEAM
  if (product === "msp") return process.env.STRIPE_PRICE_MSP
  if (product === "enterprise") return process.env.STRIPE_PRICE_ENTERPRISE || process.env.STRIPE_PRICE_TEAM
  return process.env.STRIPE_PRICE_TEAM
}

async function resolvePromoCode(stripe: ReturnType<typeof import("@/lib/stripe")["getStripe"]>, code: string): Promise<string | null> {
  try {
    const list = await stripe.promotionCodes.list({ code, limit: 1, active: true })
    return list.data[0]?.id ?? null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  if (!isStripeActive()) return apiUnavailableResponse()

  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  logTelemetry("stripe.checkout.request", {
    requestId,
  })

  try {
    const stripe = getStripe()
    const url = new URL(req.url)
    const sp = url.searchParams

    const raw = sp.get("product") || sp.get("plan") || "daypass"
    const allowed = ["pro", "team", "daypass", "msp", "enterprise"] as const
    const product: Product = (allowed as readonly string[]).includes(raw) ? (raw as Product) : "daypass"

    const email = sp.get("email") || undefined
    const affiliateRef = sp.get("affiliate_ref") || undefined

    const price = getPriceId(product)

    if (!price) {
      console.error("[stripe/checkout] missing price id for product", { product })
      logTelemetry("stripe.checkout.error", {
        requestId,
        error: "missing price id",
        product,
        durationMs: Date.now() - startedAt,
      })

      return NextResponse.json(
        { error: "Checkout f\u00FCr dieses Produkt ist aktuell nicht verf\u00FCgbar." },
        { status: 503 }
      )
    }

    const origin = getOrigin(req)
    const success_url = `${origin}/api/auth/activate?session_id={CHECKOUT_SESSION_ID}`
    const cancel_url = `${origin}/pricing?canceled=1`
    const mode = getMode(product)

    const session = await stripe.checkout.sessions.create({
      mode,
      allow_promotion_codes: true,
      line_items: [{ price, quantity: 1 }],
      success_url,
      cancel_url,
      customer_email: email,
      ...(mode === "payment" ? { customer_creation: "always" as const } : {}),
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      metadata: {
        product,
        ...(email ? { email } : {}),
        ...(affiliateRef ? { affiliate_ref: affiliateRef } : {}),
      },
    })

    console.info("[stripe/checkout] created checkout session (GET)", {
      sessionId: session.id,
      mode,
      product,
      hasUrl: Boolean(session.url),
    })
    logTelemetry("stripe.checkout.success", {
      requestId,
      sessionId: session.id,
      mode,
      product,
      durationMs: Date.now() - startedAt,
    })

    if (session.url) {
      return NextResponse.redirect(session.url, 303)
    }
    return NextResponse.json({ error: "Missing checkout url" }, { status: 500 })
  } catch (e: unknown) {
    console.error("[stripe/checkout] failed (GET)", {
      err: e instanceof Error ? e.message : String(e),
    })
    logTelemetry("stripe.checkout.error", {
      requestId,
      error: e instanceof Error ? e.message : String(e),
      durationMs: Date.now() - startedAt,
    })
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    )
  }
}

function getMode(product: Product): "payment" | "subscription" {
  return product === "daypass" ? "payment" : "subscription"
}

export async function POST(req: NextRequest) {
  if (!isStripeActive()) return apiUnavailableResponse()

  const requestId = getRequestId(req.headers)
  const startedAt = Date.now()
  logTelemetry("stripe.checkout.request", {
    requestId,
  })

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

    const annual = product !== "daypass" && body?.annual === true

    const rawCoupon: string | undefined =
      typeof body?.coupon_code === "string" && body.coupon_code.length > 0
        ? body.coupon_code.slice(0, 32).toUpperCase()
        : undefined
    const recommendedPlan: string | undefined =
      typeof body?.recommended_plan === "string" && body.recommended_plan.length > 0
        ? body.recommended_plan.slice(0, 32)
        : undefined

    const price = getPriceId(product, annual)

    if (!price) {
      console.error("[stripe/checkout] missing price id for product", { product, annual })
      logTelemetry("stripe.checkout.error", {
        requestId,
        error: "missing price id",
        product,
        durationMs: Date.now() - startedAt,
      })

      return NextResponse.json(
        { error: "Checkout für dieses Produkt ist aktuell nicht verfügbar." },
        { status: 503 }
      )
    }

    const origin = getOrigin(req)
    const success_url = `${origin}/api/auth/activate?session_id={CHECKOUT_SESSION_ID}`
    const cancel_url = `${origin}/pricing?canceled=1`
    const mode = getMode(product)

    // Pre-apply promo code if provided; fall back to allow_promotion_codes
    let discounts: { promotion_code: string }[] | undefined
    let allowPromoCodes = true
    if (rawCoupon) {
      const promoId = await resolvePromoCode(stripe, rawCoupon)
      if (promoId) {
        discounts = [{ promotion_code: promoId }]
        allowPromoCodes = false
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      ...(allowPromoCodes ? { allow_promotion_codes: true } : { discounts }),
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
        annual: String(annual),
        ...(email ? { email } : {}),
        ...(affiliateRef ? { affiliate_ref: affiliateRef } : {}),
        ...(rawCoupon ? { coupon_code: rawCoupon } : {}),
        ...(recommendedPlan ? { recommended_plan: recommendedPlan } : {}),
      },
    })


    console.info("[stripe/checkout] created checkout session", {
      sessionId: session.id,
      mode,
      product,
      hasUrl: Boolean(session.url),
    })
    logTelemetry("stripe.checkout.success", {
      requestId,
      sessionId: session.id,
      mode,
      product,
      durationMs: Date.now() - startedAt,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: unknown) {
    console.error("[stripe/checkout] failed", {
      err: e instanceof Error ? e.message : String(e),
    })
    logTelemetry("stripe.checkout.error", {
      requestId,
      error: e instanceof Error ? e.message : String(e),
      durationMs: Date.now() - startedAt,
    })

    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    )
  }
}
