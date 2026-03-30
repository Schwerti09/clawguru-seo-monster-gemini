export interface DashboardExecution {
  id: string
  runbook_id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  started_at: string
  completed_at: string | null
  result: any | null
  created_at: string
}

export interface DashboardThreat {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved'
  created_at: string
}

export interface DashboardNode {
  id: string
  type: 'threat' | 'runbook' | 'oracle' | 'neuro'
  status: 'active' | 'inactive'
  connections: string[]
  metadata: any
}

export interface DashboardPayment {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface DashboardSubscription {
  tier: string
  status: string
  stripe_subscription_id: string | null
  expires_at: string | null
  created_at: string
}

export interface DashboardData {
  clawScore: number
  activeThreats: number
  executionsToday: number
  myceliumNodes: number
  successRate: number
  recentExecutions: DashboardExecution[]
  threats: DashboardThreat[]
  nodes: DashboardNode[]
  payments: DashboardPayment[]
  subscription: DashboardSubscription | null
  totalExecutions: number
  lastRunAt: string | null
  totalSpent: number
  nextBillingDate: string | null
}
