"use client"

import React, { Suspense, useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"

interface NeuroDict {
  title: string
  subtitle: string
  pick_stack: string
  add_stack: string
  input_placeholder: string
  recommend: string
  recommendations: string
  plan_title: string
  score_title: string
  confidence: string
  loading: string
  fetch_error: string
  available_label?: string
  chosen_label?: string
}
interface DictShape { neuro?: Partial<NeuroDict> }

interface NeuroRunbook {
  slug: string
  title: string
  summary: string
  score: number
}
interface NeuroPlanStep {
  id: string
  title: string
  detail: string
}
interface NeuroResult {
  stacks: string[]
  neuroScore: number
  confidence: number
  recommendations: NeuroRunbook[]
  plan: NeuroPlanStep[]
  updatedAt: string
}

class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode; children?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback?: React.ReactNode; children?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch() {}
  render() { return this.state.hasError ? (this.props.fallback || null) : (this.props.children as React.ReactElement) }
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
          background: `conic-gradient(#00b8ff ${val * 3.6}deg, rgba(255,255,255,0.08) ${val * 3.6}deg)`,
          boxShadow: "0 0 40px rgba(0,184,255,0.25), inset 0 0 10px rgba(0,184,255,0.2)",
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

export default function NeuroPage({ dict }: { dict?: DictShape }) {
  const t: NeuroDict = useMemo(() => ({
    title: dict?.neuro?.title ?? "Neuro – Personal Intelligence",
    subtitle: dict?.neuro?.subtitle ?? "Dein Stack. Deine Ziele. Dein persönlicher Ausführungsplan.",
    pick_stack: dict?.neuro?.pick_stack ?? "Stacks wählen",
    add_stack: dict?.neuro?.add_stack ?? "Hinzufügen",
    input_placeholder: dict?.neuro?.input_placeholder ?? "z. B. nodejs, postgres, kubernetes, aws-eks",
    recommend: dict?.neuro?.recommend ?? "Empfehlen",
    recommendations: dict?.neuro?.recommendations ?? "Empfehlungen",
    plan_title: dict?.neuro?.plan_title ?? "Ausführungsplan",
    score_title: dict?.neuro?.score_title ?? "Neuro Score",
    confidence: dict?.neuro?.confidence ?? "Confidence",
    loading: dict?.neuro?.loading ?? "Lade...",
    fetch_error: dict?.neuro?.fetch_error ?? "Laden fehlgeschlagen",
    available_label: dict?.neuro?.available_label ?? "Available",
    chosen_label: dict?.neuro?.chosen_label ?? "Chosen",
  }), [dict])

  const pathname = usePathname()
  const lang = useMemo(() => {
    const seg = (pathname || "").split("/")[1] || "en"
    return seg || "en"
  }, [pathname])
  const prefix = `/${lang}`
  const reduce = useReducedMotion()
  const [available, setAvailable] = useState<string[]>([
    "nodejs", "nginx", "postgres", "redis", "kubernetes", "aws-eks", "gcp-gke", "terraform", "github-actions",
  ])
  const [chosen, setChosen] = useState<string[]>(["nodejs", "postgres", "nginx"])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<NeuroResult | null>(null)

  function addStack() {
    const s = input.trim().toLowerCase()
    if (!s) return
    if (!chosen.includes(s)) setChosen((v) => [...v, s].slice(0, 8))
    if (!available.includes(s)) setAvailable((v) => [...v, s].slice(0, 20))
    setInput("")
  }
  function onDragStart(e: React.DragEvent<HTMLButtonElement>, s: string) {
    e.dataTransfer.setData("text/plain", s)
    e.currentTarget.style.opacity = "0.6"
  }
  function onDragEnd(e: React.DragEvent<HTMLButtonElement>) {
    e.currentTarget.style.opacity = ""
  }
  function onDropToChosen(e: React.DragEvent<HTMLDivElement>) {
    const s = e.dataTransfer.getData("text/plain")
    if (s && !chosen.includes(s)) setChosen((v) => [...v, s].slice(0, 8))
  }
  function onDropToAvailable(e: React.DragEvent<HTMLDivElement>) {
    const s = e.dataTransfer.getData("text/plain")
    if (s) setChosen((v) => v.filter((x) => x !== s))
  }

  async function runNeuro() {
    setBusy(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set("stack", chosen.join(","))
      params.set("limit", "8")
      const r = await fetch(`/api/neuro?${params.toString()}`, { cache: "no-store" })
      if (!r.ok) throw new Error(String(r.status))
      const j = (await r.json()) as {
        recommended_runbooks: Array<{ slug: string; title: string; summary: string; clawScore?: number; relevance?: number }>
        execution_plan: string
        estimated_time: string
        neuroScore?: number
        confidence?: number
      }
      const recs: NeuroRunbook[] = (j.recommended_runbooks || []).map((x) => ({
        slug: x.slug,
        title: x.title,
        summary: x.summary,
        score: Math.round(x.clawScore || 0),
      }))
      const plan: NeuroPlanStep[] = recs.map((r, i) => ({
        id: `step-${i + 1}`,
        title: r.title,
        detail: r.summary,
      }))
      const result: NeuroResult = {
        stacks: chosen.slice(0, 8),
        neuroScore: Math.max(40, Math.min(98, Math.round(j.neuroScore ?? (recs.reduce((a, b) => a + b.score, 0) / Math.max(1, recs.length))))),
        confidence: Math.max(40, Math.min(97, Math.round(j.confidence ?? 60))),
        recommendations: recs,
        plan,
        updatedAt: new Date().toISOString(),
      }
      setData(result)
    } catch {
      setError(t.fetch_error)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const stackQ = url.searchParams.get("stack")
    if (stackQ) {
      const next = Array.from(new Set(stackQ.split(/[\s,;|]+/).map((s) => s.trim().toLowerCase()).filter(Boolean))).slice(0, 8)
      if (next.length) setChosen(next)
      setTimeout(() => runNeuro(), 0)
    } else {
      runNeuro()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
      <motion.header
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-white drop-shadow-[0_0_22px_rgba(0,255,157,0.35)]">{t.title}</h1>
        <p className="text-gray-300 mt-2">{t.subtitle}</p>
      </motion.header>

      <section className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 backdrop-blur">
        <label className="text-sm font-semibold text-cyan-200">{t.pick_stack}</label>
        <div className="mt-2 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addStack() }}
            placeholder={t.input_placeholder}
            className="flex-1 rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-400/40"
            aria-label={t.input_placeholder}
          />
          <button
            onClick={addStack}
            className="px-3 py-2 rounded-lg text-sm font-bold border border-emerald-500/40 bg-emerald-500/20 text-emerald-100 hover:shadow-[0_0_24px_rgba(0,255,157,0.35)]"
          >
            {t.add_stack}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToAvailable}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
            aria-label={t.available_label}
          >
            <div className="text-[12px] text-gray-400 mb-2">{t.available_label}</div>
            <div className="flex flex-wrap gap-2">
              {available.map((s) => (
                <button
                  key={`avail-${s}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, s)}
                  onDragEnd={onDragEnd}
                  onClick={() => { if (!chosen.includes(s)) setChosen((v) => [...v, s]) }}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropToChosen}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
            aria-label={t.chosen_label}
          >
            <div className="text-[12px] text-gray-400 mb-2">{t.chosen_label}</div>
            <div className="flex flex-wrap gap-2">
              {chosen.map((s) => (
                <button
                  key={`chosen-${s}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, s)}
                  onDragEnd={onDragEnd}
                  onClick={() => setChosen((v) => v.filter((x) => x !== s))}
                  className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100 hover:shadow-[0_0_18px_rgba(0,255,157,0.3)] focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                >
                  {s} ×
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <motion.button
            whileTap={reduce ? undefined : { scale: 0.98 }}
            onClick={runNeuro}
            disabled={busy}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-emerald-500/40 bg-emerald-500/20 text-emerald-100 hover:shadow-[0_0_30px_rgba(0,255,157,0.35)] disabled:opacity-50"
          >
            {busy ? t.loading : t.recommend}
          </motion.button>
          {error && (
            <div className="text-sm text-red-300 flex items-center gap-2">
              <span>{error}</span>
              <button onClick={runNeuro} className="underline decoration-dotted hover:text-red-200">Retry</button>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <h2 className="text-white font-semibold mb-3">{t.recommendations}</h2>
          {!data && <Shimmer className="h-28" />}
          {data && (
            <ul className="space-y-3">
              {data.recommendations.map((r) => (
                <li key={r.slug} className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/7.5 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-semibold truncate">{r.title}</div>
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">{r.summary}</p>
                      <div className="mt-2 text-[11px] px-2 py-[2px] rounded-full border border-cyan-500/40 text-cyan-200 inline-block">
                        ClawScore {r.score}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a
                        href={`/runbook/${encodeURIComponent(r.slug)}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-cyan-500/40 bg-cyan-500/15 text-cyan-100 hover:shadow-[0_0_20px_rgba(0,184,255,0.35)]"
                      >
                        Runbook
                      </a>
                      <a
                        href={`${prefix}/summon?q=${encodeURIComponent(r.title)}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/40 bg-emerald-500/15 text-emerald-100 hover:shadow-[0_0_20px_rgba(0,255,157,0.35)]"
                      >
                        In Summon starten
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3 className="text-white font-semibold mt-6 mb-3">{t.plan_title}</h3>
          {!data && <Shimmer className="h-24" />}
          {data && (
            <ol className="space-y-3">
              {data.plan.map((st, i) => (
                <motion.li
                  key={st.id}
                  initial={reduce ? undefined : { opacity: 0, x: -8 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-20% 0%" }}
                  transition={{ type: "spring", stiffness: 180, damping: 22, delay: reduce ? 0 : i * 0.03 }}
                  className="relative pl-4"
                >
                  <div className="absolute left-0 top-2 w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(0,255,157,0.8)]" aria-hidden />
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-white font-semibold">{st.title}</div>
                    <p className="text-sm text-gray-300 mt-1">{st.detail}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <h2 className="text-white font-semibold mb-3">{t.score_title}</h2>
          <ErrorBoundary fallback={<Shimmer className="h-36" />}>
            <Suspense fallback={<Shimmer className="h-36" />}>
              {data ? <ScoreRing score={data.neuroScore} label="Neuro" /> : <Shimmer className="h-36" />}
            </Suspense>
          </ErrorBoundary>
          <div className="mt-4">
            <div className="text-[12px] text-gray-400">{t.confidence}</div>
            <div className="mt-1 h-2 w-full rounded-full bg-white/5 border border-white/10 overflow-hidden" aria-label={t.confidence}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data?.confidence ?? 0}%` }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_24px_rgba(0,255,157,0.35)]"
              />
            </div>
            <div className="text-right text-xs text-gray-300 mt-1">{data?.confidence ?? 0}%</div>
          </div>
        </section>
      </div>
    </main>
  )
}
