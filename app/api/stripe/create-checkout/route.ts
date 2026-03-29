/**
 * Stripe Checkout für Perfection Mode
 * 
 * Zahlungsabwicklung für Premium Content Generation
 * Preise: Basic €35, Premium €75, Ultra €150
 */

import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
})

const PRICE_MAP = {
  basic: { amount: 3500, name: "Basic Landingpage" },    // €35
  premium: { amount: 7500, name: "Premium Landingpage" }, // €75
  ultra: { amount: 15000, name: "Ultra Landingpage" },   // €150
}

export async function POST(request: NextRequest) {
  try {
    const { tier, topic, amount } = await request.json()

    if (!tier || !topic) {
      return NextResponse.json(
        { error: "Missing tier or topic" },
        { status: 400 }
      )
    }

    const price = PRICE_MAP[tier as keyof typeof PRICE_MAP]
    
    if (!price) {
      return NextResponse.json(
        { error: "Invalid tier" },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "paypal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: price.name,
              description: `Premium SEO Landingpage: "${topic}"`,
              images: ["https://clawguru.org/og-image.png"],
            },
            unit_amount: price.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/perfection/success?session_id={CHECKOUT_SESSION_ID}&topic=${encodeURIComponent(topic)}&tier=${tier}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/perfection?canceled=true`,
      metadata: {
        topic,
        tier,
        type: "perfection_content",
      },
      allow_promotion_codes: true,
      invoice_creation: {
        enabled: true,
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error("[stripe-checkout] Error:", error)
    return NextResponse.json(
      { error: "Checkout creation failed" },
      { status: 500 }
    )
  }
}
