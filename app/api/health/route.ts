import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const required = ["STRIPE_SECRET_KEY", "STRIPE_PRICE_DAYPASS"] as const

  const missing = required.filter((k) => !process.env[k])

  const ok = missing.length === 0
  return NextResponse.json({
    ok,
    ts: new Date().toISOString(),
    env: {
      stripe: {
        hasSecretKey: Boolean(process.env.STRIPE_SECRET_KEY),
        hasDaypassPrice: Boolean(process.env.STRIPE_PRICE_DAYPASS)
      }
    },
    missing
  })
}
