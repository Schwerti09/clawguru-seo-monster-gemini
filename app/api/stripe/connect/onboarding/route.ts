import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getOrigin } from "@/lib/origin"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { isStripeActive, apiUnavailableResponse } from "@/lib/api-guard"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const DEFAULT_AFFILIATE_REF = "direct"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

export async function POST(req: NextRequest) {
  if (!isStripeActive()) return apiUnavailableResponse()
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not configured" }, { status: 503 })
  }

  const token = cookies().get(adminCookieName())?.value ?? ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  try {
    const body = await req.json().catch(() => ({}))
    const affiliateRef = typeof body?.affiliate_ref === "string" && body.affiliate_ref.trim()
      ? body.affiliate_ref.trim().slice(0, 64)
      : DEFAULT_AFFILIATE_REF
    const email = typeof body?.email === "string" ? body.email : undefined
    const origin = getOrigin(req)
    const returnUrl = typeof body?.return_url === "string" && body.return_url.length > 0
      ? body.return_url
      : `${origin}/admin/profit-dashboard`
    const refreshUrl = typeof body?.refresh_url === "string" && body.refresh_url.length > 0
      ? body.refresh_url
      : `${origin}/admin/profit-dashboard?refresh=1`

    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: { transfers: { requested: true } },
      metadata: { affiliate_ref: affiliateRef },
    })

    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    })

    return NextResponse.json({ accountId: account.id, url: link.url, affiliate_ref: affiliateRef })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe Connect onboarding failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
