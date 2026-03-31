'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserTier, TIER_CONFIGS } from '@/lib/tier-access'
import type { DashboardData } from '@/types/dashboard'
import { 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Shield, 
  Crown,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Calendar,
  DollarSign,
  Users,
  Server,
  Database,
  Globe,
  Cpu,
  Brain,
  Target,
  AlertTriangle,
  Info,
  Star,
  Rocket,
  Lock,
  ChevronRight
} from 'lucide-react'

interface BillingTabProps {
  tier: UserTier
  onUpgrade: () => void
  data: DashboardData
}

export function BillingTab({ tier, onUpgrade, data }: BillingTabProps) {
  const currentConfig = TIER_CONFIGS[tier]
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [portalLoading, setPortalLoading] = useState(false)
  // Real usage from data
  const realUsage = {
    executions: data.totalExecutions,
    nodes: data.myceliumNodes,
    threats: data.activeThreats
  }

  const getTierIcon = (tierKey: string) => {
    switch (tierKey) {
      case 'enterprise': return Crown
      case 'pro': return Star
      case 'daypass': return Zap
      case 'explorer': return Shield
      default: return Shield
    }
  }

  const getTierGradient = (tierKey: string) => {
    switch (tierKey) {
      case 'enterprise': return 'from-yellow-500 to-orange-500'
      case 'pro': return 'from-purple-500 to-pink-500'
      case 'daypass': return 'from-blue-500 to-cyan-500'
      case 'explorer': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getYearlyDiscount = () => {
    switch (billingCycle) {
      case 'yearly': return 20
      case 'monthly': return 0
      default: return 0
    }
  }

  const getAdjustedPrice = (basePrice: string) => {
    if (!basePrice || basePrice === 'Free' || basePrice === 'Custom') return basePrice
    const price = parseFloat(basePrice.replace('€', '').trim())
    if (isNaN(price)) return basePrice
    const discount = getYearlyDiscount()
    const adjustedPrice = price * (1 - discount / 100)
    return billingCycle === 'yearly' ? `€${adjustedPrice.toFixed(2)}/mo` : basePrice
  }
  
  return (
    <div className="p-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)' }}>
            <CreditCard className="w-6 h-6" style={{ color: '#EAB308' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Billing & Plans</h2>
            <p className="text-gray-500 text-sm">
              Abonnement verwalten und die volle Kraft von ClawGuru freischalten.
            </p>
          </div>
        </div>
        
        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="rounded-xl border p-1 flex" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <motion.button
              onClick={() => setBillingCycle('monthly')}
              className="px-6 py-2 rounded-md text-sm font-medium transition-all"
              style={billingCycle === 'monthly' ? { background: 'rgba(234,179,8,0.15)', color: '#EAB308' } : { color: '#71717A' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Monthly
            </motion.button>
            <motion.button
              onClick={() => setBillingCycle('yearly')}
              className="px-6 py-2 rounded-md text-sm font-medium transition-all relative"
              style={billingCycle === 'yearly' ? { background: 'rgba(234,179,8,0.15)', color: '#EAB308' } : { color: '#71717A' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yearly
              {billingCycle === 'yearly' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 px-2 py-1 text-xs rounded-full font-bold" style={{ background: '#EAB308', color: '#0A0A0A' }}
                >
                  -20%
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Current Plan Overview */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="rounded-2xl border p-8" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getTierGradient(tier)} flex items-center justify-center`}>
                {(() => {
                  const IconComponent = getTierIcon(tier)
                  return <IconComponent className="w-10 h-10 text-white" />
                })()}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Current Plan</h3>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                    tier === 'enterprise' 
                      ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                      : tier === 'pro'
                      ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30'
                      : tier === 'daypass'
                      ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                      : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
                  }`}>
                    {currentConfig.name}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {getAdjustedPrice(currentConfig.price)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Next billing date</div>
                <div className="text-lg font-semibold text-white">{data.nextBillingDate ? new Date(data.nextBillingDate).toLocaleDateString('de-DE') : '–'}</div>
              </div>
              
              {tier !== 'enterprise' && (
                <motion.button
                  onClick={onUpgrade}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 border"
                  style={{ background: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.25)', color: '#EAB308' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Rocket className="w-4 h-4" />
                  Upgrade Plan
                </motion.button>
              )}
            </div>
          </div>
          
          {/* Current Tier Features */}
          <div className="grid grid-cols-4 gap-4">
            {currentConfig.features.slice(0, 4).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <CheckCircle className="w-4 h-4 text-green-400" />
                {feature}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Usage Statistics */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-6 mb-8"
      >
        {/* Usage This Month */}
        <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          <h4 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4" style={{ color: '#EAB308' }} />
            Nutzung diesen Monat
          </h4>
          
          <div className="space-y-4">
            {[
              { label: 'Executions', icon: Zap, value: realUsage.executions, max: currentConfig.limits.maxExecutions, gradient: 'linear-gradient(90deg, #A1A1AA, #EAB308)' },
              { label: 'Mycelium Nodes', icon: Globe, value: realUsage.nodes, max: currentConfig.limits.maxMyceliumNodes, gradient: 'linear-gradient(90deg, #A1A1AA, #D4A017)' },
              { label: 'Active Threats', icon: Shield, value: realUsage.threats, max: 100, gradient: 'linear-gradient(90deg, #71717A, #EF4444)' }
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400 flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  <span className="text-white font-semibold">
                    {item.value} / {item.max === Infinity ? '∞' : item.max}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-3 rounded-full relative" style={{ background: item.gradient }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.value / (item.max === Infinity ? 1000 : item.max) * 100, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Information */}
        <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))', borderColor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}>
          <h4 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <DollarSign className="w-4 h-4" style={{ color: '#EAB308' }} />
            Zahlungsinformationen
          </h4>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Current Plan</span>
                <span className="text-white font-semibold">{currentConfig.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Billing Cycle</span>
                <span className="text-white font-semibold capitalize">{billingCycle}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Monthly Cost</span>
                <span className="text-white font-semibold">{getAdjustedPrice(currentConfig.price)}</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Yearly Discount</span>
                  <span className="text-green-400 font-semibold">-{getYearlyDiscount()}%</span>
                </div>
              )}
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              {data.subscription?.stripe_subscription_id && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subscription</span>
                  <span className="text-white font-semibold text-xs font-mono">{data.subscription.stripe_subscription_id.slice(0, 16)}…</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Next Billing Date</span>
                <span className="text-white font-semibold">{data.nextBillingDate ? new Date(data.nextBillingDate).toLocaleDateString('de-DE') : '–'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Spent</span>
                <span className="text-white font-semibold">€{data.totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Zahlungen</span>
                <span className="text-white font-semibold">{data.payments.length}</span>
              </div>
            </div>
            
            <motion.button
              onClick={async () => {
                setPortalLoading(true)
                try {
                  const res = await fetch('/api/stripe/portal', { method: 'POST' })
                  const json = await res.json().catch(() => null)
                  if (json?.url) {
                    window.location.href = json.url
                    return
                  }
                } catch { /* fall through */ }
                setPortalLoading(false)
              }}
              disabled={portalLoading || tier === 'explorer'}
              className="w-full px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium border hover:border-yellow-500/20 disabled:opacity-40"
              style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(255,255,255,0.06)', color: '#EAB308' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-4 h-4" />
              {portalLoading ? 'Wird geladen…' : 'Billing Portal öffnen'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Plan Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          Compare Plans
        </h3>
        
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(TIER_CONFIGS).map(([tierKey, config], index) => {
            const IconComponent = getTierIcon(tierKey)
            const isCurrentTier = tierKey === tier
            const isHigherTier = Object.keys(TIER_CONFIGS).indexOf(tierKey) > Object.keys(TIER_CONFIGS).indexOf(tier)
            
            return (
              <motion.div
                key={tierKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="relative group cursor-pointer border rounded-2xl p-6 transition-all"
                style={{
                  background: isCurrentTier ? 'rgba(234,179,8,0.04)' : 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
                  borderColor: isCurrentTier ? 'rgba(234,179,8,0.2)' : isHigherTier ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)'
                }}
                whileHover={{ scale: isHigherTier ? 1.02 : 1 }}
                whileTap={{ scale: isHigherTier ? 0.98 : 1 }}
              >
                {/* Popular Badge */}
                {tierKey === 'pro' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full" style={{ background: '#EAB308', color: '#0A0A0A' }}
                  >
                    POPULAR
                  </motion.div>
                )}
                
                {/* Current Badge */}
                {isCurrentTier && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-3 right-0 px-3 py-1 text-xs font-bold rounded-full border" style={{ background: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.3)', color: '#EAB308' }}
                  >
                    CURRENT
                  </motion.div>
                )}
                
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getTierGradient(tierKey)} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2">{config.name}</h4>
                  <div className="text-3xl font-bold text-white mb-1">
                    {getAdjustedPrice(config.price)}
                  </div>
                  {billingCycle === 'yearly' && tierKey !== 'explorer' && tierKey !== 'enterprise' && (
                    <div className="text-sm text-green-400">
                      {(() => {
                        const base = parseFloat(config.price.replace('€', '').trim())
                        return isNaN(base) ? null : `Save €${Math.round(base * 0.2 * 12)}/year`
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 mb-6">
                  {config.features.slice(0, 5).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Executions</span>
                    <span className="text-white font-medium">
                      {config.limits.maxExecutions === Infinity ? 'Unlimited' : config.limits.maxExecutions}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">AI Tokens</span>
                    <span className="text-white font-medium">
                      {config.limits.aiTokens === Infinity ? 'Unlimited' : `${config.limits.aiTokens / 1000}k`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Mycelium Nodes</span>
                    <span className="text-white font-medium">
                      {config.limits.maxMyceliumNodes === Infinity ? 'Unlimited' : config.limits.maxMyceliumNodes}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    isCurrentTier
                      ? 'cursor-not-allowed'
                      : isHigherTier
                      ? 'hover:opacity-90'
                      : 'cursor-not-allowed'
                  }`}
                  disabled={!isHigherTier}
                  style={isHigherTier ? { background: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.25)', color: '#EAB308' } : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.04)', color: '#52525B' }}
                  whileHover={isHigherTier ? { scale: 1.02 } : {}}
                  whileTap={isHigherTier ? { scale: 0.98 } : {}}
                  onClick={isHigherTier ? onUpgrade : undefined}
                >
                  {isCurrentTier ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Current Plan
                    </>
                  ) : isHigherTier ? (
                    <>
                      <Rocket className="w-4 h-4" />
                      Upgrade
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Downgrade
                    </>
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
