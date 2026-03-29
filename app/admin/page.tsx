import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminDashboardClient } from '@/components/cockpit/AdminDashboardClient'
import { getUserTier } from '@/lib/tier-access'
import { Database } from '@/types/database'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function AdminPage() {
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tier = await getUserTier(user.id)
  
  // Only Enterprise users can access admin
  if (tier !== 'enterprise') {
    redirect('/dashboard')
  }

  // Real admin data fetch
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
      user={user}
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
}

async function fetchTotalUsers(): Promise<number> {
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
  
  return count || 0
}

async function fetchActiveUsers(): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  
  const { count } = await supabase
    .from('user_metrics')
    .select('*', { count: 'exact', head: true })
    .gte('last_active', thirtyDaysAgo)
  
  return count || 0
}

async function fetchRevenueToday(): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  
  const { data } = await supabase
    .from('payments')
    .select('amount')
    .gte('created_at', today)
    .eq('status', 'completed')
  
  return data?.reduce((sum, payment) => sum + payment.amount, 0) || 0
}

async function fetchRevenueMonth(): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  
  const { data } = await supabase
    .from('payments')
    .select('amount')
    .gte('created_at', thirtyDaysAgo)
    .eq('status', 'completed')
  
  return data?.reduce((sum, payment) => sum + payment.amount, 0) || 0
}

async function fetchTotalExecutions(): Promise<number> {
  const { count } = await supabase
    .from('runbook_executions')
    .select('*', { count: 'exact', head: true })
  
  return count || 0
}

async function fetchSystemHealth(): Promise<{
  cpu: number
  memory: number
  storage: number
  uptime: number
}> {
  // Mock system health - in production would fetch from monitoring
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
  // Mock Gemini usage - in production would fetch from Google Cloud
  return {
    tokensUsed: 2450000,
    requestsToday: 1247,
    costToday: 12.34
  }
}
