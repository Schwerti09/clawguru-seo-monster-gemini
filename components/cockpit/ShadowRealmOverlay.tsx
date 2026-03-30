'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  ChevronRight,
  Info,
  Star
} from 'lucide-react'

interface ShadowRealmOverlayProps {
  onUpgrade: () => void
  tier: UserTier
}

export function ShadowRealmOverlay({ onUpgrade, tier }: ShadowRealmOverlayProps) {
  const [teaserData, setTeaserData] = useState({
    activeThreats: 0, myceliumNodes: 0, aiInsights: 0,
    executionQueue: 0, networkActivity: 0, successRate: 0
  })
  const nextTier = getNextTier(tier)

  useEffect(() => {
    const interval = setInterval(() => {
      setTeaserData({
        activeThreats: Math.floor(Math.random() * 50) + 12,
        myceliumNodes: Math.floor(Math.random() * 100) + 47,
        aiInsights: Math.floor(Math.random() * 200) + 89,
        executionQueue: Math.floor(Math.random() * 15) + 3,
        networkActivity: Math.floor(Math.random() * 89) + 34,
        successRate: Math.floor(Math.random() * 15) + 85
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getTierIcon = (tierKey: string) => {
    switch (tierKey) {
      case 'enterprise': return Crown
      case 'pro': return Star
      case 'daypass': return Zap
      default: return Shield
    }
  }

  const shadowFeatures = [
    { icon: Brain, title: 'Living Mycelium Brain', description: 'Echtzeit neuronale Netzwerkanalyse mit 47+ Knoten', value: teaserData.myceliumNodes, unit: 'nodes', locked: !TIER_CONFIGS[tier].canAccess.mycelium },
    { icon: Zap, title: 'AI-Powered Tools', description: 'Erweiterte Sicherheitstools mit Machine Learning', value: teaserData.aiInsights, unit: 'insights', locked: !TIER_CONFIGS[tier].canAccess.tools },
    { icon: Activity, title: 'Unlimited Executions', description: 'Unbegrenzte Security-Scans und Bewertungen', value: teaserData.executionQueue, unit: 'running', locked: !TIER_CONFIGS[tier].canAccess.executions },
    { icon: AlertTriangle, title: 'Live Threat Detection', description: 'Echtzeit-Bedrohungserkennung und Alerts', value: teaserData.activeThreats, unit: 'threats', locked: !TIER_CONFIGS[tier].canAccess.mycelium },
    { icon: Target, title: 'Advanced Analytics', description: 'Tiefgehende Sicherheitsanalysen und Reports', value: teaserData.successRate, unit: '% success', locked: !TIER_CONFIGS[tier].canAccess.executions },
    { icon: Eye, title: 'Network Visibility', description: 'Vollständige Netzwerktopologie und Monitoring', value: teaserData.networkActivity, unit: '% activity', locked: !TIER_CONFIGS[tier].canAccess.mycelium }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black/92 backdrop-blur-2xl">
        {/* Gold particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ background: '#EAB308', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ opacity: [0, 0.4, 0], scale: [0, 1, 0] }}
              transition={{ duration: Math.random() * 5 + 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>

        {/* Subtle gold grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto p-8"
      >
        <div
          className="relative rounded-3xl p-10 border overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.03) 0%, rgba(10,10,10,0.95) 30%, rgba(10,10,10,0.98) 100%)',
            borderColor: 'rgba(234,179,8,0.15)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 0 120px rgba(234,179,8,0.06), inset 0 1px 0 rgba(255,255,255,0.04)'
          }}
        >
          {/* Inner gold glow */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)' }} />

          {/* Header */}
          <div className="relative text-center mb-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 border"
              style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.25)', boxShadow: '0 0 40px rgba(234,179,8,0.1)' }}
            >
              <Lock className="w-8 h-8" style={{ color: '#EAB308' }} />
            </motion.div>

            <h2 className="text-4xl font-black mb-3 text-white" style={{ textShadow: '0 0 60px rgba(234,179,8,0.2)' }}>
              SHADOW <span style={{ color: '#EAB308' }}>REALM</span>
            </h2>

            <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Du hast die verborgene Kraft von ClawGuru entdeckt. Erweiterte Features warten darauf, freigeschaltet zu werden.
              <span style={{ color: '#EAB308' }}> Echtzeit-Daten unten</span> zeigen, was dir entgeht.
            </p>

            {nextTier && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border"
                style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.15)' }}
              >
                {(() => { const I = getTierIcon(nextTier); return <I className="w-4 h-4" style={{ color: '#EAB308' }} /> })()}
                <span className="text-sm font-medium" style={{ color: '#EAB308' }}>
                  {TIER_CONFIGS[nextTier].name} freischalten
                </span>
                <ChevronRight className="w-3.5 h-3.5" style={{ color: '#EAB308' }} />
              </motion.div>
            )}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 relative">
            {shadowFeatures.map((feature, index) => {
              const Icon = feature.icon
              const isLocked = feature.locked
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                  className="relative group"
                >
                  <div
                    className="relative p-5 rounded-2xl border transition-all duration-500 hover:border-yellow-500/15"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
                      borderColor: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                        <Lock className="w-6 h-6" style={{ color: '#EAB308', opacity: 0.6 }} />
                      </div>
                    )}

                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-3" style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <Icon className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">{feature.description}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white">{feature.value}</span>
                        <span className="text-[11px] text-gray-500">{feature.unit}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{
                          background: isLocked ? '#EF4444' : '#EAB308',
                          boxShadow: isLocked ? '0 0 4px rgba(239,68,68,0.4)' : '0 0 4px rgba(234,179,8,0.4)'
                        }} />
                        <span className="text-[10px] font-medium" style={{ color: isLocked ? '#EF4444' : '#EAB308' }}>
                          {isLocked ? 'LOCKED' : 'ACTIVE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="relative text-center">
            <motion.div
              animate={{ boxShadow: ['0 0 40px rgba(234,179,8,0.15)', '0 0 80px rgba(234,179,8,0.08)', '0 0 40px rgba(234,179,8,0.15)'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <motion.button
                onClick={onUpgrade}
                className="relative px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden border"
                style={{ background: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.3)', color: '#EAB308' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(234,179,8,0.08) 50%, transparent 100%)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  FULL CONTROL FREISCHALTEN
                  <ChevronRight className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>

            <div className="mt-5 space-y-1.5">
              <p className="text-gray-500 flex items-center justify-center gap-2 text-sm">
                <Info className="w-3.5 h-3.5" />
                Ab €9/Tag · Sofortzugang · Jederzeit kündbar
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" style={{ color: '#EAB308' }} />
                  4.9/5
                </span>
                <span className="w-px h-3 bg-white/5" />
                <span>10.000+ Nutzer</span>
                <span className="w-px h-3 bg-white/5" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
