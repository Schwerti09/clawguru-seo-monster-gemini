import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminCookieName, verifyAdminToken } from "@/lib/admin-auth"
import { dbQuery } from "@/lib/db"
import { getStripe } from "@/lib/stripe"
import { getGeoSitemapRuntimeLimits } from "@/lib/geo-runtime-config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

type Payment = {
  created: number
  amount: number
  currency: string
  description?: string | null
}

async function safeQuery<T extends Record<string, any> = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!process.env.DATABASE_URL) return []
  try {
    const res = await dbQuery<T>(sql, params)
    return res.rows
  } catch {
    return []
  }
}

async function getStripeOverview() {
  if (!process.env.STRIPE_SECRET_KEY) return null
  try {
    const stripe = getStripe()
    const now = Math.floor(Date.now() / 1000)
    const since24h = now - 24 * 60 * 60
    const since7d = now - 7 * 24 * 60 * 60

    const [charges24hRes, charges7dRes, activeSubsRes, trialingSubsRes] = await Promise.all([
      stripe.charges.list({ limit: 100, created: { gte: since24h } }),
      stripe.charges.list({ limit: 100, created: { gte: since7d } }),
      stripe.subscriptions.list({ status: "active", limit: 100 }),
      stripe.subscriptions.list({ status: "trialing", limit: 100 }),
    ])

    const charges24h = charges24hRes.data.reduce((sum, c) => sum + (c.paid ? c.amount : 0), 0)
    const charges7d = charges7dRes.data.reduce((sum, c) => sum + (c.paid ? c.amount : 0), 0)
    const chargeCount7d = charges7dRes.data.filter((c) => c.paid).length
    const lastPayments: Payment[] = charges7dRes.data
      .filter((c) => c.paid)
      .slice(0, 8)
      .map((c) => ({
        created: c.created,
        amount: c.amount,
        currency: c.currency,
        description: c.description,
      }))

    return {
      currency: "eur",
      charges7d,
      charges24h,
      chargeCount7d,
      activeSubs: activeSubsRes.data.length,
      trialingSubs: trialingSubsRes.data.length,
      lastPayments,
    }
  } catch {
    return null
  }
}

function dayRange(daysBack: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysBack)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export async function GET() {
  const token = (await cookies()).get(adminCookieName())?.value || ""
  const session = token ? verifyAdminToken(token) : null
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  const env = {
    hasStripe: Boolean(process.env.STRIPE_SECRET_KEY),
    hasGemini: Boolean(process.env.GEMINI_API_KEY),
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasAdmin: Boolean(process.env.ADMIN_PASSWORD || process.env.ADMIN_SESSION_SECRET),
    hasWebhook: Boolean(process.env.DISCORD_WEBHOOK_URL || process.env.SENTINEL_NOTIFY_URL),
    hasEmail: Boolean(process.env.RESEND_API_KEY || process.env.EMAIL_FROM),
  }

  const [
    stripe,
    execution24hRows,
    execution7dRows,
    execHealthRows,
    nodeRows,
    indexedRows,
    gscLastRunRows,
    geminiTodayRows,
    gemini7dRows,
    geminiMonthRows,
    geminiReqRows,
    affiliateRows,
    geoRolloutRows,
    geoCanaryRows,
    geoStableRows,
    runtimeLimits,
  ] = await Promise.all([
    getStripeOverview(),
    safeQuery<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM runbook_executions WHERE created_at >= NOW() - INTERVAL '24 hours'`
    ),
    safeQuery<{ day: string; count: string }>(
      `SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::text AS count
       FROM runbook_executions
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY 1
       ORDER BY 1 ASC`
    ),
    safeQuery<{ success: string; total: string }>(
      `SELECT
          COUNT(*) FILTER (WHERE status IN ('completed'))::text AS success,
          COUNT(*) FILTER (WHERE status IN ('completed','failed'))::text AS total
       FROM runbook_executions
       WHERE created_at >= NOW() - INTERVAL '24 hours'`
    ),
    safeQuery<{ active: string; total: string }>(
      `SELECT
          COUNT(*) FILTER (WHERE status = 'active')::text AS active,
          COUNT(*)::text AS total
       FROM mycelium_nodes`
    ),
    safeQuery<{ indexed: string }>(
      `SELECT COUNT(DISTINCT query)::text AS indexed
       FROM gsc_metrics
       WHERE date >= CURRENT_DATE - INTERVAL '30 days'
         AND impressions > 0`
    ),
    safeQuery<{ last_run: string }>(
      `SELECT MAX(date)::text AS last_run FROM gsc_metrics`
    ),
    safeQuery<{ input_tokens: string; output_tokens: string }>(
      `SELECT
          COALESCE(SUM(input_tokens),0)::text AS input_tokens,
          COALESCE(SUM(output_tokens),0)::text AS output_tokens
       FROM gemini_usage
       WHERE date = CURRENT_DATE`
    ),
    safeQuery<{ burn: string }>(
      `SELECT COALESCE(AVG(input_tokens + output_tokens),0)::text AS burn
       FROM gemini_usage
       WHERE date >= CURRENT_DATE - INTERVAL '7 days'`
    ),
    safeQuery<{ total: string; limit: string }>(
      `SELECT
        COALESCE(SUM(input_tokens + output_tokens),0)::text AS total,
        COALESCE(MAX(monthly_limit_tokens), 0)::text AS limit
       FROM gemini_usage
       WHERE DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)`
    ),
    safeQuery<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM gemini_requests WHERE created_at >= NOW() - INTERVAL '24 hours'`
    ),
    safeQuery<{ active_partners: string }>(
      `SELECT COUNT(*)::text AS active_partners
       FROM users
       WHERE affiliate_code IS NOT NULL
         AND is_active = true`
    ),
    safeQuery<{ rollout_stage: "canary" | "stable"; count: string }>(
      `SELECT rollout_stage, COUNT(*)::text AS count
       FROM geo_cities
       WHERE is_active = true
       GROUP BY rollout_stage`
    ),
    safeQuery<{ slug: string; priority: number }>(
      `SELECT slug, priority
       FROM geo_cities
       WHERE is_active = true AND rollout_stage = 'canary'
       ORDER BY priority DESC, population DESC
       LIMIT 5`
    ),
    safeQuery<{ slug: string; priority: number }>(
      `SELECT slug, priority
       FROM geo_cities
       WHERE is_active = true AND rollout_stage = 'stable'
       ORDER BY priority DESC, population DESC
       LIMIT 5`
    ),
    getGeoSitemapRuntimeLimits().catch(() => null),
  ])

  const executionsToday = parseInt(execution24hRows[0]?.count || "0", 10)
  const trendMap = new Map(execution7dRows.map((r) => [r.day, parseInt(r.count || "0", 10)]))
  const trend7d = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    return trendMap.get(key) || 0
  })

  const success = parseInt(execHealthRows[0]?.success || "0", 10)
  const total = parseInt(execHealthRows[0]?.total || "0", 10)
  const myceliumHealth = total > 0 ? Math.round((success / total) * 1000) / 10 : 100

  const indexedPages = parseInt(indexedRows[0]?.indexed || "0", 10)
  const targetPages = Math.max(1, parseInt(process.env.ADMIN_TARGET_INDEX_PAGES || "100000", 10) || 100000)
  const progressPct = Math.min(100, Math.round((indexedPages / targetPages) * 100))
  const lastDailyIndexRun = gscLastRunRows[0]?.last_run ? new Date(gscLastRunRows[0].last_run).toISOString() : null

  const inputToday = parseInt(geminiTodayRows[0]?.input_tokens || "0", 10)
  const outputToday = parseInt(geminiTodayRows[0]?.output_tokens || "0", 10)
  const monthlyUsed = parseInt(geminiMonthRows[0]?.total || "0", 10)
  const monthlyLimit = Math.max(0, parseInt(geminiMonthRows[0]?.limit || "0", 10))

  const geoRollout = geoRolloutRows.reduce(
    (acc, row) => {
      const count = parseInt(row.count || "0", 10)
      if (row.rollout_stage === "canary") acc.activeCanary = count
      if (row.rollout_stage === "stable") acc.activeStable = count
      return acc
    },
    { activeCanary: 0, activeStable: 0 }
  )

  return NextResponse.json({
    now: new Date().toISOString(),
    siteUrl,
    env,
    stripe: stripe || undefined,
    geminiUsage: {
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      hasKey: env.hasGemini,
      endpoint: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta",
      tokensInputToday: inputToday,
      tokensOutputToday: outputToday,
      tokens7dBurnRate: Math.round(parseFloat(gemini7dRows[0]?.burn || "0")),
      monthlyTokensUsed: monthlyUsed,
      monthlyTokensLimit: monthlyLimit > 0 ? monthlyLimit : undefined,
      requestsToday: parseInt(geminiReqRows[0]?.count || "0", 10),
    },
    indexStatus: {
      indexedPages,
      targetPages,
      progressPct,
      lastDailyIndexRun,
    },
    runbookStats: {
      executedLast24h: executionsToday,
      trend7d,
      myceliumHealth,
      activeNodes: parseInt(nodeRows[0]?.active || "0", 10),
      totalNodes: parseInt(nodeRows[0]?.total || "0", 10),
    },
    affiliateStats: {
      activePartners: parseInt(affiliateRows[0]?.active_partners || "0", 10),
      pendingPayoutEur: 0,
    },
    geoStatus: {
      activeStable: geoRollout.activeStable,
      activeCanary: geoRollout.activeCanary,
      topCanary: geoCanaryRows,
      topStable: geoStableRows,
      sitemapRuntimeLimits: runtimeLimits || undefined,
    },
  })
}