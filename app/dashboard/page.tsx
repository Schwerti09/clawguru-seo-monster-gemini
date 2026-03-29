import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserDashboardClient } from '@/components/cockpit/UserDashboardClient'
import { getUserTier } from '@/lib/tier-access'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function DashboardPage() {
  // Get Supabase client if available
  const getSupabaseClient = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return null
    }
    // Import dynamically to avoid build errors
    const { createClient } = require('@supabase/supabase-js')
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }

  const supabase = getSupabaseClient()
  
  if (!supabase) {
    // Development fallback with mock data
    const user = {
      id: 'mock-user-id',
      email: 'demo@clawguru.org'
    }
    
    const tier = await getUserTier(user.id)
    
    // Mock data for development
    const initialData = {
      clawScore: 850,
      activeThreats: 12,
      executionsToday: 5,
      myceliumNodes: 8,
      successRate: 95
    }

    return (
      <UserDashboardClient
        user={user}
        tier={tier}
        initialData={initialData}
      />
    )
  }

  // Production: Get real user from Supabase
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const tier = await getUserTier(user.id)

  // Fetch real dashboard data
  const [
    clawScore,
    activeThreats,
    executionsToday,
    myceliumNodes,
    successRate
  ] = await Promise.all([
    fetchClawScore(user.id),
    fetchActiveThreats(),
    fetchExecutionsToday(user.id),
    fetchMyceliumNodes(user.id),
    fetchSuccessRate(user.id)
  ])

  const initialData = {
    clawScore,
    activeThreats,
    executionsToday,
    myceliumNodes,
    successRate
  }

  return (
    <UserDashboardClient
      user={user}
      tier={tier}
      initialData={initialData}
    />
  )
}

// Real data fetching functions
function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }
  // Import dynamically to avoid build errors
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

async function fetchClawScore(userId: string): Promise<number> {
  const supabase = getSupabaseClient()
  if (!supabase) return 850 // fallback
  
  // Calculate real claw score based on user activity
  const { data: executions } = await supabase
    .from('runbook_executions')
    .select('success_rate, created_at')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  const { data: threats } = await supabase
    .from('threats_detected')
    .select('severity')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  let score = 500 // base score
  
  // Add points for successful executions
  if (executions) {
    score += executions.length * 10
    score += executions.filter((e: any) => e.success_rate > 90).length * 5
  }
  
  // Add points for threat detection
  if (threats) {
    score += threats.length * 15
    score += threats.filter((t: any) => t.severity === 'high').length * 25
  }
  
  return Math.min(score, 1000) // cap at 1000
}

async function fetchActiveThreats(): Promise<number> {
  const supabase = getSupabaseClient()
  if (!supabase) return 12 // fallback
  
  const { count } = await supabase
    .from('threats_detected')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  
  return count || 0
}

async function fetchExecutionsToday(userId: string): Promise<number> {
  const supabase = getSupabaseClient()
  if (!supabase) return 5 // fallback
  
  const today = new Date().toISOString().split('T')[0]
  
  const { count } = await supabase
    .from('runbook_executions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today)
  
  return count || 0
}

async function fetchMyceliumNodes(userId: string): Promise<number> {
  const supabase = getSupabaseClient()
  if (!supabase) return 8 // fallback
  
  const { count } = await supabase
    .from('mycelium_nodes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')
  
  return count || 0
}

async function fetchSuccessRate(userId: string): Promise<number> {
  const supabase = getSupabaseClient()
  if (!supabase) return 95 // fallback
  
  const { data: executions } = await supabase
    .from('runbook_executions')
    .select('success_rate')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
  
  if (!executions || executions.length === 0) return 95
  
  const avgSuccessRate = executions.reduce((sum: number, exec: any) => sum + exec.success_rate, 0) / executions.length
  return Math.round(avgSuccessRate)
}
