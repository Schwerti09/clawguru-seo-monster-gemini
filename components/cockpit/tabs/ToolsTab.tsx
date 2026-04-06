'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useDashboardToolRun } from '@/hooks/useDashboardToolRun'
import { motion, AnimatePresence } from 'framer-motion'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n'
import { RoastMyStack } from '@/components/roast/RoastMyStack'
import {
  Zap,
  Brain,
  Shield,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Cpu,
  Database,
  Wifi,
  CheckCircle,
  Clock,
  Target,
  Lock,
  Inbox
} from 'lucide-react'
import type { DashboardExecution } from '@/types/dashboard'

interface ToolsTabProps {
  isShadowed: boolean
  executions: DashboardExecution[]
}

/* ── Glassmorphism card style helper ── */
const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)',
  borderColor: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(20px)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
} as const

function localeFromPathname(pathname: string | null): Locale {
  if (!pathname) return DEFAULT_LOCALE
  const first = pathname.split("/").filter(Boolean)[0]
  return first && SUPPORTED_LOCALES.includes(first as Locale) ? (first as Locale) : DEFAULT_LOCALE
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'gerade eben'
  if (mins < 60) return `vor ${mins} Min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `vor ${hours}h`
  const days = Math.floor(hours / 24)
  return `vor ${days}d`
}

export function ToolsTab({ isShadowed, executions }: ToolsTabProps) {
  const pathname = usePathname()
  const { runTool, runningToolId } = useDashboardToolRun()
  const dashLocale = localeFromPathname(pathname)
  const dashPrefix = `/${dashLocale}`

  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [executionProgress, setExecutionProgress] = useState(0)
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle')
  const [executionError, setExecutionError] = useState<string | null>(null)
  const [lastRunSummary, setLastRunSummary] = useState<string | null>(null)

  // Derive tool stats from real executions
  const totalRuns = executions.length
  const completedRuns = executions.filter(e => e.status === 'completed').length
  const avgSuccess = totalRuns > 0 ? Math.round(completedRuns / totalRuns * 100) : 0
  const lastRun = executions.length > 0 ? timeAgo(executions[0].created_at) : '–'

  const tools = [
    { id: 'summon', name: 'ClawGuru Summon', description: 'KI-gesteuerte Echtzeit-Bedrohungserkennung', icon: Zap, features: ['Echtzeit-Analyse', 'Threat Intelligence', 'Automated Response'], status: 'ready', category: 'Offensive' },
    { id: 'oracle', name: 'Security Oracle', description: 'Prädiktive Sicherheitsanalyse mit ML-Modellen', icon: Brain, features: ['72h Forecast', 'Risk Assessment', 'Strategic Planning'], status: 'ready', category: 'Intelligence' },
    { id: 'neuro', name: 'Neuro Security', description: 'Neuronale Mustererkennung für Sicherheitsanomalien', icon: Activity, features: ['Pattern Detection', 'Anomaly Recognition', 'Learning System'], status: 'ready', category: 'Defensive' },
    { id: 'check', name: 'Security Check', description: 'Umfassende Sicherheitsaudits und Schwachstellenbewertung', icon: Shield, features: ['Full Audit', 'Compliance Check', 'Remediation Guide'], status: 'ready', category: 'Audit' }
  ]

  const handleToolExecute = async (toolId: string) => {
    if (isShadowed) return
    setExecutionError(null)
    setLastRunSummary(null)
    setActiveTool(toolId)
    setExecutionStatus('running')
    setExecutionProgress(4)

    const tick = setInterval(() => {
      setExecutionProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 14))
    }, 350)

    try {
      const result = await runTool(toolId)
      clearInterval(tick)
      if (!result.ok) {
        setExecutionStatus('error')
        setExecutionProgress(0)
        setExecutionError(result.message)
        return
      }
      setExecutionProgress(100)
      setExecutionStatus('completed')
      setLastRunSummary(`Lauf serverseitig protokolliert. Execution-ID: ${result.executionId}`)
    } catch {
      clearInterval(tick)
      setExecutionStatus('error')
      setExecutionProgress(0)
      setExecutionError('Netzwerkfehler.')
    }
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 rounded-2xl border p-5"
        style={{ ...glass, borderColor: 'rgba(34,211,238,0.15)' }}
      >
        <RoastMyStack locale={dashLocale} prefix={dashPrefix} variant="compact" />
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)' }}>
            <Zap className="w-6 h-6" style={{ color: '#EAB308' }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Tools Command Center</h2>
            <p className="text-gray-500 text-sm">Security-Tools mit einem Klick ausführen.</p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Active Tools', value: String(tools.length), icon: CheckCircle },
            { label: 'Avg Success', value: avgSuccess > 0 ? `${avgSuccess}%` : '–', icon: Activity },
            { label: 'Last Run', value: lastRun, icon: Clock },
            { label: 'Total Runs', value: String(totalRuns), icon: Target }
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border p-4" style={glass}>
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className="w-3.5 h-3.5" style={{ color: '#EAB308' }} />
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-600">{stat.label}</span>
              </div>
              <div className="text-xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 gap-5">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`relative group ${isShadowed ? 'pointer-events-none' : 'cursor-pointer'}`}
            onClick={() => {
              if (isShadowed || runningToolId) return
              void handleToolExecute(tool.id)
            }}
            whileHover={!isShadowed && !runningToolId ? { y: -4, transition: { duration: 0.3 } } : {}}
          >
            <div
              className="relative p-6 rounded-2xl border overflow-hidden transition-all duration-500 group-hover:border-yellow-500/20"
              style={glass}
            >
              {/* Gold hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(234,179,8,0.06) 0%, transparent 70%)' }} />

              {isShadowed && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl z-10" />}

              <div className="relative z-[5]">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:border-yellow-500/20" style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(255,255,255,0.06)' }}>
                      <tool.icon className="w-5 h-5 transition-colors duration-500 group-hover:text-yellow-500" style={{ color: '#A1A1AA' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(234,179,8,0.1)', color: '#EAB308' }}>{tool.status}</div>
                        <span className="text-[10px] text-gray-600">{tool.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-600 uppercase">Success</div>
                    <div className="text-lg font-black" style={{ color: '#EAB308' }}>{avgSuccess > 0 ? `${avgSuccess}%` : '–'}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{tool.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[{ label: 'Total Runs', value: String(totalRuns), icon: Clock }, { label: 'Last Used', value: lastRun, icon: Activity }].map(s => (
                    <div key={s.label} className="rounded-lg p-2.5 border" style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.04)' }}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <s.icon className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-600">{s.label}</span>
                      </div>
                      <div className="text-sm font-semibold text-white">{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-5">
                  {tool.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1 h-1 rounded-full" style={{ background: '#EAB308' }} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Button */}
                <motion.button
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border"
                  style={isShadowed
                    ? { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.04)', color: '#52525B' }
                    : { background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)', color: '#EAB308' }
                  }
                  whileHover={!isShadowed ? { scale: 1.02 } : {}}
                  whileTap={!isShadowed ? { scale: 0.98 } : {}}
                  disabled={isShadowed}
                >
                  {isShadowed ? <><Lock className="w-4 h-4" /> Upgrade Required</> : <><Play className="w-4 h-4" /> Execute Tool</>}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Execution Panel */}
      <AnimatePresence>
        {activeTool && !isShadowed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-6 rounded-2xl border"
            style={{ ...glass, borderColor: 'rgba(234,179,8,0.12)', boxShadow: '0 0 60px rgba(234,179,8,0.04)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.15)' }}>
                  {(() => { const t = tools.find(x => x.id === activeTool); const I = t?.icon; return I ? <I className="w-5 h-5" style={{ color: '#EAB308' }} /> : null })()}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{tools.find(t => t.id === activeTool)?.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{
                      background: executionStatus === 'running' ? '#EAB308' : executionStatus === 'completed' ? '#22C55E' : executionStatus === 'error' ? '#EF4444' : '#52525B',
                      boxShadow: executionStatus === 'running' ? '0 0 6px rgba(234,179,8,0.5)' : 'none'
                    }} />
                    <span className="text-xs capitalize" style={{ color: executionStatus === 'running' ? '#EAB308' : executionStatus === 'completed' ? '#22C55E' : executionStatus === 'error' ? '#F87171' : '#A1A1AA' }}>{executionStatus}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {executionStatus === 'running' && (
                  <button onClick={() => { setExecutionStatus('idle'); setExecutionProgress(0); setActiveTool(null) }} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:border-red-500/30" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.15)' }}>
                    <Pause className="w-3 h-3 inline mr-1" />Stop
                  </button>
                )}
                {executionStatus === 'completed' && (
                  <button onClick={() => { setExecutionStatus('idle'); setExecutionProgress(0) }} className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all" style={{ color: '#EAB308', background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.15)' }}>
                    <RotateCcw className="w-3 h-3 inline mr-1" />Reset
                  </button>
                )}
                <button onClick={() => setActiveTool(null)} className="text-gray-600 hover:text-white text-xs ml-1">✕</button>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-gray-500">Execution Progress</span>
                <span className="font-semibold" style={{ color: '#EAB308' }}>{Math.round(executionProgress)}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <motion.div className="h-full rounded-full" style={{ width: `${executionProgress}%`, background: 'linear-gradient(90deg, #A1A1AA, #EAB308)' }} />
              </div>
            </div>

            {/* Resource stats */}
            <div className="grid grid-cols-3 gap-3">
              {[{ label: 'CPU', icon: Cpu, val: 45 }, { label: 'Memory', icon: Database, val: 60 }, { label: 'Network', icon: Wifi, val: 35 }].map(r => (
                <div key={r.label} className="rounded-lg p-3 border" style={{ background: 'rgba(255,255,255,0.015)', borderColor: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <r.icon className="w-3 h-3 text-gray-600" />
                    <span className="text-[10px] text-gray-600">{r.label}</span>
                  </div>
                  <div className="text-base font-bold text-white">{r.val}%</div>
                </div>
              ))}
            </div>

            {executionStatus === 'completed' && lastRunSummary && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl border" style={{ background: 'rgba(234,179,8,0.04)', borderColor: 'rgba(234,179,8,0.12)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4" style={{ color: '#EAB308' }} />
                  <span className="text-sm font-semibold" style={{ color: '#EAB308' }}>Ausführung erfolgreich</span>
                </div>
                <p className="text-xs text-gray-500">{lastRunSummary}</p>
              </motion.div>
            )}
            {executionStatus === 'error' && executionError && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl border" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}>
                <p className="text-xs text-red-300">{executionError}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
