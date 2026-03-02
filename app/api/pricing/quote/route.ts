import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
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

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
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
  if (!priceId) {
    return NextResponse.json({ error: "Missing Stripe price." }, { status: 500 })
  }

  const country = getCountryFromRequest(req)
  const desiredCurrency = getCurrencyForCountry(country)

  try {
    const price = await stripe.prices.retrieve(priceId)
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
      const calculation = await stripe.tax.calculations.create({
        currency,
        line_items: [
          {
            amount: unitAmount,
            reference: product,
            tax_behavior: taxBehavior === "inclusive" ? "inclusive" : "exclusive",
          },
        ],
        customer_details: {
          address: { country },
          address_source: "billing",
        },
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
