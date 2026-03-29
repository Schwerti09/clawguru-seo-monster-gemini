'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserTier, TIER_CONFIGS, getNextTier } from '@/lib/tier-access'
import { 
  Lock, 
  Sparkles, 
  Zap, 
  Brain, 
  Shield, 
  Crown,
  Activity,
  Target,
  AlertTriangle,
  Eye,
  Rocket,
  Flame,
  ChevronRight,
  Info,
  Star,
  TrendingUp
} from 'lucide-react'

interface ShadowRealmOverlayProps {
  onUpgrade: () => void
  tier: UserTier
}

export function ShadowRealmOverlay({ onUpgrade, tier }: ShadowRealmOverlayProps) {
  const [teaserData, setTeaserData] = useState({
    activeThreats: 0,
    myceliumNodes: 0,
    aiInsights: 0,
    executionQueue: 0,
    networkActivity: 0,
    successRate: 0
  })
  
  const [pulseIntensity, setPulseIntensity] = useState(0)
  const nextTier = getNextTier(tier)

  // Animate teaser data
  useEffect(() => {
    const interval = setInterval(() => {
      setTeaserData(prev => ({
        activeThreats: Math.floor(Math.random() * 50) + 12,
        myceliumNodes: Math.floor(Math.random() * 100) + 47,
        aiInsights: Math.floor(Math.random() * 200) + 89,
        executionQueue: Math.floor(Math.random() * 15) + 3,
        networkActivity: Math.floor(Math.random() * 89) + 34,
        successRate: Math.floor(Math.random() * 15) + 85
      }))
      setPulseIntensity(prev => (prev + 0.1) % (Math.PI * 2))
    }, 2000)

    return () => clearInterval(interval)
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

  const shadowFeatures = [
    {
      icon: Brain,
      title: 'Living Mycelium Brain',
      description: 'Real-time neural network analysis with 47+ active nodes',
      value: teaserData.myceliumNodes,
      unit: 'nodes',
      color: 'from-purple-500 to-pink-500',
      locked: !TIER_CONFIGS[tier].canAccess.mycelium
    },
    {
      icon: Zap,
      title: 'AI-Powered Tools',
      description: 'Advanced security tools with machine learning',
      value: teaserData.aiInsights,
      unit: 'insights',
      color: 'from-yellow-500 to-orange-500',
      locked: !TIER_CONFIGS[tier].canAccess.tools
    },
    {
      icon: Activity,
      title: 'Unlimited Executions',
      description: 'Run unlimited security scans and assessments',
      value: teaserData.executionQueue,
      unit: 'running',
      color: 'from-cyan-500 to-blue-500',
      locked: !TIER_CONFIGS[tier].canAccess.executions
    },
    {
      icon: AlertTriangle,
      title: 'Live Threat Detection',
      description: 'Real-time threat intelligence and alerts',
      value: teaserData.activeThreats,
      unit: 'threats',
      color: 'from-red-500 to-orange-500',
      locked: !TIER_CONFIGS[tier].canAccess.mycelium
    },
    {
      icon: Target,
      title: 'Advanced Analytics',
      description: 'Deep security analytics and reporting',
      value: teaserData.successRate,
      unit: '% success',
      color: 'from-green-500 to-emerald-500',
      locked: !TIER_CONFIGS[tier].canAccess.executions
    },
    {
      icon: Eye,
      title: 'Network Visibility',
      description: 'Complete network topology and monitoring',
      value: teaserData.networkActivity,
      unit: '% activity',
      color: 'from-blue-500 to-purple-500',
      locked: !TIER_CONFIGS[tier].canAccess.mycelium
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center"
    >
      {/* Enhanced Shadow Background */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl">
        {/* Animated Mycelium Particles */}
        <div className="absolute inset-0">
          {[...Array(80)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-red-500/30 to-cyan-500/30 rounded-full"
              animate={{
                x: [Math.random() * 100, Math.random() * 100],
                y: [Math.random() * 100, Math.random() * 100],
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 51, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 51, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="relative z-10 max-w-6xl mx-auto p-8"
      >
        {/* Glowing Ring Effect */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            boxShadow: [
              '0 0 100px rgba(255, 0, 51, 0.3)',
              '0 0 200px rgba(255, 0, 51, 0.1)',
              '0 0 100px rgba(255, 0, 51, 0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl p-12 border border-red-500/20">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 mb-6"
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              MYCELIUM SHADOW REALM
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              You've discovered the hidden power of ClawGuru. In the Shadow Realm, 
              advanced features pulse with life, waiting to be unlocked. 
              <span className="text-cyan-400 font-semibold"> Real-time data streams below</span> show what you're missing.
            </p>

            {/* Next Tier Preview */}
            {nextTier && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full"
              >
                {(() => {
                  const NextIcon = getTierIcon(nextTier)
                  return <NextIcon className="w-5 h-5 text-purple-400" />
                })()}
                <span className="text-purple-300 font-medium">
                  Unlock {TIER_CONFIGS[nextTier].name} Tier
                </span>
                <ChevronRight className="w-4 h-4 text-purple-400" />
              </motion.div>
            )}
          </div>

          {/* Live Teaser Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {shadowFeatures.map((feature, index) => {
              const Icon = feature.icon
              const isLocked = feature.locked
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`relative group ${
                    isLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all ${
                    isLocked
                      ? 'bg-gray-900/40 border-gray-700/50'
                      : 'bg-black/40 border-cyan-500/20 hover:border-cyan-500/40'
                  }`}>
                    {/* Lock Overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Lock className="w-8 h-8 text-red-500" />
                      </div>
                    )}

                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{feature.description}</p>

                      {/* Live Value */}
                      <div className="flex items-baseline gap-2">
                        <motion.div
                          className="text-3xl font-bold text-white"
                          animate={{ 
                            color: isLocked ? '#9CA3AF' : ['#FFFFFF', feature.color.split(' ')[0].replace('from-', '#'), '#FFFFFF']
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {feature.value}
                        </motion.div>
                        <span className="text-sm text-gray-400">{feature.unit}</span>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center gap-2 mt-3">
                        <motion.div
                          className={`w-2 h-2 rounded-full ${
                            isLocked ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          animate={isLocked ? {} : {
                            opacity: [1, 0.5, 1],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className={`text-xs ${
                          isLocked ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {isLocked ? 'LOCKED' : 'ACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  {!isLocked && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ zIndex: -1 }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Upgrade CTA Section */}
          <div className="text-center">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(255, 0, 51, 0.4)',
                  '0 0 60px rgba(255, 0, 51, 0.2)',
                  '0 0 30px rgba(255, 0, 51, 0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <motion.button
                onClick={onUpgrade}
                className="relative px-12 py-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl font-bold text-white text-xl overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                {/* Content */}
                <span className="relative flex items-center gap-3">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Flame className="w-6 h-6" />
                  </motion.div>
                  IGNITE FULL CONTROL
                  <Rocket className="w-6 h-6" />
                </span>
              </motion.button>
            </motion.div>

            <div className="mt-6 space-y-2">
              <p className="text-gray-400 flex items-center justify-center gap-2">
                <Info className="w-4 h-4" />
                From €9/day • Instant access • Cancel anytime
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  4.9/5 Rating
                </span>
                <span>•</span>
                <span>10,000+ Active Users</span>
                <span>•</span>
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
