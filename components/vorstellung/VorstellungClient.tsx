"use client"

import Container from "@/components/shared/Container"
import { GlowButton } from "@/components/ui/GlowButton"
import dynamic from "next/dynamic"
import React, { Suspense, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"
import { STATS } from "@/lib/stats"

class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback || null
    return this.props.children as React.ReactElement
  }
}

const OrbitingLogo = dynamic(() => import("@/components/vorstellung/OrbitingLogo"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full max-w-xs mx-auto aspect-square">
      <div className="w-full h-full rounded-full grid place-items-center" aria-hidden>
        <div
          className="w-[55%] h-[55%] rounded-full border border-white/10"
          style={{ boxShadow: "0 0 24px rgba(0,184,255,0.25), inset 0 0 24px rgba(0,255,157,0.15)" }}
        />
      </div>
    </div>
  ),
})

const FeatureShowcase = dynamic(() => import("@/components/FeatureShowcase"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
      <div className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
    </div>
  ),
})
const PreviewField = dynamic(() => import("@/components/home/PreviewField"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" aria-hidden />,
})
const CopilotTeaser = dynamic(() => import("@/components/vorstellung/CopilotTeaser"), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">Lade Copilot…</div>
})
const HeroPreview = dynamic(() => import("@/components/home/HeroPreview"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[1,2,3,4,5,6,7,8].map((i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-black/40" />
      ))}
    </div>
  ),
})

function MiniCopilot() {
  const [len, setLen] = useState(0)
  const [showAns, setShowAns] = useState(false)
  const prompt = "Wie fixe ich 502 bei Nginx + Node?"
  useEffect(() => {
    let t: any
    let i = 0
    const step = () => {
      i += 1
      setLen(i)
      if (i < prompt.length) {
        t = setTimeout(step, 35)
      } else {
        t = setTimeout(() => setShowAns(true), 300)
      }
    }
    t = setTimeout(step, 150)
    return () => { if (t) clearTimeout(t) }
  }, [])
  return (
    <div className="absolute inset-0 p-3 flex flex-col gap-2">
      <div className="max-w-[72%] rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-[10px] text-gray-200">
        {prompt.slice(0, len)}
        <span className="inline-block w-1 h-3 bg-gray-300 ml-0.5 animate-pulse align-middle" />
      </div>
      {showAns && (
        <div className="self-end max-w-[78%] rounded-2xl bg-cyan-500/10 border border-cyan-400/20 px-3 py-2 text-[10px] text-cyan-200">
          Erstelle Runbook mit Checks, Fix, Verify, Rollback…
        </div>
      )}
      <div className="max-w-[82%] rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
        <div className="h-2 w-5/6 bg-white/20 rounded mb-1 animate-pulse" />
        <div className="h-2 w-3/4 bg-white/15 rounded mb-1" />
        <div className="h-2 w-2/3 bg-white/10 rounded" />
      </div>
      <div className="self-end max-w-[62%] rounded-2xl bg-cyan-500/10 border border-cyan-400/20 px-3 py-2">
        <div className="h-2 w-4/5 bg-cyan-300/30 rounded mb-1" />
        <div className="h-2 w-2/3 bg-cyan-300/20 rounded" />
      </div>
    </div>
  )
}

function MiniVault() {
  const items = ["SSH", "Docker", "CSP", "TLS", "OAuth", "Webhook"]
  const [hi, setHi] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setHi((v) => (v + 1) % items.length), 1200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="absolute inset-0 p-3 grid grid-cols-3 gap-2">
      {items.map((_, i) => (
        <div key={i} className={`rounded-md border ${hi===i?"border-emerald-400/40 bg-emerald-400/10 scale-[1.02]":"border-white/10 bg-black/40"} p-2 flex flex-col gap-2 transition-all`}> 
          <div className={`h-6 w-6 rounded ${hi===i?"bg-emerald-400/60 border-emerald-300/60":"bg-emerald-400/30 border-emerald-400/30"} border`} />
          <div className="h-2 w-4/5 bg-white/15 rounded" />
          <div className="h-2 w-2/3 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  )
}

function MiniIntel() {
  const rows = [
    { dot: "bg-red-400", tag: "CVE‑2024‑1234", w: "w-4/5" },
    { dot: "bg-yellow-400", tag: "Zero‑Day Watch", w: "w-3/5" },
    { dot: "bg-emerald-400", tag: "Mitigation", w: "w-2/3" },
  ]
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((v) => (v + 1) % rows.length), 1500)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="absolute inset-0 p-3 space-y-2">
      {rows.map((r, i) => (
        <motion.div key={i} initial={{ opacity: 0.6 }} animate={{ opacity: idx===i?1:0.7, x: idx===i?0:0, scale: idx===i?1:0.98 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
          <span className={`h-2.5 w-2.5 rounded-full ${r.dot} animate-pulse`} />
          <div className="flex-1">
            <div className={`h-2 ${r.w} bg-white/20 rounded mb-1`} />
            <div className="h-2 w-2/3 bg-white/10 rounded" />
          </div>
          <div className="text-[10px] font-mono text-gray-300">{r.tag}</div>
        </motion.div>
      ))}
    </div>
  )
}

function MiniScoreGauge() {
  const target = 78
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf: number
    const start = performance.now()
    const dur = 900
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      setV(Math.round(target * (0.5 - 0.5 * Math.cos(Math.PI * p))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const angle = Math.max(1, Math.min(100, v))
  return (
    <div className="absolute inset-0 p-3 flex items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 rounded-full" style={{ background: `conic-gradient(#22c55e 0% ${angle}%, rgba(255,255,255,0.08) ${angle}% 100%)` }} />
        <div className="absolute inset-1 rounded-full bg-black/60 border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-black text-white">{v}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-300">Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VorstellungClient({ dict }: { dict?: any }) {
  const pathname = usePathname()
  const first = pathname?.split("/")[1] || ""
  const isLang = /(^[a-z]{2}(-[A-Z]{2})?$)/.test(first) || ["de","en","ru","es","fr","it","pt","nl","pl","tr","uk","cs","sk","sv","no","da","fi","ja","ko","zh"].includes(first)
  const prefix = isLang ? `/${first}` : ""
  const reduce = useReducedMotion()
  const [fx, setFx] = useState(false)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const timelineItems = Array.isArray((dict as any)?.timelineItems)
    ? ((dict as any).timelineItems as Array<{ y: string; t: string; d: string }>)
    : [
        { y: "2026", t: "ClawGuru Launch", d: "Public launch mit Ops‑Intel & Copilot" },
        { y: "2026 Q1", t: "Mycelium v3", d: "Neues UI, Performance, Embed‑Modus" },
        { y: "2026 Q2", t: "3,4 Mio Runbooks", d: "Massives Vault‑Upgrade & Qualitätssiegel" },
      ]
  const trustedLogos = Array.isArray((dict as any)?.trustedLogos)
    ? ((dict as any).trustedLogos as string[])
    : ["ACME Cloud", "HelixOps", "NordSec", "Vector Labs"]
  const nf = useMemo(() => {
    try {
      const lang = (first || "en").slice(0, 2)
      return new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-US")
    } catch {
      return new Intl.NumberFormat("en-US")
    }
  }, [first])
  const stats = [
    { v: String(STATS.avgClawScore), l: (dict as any)?.stats?.[0]?.l ?? "ClawScore" },
    { v: nf.format(STATS.totalRunbooks), l: (dict as any)?.stats?.[1]?.l ?? "Runbooks" },
    { v: nf.format(STATS.checksTotal), l: (dict as any)?.stats?.[2]?.l ?? "Checks" },
    { v: (dict as any)?.stats?.[3]?.v ?? "Quantum", l: (dict as any)?.stats?.[3]?.l ?? "Resistant" },
  ]
  useEffect(() => {
    let canceled = false
    let idleId: number | null = null
    let tFallback: any = null
    let tForce: any = null
    const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 768 : false
    const enable = () => { if (!canceled) setFx(true) }
    try {
      if (isDesktop) {
        // Desktop: sofort aktivieren für sichtbare Previews
        enable()
      } else {
        const ric = (window as any).requestIdleCallback as undefined | ((cb: any, opts?: any) => number)
        if (ric) {
          idleId = ric(enable, { timeout: 1200 })
        }
        // Mobile: Fallback/Force-Timer
        tFallback = setTimeout(enable, 800)
        tForce = setTimeout(enable, 1800)
      }
    } catch {
      // Conservative fallback
      if (isDesktop) {
        enable()
      } else {
        tFallback = setTimeout(enable, 800)
        tForce = setTimeout(enable, 1800)
      }
    }
    return () => {
      canceled = true
      try { if (idleId && (window as any).cancelIdleCallback) (window as any).cancelIdleCallback(idleId) } catch {}
      if (tFallback) clearTimeout(tFallback)
      if (tForce) clearTimeout(tForce)
    }
  }, [])
  return (
    <main className="min-h-screen" style={{ background: "var(--surface-0, #0a0a0a)" }}>
      {/* Fullscreen Hero with orbiting logo */}
      <section ref={heroRef} className="relative overflow-hidden pt-24 pb-16 px-4">
        {/* Desktop particle field (very light), masked and lazy */}
        <div className="hidden md:block absolute inset-0" aria-hidden>
          <Suspense fallback={null}>
            <PreviewField />
          </Suspense>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
          opacity: 0.4,
        }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 20 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 text-[11px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> {dict?.badge ?? "Quantum‑Resistant"}
            </div>
          </motion.div>
          <motion.h1 initial={reduce ? undefined : { opacity: 0, y: 10 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-6xl font-black font-heading text-white leading-tight mt-3">
            {dict?.title ?? "ClawGuru vorgestellt"}
          </motion.h1>
          <div className="mt-6 flex items-center justify-center">
            <Suspense fallback={null}>
              <div className="opacity-90" aria-hidden>
                <ErrorBoundary fallback={<div className="h-[52vh] grid place-items-center rounded-3xl border border-white/10 bg-black/50 text-white/70">{dict?.fallbackLogo ?? "Logo"}</div>}>
                  <OrbitingLogo />
                </ErrorBoundary>
              </div>
            </Suspense>
          </div>
          <motion.p initial={reduce ? undefined : { opacity: 0 }} whileInView={reduce ? undefined : { opacity: 1 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.6, delay: 0.1 }} className="mt-4 text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            {dict?.subtitle ?? "Die Ops‑Intelligence Plattform: schnell, fokussiert, ergebnisorientiert. Hier siehst du in 60 Sekunden, was du bekommst."}
          </motion.p>
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 10 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.6, delay: 0.15 }} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <GlowButton variant="primary" href={`${prefix}/check`}>{dict?.ctaPrimary ?? "Jetzt testen"}</GlowButton>
            <GlowButton variant="outline" href={`${prefix}/pricing`}>{dict?.ctaSecondary ?? "Pläne"}</GlowButton>
          </motion.div>
        </div>
      </section>

      <Container>
        <div className="py-10 max-w-6xl mx-auto space-y-12">
          {/* Particle/Video background section (lightweight) */}
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 16 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.55 }} className="rounded-[24px] border border-white/10 bg-black/30 p-4">
            <div className="text-sm text-gray-400 mb-2">{dict?.sectionGet ?? "Das bekommst du"}</div>
            <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" aria-hidden />
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "3px 3px",
                maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
              }} aria-hidden />
              <Suspense fallback={null}>
                <ErrorBoundary fallback={<div className="absolute inset-0" aria-hidden /> }>
                  <HeroPreview />
                </ErrorBoundary>
              </Suspense>
            </div>
          </motion.div>

          {/* Feature Live Previews */}
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 16 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.55 }}>
            <ErrorBoundary fallback={<div className="h-96 bg-white/5 rounded-2xl border border-white/10" /> }>
              <FeatureShowcase prefix={prefix} />
            </ErrorBoundary>
          </motion.div>

          {/* Timeline */}
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 16 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.55 }} className="rounded-2xl border border-white/10 bg-black/30 p-6" style={{ contentVisibility: "auto", containIntrinsicSize: "520px" }}>
            <div className="text-sm font-bold text-white mb-3">{dict?.timelineTitle ?? "ClawVerse Timeline"}</div>
            <ol className="relative border-l border-white/10 pl-6 space-y-5">
              {timelineItems.map((x, i) => (
                <motion.li key={i} initial={reduce ? undefined : { opacity: 0, x: -6 }} whileInView={reduce ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.45, delay: i * 0.05 }} className="ml-2">
                  <div className="absolute -left-1.5 w-3 h-3 rounded-full" style={{ background: i === 0 ? "#00b8ff" : i === 1 ? "#d4af37" : "#00ff9d" }} />
                  <div className="text-xs text-gray-400">{x.y}</div>
                  <div className="text-sm font-semibold text-white">{x.t}</div>
                  <div className="text-xs text-gray-400">{x.d}</div>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Copilot live demo teaser */}
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 14 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.55 }} className="rounded-2xl border border-white/10 bg-black/30 p-4" style={{ contentVisibility: "auto", containIntrinsicSize: "220px" }}>
            <Suspense fallback={<div className="text-xs text-gray-400">{dict?.copilotInit ?? "Initialisiere Copilot…"}</div>}>
              <ErrorBoundary fallback={<div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">{dict?.copilotFallback ?? "Copilot nicht verfügbar"}</div>}>
                <CopilotTeaser />
              </ErrorBoundary>
            </Suspense>
          </motion.div>

          {/* Trusted logos + stats */}
          <motion.div initial={reduce ? undefined : { opacity: 0, y: 12 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.55 }} className="rounded-2xl border border-white/10 bg-black/30 p-6" style={{ contentVisibility: "auto", containIntrinsicSize: "480px" }}>
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-gray-400">{dict?.trustedBy ?? "Trusted by SecOps Leaders"}</div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {trustedLogos.map((n, i) => (
                <motion.div key={n} initial={reduce ? undefined : { opacity: 0, y: 6 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.4, delay: i * 0.03 }} className="rounded-xl border border-white/10 bg-black/50 p-3 text-center text-sm text-gray-300">{n}</motion.div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <motion.div key={s.l} initial={reduce ? undefined : { opacity: 0, y: 6 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={reduce ? undefined : { duration: 0.4, delay: i * 0.03 }} className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
                  <div className="text-xl font-black text-white">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center pt-6">
            <GlowButton variant="primary" href={`${prefix}/daypass`}>{dict?.finalCta ?? "Day Pass 7€ – Sofortzugang"}</GlowButton>
          </motion.div>
        </div>
      </Container>
    </main>
  )
}
