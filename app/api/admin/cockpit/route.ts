// File: app/api/admin/cockpit/route.ts
// Management Cockpit API – serves Revenue, SEO Index, Affiliate & System data.
// Admin-only (requires valid session cookie).

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { stripe } from "@/lib/stripe"
import { totalSitemapUrls } from "@/lib/pseo"
import { AFFILIATE_REDIRECTS } from "@/lib/constants"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 })
}

// ---------------------------------------------------------------------------
// Stripe revenue helpers
// ---------------------------------------------------------------------------
async function fetchRevenue() {
  // Start of today (UTC midnight)
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)
  const todayTs = Math.floor(todayStart.getTime() / 1000)

  // Start of this month (UTC)
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)
  const monthTs = Math.floor(monthStart.getTime() / 1000)

  const [cToday, cMonth, subs] = await Promise.all([
    stripe.charges.list({ limit: 100, created: { gte: todayTs } }),
    stripe.charges.list({ limit: 100, created: { gte: monthTs } }),
    stripe.subscriptions.list({ limit: 100, status: "active" }),
  ])

  const succeeded = (c: { paid: boolean | null; status: string | null }) =>
    c.paid && c.status === "succeeded"

  const sum = (arr: Array<{ paid: boolean | null; status: string | null; amount: number | null }>) =>
    arr.reduce((acc, c) => (succeeded(c) ? acc + (c.amount ?? 0) : acc), 0)

  const currency = (cMonth.data[0]?.currency ?? cToday.data[0]?.currency ?? "eur") as string

  // Last 5 transactions with country + affiliate-id from charge metadata
  const last5 = cMonth.data
    .filter(succeeded)
    .slice(0, 5)
    .map((c) => ({
      created: c.created,
      amount: c.amount ?? 0,
      currency: c.currency,
      country: (c.billing_details?.address?.country ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (c.payment_method_details as any)?.card?.country ??
        null) as string | null,
      affiliateId: (c.metadata?.affiliate_id ?? c.metadata?.utm_campaign ?? null) as string | null,
    }))

  return {
    currency,
    salesToday: sum(cToday.data),
    salesThisMonth: sum(cMonth.data),
    activeSubs: subs.data.length,
    lastTransactions: last5,
  }
}

// ---------------------------------------------------------------------------
// SEO index tracker
// ---------------------------------------------------------------------------
// Module-level in-memory store for last successful daily-index cron run.
let _lastDailyIndexRun: string | null = null

export function recordDailyIndexRun() {
  _lastDailyIndexRun = new Date().toISOString()
}

function seoIndexData() {
  const total = totalSitemapUrls()
  const target = 100_000
  return {
    indexedPages: total,
    targetPages: target,
    progressPct: Math.min(100, Math.round((total / target) * 100)),
    lastDailyIndexRun: _lastDailyIndexRun,
  }
}

// ---------------------------------------------------------------------------
// Affiliate performance (top 5 partners from constants)
// ---------------------------------------------------------------------------
function affiliateData() {
  const partners = Object.entries(AFFILIATE_REDIRECTS).map(([slug]) => ({
    id: slug,
    clicks: 0,
    sales: 0,
  }))
  return { partners: partners.slice(0, 5) }
}

// ---------------------------------------------------------------------------
// System sentinel
// ---------------------------------------------------------------------------
async function checkGeminiStatus(): Promise<"online" | "offline"> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return "offline"
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
      { cache: "no-store", signal: AbortSignal.timeout(5_000) }
    )
    return res.ok ? "online" : "offline"
  } catch {
    return "offline"
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

  const [geminiStatus, stripeData] = await Promise.all([
    checkGeminiStatus(),
    hasStripe
      ? fetchRevenue().catch(() => null)
      : Promise.resolve(null),
  ])

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    revenue: stripeData,
    seo: seoIndexData(),
    affiliates: affiliateData(),
    system: {
      geminiStatus,
      maintenanceMode: process.env.MAINTENANCE_MODE === "true",
      hasNetlifyToken: Boolean(process.env.NETLIFY_AUTH_TOKEN && process.env.NETLIFY_SITE_ID),
    },
  })
}
