'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
  Filter,
  Calendar,
  Cpu,
  Shield,
  Zap,
  Brain,
  Target,
  FileText,
  Terminal,
  ChevronDown,
  Inbox
} from 'lucide-react'
import type { DashboardExecution } from '@/types/dashboard'

interface ExecutionsTabProps {
  isShadowed: boolean
  executions: DashboardExecution[]
}

const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)',
  borderColor: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(20px)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
} as const

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

function durationMin(start: string, end: string | null): number | null {
  if (!end) return null
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
}

export function ExecutionsTab({ isShadowed, executions }: ExecutionsTabProps) {
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')

  const liveExecutions = new Set(executions.filter(e => e.status === 'running').map(e => e.id))

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return { color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)' }
      case 'running': return { color: '#EAB308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.15)' }
      case 'failed': return { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' }
      default: return { color: '#A1A1AA', bg: 'rgba(161,161,170,0.08)', border: 'rgba(161,161,170,0.15)' }
    }
  }

  const filteredExecutions = executions.filter(e => filter === 'all' || e.status === filter)

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)' }}>
              <Activity className="w-6 h-6" style={{ color: '#EAB308' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Executions & Runbooks</h2>
              <p className="text-gray-500 text-sm">Security-Tool-Ausführungen überwachen und verwalten.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-xl text-xs font-medium border transition-all hover:border-yellow-500/20 text-gray-400" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />Schedule
            </button>
            <button className="px-3 py-2 rounded-xl text-xs font-medium border transition-all" style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)', color: '#EAB308' }}>
              <Play className="w-3.5 h-3.5 inline mr-1.5" />New Execution
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Running', value: executions.filter(e => e.status === 'running').length, icon: Activity },
            { label: 'Completed', value: executions.filter(e => e.status === 'completed').length, icon: CheckCircle },
            { label: 'Failed', value: executions.filter(e => e.status === 'failed').length, icon: XCircle },
            { label: 'Total', value: executions.length, icon: Target }
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-3" style={glass}>
              <div className="flex items-center gap-1.5 mb-1">
                <s.icon className="w-3.5 h-3.5" style={{ color: '#EAB308' }} />
                <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-gray-600">{s.label}</span>
              </div>
              <div className="text-xl font-black text-white">{s.value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5 text-gray-600" /><span className="text-xs text-gray-600">Filter:</span></div>
        <div className="flex gap-1.5">
          {['all', 'running', 'completed', 'failed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className="px-3 py-1 rounded-lg text-xs font-medium border transition-all" style={filter === s ? { background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)', color: '#EAB308' } : { background: 'transparent', borderColor: 'rgba(255,255,255,0.06)', color: '#71717A' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 ml-auto"><Clock className="w-3.5 h-3.5 text-gray-600" /><span className="text-xs text-gray-600">Zeitraum:</span></div>
        <div className="flex gap-1.5">
          {['1h', '24h', '7d', '30d'].map(r => (
            <button key={r} onClick={() => setTimeRange(r)} className="px-3 py-1 rounded-lg text-xs font-medium border transition-all" style={timeRange === r ? { background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)', color: '#EAB308' } : { background: 'transparent', borderColor: 'rgba(255,255,255,0.06)', color: '#71717A' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Execution List */}
      <div className="space-y-3">
        {filteredExecutions.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 rounded-2xl border" style={glass}>
            <Inbox className="w-10 h-10 mb-3" style={{ color: '#EAB308', opacity: 0.4 }} />
            <p className="text-sm text-gray-500 mb-1">Keine Ausführungen vorhanden</p>
            <p className="text-[11px] text-gray-600">Starte ein Tool, um deine ersten Ergebnisse zu sehen.</p>
          </motion.div>
        )}
        {filteredExecutions.map((exec, index) => {
          const isExpanded = selectedExecution === exec.id
          const isLive = liveExecutions.has(exec.id)
          const ss = getStatusStyle(exec.status)
          const dur = durationMin(exec.started_at, exec.completed_at)

          return (
            <motion.div
              key={exec.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`relative group ${isShadowed ? 'pointer-events-none' : 'cursor-pointer'}`}
              onClick={() => setSelectedExecution(isExpanded ? null : exec.id)}
            >
              <div
                className="p-5 rounded-2xl border transition-all duration-300"
                style={{
                  ...glass,
                  borderColor: isExpanded ? 'rgba(234,179,8,0.2)' : 'rgba(255,255,255,0.06)',
                  boxShadow: isExpanded ? '0 0 40px rgba(234,179,8,0.04)' : glass.boxShadow
                }}
              >
                {isShadowed && <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl" />}

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(255,255,255,0.06)' }}>
                        <Activity className="w-5 h-5" style={{ color: '#A1A1AA' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-semibold text-white truncate">{exec.runbook_id}</h3>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border" style={{ color: ss.color, background: ss.bg, borderColor: ss.border }}>
                            {exec.status}
                          </span>
                          {isLive && (
                            <motion.span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'rgba(234,179,8,0.08)', color: '#EAB308' }} animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#EAB308' }} /> LIVE
                            </motion.span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-gray-600">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(exec.created_at)}</span>
                          {dur !== null && <span>{dur} min</span>}
                        </div>
                      </div>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-gray-600 ml-3">
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-5 pt-5"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                      >
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#EAB308' }}><FileText className="w-3.5 h-3.5" /> Details</h4>
                            <div className="space-y-2 text-[11px]">
                              <div className="flex justify-between"><span className="text-gray-500">Runbook</span><span className="text-white font-medium">{exec.runbook_id}</span></div>
                              <div className="flex justify-between"><span className="text-gray-500">Gestartet</span><span className="text-white font-medium">{new Date(exec.started_at).toLocaleString()}</span></div>
                              {exec.completed_at && <div className="flex justify-between"><span className="text-gray-500">Beendet</span><span className="text-white font-medium">{new Date(exec.completed_at).toLocaleString()}</span></div>}
                              {dur !== null && <div className="flex justify-between"><span className="text-gray-500">Dauer</span><span className="text-white font-medium">{dur} min</span></div>}
                            </div>
                          </div>
                          {exec.result && (
                            <div>
                              <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#EAB308' }}><Terminal className="w-3.5 h-3.5" /> Ergebnis</h4>
                              <div className="rounded-xl p-3 h-28 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.4)' }}>
                                <pre className="text-[11px] font-mono text-gray-400 whitespace-pre-wrap">{typeof exec.result === 'string' ? exec.result : JSON.stringify(exec.result, null, 2)}</pre>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all hover:border-yellow-500/20 text-gray-400" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
                            <Eye className="w-3 h-3 inline mr-1" />Details
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredExecutions.length === 0 && (
        <div className="text-center py-12"><span className="text-gray-600 text-sm">Keine Ausführungen gefunden</span></div>
      )}
    </div>
  )
}
