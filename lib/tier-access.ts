import React from 'react'
import { Crown, Star, Zap, Shield } from 'lucide-react'

export type UserTier = 'explorer' | 'daypass' | 'pro' | 'enterprise'

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

export interface TierConfig {
  name: string
  price: string
  features: string[]
  limits: {
    maxExecutions: number
    maxRunbooks: number
    maxMyceliumNodes: number
    aiTokens: number
  }
  canAccess: {
    overview: boolean
    mycelium: boolean
    tools: boolean
    executions: boolean
    billing: boolean
    admin: boolean
  }
  stripePriceId?: string
  description: string
  highlightFeatures: string[]
}

export const TIER_CONFIGS: Record<UserTier, TierConfig> = {
  explorer: {
    name: 'Explorer',
    price: 'Free',
    description: 'Perfect for getting started with ClawGuru',
    features: [
      'View Overview Dashboard',
      'Basic Security Metrics',
      'Limited Tool Access',
      'Community Support',
      '5 Monthly Executions',
      '1,000 AI Tokens',
      '10 Runbooks',
      '50 Mycelium Nodes'
    ],
    highlightFeatures: [
      'View Overview Dashboard',
      'Basic Security Metrics'
    ],
    limits: {
      maxExecutions: 5,
      maxRunbooks: 10,
      maxMyceliumNodes: 50,
      aiTokens: 1000
    },
    canAccess: {
      overview: true,
      mycelium: false,
      tools: false,
      executions: false,
      billing: true,
      admin: false
    },
    stripePriceId: 'price_explorer_free'
  },
  daypass: {
    name: 'Day Pass',
    price: '€9 / 24h',
    description: 'Full access for 24 hours - perfect for projects and testing',
    features: [
      'Full Access 24h',
      'All Security Tools',
      'Unlimited Executions',
      'Advanced Mycelium Network',
      '100,000 AI Tokens',
      'Priority Support',
      'Real-time Threat Detection',
      'Custom Runbooks'
    ],
    highlightFeatures: [
      'Full Access 24h',
      'All Tools',
      'Unlimited Executions'
    ],
    limits: {
      maxExecutions: Infinity,
      maxRunbooks: Infinity,
      maxMyceliumNodes: Infinity,
      aiTokens: 100000
    },
    canAccess: {
      overview: true,
      mycelium: true,
      tools: true,
      executions: true,
      billing: true,
      admin: false
    },
    stripePriceId: 'price_daypass_9eur'
  },
  pro: {
    name: 'Pro',
    price: '€49 / Monat',
    description: 'For professionals and teams who need advanced security tools',
    features: [
      'Unlimited Everything',
      'Advanced AI Analytics',
      'Team Collaboration (5 users)',
      'Priority Support',
      '1,000,000 AI Tokens',
      'Custom Integrations',
      'API Access',
      'Advanced Reporting',
      'SLA Guarantee'
    ],
    highlightFeatures: [
      'Unlimited Everything',
      'Teams',
      'Priority Support'
    ],
    limits: {
      maxExecutions: Infinity,
      maxRunbooks: Infinity,
      maxMyceliumNodes: Infinity,
      aiTokens: 1000000
    },
    canAccess: {
      overview: true,
      mycelium: true,
      tools: true,
      executions: true,
      billing: true,
      admin: false
    },
    stripePriceId: 'price_pro_49eur'
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations with advanced security and compliance needs',
    features: [
      'God Mode Access',
      'Unlimited Users',
      '99.9% SLA Guarantee',
      'White-Label Options',
      'Dedicated Support Team',
      'On-Premise Deployment',
      'Custom Integrations',
      'Advanced Compliance',
      'Audit Logs',
      'Custom Training'
    ],
    highlightFeatures: [
      'God Mode',
      'SLA',
      'White-Label',
      'Dedicated Support'
    ],
    limits: {
      maxExecutions: Infinity,
      maxRunbooks: Infinity,
      maxMyceliumNodes: Infinity,
      aiTokens: Infinity
    },
    canAccess: {
      overview: true,
      mycelium: true,
      tools: true,
      executions: true,
      billing: true,
      admin: true
    },
    stripePriceId: 'price_enterprise_custom'
  }
}

/**
 * Derive UserTier from an AccessPlan (from the claw_access token).
 * If no plan is provided, the user is an explorer (free tier).
 */
export function getUserTierFromPlan(plan: string | null | undefined): UserTier {
  if (!plan) return 'explorer'
  switch (plan) {
    case 'team': return 'enterprise'
    case 'pro': return 'pro'
    case 'daypass': return 'daypass'
    default: return 'explorer'
  }
}

/**
 * Legacy helper – kept for callsites that pass a userId string.
 * Without a DB lookup the only fallback is explorer.
 */
export async function getUserTier(_userId: string): Promise<UserTier> {
  return 'explorer'
}

export function canAccessFeature(tier: UserTier, feature: keyof TierConfig['canAccess']): boolean {
  return TIER_CONFIGS[tier].canAccess[feature]
}

export function isFeatureShadowed(tier: UserTier, feature: keyof TierConfig['canAccess']): boolean {
  return !canAccessFeature(tier, feature)
}

export function getUpgradePath(currentTier: UserTier): UserTier[] {
  const tiers: UserTier[] = ['explorer', 'daypass', 'pro', 'enterprise']
  const currentIndex = tiers.indexOf(currentTier)
  return tiers.slice(currentIndex + 1)
}

export function getTierLimits(tier: UserTier) {
  return TIER_CONFIGS[tier].limits
}

export function canExecuteMore(tier: UserTier, currentExecutions: number): boolean {
  const limits = getTierLimits(tier)
  return limits.maxExecutions === Infinity || currentExecutions < limits.maxExecutions
}

export function canUseMoreTokens(tier: UserTier, currentTokens: number): boolean {
  const limits = getTierLimits(tier)
  return limits.aiTokens === Infinity || currentTokens < limits.aiTokens
}

export function canCreateMoreRunbooks(tier: UserTier, currentRunbooks: number): boolean {
  const limits = getTierLimits(tier)
  return limits.maxRunbooks === Infinity || currentRunbooks < limits.maxRunbooks
}

export function canAddMoreNodes(tier: UserTier, currentNodes: number): boolean {
  const limits = getTierLimits(tier)
  return limits.maxMyceliumNodes === Infinity || currentNodes < limits.maxMyceliumNodes
}

export function getUsagePercentage(tier: UserTier, current: number, limitType: keyof TierConfig['limits']): number {
  const limits = getTierLimits(tier)
  const limit = limits[limitType]
  
  if (limit === Infinity) return 0
  return Math.min((current / limit) * 100, 100)
}

export function getNextTier(tier: UserTier): UserTier | null {
  const upgradePath = getUpgradePath(tier)
  return upgradePath.length > 0 ? upgradePath[0] : null
}

export function getTierPrice(tier: UserTier, billingCycle: 'monthly' | 'yearly' = 'monthly'): string {
  const config = TIER_CONFIGS[tier]
  
  if (tier === 'enterprise') return 'Custom'
  if (tier === 'explorer') return 'Free'
  
  const basePrice = parseFloat(config.price.replace('€', '').replace('/ Monat', '').replace('/ 24h', ''))
  
  if (billingCycle === 'yearly' && tier !== 'daypass') {
    const yearlyPrice = basePrice * 12 * 0.8 // 20% discount
    return `€${yearlyPrice}/year`
  }
  
  return config.price
}

export function getTierColor(tier: UserTier): string {
  switch (tier) {
    case 'enterprise': return 'from-yellow-500 to-orange-500'
    case 'pro': return 'from-purple-500 to-pink-500'
    case 'daypass': return 'from-blue-500 to-cyan-500'
    case 'explorer': return 'from-gray-500 to-gray-600'
    default: return 'from-gray-500 to-gray-600'
  }
}

export function getTierIcon(tier: UserTier): React.ComponentType<any> {
  switch (tier) {
    case 'enterprise': return Crown
    case 'pro': return Star
    case 'daypass': return Zap
    case 'explorer': return Shield
    default: return Shield
  }
}
