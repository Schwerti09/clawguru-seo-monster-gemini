import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { sendEmail, buildMagicLinkHtml } from "@/lib/email"
import { signAccessToken, AccessPlan } from "@/lib/access-token"

export const runtime = "nodejs"

// naive in-memory rate limit (best-effort)
const memory: { [k: string]: { count: number; ts: number } } = {}

function ip(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for") || ""
  return xf.split(",")[0]?.trim() || "unknown"
}

function okToProceed(key: string) {
  const now = Date.now()
  const slot = memory[key]
  if (!slot || now - slot.ts > 60_000) {
    memory[key] = { count: 1, ts: now }
    return true
  }
  slot.count += 1
  return slot.count <= 3
}

function tokenExp(plan: AccessPlan, now: number) {
  if (plan === "daypass") return now + 60 * 60 * 24
  return now + 60 * 60 * 24 * 30
}

async function issueTokenForCustomer(customerId: string): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000)

  // 1) Prefer active subscription (pro/team)
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10
  })

  const activeSub = subs.data.find((s) => s.status === "active" || s.status === "trialing")
  if (activeSub) {
    const product = (activeSub.metadata?.product || "").toLowerCase()
    const plan: AccessPlan = product === "team" ? "team" : "pro"
    return signAccessToken({
      v: 1,
      plan,
      customerId,
      subscriptionId: activeSub.id,
      iat: now,
      exp: tokenExp(plan, now)
    })
  }

  // 2) Fallback daypass: look for a succeeded payment intent with metadata.product=daypass within 24h
  const pis = await stripe.paymentIntents.list({ customer: customerId, limit: 20 })
  const day = pis.data.find((pi) => {
    const md = pi.metadata || {}
    const prod = String(md.product || "").toLowerCase()
    const created = pi.created || 0
    const okAge = created >= now - 60 * 60 * 24
    return pi.status === "succeeded" && prod === "daypass" && okAge
  })
  if (day) {
    return signAccessToken({
      v: 1,
      plan: "daypass",
      customerId,
      iat: now,
      exp: tokenExp("daypass", now)
    })
  }

  return null
}

export async function POST(req: NextRequest) {
  // Always return success to avoid account enumeration
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const redirectUrl = new URL("/recover?sent=1", base)

  const key = ip(req)
  if (!okToProceed(key)) {
    return NextResponse.redirect(new URL("/recover?rate_limited=1", base))
  }

  const contentType = req.headers.get("content-type") || ""
  let email = ""
  try {
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const form = await req.formData()
      email = String(form.get("email") || "")
    } else {
      const body = await req.json().catch(() => ({}))
      email = String((body as { email?: string }).email || "")
    }
  } catch {
    email = ""
  }

  email = email.trim().toLowerCase()
  if (!email || !email.includes("@")) {
    return NextResponse.redirect(new URL("/recover?invalid_email=1", base))
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 })
    const customer = customers.data[0]
    if (!customer?.id) return NextResponse.redirect(redirectUrl)

    const token = await issueTokenForCustomer(customer.id)
    if (!token) return NextResponse.redirect(redirectUrl)

    const url = `${base}/api/auth/recover?token=${encodeURIComponent(token)}`
    await sendEmail({
      to: email,
      subject: "ClawGuru – Dein Magic Link",
      html: buildMagicLinkHtml(url, 60), // 60 minutes validity
    })
  } catch (err) {
    console.error("[recovery/request] Failed to process recovery request:", err)
    // Still redirect to success page to avoid leaking account existence
  }

  return NextResponse.redirect(redirectUrl)
}
