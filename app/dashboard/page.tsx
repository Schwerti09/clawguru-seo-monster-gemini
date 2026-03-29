import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { UserDashboardClient } from '@/components/cockpit/UserDashboardClient'
import { getUserTier } from '@/lib/tier-access'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function DashboardPage() {
  // Mock user for development
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
