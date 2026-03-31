'use client'

import { useState, useTransition, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Search,
  Zap,
  Lock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  Network,
  KeyRound,
  Settings2,
  Bug,
  ExternalLink
} from 'lucide-react'
import { runSecurityCheck } from '@/app/actions/security-check'
import type { SecurityCheckResult, SecurityRecommendation } from '@/app/actions/security-check'
import type { UserTier } from '@/lib/tier-access'

/* ── Helpers ── */

function scoreColor(score: number): string {
  if (score <= 33) return '#EF4444'
  if (score <= 59) return '#F97316'
  if (score <= 84) return '#EAB308'
  return '#22C55E'
}

function scoreGradientId(score: number): string {
  if (score <= 33) return 'secRingCrit'
  if (score <= 59) return 'secRingWarn'
  if (score <= 84) return 'secRingGood'
  return 'secRingBest'
}

function ratingBg(rating: string): string {
  switch (rating) {
    case 'Kritisch': return 'rgba(239,68,68,0.08)'
    case 'Verbesserungswürdig': return 'rgba(249,115,22,0.08)'
    case 'Gut': return 'rgba(234,179,8,0.08)'
    default: return 'rgba(34,197,94,0.08)'
  }
}

function ratingBorder(rating: string): string {
  switch (rating) {
    case 'Kritisch': return 'rgba(239,68,68,0.25)'
    case 'Verbesserungswürdig': return 'rgba(249,115,22,0.25)'
    case 'Gut': return 'rgba(234,179,8,0.25)'
    default: return 'rgba(34,197,94,0.25)'
  }
}

function severityColor(severity: SecurityRecommendation['severity']): string {
  switch (severity) {
    case 'critical': return '#EF4444'
    case 'high': return '#F97316'
    case 'medium': return '#EAB308'
    case 'low': return '#22C55E'
  }
}

function severityLabel(severity: SecurityRecommendation['severity']): string {
  switch (severity) {
    case 'critical': return 'KRITISCH'
    case 'high': return 'HOCH'
    case 'medium': return 'MITTEL'
    case 'low': return 'NIEDRIG'
  }
}

function categoryLabel(key: string): string {
  switch (key) {
    case 'network': return 'Network'
    case 'auth': return 'Auth'
    case 'config': return 'Config'
    case 'vulnerabilities': return 'Vulnerabilities'
    default: return key
  }
}

function categoryIcon(key: string) {
  switch (key) {
    case 'network': return Network
    case 'auth': return KeyRound
    case 'config': return Settings2
    case 'vulnerabilities': return Bug
    default: return Shield
  }
}

/* ── Circular Progress Ring ── */

function ScoreRing({ score }: { score: number }) {
  const R = 50
  const CIRC = 2 * Math.PI * R
  const offset = CIRC * (1 - score / 100)
  const color = scoreColor(score)
  const gradId = scoreGradientId(score)

  return (
    <svg width="160" height="160" viewBox="0 0 120 120" className="block">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        <filter id="secGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle cx="60" cy="60" r={R}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="8"
      />

      {/* Progress arc */}
      <motion.circle
        cx="60" cy="60" r={R}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        initial={{ strokeDashoffset: CIRC }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        transform="rotate(-90 60 60)"
        filter="url(#secGlow)"
      />

      {/* Score text */}
      <text x="60" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="inherit">
        {score}
      </text>
      <text x="60" y="70" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="inherit" letterSpacing="2">
        /100
      </text>
    </svg>
  )
}

/* ── Gold Spinner ── */

function GoldSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#EAB308', borderRightColor: 'rgba(234,179,8,0.3)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-2 rounded-full border border-yellow-500/10" />
        <Shield className="absolute inset-0 m-auto w-6 h-6" style={{ color: '#EAB308' }} />
      </div>
      <p className="text-sm font-medium tracking-widest uppercase" style={{ color: '#EAB308' }}>
        Analysiere…
      </p>
    </div>
  )
}

/* ── Category Bar ── */

function CategoryBar({ label, score, icon: Icon }: { label: string; score: number; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }) {
  const color = scoreColor(score)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color: '#A1A1AA' }} />
          <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">{label}</span>
        </div>
        <span className="text-xs font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}

/* ── Recommendation Card ── */

function RecommendationCard({ rec, isPremiumLocked }: { rec: SecurityRecommendation; isPremiumLocked: boolean }) {
  const color = severityColor(rec.severity)

  if (isPremiumLocked) {
    return (
      <div
        className="relative rounded-xl border p-4 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.015)',
          borderColor: 'rgba(255,255,255,0.06)'
        }}
      >
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-[3px] bg-black/60 rounded-xl flex items-center justify-center z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border" style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.2)' }}>
            <Lock className="w-3.5 h-3.5" style={{ color: '#EAB308' }} />
            <span className="text-xs font-semibold tracking-wider" style={{ color: '#EAB308' }}>PRO FEATURE</span>
          </div>
        </div>
        {/* Blurred content placeholder */}
        <div className="space-y-2 select-none pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: `${color}15`, color }}>
              {severityLabel(rec.severity)}
            </div>
          </div>
          <div className="h-4 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-full rounded bg-white/5" />
          <div className="h-3 w-2/3 rounded bg-white/5" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl border p-4 transition-all hover:border-yellow-500/20 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.015)',
        borderColor: 'rgba(255,255,255,0.06)'
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider"
            style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
          >
            {severityLabel(rec.severity)}
          </span>
          {rec.tool && (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wide"
              style={{ background: 'rgba(234,179,8,0.06)', color: '#EAB308', border: '1px solid rgba(234,179,8,0.15)' }}
            >
              {rec.tool}
            </span>
          )}
        </div>
      </div>

      <h4 className="text-sm font-semibold text-white mb-1.5 leading-snug">{rec.title}</h4>
      <p className="text-[12px] text-gray-500 leading-relaxed mb-3">{rec.description}</p>

      <div
        className="flex items-center gap-2 p-2.5 rounded-lg font-mono text-[11px] text-gray-400"
        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="text-yellow-500 flex-shrink-0">$</span>
        <span className="truncate">{rec.action}</span>
      </div>
    </motion.div>
  )
}

/* ── Main Component ── */

function formatInputTypeLabel(inputType: SecurityCheckResult['inputType']): string {
  switch (inputType) {
    case 'ip': return '● IP-Adresse'
    case 'domain': return '● Domain'
    case 'url': return '● URL'
    default: return '● Unbekannter Typ'
  }
}

interface InstantSecurityCheckProps {
  tier: UserTier
  onUpgrade?: () => void
}

export function InstantSecurityCheck({ tier, onUpgrade }: InstantSecurityCheckProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SecurityCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const isPaid = tier === 'daypass' || tier === 'pro' || tier === 'enterprise'

  function handleCheck() {
    if (!input.trim() || isPending) return
    setError(null)
    startTransition(async () => {
      try {
        const res = await runSecurityCheck(input.trim())
        setResult(res)
      } catch (e: unknown) {
        setError((e as Error)?.message ?? 'Fehler beim Ausführen der Sicherheitsprüfung')
      }
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleCheck()
  }

  const freeRecsCount = 2
  const visibleRecs = result ? (isPaid ? result.recommendations : result.recommendations.slice(0, freeRecsCount)) : []
  const lockedRecs = result && !isPaid ? result.recommendations.slice(freeRecsCount) : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-3xl border"
      style={{
        background: 'linear-gradient(135deg, rgba(234,179,8,0.04) 0%, rgba(10,10,10,0.96) 50%, rgba(10,10,10,0.99) 100%)',
        borderColor: 'rgba(234,179,8,0.15)',
        boxShadow: '0 0 80px rgba(234,179,8,0.05), inset 0 1px 0 rgba(255,255,255,0.04)'
      }}
    >
      {/* Decorative glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(234,179,8,0.07) 0%, transparent 70%)' }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(234,179,8,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 p-6 md:p-8">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(234,179,8,0.2)', '0 0 40px rgba(234,179,8,0.1)', '0 0 20px rgba(234,179,8,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0"
            style={{ background: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.25)' }}
          >
            <Shield className="w-5 h-5" style={{ color: '#EAB308' }} />
          </motion.div>
          <div>
            <h2 className="text-base font-bold tracking-wide text-white">
              Instant Security Check
            </h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Sofortiger Claw Security Score — kostenlos
            </p>
          </div>
          <div className="ml-auto flex-shrink-0">
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border"
              style={{ background: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.2)', color: '#EAB308' }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* ── Input Row ── */}
        <div className="flex gap-3 mb-2">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="IP, Domain oder Bot-URL eingeben (z.B. 185.123.45.67 oder example.com)"
              disabled={isPending}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder-gray-600 outline-none transition-all disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                caretColor: '#EAB308'
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(234,179,8,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(234,179,8,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          <motion.button
            onClick={handleCheck}
            disabled={isPending || !input.trim()}
            whileHover={{ scale: isPending ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm overflow-hidden flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(234,179,8,0.12)',
              border: '1px solid rgba(234,179,8,0.3)',
              color: '#EAB308',
              boxShadow: '0 0 20px rgba(234,179,8,0.08)'
            }}
          >
            {/* Shimmer on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(234,179,8,0.06), transparent)' }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            <Zap className="w-4 h-4 relative" />
            <span className="relative whitespace-nowrap">Jetzt prüfen</span>
          </motion.button>
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        {/* ── Loading State ── */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GoldSpinner />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && !isPending && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-6"
            >
              {/* ── Score Hero ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ring + Score */}
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0">
                    <ScoreRing score={result.score} />
                  </div>
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-sm font-bold border"
                      style={{
                        background: ratingBg(result.rating),
                        borderColor: ratingBorder(result.rating),
                        color: scoreColor(result.score)
                      }}
                    >
                      {result.score > 84 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      {result.rating}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Geprüft: <span className="text-gray-300 font-mono">{result.input}</span>
                    </p>
                    <p className="text-[11px] text-gray-600 mt-1">
                      {formatInputTypeLabel(result.inputType)}
                      {' · '}
                      {new Date(result.checkedAt).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                    </p>
                  </div>
                </div>

                {/* Category Breakdown — premium gate */}
                {isPaid ? (
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 mb-3">Kategorie-Breakdown</p>
                    {Object.entries(result.categories).map(([key, val]) => {
                      const Icon = categoryIcon(key)
                      return (
                        <CategoryBar
                          key={key}
                          label={categoryLabel(key)}
                          score={val}
                          icon={Icon}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <div
                    className="relative rounded-2xl border p-5 overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.01)',
                      borderColor: 'rgba(234,179,8,0.12)'
                    }}
                  >
                    {/* Blurred preview */}
                    <div className="space-y-3 blur-sm pointer-events-none select-none">
                      {['Network', 'Auth', 'Config', 'Vulnerabilities'].map(cat => (
                        <div key={cat}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-400">{cat}</span>
                            <span className="text-xs text-gray-400">??/100</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10" />
                        </div>
                      ))}
                    </div>
                    {/* Upgrade nudge */}
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] bg-black/50 rounded-2xl">
                      <div className="text-center px-4">
                        <Lock className="w-5 h-5 mx-auto mb-2" style={{ color: '#EAB308' }} />
                        <p className="text-xs font-semibold text-white mb-1">Detailierter Breakdown</p>
                        <p className="text-[11px] text-gray-400 mb-3">Ab Day Pass verfügbar</p>
                        {onUpgrade && (
                          <button
                            onClick={onUpgrade}
                            className="text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all hover:border-yellow-500/40"
                            style={{ color: '#EAB308', borderColor: 'rgba(234,179,8,0.25)', background: 'rgba(234,179,8,0.06)' }}
                          >
                            Freischalten
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Recommendations ── */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2" style={{ color: '#EAB308' }}>
                    <Sparkles className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Handlungsempfehlungen</span>
                  </h3>
                  {!isPaid && (
                    <span className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {freeRecsCount} von {result.recommendations.length} sichtbar
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {visibleRecs.map(rec => (
                    <RecommendationCard key={rec.id} rec={rec} isPremiumLocked={false} />
                  ))}
                  {lockedRecs.map(rec => (
                    <RecommendationCard key={rec.id} rec={rec} isPremiumLocked={true} />
                  ))}
                </div>
              </div>

              {/* ── Paywall CTA for free users ── */}
              {!isPaid && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative rounded-2xl border p-6 overflow-hidden text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(234,179,8,0.04), rgba(10,10,10,0.97))',
                    borderColor: 'rgba(234,179,8,0.18)',
                    boxShadow: '0 0 60px rgba(234,179,8,0.04)'
                  }}
                >
                  {/* Shimmer */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(234,179,8,0.04), transparent)' }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>

                  <div className="relative">
                    <p className="text-xs text-gray-500 mb-2 tracking-widest uppercase">Vollständiger Report wartet auf dich</p>
                    <h4 className="text-lg font-black text-white mb-1">
                      {result.recommendations.length - freeRecsCount} weitere Empfehlungen gesperrt
                    </h4>
                    <p className="text-sm text-gray-400 mb-5">
                      + Kategorie-Breakdown · Personalisierte Runbooks · One-Click Execute · PDF-Export
                    </p>
                    {onUpgrade && (
                      <motion.button
                        onClick={onUpgrade}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm border"
                        style={{
                          background: 'rgba(234,179,8,0.1)',
                          borderColor: 'rgba(234,179,8,0.3)',
                          color: '#EAB308',
                          boxShadow: '0 0 30px rgba(234,179,8,0.08)'
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                        IGNITE FULL CONTROL
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                    <p className="text-[11px] text-gray-600 mt-3">Ab €9/Tag · Sofortzugang · Kein Abo nötig</p>
                  </div>
                </motion.div>
              )}

              {/* ── Next Steps for paid users ── */}
              {isPaid && (
                <div>
                  <h3 className="text-sm font-semibold tracking-wide flex items-center gap-2 mb-4" style={{ color: '#EAB308' }}>
                    <ChevronRight className="w-4 h-4" />
                    <span className="uppercase tracking-widest">Nächste Schritte</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { label: 'Runbook ausführen', desc: 'Automatisch patchen & härten', icon: Zap },
                      { label: 'Vollständigen Report', desc: 'PDF-Export aller Findings', icon: ExternalLink },
                      { label: 'Monitoring aktivieren', desc: 'Automatische Re-Scans täglich', icon: Shield }
                    ].map(step => (
                      <motion.button
                        key={step.label}
                        whileHover={{ scale: 1.02, borderColor: 'rgba(234,179,8,0.25)' }}
                        whileTap={{ scale: 0.98 }}
                        className="text-left p-4 rounded-xl border transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.015)',
                          borderColor: 'rgba(255,255,255,0.06)'
                        }}
                      >
                        <step.icon className="w-4 h-4 mb-2" style={{ color: '#EAB308' }} />
                        <div className="text-sm font-semibold text-white">{step.label}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{step.desc}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
