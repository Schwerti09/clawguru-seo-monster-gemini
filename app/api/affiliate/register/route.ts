/**
 * POST /api/affiliate/register
 *
 * Registers a new affiliate by storing their Stripe Connect account ID in a
 * Stripe Customer's metadata under META_AFF_CONNECT_ID.
 *
 * Body: { code: string; connectAccountId: string; adminSecret: string }
 *
 * This is an admin-only endpoint protected by AFFILIATE_ADMIN_SECRET.
 * In a full implementation you would use Stripe Connect OAuth onboarding
 * instead of manually passing a connectAccountId.
 */

import { NextRequest, NextResponse } from "next/server"
import { isValidAffCode, META_AFF_CODE, META_AFF_CONNECT_ID } from "@/lib/affiliate"
import { stripe } from "@/lib/stripe"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  // Admin secret guard
  const body = await req.json().catch(() => ({}))
  const adminSecret: unknown = body?.adminSecret
  const expected = process.env.AFFILIATE_ADMIN_SECRET
  if (!expected || adminSecret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const code: unknown = body?.code
  const connectAccountId: unknown = body?.connectAccountId

  if (!isValidAffCode(code)) {
    return NextResponse.json({ error: "Invalid affiliate code" }, { status: 400 })
  }
  if (typeof connectAccountId !== "string" || !connectAccountId.startsWith("acct_")) {
    return NextResponse.json(
      { error: "connectAccountId must be a valid Stripe Connect account ID (acct_…)" },
      { status: 400 }
    )
  }

  // We represent affiliates as Stripe Customers so their metadata is
  // queryable and their payouts flow through Stripe Connect.
  // Look up existing or create new affiliate customer record.
  const existing = await stripe.customers.search({
    query: `metadata["${META_AFF_CODE}"]:"${code}"`,
    limit: 1
  })

  if (existing.data.length > 0) {
    const customer = existing.data[0]
    await stripe.customers.update(customer.id, {
      metadata: { [META_AFF_CONNECT_ID]: connectAccountId }
    })
    return NextResponse.json({ ok: true, customerId: customer.id, code, updated: true })
  }

  // Create a new "affiliate" customer record in Stripe
  const customer = await stripe.customers.create({
    description: `Affiliate partner: ${code}`,
    metadata: {
      [META_AFF_CODE]: code,
      [META_AFF_CONNECT_ID]: connectAccountId,
      affiliate: "true"
    }
  })

  return NextResponse.json({ ok: true, customerId: customer.id, code, created: true })
}
