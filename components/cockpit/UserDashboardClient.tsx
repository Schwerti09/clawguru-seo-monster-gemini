'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, UserTier, TIER_CONFIGS, isFeatureShadowed, getUpgradePath } from '@/lib/tier-access'
import { OverviewTab } from './tabs/OverviewTab'
import { MyceliumTab } from './tabs/MyceliumTab'
import { ToolsTab } from './tabs/ToolsTab'
import { ExecutionsTab } from './tabs/ExecutionsTab'
import { BillingTab } from './tabs/BillingTab'
import { ShadowRealmOverlay } from './ShadowRealmOverlay'
import { UpgradeModal } from './UpgradeModal'
import { MyceliumMinimap } from './MyceliumMinimap'
import { ThreatLevelGauge } from './ThreatLevelGauge'
import { QuickTools } from './QuickTools'
import { Activity, Zap, Shield, Target, TrendingUp, AlertTriangle, Cpu, Globe, Lock } from 'lucide-react'

interface UserDashboardClientProps {
  user: User
  tier: UserTier
  initialData: {
    clawScore: number
    activeThreats: number
    executionsToday: number
    myceliumNodes: number
    successRate: number
  }
}

export function UserDashboardClient({ user, tier, initialData }: UserDashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isShadowRealm, setIsShadowRealm] = useState(isFeatureShadowed(tier, 'overview'))
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Mycelium Background Particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      connections: number[]
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        connections: []
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 255, 159, 0.3)'
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) +
            Math.pow(particle.y - otherParticle.y, 2)
          )
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(0, 255, 159, ${0.1 * (1 - distance / 150)})`
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Command Deck', icon: Target },
    { id: 'mycelium', label: 'The Living Brain', icon: Activity },
    { id: 'tools', label: 'Tools Command', icon: Zap },
    { id: 'executions', label: 'Executions & Runbooks', icon: Shield },
    { id: 'billing', label: 'Billing & Tiers', icon: TrendingUp }
  ]

  const renderTab = () => {
    const isShadowed = isFeatureShadowed(tier, activeTab as keyof typeof TIER_CONFIGS.explorer.canAccess)
    
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={initialData} isShadowed={isShadowed} />
      case 'mycelium':
        return <MyceliumTab isShadowed={isShadowed} />
      case 'tools':
        return <ToolsTab isShadowed={isShadowed} />
      case 'executions':
        return <ExecutionsTab isShadowed={isShadowed} />
      case 'billing':
        return <BillingTab tier={tier} onUpgrade={() => setShowUpgradeModal(true)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Mycelium Particle Background */}
      <canvas 
        ref={canvasRef}
        className="fixed inset-0 z-0"
      />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(255,0,51,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(0,255,159,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,212,255,0.03),transparent_70%)]" />
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px'
        }}
      />

      {/* Scanlines Effect */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 159, 0.03) 2px, rgba(0, 255, 159, 0.03) 4px)',
          animation: 'scanlines 8s linear infinite'
        }}
      />

      {/* Interactive Glow Effect */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 159, 0.05), transparent)`,
        }}
      />

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar - Mycelium Minimap */}
        <div className="w-80 bg-black/40 backdrop-blur-2xl border-r border-cyan-500/20">
          <MyceliumMinimap tier={tier} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 bg-black/40 backdrop-blur-2xl border-b border-cyan-500/20 flex items-center justify-between px-6">
            <div className="flex items-center gap-6">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div className="text-2xl font-bold">
                  <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    ClawGuru
                  </span>
                  <span className="text-cyan-400 ml-2">Command Cockpit</span>
                </div>
              </motion.div>
              <ThreatLevelGauge />
            </div>
            
            <div className="flex items-center gap-6">
              {/* Global Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span className="text-gray-300">Global Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300">42 Nodes Active</span>
                </div>
              </div>
              
              {/* Tier Badge */}
              <motion.div
                className={`px-4 py-2 rounded-full border backdrop-blur-sm ${
                  tier === 'enterprise' 
                    ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20' 
                    : tier === 'pro'
                    ? 'border-purple-500/50 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                    : tier === 'daypass'
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/20'
                    : 'border-gray-500/50 bg-gray-500/10 text-gray-400'
                }`}
                animate={{
                  boxShadow: tier !== 'explorer' 
                    ? '0 0 30px rgba(0, 255, 159, 0.3)' 
                    : '0 0 10px rgba(255, 255, 255, 0.1)',
                  scale: tier !== 'explorer' ? [1, 1.05, 1] : 1
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-sm font-bold tracking-wider">
                  {TIER_CONFIGS[tier].name.toUpperCase()}
                </span>
              </motion.div>

              {/* User Avatar */}
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-lg">
                  {user.email?.[0]?.toUpperCase()}
                </span>
              </motion.div>
            </div>
          </header>

          {/* Tab Navigation */}
          <div className="flex border-b border-cyan-500/20 bg-black/20 backdrop-blur-2xl">
            {tabs.map((tab, index) => {
              const isShadowed = isFeatureShadowed(tier, tab.id as keyof typeof TIER_CONFIGS.explorer.canAccess)
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-8 py-4 flex items-center gap-3 transition-all overflow-hidden group ${
                    isActive 
                      ? 'text-white bg-white/5' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                  <span className="font-medium tracking-wide">{tab.label}</span>
                  
                  {/* Lock Icon for Shadowed Features */}
                  {isShadowed && (
                    <motion.div
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Lock className="w-4 h-4 text-red-400" />
                    </motion.div>
                  )}
                  
                  {/* Active Tab Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-green-400"
                      layoutId="activeTab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>

            {/* Shadow Realm Overlay */}
            {isFeatureShadowed(tier, activeTab as keyof typeof TIER_CONFIGS.explorer.canAccess) && (
              <ShadowRealmOverlay 
                onUpgrade={() => setShowUpgradeModal(true)}
                tier={tier}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Quick Tools */}
        <div className="w-20 bg-black/40 backdrop-blur-2xl border-l border-cyan-500/20">
          <QuickTools tier={tier} />
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <UpgradeModal
            currentTier={tier}
            upgradePath={getUpgradePath(tier)}
            onClose={() => setShowUpgradeModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Add CSS for scanlines animation
const style = document.createElement('style')
style.textContent = `
  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(10px); }
  }
`
document.head.appendChild(style)
