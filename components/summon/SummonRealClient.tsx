"use client"

import React, { memo, useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import dynamic from "next/dynamic"

type SwarmType = "attack" | "defense" | "recovery" | "optimize"

type SummonResult = {
  title: string
  summary: string
  slug: string
  clawScore: number
  risks: string[]
  steps: string[]
  confidence: number
  estimatedTime: string
}

type Dict = any

export default function SummonRealClient({ dict, prefix = "" }: { dict?: Dict; prefix?: string }) {
  const reduce = useReducedMotion()
  const t: any = (dict && (dict as any).summon ? (dict as any).summon : dict) ?? {}
  const [type, setType] = useState<SwarmType>("defense")
  const [q, setQ] = useState<string>("Nginx 502 bei Node + TLS 1.3 – wie härten?")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [freeLimited, setFreeLimited] = useState<{ resetAt?: number } | null>(null)
  const [res, setRes] = useState<SummonResult | null>(null)
  const [progress, setProgress] = useState(0)
  const mounted = useRef(true)
  const recRef = useRef<any | null>(null)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    return () => {
      mounted.current = false
      try {
        if (recRef.current) {
          recRef.current.stop()
          recRef.current = null
        }
      } catch {}
    }
  }, [])

  // URL-Param-Prefill & One-Click Auto-Start
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      const qp = (url.searchParams.get("q") || "").trim()
      const st = (url.searchParams.get("swarmType") || "").toLowerCase()
      const auto = url.searchParams.get("auto")
      if (qp) setQ(qp.slice(0, 1200))
      if (st === "attack" || st === "defense" || st === "recovery" || st === "optimize") {
        setType(st as SwarmType)
      }
      if (auto && (qp || q)) {
        // ensure state updates are applied first
        setTimeout(() => { if (mounted.current) startSummon() }, 0)
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const examples: string[] =
    (t?.example_queries_items as string[]) ||
    ["AWS S3 Public Bucket", "PostgreSQL Connection Pooling", "Kubernetes RBAC", "SSH Hardening", "Nginx TLS 1.3"]

  const placeholder: string = t?.input_placeholder || "Beschreibe dein Problem (Stack, Provider, Ports) …"

  function onPrefillClick(s: string) {
    setQ(s)
  }

  function toggleVoice() {
    try {
      const SR = (typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null
      if (!SR) {
        setErr(t?.voice_unsupported || "Spracherkennung wird von deinem Browser nicht unterstützt.")
        return
      }
      if (recRef.current) {
        try { recRef.current.stop() } catch {}
        recRef.current = null
        setListening(false)
        return
      }
      const rec = new SR()
      rec.lang = (t?.voice_lang as string) || (typeof navigator !== 'undefined' ? navigator.language : '') || "en-US"
      rec.interimResults = true
      ;(rec as any).maxAlternatives = 1
      rec.continuous = false
      let finalText = ""
      let gotAny = false
      rec.onresult = (e: any) => {
        let interim = ""
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const tr = e.results[i][0]?.transcript || ""
          if (e.results[i].isFinal) finalText += tr + " "
          else interim += tr
        }
        const combined = (finalText + interim).trim()
        if (combined) gotAny = true
        if (mounted.current) setQ(combined)
      }
      rec.onnomatch = () => {
        if (!gotAny && mounted.current) setErr(t?.voice_no_speech || "Kein Sprachsignal erkannt. Bitte erneut versuchen.")
      }
      rec.onspeechend = () => {
        try { rec.stop() } catch {}
      }
      rec.onend = () => {
        recRef.current = null
        if (mounted.current) setListening(false)
      }
      rec.onerror = (ev: any) => {
        if (mounted.current) {
          const code = ev?.error as string | undefined
          if (code === 'no-speech') {
            setErr(t?.voice_no_speech || "Kein Sprachsignal erkannt. Bitte näher ans Mikrofon sprechen und erneut versuchen.")
          } else if (code === 'audio-capture') {
            setErr(t?.voice_no_mic || "Kein Mikrofon gefunden oder Zugriff verweigert.")
          } else if (code === 'not-allowed') {
            setErr(t?.voice_perm_denied || "Mikrofon-Berechtigung verweigert. Bitte im Browser erlauben.")
          } else {
            setErr(code || t?.voice_error || "Voice-Fehler")
          }
        }
        recRef.current = null
        if (mounted.current) setListening(false)
      }
      recRef.current = rec
      setListening(true)
      rec.start()
      // Hard timeout if no speech is detected within 8s
      window.setTimeout(() => {
        if (recRef.current === rec && !gotAny) {
          try { rec.stop() } catch {}
        }
      }, 8000)
    } catch (e: any) {
      if (mounted.current) setErr(e?.message || t?.voice_error || "Voice-Fehler")
      recRef.current = null
      if (mounted.current) setListening(false)
    }
  }

  async function startSummon() {
    const query = q.trim()
    if (!query) return
    setBusy(true)
    setErr(null)
    setRes(null)
    setFreeLimited(null)
    setProgress(0)

    let i = 0
    const id = window.setInterval(() => {
      i = Math.min(95, i + Math.max(1, Math.round(5 - i / 25)))
      if (mounted.current) setProgress(i)
    }, 80)

    try {
      const r = await fetch("/api/summon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ q: query, swarmType: type }),
      })
      if (r.status === 429) {
        const j = (await r.json().catch(() => ({}))) as { code?: string; resetAt?: number; message?: string }
        if (j?.code === "FREE_LIMIT") {
          if (mounted.current) setFreeLimited({ resetAt: j.resetAt })
          return
        }
        throw new Error(j?.message || "Rate limited")
      }
      if (!r.ok) throw new Error(String(r.status))
      const j = (await r.json()) as SummonResult
      if (mounted.current) {
        setRes(j)
      }
    } catch (e: any) {
      if (mounted.current) setErr(e?.message || "Fehler")
    } finally {
      window.clearInterval(id)
      if (mounted.current) setProgress(100)
      setTimeout(() => {
        if (mounted.current) setBusy(false)
      }, 200)
    }
  }

  return (
    <ErrorBoundary fallback={<div className="rounded-2xl border border-red-400/30 bg-red-500/10 text-red-200 p-4">{t?.error_boundary_fallback || "Ein Fehler ist aufgetreten."}</div>}>
      <div className="space-y-6">
        <SwarmTypeCards current={type} onChange={setType} reduce={reduce || false} dict={t} />

      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
        <div className="flex flex-wrap gap-2 mb-3">
          {examples.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => onPrefillClick(s)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-500/10 transition"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative">
          <textarea
            value={q}
            onChange={(e) => setQ(e.target.value.slice(0, 1200))}
            rows={4}
            placeholder={placeholder}
            className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-3 text-sm text-gray-200 outline-none focus:border-cyan-400/40"
          />
          <div className="absolute bottom-1 right-2 text-[11px] text-gray-400">{q.length}/1200</div>
          <button
            onClick={toggleVoice}
            aria-label={listening ? (t?.voice_stop_label || "Stop Voice") : (t?.voice_label || "Voice")}
            title={listening ? (t?.voice_stop_label || "Stop Voice") : (t?.voice_label || "Voice")}
            className={`absolute top-1.5 right-2 h-8 w-8 grid place-items-center rounded-md border ${
              listening ? 'border-red-400/50 bg-red-500/10 text-red-200' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            <MicIcon />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <motion.button
            whileTap={reduce ? undefined : { scale: 0.98 }}
            onClick={startSummon}
            disabled={busy}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-cyan-500/40 bg-cyan-500/20 text-cyan-100 hover:shadow-[0_0_30px_rgba(0,184,255,0.35)] disabled:opacity-50"
          >
            {busy ? (t?.analyzing_label || "Analysiere…") : t?.start_label || "Summon starten"}
          </motion.button>
          {busy && (
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

        {freeLimited && (
          <div className="rounded-2xl p-4 border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-md">
            <div className="text-sm font-semibold text-white mb-1">{t?.free_limit_title || "Free-Limit erreicht"}</div>
            <div className="text-xs text-gray-300">
              {t?.free_limit_desc || "Du hast dein tägliches kostenloses Summon verbraucht. Hol dir den Daypass für unbegrenzte Nutzung."}
            </div>
            <div className="mt-3">
              <a
                className="inline-block px-3 py-2 rounded-lg text-xs font-bold border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
                href={`${prefix}/daypass` || "/daypass"}
              >
                {t?.daypass_btn || "Day Pass holen"}
              </a>
            </div>
          </div>
        )}

        <ResultPanel result={res} busy={busy} err={err} prefix={prefix} dict={t} reduce={reduce || false} />
      </div>
    </ErrorBoundary>
  )
}

function SwarmTypeCards({
  current,
  onChange,
  reduce,
  dict,
}: {
  current: SwarmType
  onChange: (v: SwarmType) => void
  reduce: boolean
  dict?: Dict
}) {
  const cards: Array<{ k: SwarmType; label: string; desc: string; color: string }> = [
    { k: "attack", label: dict?.attack_label || "Attack", desc: dict?.attack_desc || "Offensive Hunt & Pen Test", color: "#d946ef" },
    { k: "defense", label: dict?.defense_label || "Defense", desc: dict?.defense_desc || "Hardening & Shield", color: "#22d3ee" },
    { k: "recovery", label: dict?.recovery_label || "Recovery", desc: dict?.recovery_desc || "Incident Fix & Verify", color: "#22c55e" },
    { k: "optimize", label: dict?.optimize_label || "Optimize", desc: dict?.optimize_desc || "Latency & Cost", color: "#eab308" },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c) => (
        <TiltCard
          key={c.k}
          active={current === c.k}
          onClick={() => onChange(c.k)}
          color={c.color}
          reduce={reduce}
          title={c.label}
          desc={c.desc}
        />
      ))}
    </div>
  )
}

const TiltCard = memo(function TiltCard({
  active,
  onClick,
  color,
  title,
  desc,
  reduce,
}: {
  active: boolean
  onClick: () => void
  color: string
  title: string
  desc: string
  reduce: boolean
}) {
  const ref = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      const rx = (0.5 - y) * 10
      const ry = (x - 0.5) * 12
      el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${active ? 6 : 0}px)`
    }
    const onLeave = () => {
      el.style.transform = `perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)`
    }
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
    }
  }, [reduce, active])
  return (
    <motion.button
      ref={ref as any}
      whileHover={reduce ? undefined : { y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left bg-black/40 backdrop-blur-md transition ${
        active ? "border-white/20" : "border-white/10"
      }`}
      style={{
        boxShadow: active ? `0 0 36px ${color}55` : "none",
      }}
    >
      <div
        className="h-8 w-8 rounded-md border mb-2"
        style={{ background: `${color}33`, borderColor: `${color}66` }}
      />
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="text-xs text-gray-300">{desc}</div>
    </motion.button>
  )
})

function ResultPanel({
  result,
  busy,
  err,
  dict,
  prefix,
  reduce,
}: {
  result: SummonResult | null
  busy: boolean
  err: string | null
  dict?: Dict
  prefix: string
  reduce: boolean
}) {
  if (busy && !result) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 animate-pulse backdrop-blur-md">
        <div className="h-4 w-1/3 bg-white/10 rounded mb-2" />
        <div className="h-3 w-2/3 bg-white/10 rounded mb-2" />
        <div className="h-3 w-1/2 bg-white/10 rounded mb-2" />
        <div className="h-28 w-full bg-white/5 rounded" />
      </div>
    )
  }
  if (err) {
    return (
      <div className="rounded-2xl border border-red-400/30 bg-red-500/10 text-red-200 p-4">
        <div className="text-sm font-semibold mb-1">Fehler</div>
        <div className="text-xs">{err}</div>
      </div>
    )
  }
  if (!result) return null

  const runbookHref = result.slug ? `${prefix || ""}/runbook/${result.slug}`.replace(/\/\//g, "/") : "/runbooks"
  const copy = async () => {
    try {
      const text =
        `${result.title}\n\n${result.summary}\n\nSteps:\n- ${result.steps.join("\n- ")}\n\n` +
        `Score: ${result.clawScore} · Confidence: ${result.confidence} · ETA: ${result.estimatedTime}`
      await navigator.clipboard.writeText(text)
    } catch {}
  }
  const shareUrl = typeof window !== "undefined" ? window.location.origin + runbookHref : runbookHref

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <ScoreRing value={result.clawScore} label={dict?.clawscore_label || "ClawScore"} reduce={reduce} />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <StatPill label={dict?.confidence_label || "Confidence"} value={`${result.confidence}%`} />
            <StatPill label={dict?.eta_label || "ETA"} value={result.estimatedTime} />
          </div>
        </div>
        <div className="md:flex-1">
          <div className="text-white font-semibold">{result.title}</div>
          <div className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{result.summary}</div>
          {result.risks?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {result.risks.slice(0, 6).map((r) => (
                <span key={r} className="px-2 py-0.5 rounded-full text-[11px] border border-white/10 text-gray-300">
                  {r}
                </span>
              ))}
            </div>
          )}
          {result.steps?.length > 0 && (
            <ol className="mt-3 list-decimal pl-4 text-sm text-gray-200 space-y-1">
              {result.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          )}
          {result.steps?.length > 0 && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-gray-300 mb-1">Diagram</div>
              <LazyDiagramCard steps={result.steps} reduce={reduce} />
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a
              href={runbookHref}
              className="px-3 py-2 rounded-lg text-xs font-bold border border-emerald-400/40 bg-emerald-500/10 text-emerald-100 hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]"
            >
              {(dict?.view_link_label as string) || "Ansehen →"}
            </a>
            <button
              onClick={copy}
              className="px-3 py-2 rounded-lg text-xs font-bold border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10"
            >
              {dict?.copy_label || "Copy"}
            </button>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.title)}&url=${encodeURIComponent(
                shareUrl
              )}`}
              className="px-3 py-2 rounded-lg text-xs font-bold border border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
            >
              {dict?.share_x_label || "Share X"}
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              className="px-3 py-2 rounded-lg text-xs font-bold border border-blue-400/40 bg-blue-500/10 text-blue-100"
            >
              {dict?.share_linkedin_label || "Share LinkedIn"}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreRing({ value, label, reduce }: { value: number; label: string; reduce: boolean }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (reduce) {
      setV(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 900
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 0.5 - 0.5 * Math.cos(Math.PI * p)
      setV(Math.round(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, reduce])
  const angle = Math.max(0, Math.min(100, v))
  return (
    <div className="relative h-28 w-28">
      <div
        className="h-full w-full rounded-full"
        style={{
          background: `conic-gradient(#06b6d4 0% ${angle}%, rgba(255,255,255,0.08) ${angle}% 100%)`,
          boxShadow: "0 0 26px rgba(0,184,255,0.25)",
        }}
      />
      <div className="absolute inset-1 rounded-full bg-black/60 border border-white/10 grid place-items-center">
        <div className="text-center">
          <div className="text-2xl font-black text-white">{v}</div>
          <div className="text-[10px] uppercase tracking-widest text-gray-300">{label}</div>
        </div>
      </div>
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1 rounded-md border border-white/10 bg-white/5 text-[11px] text-gray-200">
      <span className="text-gray-400 mr-1">{label}:</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

const LazyDiagramCard = dynamic(() => import("@/components/summon/DiagramCard"), {
  ssr: false,
  loading: () => <div className="h-16 w-full animate-pulse rounded-md bg-white/5" />,
})

function MicIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="text-gray-300">
      <path
        fill="currentColor"
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3m5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z"
      />
    </svg>
  )
}

class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode; children?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  override componentDidCatch() {
    // no-op
  }
  override render() {
    if (this.state.hasError) return this.props.fallback || null
    return this.props.children as React.ReactElement
  }
}
