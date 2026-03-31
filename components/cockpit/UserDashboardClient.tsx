'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, UserTier, TIER_CONFIGS, isFeatureShadowed, getUpgradePath } from '@/lib/tier-access'
import type { DashboardData } from '@/types/dashboard'
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
import { Activity, Zap, Shield, Target, TrendingUp, Cpu, Globe, Lock, Sparkles } from 'lucide-react'

/* ── Color Palette (Google AI Studio inspired) ──
   Base:    #0A0A0A (deep black)
   Gold:    #EAB308 (luxury accent)
   Silver:  #A1A1AA (graphite secondary)
   ────────────────────────────────────────────── */

interface UserDashboardClientProps {
  user: User
  tier: UserTier
  initialData: DashboardData
}

export function UserDashboardClient({ user, tier, initialData }: UserDashboardClientProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'mycelium', label: 'Mycelium', icon: Activity },
    { id: 'tools', label: 'Tools', icon: Zap },
    { id: 'executions', label: 'Executions', icon: Shield },
    { id: 'billing', label: 'Billing', icon: TrendingUp }
  ]

  const renderTab = () => {
    const isShadowed = isFeatureShadowed(tier, activeTab as keyof typeof TIER_CONFIGS.explorer.canAccess)
    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={initialData} tier={tier} onUpgrade={() => setShowUpgradeModal(true)} />
      case 'mycelium':
        return <MyceliumTab isShadowed={isShadowed} nodes={initialData.nodes} />
      case 'tools':
        return <ToolsTab isShadowed={isShadowed} executions={initialData.recentExecutions} />
      case 'executions':
        return <ExecutionsTab isShadowed={isShadowed} executions={initialData.recentExecutions} />
      case 'billing':
        return <BillingTab tier={tier} onUpgrade={() => setShowUpgradeModal(true)} data={initialData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{ background: '#0A0A0A' }}>

      {/* ── Background Layers ── */}
      <div className="fixed inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 0%, rgba(234,179,8,0.04) 0%, transparent 50%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 100%, rgba(161,161,170,0.03) 0%, transparent 50%)' }} />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(234,179,8,0.15) 3px, rgba(234,179,8,0.15) 4px)',
          }}
        />
      </div>

      {/* Interactive gold glow following cursor */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(234,179,8,0.03), transparent)`,
        }}
      />

      {/* ── Main Layout ── */}
      <div className="relative z-10 flex h-screen">

        {/* Left Sidebar */}
        <div
          className="w-72 border-r flex-shrink-0"
          style={{
            background: 'rgba(10,10,10,0.8)',
            borderColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <MyceliumMinimap tier={tier} dbNodes={initialData.nodes} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* ── Top Bar ── */}
          <header
            className="h-14 flex items-center justify-between px-6 border-b flex-shrink-0"
            style={{
              background: 'rgba(10,10,10,0.85)',
              borderColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="flex items-center gap-5">
              <motion.div
                className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Gold dot indicator */}
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#EAB308', boxShadow: '0 0 8px rgba(234,179,8,0.6)' }}
                />
                <div className="text-lg font-bold tracking-tight">
                  <span style={{ color: '#EAB308' }}>ClawGuru</span>
                  <span className="text-gray-500 font-normal ml-2 text-sm">Dashboard</span>
                </div>
              </motion.div>

              {/* Subtle divider */}
              <div className="w-px h-5 bg-white/5" />

              <ThreatLevelGauge activeThreats={initialData.activeThreats} />
            </div>

            <div className="flex items-center gap-5">
              {/* Global indicators */}
              <div className="hidden lg:flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3" style={{ color: '#EAB308' }} />
                  <span>Network</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" style={{ color: '#A1A1AA' }} />
                  <span>{initialData.myceliumNodes} Nodes</span>
                </div>
              </div>

              {/* Tier Badge */}
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider border"
                style={{
                  color: tier === 'enterprise' ? '#EAB308' : tier === 'pro' ? '#EAB308' : '#A1A1AA',
                  borderColor: tier === 'enterprise' ? 'rgba(234,179,8,0.3)' : tier === 'pro' ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.08)',
                  background: tier === 'enterprise' ? 'rgba(234,179,8,0.08)' : tier === 'pro' ? 'rgba(234,179,8,0.05)' : 'rgba(255,255,255,0.03)',
                  boxShadow: tier !== 'explorer' ? '0 0 20px rgba(234,179,8,0.1)' : 'none'
                }}
              >
                {TIER_CONFIGS[tier].name.toUpperCase()}
              </div>

              {/* User Avatar */}
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border"
                style={{
                  background: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(161,161,170,0.1))',
                  borderColor: 'rgba(234,179,8,0.2)'
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-semibold text-sm">
                  {user.email?.[0]?.toUpperCase()}
                </span>
              </motion.div>
            </div>
          </header>

          {/* ── Tab Navigation ── */}
          <div
            className="flex border-b flex-shrink-0"
            style={{
              background: 'rgba(10,10,10,0.6)',
              borderColor: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(12px)'
            }}
          >
            {tabs.map((tab, index) => {
              const isShadowed = isFeatureShadowed(tier, tab.id as keyof typeof TIER_CONFIGS.explorer.canAccess)
              const isActive = activeTab === tab.id
              const Icon = tab.icon

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-6 py-3.5 flex items-center gap-2.5 transition-all overflow-hidden group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(180deg, rgba(234,179,8,0.03) 0%, transparent 100%)' }}
                  />

                  <Icon
                    className="w-4 h-4 transition-colors duration-300"
                    style={{ color: isActive ? '#EAB308' : '#52525B' }}
                  />
                  <span
                    className="text-sm font-medium tracking-wide transition-colors duration-300"
                    style={{ color: isActive ? '#FFFFFF' : '#71717A' }}
                  >
                    {tab.label}
                  </span>

                  {/* Lock overlay */}
                  {isShadowed && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5" style={{ color: '#EAB308' }} />
                    </div>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      layoutId="activeTab"
                      style={{ background: 'linear-gradient(90deg, transparent, #EAB308, transparent)' }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
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

        {/* Right Sidebar */}
        <div
          className="w-16 border-l flex-shrink-0"
          style={{
            background: 'rgba(10,10,10,0.8)',
            borderColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)'
          }}
        >
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
