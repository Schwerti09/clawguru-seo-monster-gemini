'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  Shield, 
  AlertTriangle, 
  Target,
  Globe,
  Cpu,
  Database,
  Wifi,
  Brain,
  Sparkles
} from 'lucide-react'
import PremiumMetricCard from '../premium/PremiumMetricCard'
import PremiumGauge from '../premium/PremiumGauge'
import { InstantSecurityCheck } from '../InstantSecurityCheck'
import type { DashboardData } from '@/types/dashboard'
import type { UserTier } from '@/lib/tier-access'

const ClawScore3D = dynamic(() => import('../premium/ClawScore3D'), {
  ssr: false,
  loading: () => (
    <div className="w-56 h-56 rounded-full border border-yellow-500/20 grid place-items-center">
      <div className="text-xs text-gray-500 tracking-widest uppercase">Loading 3D…</div>
    </div>
  )
})

interface OverviewTabProps {
  data: DashboardData
  tier: UserTier
  onUpgrade?: () => void
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'gerade eben'
  if (mins < 60) return `vor ${mins} Min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `vor ${hours}h`
  const days = Math.floor(hours / 24)
  return `vor ${days} Tag${days > 1 ? 'en' : ''}`
}

export function OverviewTab({ data, tier, onUpgrade }: OverviewTabProps) {
  // Derive threat level from real active threats count
  const threatLevel = data.activeThreats === 0 ? 5
    : data.activeThreats <= 3 ? 20
    : data.activeThreats <= 10 ? 45
    : data.activeThreats <= 25 ? 70
    : 90

  const systemStatus = [
    { name: 'Global Network', status: data.myceliumNodes > 0 ? 'Operational' : 'Offline', icon: Globe, ok: data.myceliumNodes > 0 },
    { name: 'AI Engine', status: 'Optimal', icon: Cpu, ok: true },
    { name: 'Executions', status: data.totalExecutions > 0 ? `${data.totalExecutions} Runs` : 'Keine', icon: Database, ok: data.totalExecutions > 0 },
    { name: 'Threats', status: data.activeThreats > 0 ? `${data.activeThreats} Aktiv` : 'Keine', icon: Wifi, ok: data.activeThreats === 0 }
  ]

  // Build recent activity from real threats + executions
  const recentActivity = [
    ...data.threats.slice(0, 3).map(t => ({
      time: timeAgo(t.created_at),
      action: t.title || `Bedrohung: ${t.severity}`,
      severity: t.severity as 'low' | 'medium' | 'high' | 'critical'
    })),
    ...data.recentExecutions.slice(0, 3).map(e => ({
      time: timeAgo(e.created_at),
      action: `Execution ${e.status}: ${e.runbook_id}`,
      severity: (e.status === 'failed' ? 'high' : e.status === 'completed' ? 'low' : 'medium') as 'low' | 'medium' | 'high'
    }))
  ].slice(0, 5)

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">

      {/* ── Instant Security Check ── */}
      <InstantSecurityCheck tier={tier} onUpgrade={onUpgrade} />

      {/* ── Hero Section: 3D ClawScore + Gauge + Live Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="relative overflow-hidden rounded-3xl border p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(234,179,8,0.03) 0%, rgba(10,10,10,0.95) 40%, rgba(10,10,10,0.98) 100%)',
            borderColor: 'rgba(234,179,8,0.12)',
            boxShadow: '0 0 80px rgba(234,179,8,0.04), inset 0 1px 0 rgba(255,255,255,0.04)'
          }}
        >
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />

          {/* Radial glow top-left */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.06) 0%, transparent 70%)' }} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* 3D ClawScore Ring */}
            <div className="flex justify-center">
              <ClawScore3D
                score={data.clawScore}
                maxScore={1000}
                className="w-56 h-56"
              />
            </div>

            {/* Premium Threat Gauge */}
            <div className="flex justify-center">
              <PremiumGauge
                value={threatLevel}
                label="Threat Level"
                sublabel="Echtzeit-Analyse"
              />
            </div>

            {/* Live Stats Column */}
            <div className="space-y-3">
              {[
                { label: 'System Pulse', value: data.successRate > 0 ? `${data.successRate}%` : '–', icon: Brain, color: '#EAB308' },
                { label: 'Active Nodes', value: String(data.myceliumNodes), icon: Activity, color: '#A1A1AA' },
                { label: 'Success Rate', value: `${data.successRate}%`, icon: Shield, color: '#EAB308' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.15 }}
                  className="rounded-xl border p-4 transition-all hover:border-yellow-500/20"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gray-500">
                      {stat.label}
                    </span>
                    <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-black text-white" style={{ textShadow: `0 0 20px ${stat.color}30` }}>
                    {stat.value}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <PremiumMetricCard
          title="Claw Score"
          value={data.clawScore}
          icon={Target}
          delay={0.1}
          accentColor="#EAB308"
        />
        <PremiumMetricCard
          title="Active Threats"
          value={data.activeThreats}
          icon={AlertTriangle}
          delay={0.2}
          accentColor="#EF4444"
        />
        <PremiumMetricCard
          title="Executions Today"
          value={data.executionsToday}
          icon={Zap}
          delay={0.3}
          accentColor="#EAB308"
        />
        <PremiumMetricCard
          title="Mycelium Nodes"
          value={data.myceliumNodes}
          icon={Activity}
          delay={0.4}
          accentColor="#A1A1AA"
        />
        <PremiumMetricCard
          title="Success Rate"
          value={data.successRate}
          unit="%"
          icon={Shield}
          delay={0.5}
          accentColor="#EAB308"
        />
      </div>

      {/* ── System Status & Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
            borderColor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
          }}
        >
          <h3 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: '#EAB308' }}>
            <Shield className="w-4 h-4" />
            <span className="tracking-wide uppercase">System Status</span>
          </h3>

          <div className="space-y-2.5">
            {systemStatus.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl border transition-all hover:border-yellow-500/15"
                  style={{
                    background: 'rgba(255,255,255,0.015)',
                    borderColor: 'rgba(255,255,255,0.05)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: item.ok ? '#EAB308' : '#EF4444', boxShadow: item.ok ? '0 0 6px rgba(234,179,8,0.5)' : '0 0 6px rgba(239,68,68,0.5)' }}
                    />
                    <span className="text-[11px] font-medium" style={{ color: item.ok ? '#EAB308' : '#EF4444' }}>
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-2xl border p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))',
            borderColor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
          }}
        >
          <h3 className="text-sm font-semibold mb-5 flex items-center gap-2" style={{ color: '#EAB308' }}>
            <Activity className="w-4 h-4" />
            <span className="tracking-wide uppercase">Letzte Aktivität</span>
          </h3>

          <div className="space-y-2.5">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl border transition-all hover:border-yellow-500/15"
                style={{
                  background: 'rgba(255,255,255,0.015)',
                  borderColor: 'rgba(255,255,255,0.05)'
                }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background: activity.severity === 'high' ? '#EF4444' : activity.severity === 'medium' ? '#EAB308' : '#A1A1AA',
                    boxShadow: activity.severity === 'high' ? '0 0 6px rgba(239,68,68,0.5)' : activity.severity === 'medium' ? '0 0 6px rgba(234,179,8,0.3)' : 'none'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-snug">{activity.action}</p>
                  <p className="text-[11px] text-gray-600 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Performance Overview ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="rounded-2xl border p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(234,179,8,0.02), rgba(10,10,10,0.95))',
          borderColor: 'rgba(234,179,8,0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 60px rgba(234,179,8,0.03), inset 0 1px 0 rgba(255,255,255,0.03)'
        }}
      >
        <h3 className="text-sm font-semibold mb-6 flex items-center gap-2" style={{ color: '#EAB308' }}>
          <TrendingUp className="w-4 h-4" />
          <span className="tracking-wide uppercase">Performance Overview</span>
        </h3>

        <div
          className="h-48 rounded-xl border flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.01)',
            borderColor: 'rgba(255,255,255,0.05)'
          }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" style={{ color: '#EAB308' }} />
              <span
                className="text-5xl font-black text-white"
                style={{ textShadow: '0 0 40px rgba(234,179,8,0.3)' }}
              >
                {data.successRate > 0 ? `${data.successRate}%` : '–'}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-400">Overall Success Rate</div>
            <div className="text-[11px] text-gray-600 mt-1">{data.totalExecutions > 0 ? `Basierend auf ${data.totalExecutions} Ausführungen` : 'Noch keine Ausführungen'}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
