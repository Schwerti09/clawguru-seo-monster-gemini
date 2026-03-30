import { redirect } from 'next/navigation'
import { UserDashboardClient } from '@/components/cockpit/UserDashboardClient'
import { getUserTier } from '@/lib/tier-access'
import type { DashboardData } from '@/types/dashboard'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/* ── Supabase helper ── */
function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  const { createClient } = require('@supabase/supabase-js')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

/* ── Empty data for new users / dev fallback ── */
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

export default async function DashboardPage() {
  const supabase = getSupabaseClient()

  if (!supabase) {
    // Dev mode – no Supabase configured → empty data, no fakes
    const user = { id: 'dev-user', email: 'dev@clawguru.org' }
    const tier = await getUserTier(user.id)
    return <UserDashboardClient user={user} tier={tier} initialData={emptyData()} />
  }

  // Production: real user from Supabase
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tier = await getUserTier(user.id)
  const uid = user.id
  const now30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const today = new Date().toISOString().split('T')[0]

  // ── Parallel fetch all real data ──
  const [
    execAll, execToday, threatsActive, threatsAll,
    nodesAll, paymentsAll, subscriptionRow
  ] = await Promise.all([
    // Recent executions (last 50)
    supabase
      .from('runbook_executions')
      .select('id, runbook_id, status, started_at, completed_at, result, created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50),
    // Executions today count
    supabase
      .from('runbook_executions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid)
      .gte('created_at', today),
    // Active threats count (24h)
    supabase
      .from('threats')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    // All threats (recent 50 for display)
    supabase
      .from('threats')
      .select('id, title, description, severity, status, created_at')
      .order('created_at', { ascending: false })
      .limit(50),
    // Mycelium nodes
    supabase
      .from('mycelium_nodes')
      .select('id, type, status, connections, metadata, created_at'),
    // Payments
    supabase
      .from('payments')
      .select('id, amount, currency, status, stripe_payment_intent_id, created_at')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20),
    // Subscription
    supabase
      .from('subscriptions')
      .select('tier, status, stripe_subscription_id, expires_at, created_at')
      .eq('user_id', uid)
      .eq('status', 'active')
      .single()
  ])

  const executions: any[] = execAll.data || []
  const threats: any[] = threatsAll.data || []
  const nodes: any[] = nodesAll.data || []
  const payments: any[] = paymentsAll.data || []

  // ── Derived metrics ──
  const activeNodeCount = nodes.filter((n: any) => n.status === 'active').length

  // ClawScore: base 500 + activity bonus
  let clawScore = 500
  const recentExec = executions.filter((e: any) => new Date(e.created_at) >= new Date(now30d))
  clawScore += recentExec.length * 10
  clawScore += recentExec.filter((e: any) => e.status === 'completed').length * 5
  clawScore += threats.filter((t: any) => t.severity === 'high' || t.severity === 'critical').length * 25
  clawScore = Math.min(clawScore, 1000)

  // Success rate
  const completedExec = recentExec.filter((e: any) => e.status === 'completed' || e.status === 'failed')
  const successRate = completedExec.length > 0
    ? Math.round(completedExec.filter((e: any) => e.status === 'completed').length / completedExec.length * 100)
    : 0

  // Total spent
  const totalSpent = payments
    .filter((p: any) => p.status === 'completed')
    .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)

  // Next billing: estimate from subscription
  let nextBillingDate: string | null = null
  if (subscriptionRow.data?.expires_at) {
    nextBillingDate = subscriptionRow.data.expires_at
  }

  const initialData: DashboardData = {
    clawScore,
    activeThreats: threatsActive.count || 0,
    executionsToday: execToday.count || 0,
    myceliumNodes: activeNodeCount,
    successRate,
    recentExecutions: executions.map((e: any) => ({
      id: e.id,
      runbook_id: e.runbook_id,
      status: e.status,
      started_at: e.started_at,
      completed_at: e.completed_at || null,
      result: e.result || null,
      created_at: e.created_at
    })),
    threats: threats.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description || '',
      severity: t.severity,
      status: t.status,
      created_at: t.created_at
    })),
    nodes: nodes.map((n: any) => ({
      id: n.id,
      type: n.type,
      status: n.status,
      connections: n.connections || [],
      metadata: n.metadata || {}
    })),
    payments: payments.map((p: any) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency || 'eur',
      status: p.status,
      created_at: p.created_at
    })),
    subscription: subscriptionRow.data ? {
      tier: subscriptionRow.data.tier,
      status: subscriptionRow.data.status,
      stripe_subscription_id: subscriptionRow.data.stripe_subscription_id || null,
      expires_at: subscriptionRow.data.expires_at || null,
      created_at: subscriptionRow.data.created_at
    } : null,
    totalExecutions: executions.length,
    lastRunAt: executions.length > 0 ? executions[0].created_at : null,
    totalSpent,
    nextBillingDate
  }

  return <UserDashboardClient user={user} tier={tier} initialData={initialData} />
}
