/**
 * GET /api/affiliate/stats?code=<AFF_CODE>
 *
 * Returns affiliate performance metrics sourced directly from Stripe:
 *  - clicks   : not tracked server-side (incremented by the client tracker)
 *  - sales    : number of Stripe Customers that carry this affiliate code
 *  - revenue  : total invoices paid by those customers
 *  - commission_paid     : sum of completed Stripe Transfers for this code
 *  - commission_pending  : sum of transfers still within the 30-day hold window
 *
 * Authentication: requires the `x-aff-secret` header to match
 * the env var AFFILIATE_DASHBOARD_SECRET (or AFFILIATE_SECRET_<CODE>).
 * In production you would replace this with proper auth (e.g. NextAuth).
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { isValidAffCode, META_AFF_CODE, META_AFF_HOLD_UNTIL } from "@/lib/affiliate"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code = searchParams.get("code")

  if (!isValidAffCode(code)) {
    return NextResponse.json({ error: "Invalid or missing affiliate code" }, { status: 400 })
  }

  // Simple secret-based auth (replace with proper session auth in production)
  const secret = req.headers.get("x-aff-secret")
  const expectedSecret =
    process.env[`AFFILIATE_SECRET_${code.toUpperCase()}`] ||
    process.env.AFFILIATE_DASHBOARD_SECRET
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // ── Count customers linked to this affiliate code ──────────────────────
    // Stripe doesn't support metadata search natively on free plans, so we
    // use the search API (available on paid Stripe accounts).
    let sales = 0
    let totalRevenueCents = 0
    let lastCustomerId: string | undefined = undefined
    let hasMoreCustomers = true

    while (hasMoreCustomers) {
      const customers = await stripe.customers.search({
        query: `metadata["${META_AFF_CODE}"]:"${code}"`,
        limit: 100,
        ...(lastCustomerId ? { page: lastCustomerId } : {})
      })

      for (const customer of customers.data) {
        if (customer.deleted) continue
        sales++

        // Sum paid invoices for this customer – paginate to capture all invoices
        let invoiceCursor: string | undefined = undefined
        let hasMoreInvoices = true
        while (hasMoreInvoices) {
          const invoices: Awaited<ReturnType<typeof stripe.invoices.list>> = await stripe.invoices.list({
            customer: customer.id,
            status: "paid",
            limit: 100,
            ...(invoiceCursor ? { starting_after: invoiceCursor } : {})
          })
          for (const inv of invoices.data) {
            totalRevenueCents += inv.amount_paid || 0
          }
          if (!invoices.has_more) {
            hasMoreInvoices = false
          } else {
            invoiceCursor = invoices.data[invoices.data.length - 1].id
          }
        }
      }

      if (!customers.has_more) {
        hasMoreCustomers = false
      } else {
        // Stripe search pagination uses the last returned object's ID as the page cursor
        lastCustomerId = customers.data[customers.data.length - 1]?.id
      }
    }

    // ── Sum transfers (commissions) for this affiliate code ────────────────
    let commissionPaidCents = 0
    let commissionPendingCents = 0
    const nowSec = Math.floor(Date.now() / 1000)

    let transferCursor: string | undefined = undefined
    let hasMoreTransfers = true
    // eslint-disable-next-line no-constant-condition
    while (hasMoreTransfers) {
      const transfers: Awaited<ReturnType<typeof stripe.transfers.list>> = await stripe.transfers.list({
        limit: 100,
        ...(transferCursor ? { starting_after: transferCursor } : {})
      })

      for (const t of transfers.data) {
        if (t.metadata?.[META_AFF_CODE] !== code) continue
        const holdUntil = Number(t.metadata?.[META_AFF_HOLD_UNTIL] || 0)
        if (holdUntil > nowSec) {
          commissionPendingCents += t.amount
        } else {
          commissionPaidCents += t.amount
        }
      }

      if (!transfers.has_more) {
        hasMoreTransfers = false
        break
      }
      transferCursor = transfers.data[transfers.data.length - 1].id
    }

    const currency = "eur"
    return NextResponse.json({
      code,
      sales,
      total_revenue_cents: totalRevenueCents,
      commission_paid_cents: commissionPaidCents,
      commission_pending_cents: commissionPendingCents,
      currency,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    )
  }
}
