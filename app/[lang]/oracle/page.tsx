"use client"

import React, { Suspense, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"
import { useI18n } from "@/components/i18n/I18nProvider"

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

interface RadarPoint {
  label: string
  risk: number
}
interface CVEItem {
  id: string
  title: string
  severity: Severity
  clawScore: number
  runbookSlug: string
}
interface OracleResult {
  scope: string[]
  predictiveScore: number
  radar: RadarPoint[]
  cves: CVEItem[]
  updatedAt: string
  suggestedStacks?: string[]
}

class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode; children?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback?: React.ReactNode; children?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  override componentDidCatch() {}
  override render() {
    if (this.state.hasError) return this.props.fallback || null
    return this.props.children as React.ReactElement
  }
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-white/5 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%);} }`}</style>
      <div className="h-full w-full opacity-0">.</div>
    </div>
  )
}

const RadarCanvas = dynamic(() => Promise.resolve(function RadarCanvasImpl({ data }: { data: RadarPoint[] }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    let raf = 0
    const start = performance.now()
    const draw = () => {
      const t = (performance.now() - start) / 1000
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) / 1.2)
      gradient.addColorStop(0, "rgba(0,184,255,0.12)")
      gradient.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      ctx.strokeStyle = "rgba(255,255,255,0.08)"
      ctx.lineWidth = 1
      for (let i = 1; i <= 4; i++) {
        const r = (Math.min(width, height) / 2.4) * (i / 4)
        ctx.beginPath()
        ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      const angleStep = (Math.PI * 2) / Math.max(1, data.length)
      const centerX = width / 2
      const centerY = height / 2
      const maxR = Math.min(width, height) / 2.6

      ctx.beginPath()
      data.forEach((p, i) => {
        const a = i * angleStep - Math.PI / 2
        const r = (p.risk / 100) * maxR
        const x = centerX + r * Math.cos(a)
        const y = centerY + r * Math.sin(a)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.fillStyle = "rgba(0,255,157,0.12)"
      ctx.fill()
      ctx.strokeStyle = "rgba(0,255,157,0.5)"
      ctx.stroke()

      data.forEach((p, i) => {
        const a = i * angleStep - Math.PI / 2
        const r = (p.risk / 100) * maxR
        const x = centerX + r * Math.cos(a)
        const y = centerY + r * Math.sin(a)
        const pulse = reduce ? 1 : 1 + 0.12 * Math.sin(t * 3 + i)
        ctx.beginPath()
        ctx.arc(x, y, 4 * pulse, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0,184,255,0.85)"
        ctx.fill()
      })
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener("resize", resize)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(raf)
    }
  }, [data, reduce])

  return <canvas ref={ref} className="w-full h-64 rounded-2xl border border-white/10 bg-black/40" aria-label="Predictive Risk Radar" />
}), { ssr: false })

const ScoreRing = dynamic(() => Promise.resolve(function ScoreRingImpl({ score, label }: { score: number; label: string }) {
  const reduce = useReducedMotion()
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (reduce) { setVal(score); return }
    let raf = 0
    const start = performance.now()
    const animate = () => {
      const t = (performance.now() - start) / 700
      const eased = Math.min(1, 1 - Math.pow(1 - t, 3))
      setVal(Math.round(eased * score))
      if (eased < 1) raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [score, reduce])

  return (
    <div className="relative w-36 h-36 grid place-items-center">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#00ff9d ${val * 3.6}deg, rgba(255,255,255,0.08) ${val * 3.6}deg)`,
          boxShadow: "0 0 40px rgba(0,255,157,0.25), inset 0 0 10px rgba(0,255,157,0.2)",
        }}
        aria-hidden
      />
      <div className="absolute inset-[10%] rounded-full bg-black/70 border border-white/10 backdrop-blur" />
      <div className="relative text-center">
        <div className="text-3xl font-extrabold text-white">{val}</div>
        <div className="text-[11px] uppercase tracking-wider text-cyan-300">{label}</div>
      </div>
    </div>
  )
}), { ssr: false })

export default function OraclePage({ params }: { params: { lang: string } }) {
  const { dict, locale } = useI18n()
  const t = dict.oracle
  const prefix = `/${locale}`

  const reduce = useReducedMotion()
  const [scopes, setScopes] = useState<string[]>(["nginx", "ubuntu-22.04", "aws-ec2"])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<OracleResult | null>(null)
  const [freeLimited, setFreeLimited] = useState<{ resetAt?: number } | null>(null)

  function addScope() {
    const s = input.trim()
    if (!s) return
    if (!scopes.includes(s)) setScopes((v) => [...v, s].slice(0, 8))
    setInput("")
  }
  function removeScope(s: string) {
    setScopes((v) => v.filter((x) => x !== s))
  }

  async function fetchOracle() {
    setBusy(true)
    setError(null)
    try {
      const url = new URL(window.location.href)
      const cve = (url.searchParams.get("cve") || "").toUpperCase()
      const sp = new URLSearchParams()
      if (cve) sp.set("cve", cve)
      if (!cve && scopes.length) sp.set("scope", scopes.join(","))
      const r = await fetch(`/api/oracle?${sp.toString()}`, { cache: "no-store" })
      if (r.status === 429) {
        const j = (await r.json().catch(() => ({}))) as { code?: string; resetAt?: number; message?: string }
        if (j?.code === "FREE_LIMIT") {
          setFreeLimited({ resetAt: j.resetAt })
          return
        }
        throw new Error(j?.message || "Rate limited")
      }
      if (!r.ok) throw new Error(String(r.status))
      const j = (await r.json()) as any
      const mapped: OracleResult = {
        scope: Array.isArray(j.scope) ? j.scope : [],
        predictiveScore: Number(j.predictiveScore) || 0,
        radar: Array.isArray(j.radar) ? j.radar : [],
        cves: Array.isArray(j.cves) ? j.cves : [],
        updatedAt: j.updatedAt || new Date().toISOString(),
        suggestedStacks: Array.isArray(j.suggestedStacks) ? j.suggestedStacks : [],
      }
      setData(mapped)
    } catch (e) {
      setError(t.fetch_error)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    // Prefill from URL cve/scope on first mount
    const url = new URL(window.location.href)
    const cve = url.searchParams.get("cve")
    const scopeQ = url.searchParams.get("scope")
    if (scopeQ && !cve) {
      const next = Array.from(new Set(scopeQ.split(/[\s,;|]+/).map((s) => s.trim()).filter(Boolean)))
      if (next.length) setScopes(next.slice(0, 8))
    }
    fetchOracle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <motion.header
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_0_22px_rgba(0,184,255,0.35)]">{t.title}</h1>
        <p className="text-gray-300 mt-2">{t.subtitle}</p>
      </motion.header>

      <section className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 backdrop-blur">
        <label className="text-sm font-semibold text-cyan-200">{t.scope_label}</label>
        <div className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addScope() }}
            placeholder={t.scope_placeholder}
            className="flex-1 rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-400/40"
            aria-label={t.scope_placeholder}
          />
          <button
            onClick={addScope}
            className="px-3 py-2 rounded-lg text-sm font-bold border border-cyan-500/40 bg-cyan-500/20 text-cyan-100 hover:shadow-[0_0_24px_rgba(0,184,255,0.35)]"
          >
            {t.add_scope}
          </button>
        </div>
        <p className="text-[12px] text-gray-400 mt-1">{t.scope_hint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {scopes.map((s) => (
            <motion.span
              key={s}
              whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
              className="group inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200 shadow-[inset_0_0_20px_rgba(0,184,255,0.08)]"
            >
              <span className="text-cyan-300">#{s}</span>
              <button
                aria-label={`${t.remove}: ${s}`}
                onClick={() => removeScope(s)}
                className="rounded-full bg-white/5 px-1 text-[10px] text-gray-300 hover:bg-white/10"
              >
                ×
              </button>
            </motion.span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <motion.button
            whileTap={reduce ? undefined : { scale: 0.98 }}
            onClick={fetchOracle}
            disabled={busy}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-cyan-500/40 bg-cyan-500/20 text-cyan-100 hover:shadow-[0_0_30px_rgba(0,184,255,0.35)] disabled:opacity-50"
          >
            {busy ? t.loading : t.predict_btn}
          </motion.button>
          {error && <span className="text-sm text-red-300">{error}</span>}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <section className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">{t.risk_radar}</h2>
            {(() => {
              const stacks = (data?.suggestedStacks && data.suggestedStacks.length ? data.suggestedStacks : scopes) || []
              return stacks.length ? (
                <a
                  href={`${prefix}/neuro?stack=${encodeURIComponent(stacks.join(","))}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/40 bg-emerald-500/15 text-emerald-100 hover:shadow-[0_0_20px_rgba(0,255,157,0.35)]"
                >
                  In Neuro analysieren
                </a>
              ) : null
            })()}
          </div>
          <ErrorBoundary fallback={<Shimmer className="h-64" />}>
            <Suspense fallback={<Shimmer className="h-64" />}>
              {data ? <RadarCanvas data={data.radar} /> : <Shimmer className="h-64" />}
            </Suspense>
          </ErrorBoundary>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">{t.live_score}</h2>
          </div>
          <ErrorBoundary fallback={<Shimmer className="h-36" />}>
            <Suspense fallback={<Shimmer className="h-36" />}>
              {data ? <ScoreRing score={data.predictiveScore} label="ClawPredict" /> : <Shimmer className="h-36" />}
            </Suspense>
          </ErrorBoundary>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 mt-6">
        <h2 className="text-white font-semibold mb-3">{t.cve_title}</h2>
        {!data && <Shimmer className="h-28" />}
        {data && (
          <ul className="space-y-3">
            {data.cves.map((cve) => (
              <li key={cve.id} className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/7.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-white font-semibold truncate">{cve.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[11px] px-2 py-[2px] rounded-full border ${
                        cve.severity === "CRITICAL" ? "border-red-500/40 text-red-300" :
                        cve.severity === "HIGH" ? "border-orange-500/40 text-orange-300" :
                        cve.severity === "MEDIUM" ? "border-yellow-500/40 text-yellow-200" : "border-green-500/40 text-green-300"
                      }`}>{cve.severity}</span>
                      <span className="text-[11px] px-2 py-[2px] rounded-full border border-cyan-500/40 text-cyan-200">
                        ClawScore {cve.clawScore}
                      </span>
                    </div>
                  </div>
                  <a
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border border-cyan-500/40 bg-cyan-500/15 text-cyan-100 hover:shadow-[0_0_20px_rgba(0,184,255,0.35)]"
                    href={`${prefix}/runbook/${encodeURIComponent(cve.runbookSlug)}`}
                  >
                    Runbook
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
    {freeLimited && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        <div className="p-6 rounded-3xl border text-center max-w-md w-[92%]"
             style={{ borderColor: "rgba(212,175,55,0.25)", background: "rgba(0,0,0,0.65)", boxShadow: "0 0 60px rgba(0,255,157,0.06) inset" }}>
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] mb-2" style={{ color: "#d4af37" }}>Premium Access</div>
          <div className="text-lg md:text-xl font-black text-white">Mehr Oracle‑Vorhersagen freischalten</div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a href={`${prefix}/pricing`} className="px-4 py-3 rounded-2xl font-black text-black text-sm"
               style={{ background: "linear-gradient(135deg,#ff0033,#ff7a00)" }}>Day Pass 9 €</a>
            <a href={`${prefix}/pricing`} className="px-4 py-3 rounded-2xl font-black text-black text-sm"
               style={{ background: "linear-gradient(135deg,#a78bfa,#00ff9d)" }}>Pro 49 € / Monat</a>
          </div>
          <div className="mt-2 text-xs text-gray-400">Day Pass: 24h Zugriff — Pro: dauerhaft mit History, Export & Neuro</div>
        </div>
      </div>
    )}
    </>
  )
}
