import type { Metadata } from "next"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserDashboardClient } from '@/components/cockpit/UserDashboardClient'
import { getUserTierFromPlan } from '@/lib/tier-access'
import { verifyAccessToken } from '@/lib/access-token'
import { verifySessionToken, USER_SESSION_COOKIE } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { dbQuery } from '@/lib/db'
import type { QueryResultRow } from 'pg'
import type { DashboardData, DashboardPayment } from '@/types/dashboard'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: "Dashboard | ClawGuru",
  description: "Your ClawGuru dashboard — monitor security threats, runbook executions, and your subscription.",
}

/* ── Empty data fallback ── */
function emptyData(): DashboardData {
  return {
    clawScore: 0,
    activeThreats: 0,
    executionsToday: 0,
    myceliumNodes: 0,
    successRate: 0,
    recentExecutions: [],
    threats: [],
    nodes: [],
    payments: [],
    subscription: null,
    totalExecutions: 0,
    lastRunAt: null,
    totalSpent: 0,
    nextBillingDate: null
  }
}

/* ── Safe DB query helper (tables may not exist yet) ── */
async function safeQuery<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    if (!process.env.DATABASE_URL) return []
    const result = await dbQuery<T>(sql, params)
    return result.rows
  } catch {
    return []
  }
}

/* ── Fetch Stripe payments for a customer ── */
async function fetchStripePayments(customerId: string): Promise<{
  payments: DashboardPayment[]
  totalSpent: number
  subscriptionTier: string | null
  subscriptionId: string | null
  nextBillingDate: string | null
}> {
  const payments: DashboardPayment[] = []
  let totalSpent = 0
  let subscriptionTier: string | null = null
  let subscriptionId: string | null = null
  let nextBillingDate: string | null = null

  try {
    if (!process.env.STRIPE_SECRET_KEY) return { payments, totalSpent, subscriptionTier, subscriptionId, nextBillingDate }

    // Fetch recent charges
    const charges = await stripe.charges.list({ customer: customerId, limit: 20 })
    for (const ch of charges.data) {
      payments.push({
        id: ch.id,
        amount: ch.amount / 100,
        currency: ch.currency,
        status: ch.status === 'succeeded' ? 'completed' : ch.status === 'failed' ? 'failed' : 'pending',
        created_at: new Date(ch.created * 1000).toISOString()
      })
      if (ch.status === 'succeeded') totalSpent += ch.amount / 100
    }

    // Fetch active subscription
    const subs = await stripe.subscriptions.list({ customer: customerId, status: 'active', limit: 1 })
    if (subs.data.length > 0) {
      const sub = subs.data[0]
      subscriptionId = sub.id
      nextBillingDate = new Date(sub.current_period_end * 1000).toISOString()
      // Derive tier from price metadata or product
      const priceId = sub.items.data[0]?.price?.id || ''
      if (priceId === process.env.STRIPE_PRICE_TEAM) subscriptionTier = 'team'
      else if (priceId === process.env.STRIPE_PRICE_PRO) subscriptionTier = 'pro'
      else if (priceId === process.env.STRIPE_PRICE_DAYPASS) subscriptionTier = 'daypass'
      else subscriptionTier = 'pro'
    }
  } catch (err) {
    console.error('[dashboard] Stripe fetch error:', err)
  }

  return { payments, totalSpent, subscriptionTier, subscriptionId, nextBillingDate }
}

export default async function DashboardPage() {
  const jar = await cookies()

  // ── Auth: check claw_access token first, then session cookie ──
  const accessToken = jar.get('claw_access')?.value
  const sessionToken = jar.get(USER_SESSION_COOKIE)?.value

  const access = accessToken ? verifyAccessToken(accessToken) : null
  const session = sessionToken ? verifySessionToken(sessionToken) : null

  if (!access && !session) {
    redirect('/account')
  }

  // Build user object from available tokens
  const email = session?.email || access?.customerId || 'user'
  const plan = access?.plan || null
  const customerId = access?.customerId || null
  const tier = getUserTierFromPlan(plan)
  const user = { id: customerId || email, email }

  // ── Fetch local DB data (tables created by migration, gracefully empty if missing) ──
  const today = new Date().toISOString().split('T')[0]

  const [executions, threats, nodes] = await Promise.all([
    safeQuery(`SELECT id, runbook_id, status, started_at, completed_at, result, created_at
               FROM runbook_executions WHERE customer_id = $1
               ORDER BY created_at DESC LIMIT 50`, [user.id]),
    safeQuery(`SELECT id, title, description, severity, status, created_at
               FROM threats ORDER BY created_at DESC LIMIT 50`),
    safeQuery(`SELECT id, type, status, connections, metadata
               FROM mycelium_nodes`)
  ])

  // ── Fetch Stripe data (payments, subscription) ──
  const stripeData = customerId
    ? await fetchStripePayments(customerId)
    : { payments: [], totalSpent: 0, subscriptionTier: null, subscriptionId: null, nextBillingDate: null }

  // ── Derived metrics ──
  const now30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentExec = executions.filter((e: any) => new Date(e.created_at) >= now30d)
  const activeThreats = threats.filter((t: any) => t.status === 'active').length
  const activeNodes = nodes.filter((n: any) => n.status === 'active').length
  const execToday = executions.filter((e: any) => e.created_at?.startsWith(today)).length

  // ClawScore
  let clawScore = 500
  clawScore += recentExec.length * 10
  clawScore += recentExec.filter((e: any) => e.status === 'completed').length * 5
  clawScore += threats.filter((t: any) => t.severity === 'high' || t.severity === 'critical').length * 25
  clawScore = Math.min(clawScore, 1000)

  // Success rate
  const finished = recentExec.filter((e: any) => e.status === 'completed' || e.status === 'failed')
  const successRate = finished.length > 0
    ? Math.round(finished.filter((e: any) => e.status === 'completed').length / finished.length * 100)
    : 0

  const effectiveTier = stripeData.subscriptionTier || plan || null

  const initialData: DashboardData = {
    clawScore,
    activeThreats,
    executionsToday: execToday,
    myceliumNodes: activeNodes,
    successRate,
    recentExecutions: executions.map((e: any) => ({
      id: e.id,
      runbook_id: e.runbook_id || '',
      status: e.status,
      started_at: e.started_at,
      completed_at: e.completed_at || null,
      result: e.result || null,
      created_at: e.created_at
    })),
    threats: threats.map((t: any) => ({
      id: t.id,
      title: t.title || '',
      description: t.description || '',
      severity: t.severity || 'low',
      status: t.status || 'active',
      created_at: t.created_at
    })),
    nodes: nodes.map((n: any) => ({
      id: n.id,
      type: n.type || 'runbook',
      status: n.status || 'inactive',
      connections: n.connections || [],
      metadata: n.metadata || {}
    })),
    payments: stripeData.payments,
    subscription: effectiveTier ? {
      tier: effectiveTier,
      status: 'active',
      stripe_subscription_id: stripeData.subscriptionId,
      expires_at: stripeData.nextBillingDate,
      created_at: new Date().toISOString()
    } : null,
    totalExecutions: executions.length,
    lastRunAt: executions.length > 0 ? executions[0].created_at : null,
    totalSpent: stripeData.totalSpent,
    nextBillingDate: stripeData.nextBillingDate
  }

  return <UserDashboardClient user={user} tier={getUserTierFromPlan(effectiveTier)} initialData={initialData} />
}
