import { NextRequest, NextResponse } from "next/server"
import { getCountryFromRequest, getCurrencyForCountry } from "@/lib/geo"

export const runtime = "edge"
export const dynamic = "force-dynamic"

type Product = "daypass" | "pro" | "team" | "msp"

function getPriceId(product: Product) {
  if (product === "daypass") return process.env.STRIPE_PRICE_DAYPASS
  if (product === "pro") return process.env.STRIPE_PRICE_PRO
  if (product === "msp") return process.env.STRIPE_PRICE_MSP
  return process.env.STRIPE_PRICE_TEAM
}

type StripePrice = {
  currency: string
  unit_amount: number | null
  tax_behavior?: "inclusive" | "exclusive" | "unspecified"
  currency_options?: Record<string, { unit_amount: number | null; tax_behavior?: string }>
}

type StripeTaxCalculation = {
  amount_total: number | null
  tax_amount_exclusive: number | null
}

const STRIPE_BASE = "https://api.stripe.com/v1"

async function stripeRequest<T>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${STRIPE_BASE}${path}`, options)
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = typeof data?.error?.message === "string" ? data.error.message : "Stripe request failed."
    throw new Error(message)
  }
  return data as T
}

export async function GET(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured." }, { status: 503 })
  }

  const url = new URL(req.url)
  const product =
    url.searchParams.get("product") === "pro" ||
    url.searchParams.get("product") === "team" ||
    url.searchParams.get("product") === "daypass" ||
    url.searchParams.get("product") === "msp"
      ? (url.searchParams.get("product") as Product)
      : "daypass"

  const priceId = getPriceId(product)
  if (!priceId || !/^price_[A-Za-z0-9]+$/.test(priceId)) {
    return NextResponse.json({ error: "Missing Stripe price." }, { status: 500 })
  }

  const country = getCountryFromRequest(req)
  const desiredCurrency = getCurrencyForCountry(country)

  try {
    const price = await stripeRequest<StripePrice>(`/prices/${priceId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${stripeKey}` },
    })
    const currencyOption = price.currency_options?.[desiredCurrency]
    const currency = currencyOption ? desiredCurrency : price.currency
    const unitAmount = currencyOption?.unit_amount ?? price.unit_amount
    const taxBehavior = currencyOption?.tax_behavior ?? price.tax_behavior ?? "exclusive"

    if (!unitAmount) {
      return NextResponse.json({ error: "Missing Stripe amount." }, { status: 500 })
    }

    let amountTotal = unitAmount
    let taxAmount = 0

    if (country) {
      const params = new URLSearchParams()
      params.set("currency", currency)
      params.set("line_items[0][amount]", String(unitAmount))
      params.set("line_items[0][reference]", product)
      params.set("line_items[0][tax_behavior]", taxBehavior === "inclusive" ? "inclusive" : "exclusive")
      params.set("customer_details[address][country]", country)
      params.set("customer_details[address_source]", "billing")

      const calculation = await stripeRequest<StripeTaxCalculation>("/tax/calculations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })
      amountTotal = calculation.amount_total ?? unitAmount
      taxAmount = calculation.tax_amount_exclusive ?? 0
    }

    return NextResponse.json({
      product,
      country,
      currency,
      amount: unitAmount,
      amountTotal,
      taxAmount,
      taxBehavior,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pricing lookup failed." },
      { status: 500 }
    )
  }
}
