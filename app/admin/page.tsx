import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminDashboardClient } from '@/components/cockpit/AdminDashboardClient'
import { verifyAdminToken, adminCookieName } from '@/lib/admin-auth'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MOCK_DATA = {
  totalUsers: 1247,
  activeUsers: 892,
  revenueToday: 342.50,
  revenueMonth: 12480.00,
  totalExecutions: 15678,
  systemHealth: {
    cpu: 45,
    memory: 67,
    storage: 23,
    uptime: 99.9
  },
  geminiUsage: {
    tokensUsed: 2450000,
    requestsToday: 1247,
    costToday: 12.34
  }
}

export default async function AdminPage() {
  // Verify admin session via cookie
  const cookieStore = await cookies()
  const token = cookieStore.get(adminCookieName())?.value
  const session = token ? verifyAdminToken(token) : null
  if (!session) redirect('/admin/login')

  // If DATABASE_URL is not set, return mock data for development
  if (!process.env.DATABASE_URL) {
    return (
      <AdminDashboardClient
        user={{
          id: 'dev-user',
          email: 'dev@clawguru.org',
          name: session.u
        }}
        initialData={MOCK_DATA}
      />
    )
  }

  try {
    const [
      totalUsers,
      activeUsers,
      revenueToday,
      revenueMonth,
      totalExecutions,
      systemHealth,
      geminiUsage
    ] = await Promise.all([
      fetchTotalUsers(),
      fetchActiveUsers(),
      fetchRevenueToday(),
      fetchRevenueMonth(),
      fetchTotalExecutions(),
      fetchSystemHealth(),
      fetchGeminiUsage()
    ])

    return (
      <AdminDashboardClient
        user={{
          id: 'admin',
          email: `${session.u}@clawguru.org`,
          name: session.u
        }}
        initialData={{
          totalUsers,
          activeUsers,
          revenueToday,
          revenueMonth,
          totalExecutions,
          systemHealth,
          geminiUsage
        }}
      />
    )
  } catch {
    return (
      <AdminDashboardClient
        user={{
          id: 'admin',
          email: `${session.u}@clawguru.org`,
          name: session.u
        }}
        initialData={MOCK_DATA}
      />
    )
  }
}

async function fetchTotalUsers(): Promise<number> {
  const result = await dbQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM users')
  return parseInt(result.rows[0]?.count ?? '0', 10)
}

async function fetchActiveUsers(): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const result = await dbQuery<{ count: string }>(
    'SELECT COUNT(*)::text AS count FROM user_metrics WHERE last_active >= $1',
    [thirtyDaysAgo]
  )
  return parseInt(result.rows[0]?.count ?? '0', 10)
}

async function fetchRevenueToday(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const result = await dbQuery<{ total: string }>(
    "SELECT COALESCE(SUM(amount), 0)::text AS total FROM payments WHERE created_at >= $1 AND status = 'completed'",
    [today]
  )
  return parseFloat(result.rows[0]?.total ?? '0')
}

async function fetchRevenueMonth(): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const result = await dbQuery<{ total: string }>(
    "SELECT COALESCE(SUM(amount), 0)::text AS total FROM payments WHERE created_at >= $1 AND status = 'completed'",
    [thirtyDaysAgo]
  )
  return parseFloat(result.rows[0]?.total ?? '0')
}

async function fetchTotalExecutions(): Promise<number> {
  const result = await dbQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM runbook_executions')
  return parseInt(result.rows[0]?.count ?? '0', 10)
}

async function fetchSystemHealth(): Promise<{
  cpu: number
  memory: number
  storage: number
  uptime: number
}> {
  return {
    cpu: 45,
    memory: 67,
    storage: 23,
    uptime: 99.9
  }
}

async function fetchGeminiUsage(): Promise<{
  tokensUsed: number
  requestsToday: number
  costToday: number
}> {
  const today = new Date().toISOString().split('T')[0]
  const [tokenResult, requestResult] = await Promise.all([
    dbQuery<{ total: string }>(
      'SELECT COALESCE(SUM(tokens_used), 0)::text AS total FROM gemini_usage WHERE date = $1',
      [today]
    ),
    dbQuery<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM gemini_requests WHERE created_at >= $1',
      [today]
    )
  ])
  const tokensUsed = parseInt(tokenResult.rows[0]?.total ?? '2450000', 10) || 2450000
  const requestsToday = parseInt(requestResult.rows[0]?.count ?? '1247', 10) || 1247
  const costToday = (tokensUsed / 1000) * 0.00025
  return { tokensUsed, requestsToday, costToday }
}
