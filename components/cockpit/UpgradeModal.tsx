'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserTier, TIER_CONFIGS, getUpgradePath, getTierColor, getTierIcon } from '@/lib/tier-access'
import { 
  X, 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  CheckCircle, 
  Sparkles,
  Rocket,
  CreditCard,
  Lock,
  ChevronRight,
  Info,
  AlertTriangle,
  TrendingUp,
  Users,
  Cpu,
  Database,
  Globe
} from 'lucide-react'

interface UpgradeModalProps {
  currentTier: UserTier
  upgradePath: UserTier[]
  onClose: () => void
}

export function UpgradeModal({ currentTier, upgradePath, onClose }: UpgradeModalProps) {
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async (tier: UserTier) => {
    setIsProcessing(true)
    setSelectedTier(tier)
    
    try {
      // Stripe checkout integration
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          product: tier,
        })
      })
      
      const { url, error } = await response.json()
      
      if (error) {
        console.error('Stripe error:', error)
        setIsProcessing(false)
        return
      }
      
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      setIsProcessing(false)
    }
  }

  const getTierFeatures = (tier: UserTier) => {
    const config = TIER_CONFIGS[tier]
    return {
      basic: config.features.slice(0, 3),
      advanced: config.features.slice(3, 6),
      enterprise: config.features.slice(6)
    }
  }

  const getAdjustedPrice = (tier: UserTier) => {
    const config = TIER_CONFIGS[tier]
    
    if (tier === 'enterprise') return 'Custom Pricing'
    if (tier === 'explorer') return 'Free'
    
    const basePrice = parseFloat(config.price.replace('€', '').replace('/ Monat', '').replace('/ 24h', ''))
    
    if (billingCycle === 'yearly' && tier !== 'daypass') {
      const yearlyPrice = basePrice * 12 * 0.8 // 20% discount
      return `€${yearlyPrice}/year`
    }
    
    return config.price
  }

  const getSavings = (tier: UserTier) => {
    if (billingCycle !== 'yearly' || tier === 'daypass' || tier === 'enterprise') return null
    
    const config = TIER_CONFIGS[tier]
    const basePrice = parseFloat(config.price.replace('€', '').replace('/ Monat', ''))
    const monthlyTotal = basePrice * 12
    const yearlyPrice = basePrice * 12 * 0.8
    const savings = monthlyTotal - yearlyPrice
    
    return `Save €${savings}/year`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
      role="dialog"
      aria-modal="true"
      data-testid="upgrade-modal"
      onClick={onClose}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-cyan-500/10" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 51, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 51, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-8 max-w-6xl w-full border border-red-500/20 max-h-[90vh] overflow-y-auto"
      >
        {/* Glowing Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{
            boxShadow: [
              '0 0 40px rgba(255, 0, 51, 0.2)',
              '0 0 80px rgba(255, 0, 51, 0.1)',
              '0 0 40px rgba(255, 0, 51, 0.2)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Header */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
              >
                <Rocket className="w-8 h-8 text-white" />
              </motion.div>
              
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-2">
                  IGNITE FULL CONTROL
                </h2>
                <p className="text-gray-300 text-lg">
                  Choose your path to unlimited security power
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={onClose}
              className="w-12 h-12 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6 text-gray-400" />
            </motion.button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center mb-8">
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
                    className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full"
                  >
                    -20%
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Current Tier Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-2">
            <Info className="w-4 h-4" />
            <span className="font-medium">Current Plan</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {TIER_CONFIGS[currentTier].name}
          </div>
        </motion.div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {upgradePath.map((tier, index) => {
            const config = TIER_CONFIGS[tier]
            const features = getTierFeatures(tier)
            const IconComponent = getTierIcon(tier)
            const isPopular = tier === 'pro'
            const savings = getSavings(tier)
            
            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative group ${
                  isPopular ? 'scale-105' : ''
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      MOST POPULAR
                    </div>
                  </motion.div>
                )}

                <div className={`relative p-8 rounded-2xl border backdrop-blur-xl transition-all ${
                  isPopular
                    ? 'border-purple-500/50 bg-purple-500/10 hover:border-purple-500/70'
                    : tier === 'enterprise'
                    ? 'border-yellow-500/50 bg-yellow-500/10 hover:border-yellow-500/70'
                    : 'border-cyan-500/50 bg-cyan-500/10 hover:border-cyan-500/70'
                }`}>
                  {/* Glowing Effect for Popular */}
                  {isPopular && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{
                        boxShadow: [
                          '0 0 30px rgba(168, 85, 247, 0.3)',
                          '0 0 60px rgba(168, 85, 247, 0.1)',
                          '0 0 30px rgba(168, 85, 247, 0.3)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Tier Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getTierColor(tier)} flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Tier Name */}
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    {config.name}
                  </h3>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-white mb-1">
                      {getAdjustedPrice(tier)}
                    </div>
                    {savings && (
                      <div className="text-sm text-green-400 font-medium">
                        {savings}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm text-center mb-6">
                    {config.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Core Features</h4>
                      <div className="space-y-2">
                        {features.basic.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {features.advanced.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Advanced</h4>
                        <div className="space-y-2">
                          {features.advanced.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {features.enterprise.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Enterprise</h4>
                        <div className="space-y-2">
                          {features.enterprise.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upgrade Button */}
                  <motion.button
                    onClick={() => handleUpgrade(tier)}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                      isProcessing && selectedTier === tier
                        ? 'bg-gray-600 cursor-not-allowed'
                        : isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : tier === 'enterprise'
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                    }`}
                    whileHover={!isProcessing ? { scale: 1.02 } : {}}
                    whileTap={!isProcessing ? { scale: 0.98 } : {}}
                  >
                    {isProcessing && selectedTier === tier ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Cpu className="w-5 h-5" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        {tier === 'daypass' ? 'Start 24h Pass' : `Upgrade to ${config.name}`}
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border-t border-gray-800 pt-6"
        >
          <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Global Coverage</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
