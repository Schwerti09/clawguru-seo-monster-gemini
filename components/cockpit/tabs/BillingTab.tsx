'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserTier, TIER_CONFIGS } from '@/lib/tier-access'
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
}

export function BillingTab({ tier, onUpgrade }: BillingTabProps) {
  const currentConfig = TIER_CONFIGS[tier]
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [animatedUsage, setAnimatedUsage] = useState({
    executions: 0,
    aiTokens: 0,
    storage: 0,
    bandwidth: 0
  })

  // Animate usage stats on mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    const targetUsage = {
      executions: 47,
      aiTokens: 12300,
      storage: 2.3,
      bandwidth: 45.7
    }

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      
      setAnimatedUsage({
        executions: Math.floor(targetUsage.executions * progress),
        aiTokens: Math.floor(targetUsage.aiTokens * progress),
        storage: parseFloat((targetUsage.storage * progress).toFixed(1)),
        bandwidth: parseFloat((targetUsage.bandwidth * progress).toFixed(1))
      })

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

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
    const price = parseFloat(basePrice.replace('$', '').replace('/mo', ''))
    const discount = getYearlyDiscount()
    const adjustedPrice = price * (1 - discount / 100)
    return billingCycle === 'yearly' ? `$${adjustedPrice}/mo` : basePrice
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
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Billing & Plans</h2>
            <p className="text-gray-400 text-lg">
              Manage your subscription and unlock the full power of ClawGuru.
            </p>
          </div>
        </div>
        
        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-1 flex">
            <motion.button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Monthly
            </motion.button>
            <motion.button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Yearly
              {billingCycle === 'yearly' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full"
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
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8">
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
                <div className="text-lg font-semibold text-white">April 29, 2024</div>
              </div>
              
              {tier !== 'enterprise' && (
                <motion.button
                  onClick={onUpgrade}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white hover:opacity-90 transition-all flex items-center gap-2"
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
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Usage This Month
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Executions
                </span>
                <span className="text-white font-semibold">
                  {animatedUsage.executions} / {currentConfig.limits.maxExecutions === Infinity ? '∞' : currentConfig.limits.maxExecutions}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(animatedUsage.executions / (currentConfig.limits.maxExecutions || 100) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Tokens
                </span>
                <span className="text-white font-semibold">
                  {(animatedUsage.aiTokens / 1000).toFixed(1)}k / {currentConfig.limits.aiTokens === Infinity ? '∞' : `${currentConfig.limits.aiTokens / 1000}k`}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(animatedUsage.aiTokens / (currentConfig.limits.aiTokens || 100000) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Runbooks
                </span>
                <span className="text-white font-semibold">
                  {Math.round(animatedUsage.storage * 4)} / {currentConfig.limits.maxRunbooks === Infinity ? '∞' : currentConfig.limits.maxRunbooks}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((animatedUsage.storage * 4) / (currentConfig.limits.maxRunbooks || 50) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Mycelium Nodes
                </span>
                <span className="text-white font-semibold">
                  {Math.round(animatedUsage.bandwidth / 10)} / {currentConfig.limits.maxMyceliumNodes === Infinity ? '∞' : currentConfig.limits.maxMyceliumNodes}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((animatedUsage.bandwidth / 10) / (currentConfig.limits.maxMyceliumNodes || 20) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6">
          <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Billing Information
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
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-white font-semibold">•••• 4242</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Next Billing Date</span>
                <span className="text-white font-semibold">April 29, 2024</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Spent</span>
                <span className="text-white font-semibold">$147.00</span>
              </div>
            </div>
            
            <motion.button
              className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CreditCard className="w-4 h-4" />
              Update Payment Method
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
                className={`relative group cursor-pointer ${
                  isCurrentTier
                    ? 'border-cyan-500/50 bg-cyan-500/10'
                    : isHigherTier
                    ? 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50'
                    : 'border-gray-700/30 bg-gray-900/20'
                } border rounded-2xl p-6 backdrop-blur-xl transition-all`}
                whileHover={{ scale: isHigherTier ? 1.02 : 1 }}
                whileTap={{ scale: isHigherTier ? 0.98 : 1 }}
              >
                {/* Popular Badge */}
                {tierKey === 'pro' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full"
                  >
                    POPULAR
                  </motion.div>
                )}
                
                {/* Current Badge */}
                {isCurrentTier && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-3 right-0 px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full"
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
                  {billingCycle === 'yearly' && tierKey !== 'explorer' && (
                    <div className="text-sm text-green-400">
                      Save ${Math.round(parseFloat(config.price.replace('$', '').replace('/mo', '')) * 0.2 * 12)}/year
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
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : isHigherTier
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isHigherTier}
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
