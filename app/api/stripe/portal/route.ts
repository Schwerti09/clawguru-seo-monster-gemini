import { NextRequest, NextResponse } from "next/server"
import { getOrigin } from "@/lib/origin"
import { stripe } from "@/lib/stripe"
import { verifyAccessToken } from "@/lib/access-token"
import { cookies } from "next/headers"
import { isStripeActive, apiUnavailableResponse } from "@/lib/api-guard"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  if (!isStripeActive()) return apiUnavailableResponse()
  const token = (await cookies()).get("claw_access")?.value || ""
  const payload = token ? verifyAccessToken(token) : null
  if (!payload) return NextResponse.json({ error: "Not authorized" }, { status: 401 })

  const origin = getOrigin(req)
  const session = await stripe.billingPortal.sessions.create({
    customer: payload.customerId,
    return_url: `${origin}/dashboard`
  })

  return NextResponse.json({ url: session.url })
}
