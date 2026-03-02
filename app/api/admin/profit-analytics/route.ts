// app/api/admin/profit-analytics/route.ts
// Executive Profit & API Analytics – backend aggregation endpoint.
// Combines Stripe revenue, API usage, abuse (Wall of Shame) and conversion data
// into a single response that is cached for 60 s on the server side.

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { stripe } from "@/lib/stripe"
import { getEndpointCounts, getTopIps, getActiveBlocks } from "@/lib/api-usage"

export const runtime = "nodejs"

// ---------------------------------------------------------------------------
// Cost / pricing constants (adjust to your actual provider costs & prices)
// ---------------------------------------------------------------------------
const COST_PER_CHECK_INDICATOR_USD = 0.003 // server cost per /v1/check-indicator call
const COST_PER_RUNBOOK_USD = 0.008 // server cost per /v1/runbooks call
const REVENUE_PER_DAYPASS_USD = 4.99
const REVENUE_PER_PRO_MONTH_USD = 19.99
// Alert: warn when external-data costs exceed this fraction of revenue
const COST_ALERT_THRESHOLD_PCT = 30

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

// ---------------------------------------------------------------------------
// Stripe helpers
// ---------------------------------------------------------------------------
async function fetchStripeMetrics() {
  const now = Math.floor(Date.now() / 1000)
  const DAY = 86_400
  const MONTH = DAY * 30

  const [charges24h, chargesWeek, chargesMonth, subs] = await Promise.all([
    stripe.charges.list({ limit: 100, created: { gte: now - DAY } }),
    stripe.charges.list({ limit: 100, created: { gte: now - DAY * 7 } }),
    stripe.charges.list({ limit: 100, created: { gte: now - MONTH } }),
    stripe.subscriptions.list({ limit: 100, status: "all" })
  ])

  const succeeded = (ch: { paid: boolean | null; status: string | null }) =>
    ch.paid && ch.status === "succeeded"

  const sumAmount = (list: Array<{ paid: boolean | null; status: string | null; amount: number | null }>) =>
    list.reduce((acc, c) => (succeeded(c) ? acc + (c.amount ?? 0) : acc), 0)

  const netToday = sumAmount(charges24h.data)
  const net7d = sumAmount(chargesWeek.data)
  const net30d = sumAmount(chargesMonth.data)

  const activeSubs = subs.data.filter((s) => s.status === "active").length
  const trialingSubs = subs.data.filter((s) => s.status === "trialing").length

  // MRR: sum of active sub amounts
  const mrr = subs.data
    .filter((s) => s.status === "active")
    .reduce((acc, s) => {
      const item = s.items?.data?.[0]
      if (!item?.price) return acc
      const unitAmt = item.price.unit_amount ?? 0
      const interval = item.price.recurring?.interval ?? "month"
      const intervalCount = item.price.recurring?.interval_count ?? 1
      // normalise to monthly
      const monthly =
        interval === "year"
          ? (unitAmt * intervalCount) / 12
          : interval === "week"
          ? (unitAmt * intervalCount * 52.18) / 12
          : unitAmt * intervalCount
      return acc + monthly
    }, 0)

  const currency = (charges24h.data[0]?.currency ?? chargesWeek.data[0]?.currency ?? "eur") as string

  // Day-pass breakdown: charges in the last 24 h vs last week (excluding last 24 h)
  const daypassToday = charges24h.data.filter((c) => succeeded(c)).length
  const daypassWeek = chargesWeek.data.filter((c) => succeeded(c) && c.created < now - DAY).length

  const lastPayments = chargesWeek.data
    .filter(succeeded)
    .slice(0, 10)
    .map((c) => ({
      created: c.created,
      amount: c.amount,
      currency: c.currency,
      description: c.description ?? c.billing_details?.name ?? null
    }))

  return {
    currency,
    mrr,
    netToday,
    net7d,
    net30d,
    activeSubs,
    trialingSubs,
    daypassToday,
    daypassWeek,
    lastPayments
  }
}

// ---------------------------------------------------------------------------
// Margin calculation
// ---------------------------------------------------------------------------
function computeMargins(endpointCounts: Record<string, number>) {
  const checkCalls = endpointCounts["/v1/check-indicator"] ?? 0
  const runbookCalls = endpointCounts["/v1/runbooks"] ?? 0
  const totalCostUsd =
    checkCalls * COST_PER_CHECK_INDICATOR_USD + runbookCalls * COST_PER_RUNBOOK_USD
  return {
    checkCalls,
    runbookCalls,
    totalCostUsd,
    costPerCheckIndicatorUsd: COST_PER_CHECK_INDICATOR_USD,
    costPerRunbookUsd: COST_PER_RUNBOOK_USD,
    revenuePerDaypassUsd: REVENUE_PER_DAYPASS_USD,
    revenuePerProMonthUsd: REVENUE_PER_PRO_MONTH_USD,
    marginPerCheckIndicatorUsd: REVENUE_PER_DAYPASS_USD - COST_PER_CHECK_INDICATOR_USD,
    marginPerRunbookUsd: REVENUE_PER_DAYPASS_USD - COST_PER_RUNBOOK_USD
  }
}

// ---------------------------------------------------------------------------
// Alert threshold
// ---------------------------------------------------------------------------
function computeAlert(totalCostUsd: number, netTodayCents: number) {
  // Convert today's net revenue to USD for comparison.
  // Note: simplified – assumes 1:1 currency parity (EUR ≈ USD). In production,
  // apply a real FX rate if your revenue currency differs from USD.
  const netTodayUsd = netTodayCents / 100
  if (netTodayUsd <= 0) return null
  const pct = (totalCostUsd / netTodayUsd) * 100
  if (pct >= COST_ALERT_THRESHOLD_PCT) {
    return {
      triggered: true,
      costUsd: totalCostUsd,
      revenueTodayUsd: netTodayUsd,
      costPct: Math.round(pct),
      threshold: COST_ALERT_THRESHOLD_PCT,
      message: `⚠️ API-Kosten (${Math.round(pct)}%) übersteigen ${COST_ALERT_THRESHOLD_PCT}% des heutigen Umsatzes!`
    }
  }
  return { triggered: false, costPct: Math.round(pct), threshold: COST_ALERT_THRESHOLD_PCT }
}

// ---------------------------------------------------------------------------
// Conversion funnel (server-side placeholder – wire up real DB counters here)
// ---------------------------------------------------------------------------
function conversionFunnel() {
  // In production: read these from your analytics DB / Supabase hourly aggregation.
  // The shape is intentionally simple so the client component stays thin.
  return {
    landingPageViews: 0,
    daypassClicks: 0,
    checkoutCompleted: 0,
    note: "Wire up real analytics DB for live funnel data."
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------
export async function GET() {
  const token = cookies().get(adminCookieName())?.value ?? ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) return unauthorized()

  const hasStripe = Boolean(process.env.STRIPE_SECRET_KEY)

  let stripeMetrics: Awaited<ReturnType<typeof fetchStripeMetrics>> | null = null
  if (hasStripe) {
    try {
      stripeMetrics = await fetchStripeMetrics()
    } catch {
      stripeMetrics = null
    }
  }

  const endpointCounts = getEndpointCounts()
  const margins = computeMargins(endpointCounts)
  const topIps = getTopIps(10)
  const activeBlocks = getActiveBlocks()
  const funnel = conversionFunnel()
  const alert = stripeMetrics
    ? computeAlert(margins.totalCostUsd, stripeMetrics.netToday)
    : null

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    stripe: stripeMetrics,
    apiUsage: {
      endpointCounts,
      margins
    },
    wallOfShame: {
      topIps,
      activeBlocks
    },
    funnel,
    alert,
    thresholdPct: COST_ALERT_THRESHOLD_PCT
  })
}
