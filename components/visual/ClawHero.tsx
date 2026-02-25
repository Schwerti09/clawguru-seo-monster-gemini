// VISUAL BEAST 2026: ClawHero — Full-screen hero with animated security score counter,
// floating particles, animated grid background, and magnetic CTA
"use client"

import { useEffect, useState, useCallback } from "react"
import { Shield, Zap, Lock } from "lucide-react"
import NeonButton from "./NeonButton"

// VISUAL BEAST 2026: Animated counter hook (42 → target)
function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(42)

  useEffect(() => {
    const start = 42
    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(start + (target - start) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    const timer = setTimeout(() => requestAnimationFrame(tick), 800)
    return () => clearTimeout(timer)
  }, [target, duration])

  return value
}

// VISUAL BEAST 2026: Floating particle component
function Particle({ delay, size, x, y }: { delay: number; size: number; x: number; y: number }) {
  return (
    <div
      className="absolute rounded-full animate-float"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: "radial-gradient(circle, rgba(0,255,157,0.4) 0%, transparent 70%)",
        animationDelay: `${delay}s`,
        animationDuration: `${4 + Math.random() * 4}s`,
      }}
    />
  )
}

export default function ClawHero() {
  const score = useCountUp(94, 2500)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // VISUAL BEAST 2026: Deterministic particles
  const particles = useCallback(() => {
    const pts = []
    for (let i = 0; i < 12; i++) {
      pts.push({
        id: i,
        delay: i * 0.5,
        size: 4 + (i % 4) * 3,
        x: (i * 17 + 5) % 95,
        y: (i * 23 + 10) % 85,
      })
    }
    return pts
  }, [])

  const scoreColor =
    score >= 90 ? "text-[#00ff9d]" :
    score >= 70 ? "text-[#00b8ff]" :
    score >= 50 ? "text-orange-400" : "text-red-400"

  const glowStyle =
    score >= 90
      ? { textShadow: "0 0 30px rgba(0,255,157,0.6), 0 0 60px rgba(0,255,157,0.3)" }
      : score >= 70
      ? { textShadow: "0 0 30px rgba(0,184,255,0.6), 0 0 60px rgba(0,184,255,0.3)" }
      : {}

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* VISUAL BEAST 2026: Animated grid background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle_at_center,black,transparent_70%)] animate-[gridMove_20s_linear_infinite]" />
        {/* Radial glows */}
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full blur-3xl bg-[#00ff9d]/10 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full blur-3xl bg-[#00b8ff]/10 animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full blur-3xl bg-[#8b5cf6]/5" />
        {/* Floating particles */}
        {mounted && particles().map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-60px,-60px,0); }
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left: Score display */}
        <div className={mounted ? "animate-fadeUp" : "opacity-0"}>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full glass-card text-xs text-gray-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse-glow" />
            Claw Security Score · Live
          </div>

          {/* VISUAL BEAST 2026: Big animated score counter */}
          <div className="mb-6">
            <div className={`text-8xl sm:text-9xl font-black font-headline ${scoreColor} transition-colors duration-500`} style={glowStyle}>
              {score}
            </div>
            <div className="text-xl text-gray-400 font-medium mt-2">
              / 100 — <span className={score >= 90 ? "text-[#00ff9d] font-bold" : "text-gray-300"}>
                {score >= 90 ? "EXZELLENT" : score >= 70 ? "SOLIDE" : score >= 50 ? "ANGREIFBAR" : "KRITISCH"}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline leading-tight mb-5">
            Die <span className="bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] bg-clip-text text-transparent">Institution</span> für
            OpenClaw Security & Ops
          </h1>

          <p className="text-lg text-gray-300 max-w-xl mb-8">
            Tools, Lageberichte, Incident-Runbooks und ein Copilot, der Prioritäten setzt.
            Ziel: weniger Panik, mehr Betriebssicherheit.
          </p>

          {/* VISUAL BEAST 2026: Magnetic CTA */}
          <div className="flex flex-wrap gap-3">
            <NeonButton href="/check" variant="green" size="lg">
              <Shield className="w-5 h-5" />
              Jetzt kostenlos prüfen
            </NeonButton>
            <NeonButton href="/copilot" variant="blue" size="md">
              <Zap className="w-4 h-4" />
              Ask Copilot
            </NeonButton>
            <NeonButton href="/pricing" variant="purple" size="md">
              <Lock className="w-4 h-4" />
              Pro Kits
            </NeonButton>
          </div>

          {/* Quick stats */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: "⚡", label: "Live Score", desc: "30 Sek. Check" },
              { icon: "📋", label: "200+ Runbooks", desc: "Copy & Fix" },
              { icon: "🤖", label: "Agent Swarm", desc: "Auto-Heal" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-3 hover-neon-border">
                <div className="text-lg">{s.icon}</div>
                <div className="font-bold text-sm mt-1">{s.label}</div>
                <div className="text-xs text-gray-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Mini copilot (preserving existing functionality) */}
        <div className={`glass-card p-6 md:p-7 shadow-neon-blue ${mounted ? "animate-fadeUp" : "opacity-0"}`} style={{ animationDelay: "200ms" }}>
          <div className="font-black text-lg font-headline">Mini-Copilot</div>
          <div className="text-sm text-gray-400 mt-1">
            Schreib dein Problem in 1 Satz. Wir leiten dich in den richtigen Hub.
          </div>

          <div className="mt-4 flex gap-3">
            <input
              placeholder="z.B. 'ich glaube mein gateway ist exposed'"
              className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#00ff9d]/30 focus:border-[#00ff9d]/50 transition-all"
            />
            <a
              href="/copilot"
              className="px-5 py-3 rounded-xl font-black bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] text-black hover:opacity-90 transition-opacity"
            >
              Los
            </a>
          </div>

          <div className="mt-6 text-sm text-gray-300">
            <div className="font-black mb-2">Beliebte Prompts</div>
            <div className="flex flex-wrap gap-2">
              {[
                "Ich glaube ich bin exposed",
                "Wie härte ich WebSockets?",
                "Was sind die Top 5 Misconfigs?"
              ].map((s) => (
                <a key={s} href={"/copilot?q=" + encodeURIComponent(s)} className="px-3 py-2 rounded-xl glass-card hover-neon-border text-sm">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl glass-card text-xs text-gray-400">
            Kein Login. Keine Dark-Patterns. Nur eine Seite, die dich wirklich aus dem Feuer zieht.
          </div>
        </div>
      </div>
    </section>
  )
}
