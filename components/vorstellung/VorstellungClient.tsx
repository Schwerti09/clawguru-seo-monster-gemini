"use client"

import Container from "@/components/shared/Container"
import { GlowButton } from "@/components/ui/GlowButton"
import dynamic from "next/dynamic"
import { Suspense, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const OrbitingLogo = dynamic(() => import("@/components/vorstellung/OrbitingLogo"), { ssr: false, loading: () => null })
const PreviewField = dynamic(() => import("@/components/home/PreviewField"), { ssr: false, loading: () => null })
const CopilotTeaser = dynamic(() => import("@/components/vorstellung/CopilotTeaser"), {
  ssr: false,
  loading: () => <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-400">Lade Copilot…</div>
})

export default function VorstellungClient() {
  const [fx, setFx] = useState(false)
  const heroRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    let canceled = false
    let idleId: number | null = null
    let t: any = null
    const enable = () => { if (!canceled) setFx(true) }
    try {
      const ric = (window as any).requestIdleCallback as undefined | ((cb: any, opts?: any) => number)
      if (ric) {
        idleId = ric(enable, { timeout: 1200 })
      } else {
        t = setTimeout(enable, 600)
      }
    } catch {
      t = setTimeout(enable, 600)
    }
    return () => {
      canceled = true
      try { if (idleId && (window as any).cancelIdleCallback) (window as any).cancelIdleCallback(idleId) } catch {}
      if (t) clearTimeout(t)
    }
  }, [])
  return (
    <main className="min-h-screen" style={{ background: "var(--surface-0, #0a0a0a)" }}>
      {/* Fullscreen Hero with orbiting logo */}
      <section ref={heroRef} className="relative overflow-hidden pt-24 pb-16 px-4">
        {/* Desktop particle field (very light), masked and lazy */}
        {fx && (
          <div className="hidden md:block absolute inset-0" aria-hidden>
            <Suspense fallback={null}>
              <PreviewField />
            </Suspense>
          </div>
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
          opacity: 0.4,
        }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 text-[11px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" /> Quantum‑Resistant
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-6xl font-black font-heading text-white leading-tight mt-3">
            ClawGuru vorgestellt
          </motion.h1>
          <div className="mt-6 flex items-center justify-center">
            <Suspense fallback={null}>
              <div className="opacity-90" aria-hidden>
                {fx ? (
                  <OrbitingLogo />
                ) : (
                  <div className="relative w-full max-w-xs mx-auto aspect-square">
                    <div className="w-full h-full rounded-full grid place-items-center">
                      <div className="w-[55%] h-[55%] rounded-full border border-white/10" style={{ boxShadow: "0 0 24px rgba(0,184,255,0.25), inset 0 0 24px rgba(0,255,157,0.15)" }} />
                    </div>
                  </div>
                )}
              </div>
            </Suspense>
          </div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mt-4 text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Die Ops‑Intelligence Plattform: schnell, fokussiert, ergebnisorientiert. Hier siehst du in 60 Sekunden, was du bekommst.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <GlowButton variant="primary" href="/check">Jetzt testen</GlowButton>
            <GlowButton variant="outline" href="/pricing">Pläne</GlowButton>
          </motion.div>
        </div>
      </section>

      <Container>
        <div className="py-10 max-w-6xl mx-auto space-y-12">
          {/* Particle/Video background section (lightweight) */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="rounded-[24px] border border-white/10 bg-black/30 p-4" style={{ contentVisibility: "auto", containIntrinsicSize: "540px" }}>
            <div className="text-sm text-gray-400 mb-2">Das bekommst du</div>
            <div className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10" aria-hidden />
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "3px 3px",
                maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent)",
              }} aria-hidden />
              <div className="absolute inset-0 p-4 sm:p-6 grid sm:grid-cols-2 gap-3">
                {["Mycelium", "3,4 Mio Runbooks", "Live‑Intel", "Copilot", "Quantum‑Resistant"].map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.03 }} className="rounded-xl border border-white/10 bg-black/60 p-3">
                    <div className="text-xs text-gray-400 mb-1">Feature</div>
                    <div className="text-white font-semibold">{t}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sections with mini previews */}
          <div className="grid md:grid-cols-2 gap-6" style={{ contentVisibility: "auto", containIntrinsicSize: "600px" }}>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="mb-3 rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-transparent aspect-[16/9]" aria-hidden />
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-300 mb-1">Copilot</div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-xl font-black text-white">Runbooks on demand</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} className="text-gray-300 mt-2 text-sm">Beschreibe dein System + Problem – du bekommst ein passendes, ausführbares Runbook inkl. Validierung & Rollback.</motion.p>
            </div>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="mb-3 rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/10 to-transparent aspect-[16/9]" aria-hidden />
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-300 mb-1">Vault</div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-xl font-black text-white">500+ Playbooks</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} className="text-gray-300 mt-2 text-sm">Hardening, Recovery, CSP, SSH, Docker, Webhooks – sofort einsetzbar, produktionsreif.</motion.p>
            </div>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="mb-3 rounded-xl border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/10 to-transparent aspect-[16/9]" aria-hidden />
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-300 mb-1">Ops Intel</div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-xl font-black text-white">Live Threats & Fixes</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} className="text-gray-300 mt-2 text-sm">Trending Fixes, CVE‑Pulse und Mission Control. Sieh, was heute zählt – mit direktem Runbook‑Link.</motion.p>
            </div>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="mb-3 rounded-xl border border-yellow-400/20 bg-gradient-to-br from-yellow-500/10 to-transparent aspect-[16/9]" aria-hidden />
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-yellow-300 mb-1">Security Score</div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-xl font-black text-white">Top‑Risiken in 30 Sekunden</motion.h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.05 }} className="text-gray-300 mt-2 text-sm">Claw Security Score zeigt dir die größten Lücken sofort – inkl. Nächste‑Schritte.</motion.p>
            </div>
          </div>

          {/* Timeline */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="rounded-2xl border border-white/10 bg-black/30 p-6" style={{ contentVisibility: "auto", containIntrinsicSize: "520px" }}>
            <div className="text-sm font-bold text-white mb-3">ClawVerse Timeline</div>
            <ol className="relative border-l border-white/10 pl-6 space-y-5">
              {[
                { y: "2026", t: "ClawGuru Launch", d: "Public launch mit Ops‑Intel & Copilot" },
                { y: "2026 Q1", t: "Mycelium v3", d: "Neues UI, Performance, Embed‑Modus" },
                { y: "2026 Q2", t: "3,4 Mio Runbooks", d: "Massives Vault‑Upgrade & Qualitätssiegel" },
              ].map((x, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }} className="ml-2">
                  <div className="absolute -left-1.5 w-3 h-3 rounded-full" style={{ background: i === 0 ? "#00b8ff" : i === 1 ? "#d4af37" : "#00ff9d" }} />
                  <div className="text-xs text-gray-400">{x.y}</div>
                  <div className="text-sm font-semibold text-white">{x.t}</div>
                  <div className="text-xs text-gray-400">{x.d}</div>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Copilot live demo teaser */}
          <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="rounded-2xl border border-white/10 bg-black/30 p-4" style={{ contentVisibility: "auto", containIntrinsicSize: "220px" }}>
            <Suspense fallback={<div className="text-xs text-gray-400">Initialisiere Copilot…</div>}>
              <CopilotTeaser />
            </Suspense>
          </motion.div>

          {/* Trusted logos + stats */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="rounded-2xl border border-white/10 bg-black/30 p-6" style={{ contentVisibility: "auto", containIntrinsicSize: "480px" }}>
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-gray-400">Trusted by SecOps Leaders</div>
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              {["ACME Cloud", "HelixOps", "NordSec", "Vector Labs"].map((n, i) => (
                <motion.div key={n} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }} className="rounded-xl border border-white/10 bg-black/50 p-3 text-center text-sm text-gray-300">{n}</motion.div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { v: "94", l: "ClawScore" },
                { v: "3.4M", l: "Runbooks" },
                { v: "128K", l: "Checks" },
                { v: "Quantum", l: "Resistant" },
              ].map((s, i) => (
                <motion.div key={s.l} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.03 }} className="rounded-xl border border-white/10 bg-black/50 p-3 text-center">
                  <div className="text-xl font-black text-white">{s.v}</div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400">{s.l}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center pt-6">
            <GlowButton variant="primary" href="/daypass">Day Pass 7€ – Sofortzugang</GlowButton>
          </motion.div>
        </div>
      </Container>
    </main>
  )
}
