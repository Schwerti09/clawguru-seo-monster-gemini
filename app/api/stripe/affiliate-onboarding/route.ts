import { NextRequest, NextResponse } from "next/server"
import { isStripeActive, apiUnavailableResponse } from "@/lib/api-guard"
import { createAffiliateAccountLink } from "@/lib/stripe/affiliate-onboarding"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function normalizeString(input: unknown, max = 120) {
  return typeof input === "string" ? input.trim().slice(0, max) : undefined
}

export async function POST(req: NextRequest) {
  if (!isStripeActive()) return apiUnavailableResponse()

  const secret = process.env.AFFILIATE_ONBOARDING_SECRET
  if (secret) {
    const auth = req.headers.get("authorization") ?? ""
    if (auth !== `Bearer ${secret}`) return unauthorized()
  }

  const body = await req.json().catch(() => ({}))
  const affiliateId = normalizeString(body?.affiliateId, 64)
  const accountId = normalizeString(body?.accountId, 64)
  const email = normalizeString(body?.email, 200)
  const country = normalizeString(body?.country, 2)
  const refreshUrl = normalizeString(body?.refreshUrl, 500)
  const returnUrl = normalizeString(body?.returnUrl, 500)

  try {
    const result = await createAffiliateAccountLink({
      affiliateId,
      accountId,
      email,
      country,
      refreshUrl,
      returnUrl,
    })

    return NextResponse.json({
      url: result.url,
      accountId: result.accountId,
      expiresAt: result.expiresAt,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onboarding failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
