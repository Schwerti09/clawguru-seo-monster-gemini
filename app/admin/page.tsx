import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminDashboardClient } from '@/components/cockpit/AdminDashboardClient'
import { verifyAdminToken, adminCookieName } from '@/lib/admin-auth'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminPage() {
  // Verify admin session via cookie
  const cookieStore = await cookies()
  const token = cookieStore.get(adminCookieName())?.value
  const session = token ? verifyAdminToken(token) : null
  if (!session) redirect('/admin/login')

  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Datenbank nicht konfiguriert</h2>
          <p className="text-gray-400">Bitte DATABASE_URL setzen, um das Admin-Dashboard zu nutzen.</p>
        </div>
      </div>
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
  } catch (err) {
    console.error('Admin dashboard data fetch failed:', err)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">Datenbankfehler</h2>
          <p className="text-gray-400">Die Daten konnten nicht geladen werden. Bitte versuche es erneut.</p>
        </div>
      </div>
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
  const memUsage = process.memoryUsage()
  const memoryPct = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)

  return {
    // CPU: not reliably measurable in a single invocation without a time-interval baseline
    cpu: 0,
    memory: memoryPct,
    // Storage: requires OS-level disk access unavailable in serverless environments
    storage: 0,
    // Uptime in seconds, capped at 100 for progress-bar display (100 = stable, running > 100s)
    uptime: Math.min(100, Math.round(process.uptime())),
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
  const tokensUsed = parseInt(tokenResult.rows[0]?.total ?? '0', 10)
  const requestsToday = parseInt(requestResult.rows[0]?.count ?? '0', 10)
  const costToday = (tokensUsed / 1000) * 0.00025
  return { tokensUsed, requestsToday, costToday }
}
