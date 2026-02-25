'use client'
// WORLD BEAST FINAL LAUNCH + VISUAL BEAST 2026: app/dashboard/worldbeast/WorldbeastClient.tsx
// Client component: 🚀 START GLOBAL LAUNCH button with scan animation + particle explosion.

import { useState, useRef, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"
import type { LaunchContent } from "@/lib/agents/launch-agent"

type LaunchResult = {
  ok: boolean
  agents: {
    vulnerabilityHunter: { ok: boolean; runbooksCreated?: number }
    growthAgent: { ok: boolean; suggestionsFound?: number }
    healthCron: { ok: boolean }
  }
  launchContent: LaunchContent | null
}

// VISUAL BEAST 2026: Particle explosion effect
function ParticleExplosion() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; speed: number }[]>([])

  useEffect(() => {
    const pts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      angle: (i / 20) * 360,
      speed: 2 + Math.random() * 4,
    }))
    setParticles(pts)
    const timer = setTimeout(() => setParticles([]), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full bg-[#00ff9d] left-1/2 top-1/2"
          style={{
            animation: `particleExplode 1s ease-out forwards`,
            transform: `translate(-50%, -50%)`,
            ['--angle' as string]: `${p.angle}deg`,
            ['--speed' as string]: `${p.speed * 30}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes particleExplode {
          0% { opacity: 1; transform: translate(-50%, -50%) translate(0, 0); }
          100% { opacity: 0; transform: translate(-50%, -50%) translate(
            calc(cos(var(--angle)) * var(--speed)),
            calc(sin(var(--angle)) * var(--speed))
          ); }
        }
      `}</style>
    </div>
  )
}

export function WorldbeastClient() {
  const [phase, setPhase] = useState<"idle" | "launching" | "done" | "error">("idle")
  const [result, setResult] = useState<LaunchResult | null>(null)
  const [showContent, setShowContent] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  // VISUAL BEAST 2026: scan progress state
  const [scanProgress, setScanProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  async function startGlobalLaunch() {
    setPhase("launching")
    setScanProgress(0)
    // VISUAL BEAST 2026: Animated scan progress
    intervalRef.current = setInterval(() => {
      setScanProgress((p) => Math.min(p + Math.random() * 15, 90))
    }, 300)
    // WORLD BEAST FINAL LAUNCH: track launch button click
    trackEvent("launch_button_clicked")

    try {
      const res = await fetch("/api/launch", { method: "POST" })
      if (!res.ok) {
        setPhase("error")
        if (intervalRef.current) clearInterval(intervalRef.current)
        return
      }
      const data = await res.json() as LaunchResult
      setResult(data)
      setScanProgress(100)
      if (intervalRef.current) clearInterval(intervalRef.current)
      // VISUAL BEAST 2026: Trigger particle explosion
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 1500)
      setPhase("done")
    } catch {
      setPhase("error")
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }

  if (phase === "done" && result) {
    return (
      <div className="w-full max-w-2xl relative">
        {showParticles && <ParticleExplosion />}
        {/* Success banner */}
        <div className="px-6 py-4 rounded-2xl glass-card border-[#00ff9d]/40 font-black neon-text-green flex items-center gap-3 mb-4">
          ✅ Global Launch aktiv — alle Systeme laufen!
        </div>

        {/* Agent results */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-xl glass-card text-center">
            <div className="text-xs text-gray-500 font-mono">CVE Hunter</div>
            <div className={`text-sm font-black ${result.agents.vulnerabilityHunter.ok ? "neon-text-green" : "text-red-400"}`}>
              {result.agents.vulnerabilityHunter.ok
                ? `✅ ${result.agents.vulnerabilityHunter.runbooksCreated ?? 0} Runbooks`
                : "❌ Fehler"}
            </div>
          </div>
          <div className="p-3 rounded-xl glass-card text-center">
            <div className="text-xs text-gray-500 font-mono">Growth Agent</div>
            <div className={`text-sm font-black ${result.agents.growthAgent.ok ? "neon-text-green" : "text-red-400"}`}>
              {result.agents.growthAgent.ok
                ? `✅ ${result.agents.growthAgent.suggestionsFound ?? 0} Keywords`
                : "❌ Fehler"}
            </div>
          </div>
          <div className="p-3 rounded-xl glass-card text-center">
            <div className="text-xs text-gray-500 font-mono">Self-Heal</div>
            <div className={`text-sm font-black ${result.agents.healthCron.ok ? "neon-text-green" : "text-yellow-400"}`}>
              {result.agents.healthCron.ok ? "✅ Aktiv" : "⚠️ Skip"}
            </div>
          </div>
        </div>

        {/* Launch content toggle */}
        {result.launchContent && (
          <div>
            <button
              onClick={() => setShowContent(!showContent)}
              className="w-full px-4 py-2 rounded-xl glass-card hover-neon-border text-sm font-bold text-left font-mono"
            >
              {showContent ? "▲" : "▼"} Launch-Content anzeigen ({result.launchContent.xThread.length} Tweets · LinkedIn · Reddit · HN · Bluesky)
            </button>
            {showContent && (
              <div className="mt-3 p-4 rounded-xl glass-card text-xs text-gray-300 space-y-3 max-h-64 overflow-y-auto font-mono">
                <div>
                  <div className="font-black text-gray-200 mb-1">🐦 X-Thread (ersten 3):</div>
                  {result.launchContent.xThread.slice(0, 3).map((t, i) => (
                    <div key={i} className="mb-1 pl-2 border-l border-[#00ff9d]/30">{t}</div>
                  ))}
                </div>
                <div>
                  <div className="font-black text-gray-200 mb-1">📰 HN Title:</div>
                  <div className="pl-2 border-l border-[#00ff9d]/30">{result.launchContent.hnTitle}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (phase === "error") {
    return (
      <div className="px-6 py-3 rounded-2xl glass-card border-red-400/40 font-black text-red-400">
        ❌ Launch fehlgeschlagen – bitte erneut versuchen.
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={startGlobalLaunch}
        disabled={phase === "launching"}
        className="relative overflow-hidden px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-[#00ff9d] via-[#00b8ff] to-[#8b5cf6] text-black hover:opacity-90 disabled:opacity-60 shadow-neon-green transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {/* VISUAL BEAST 2026: Scan animation while launching */}
        {phase === "launching" && (
          <span
            className="absolute inset-0 animate-scanline pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.3), transparent)",
              height: "200%",
            }}
          />
        )}
        <span className="relative z-10">
          {phase === "launching" ? `🚀 Scanning… ${Math.round(scanProgress)}%` : "🚀 START GLOBAL LAUNCH"}
        </span>
      </button>
      {/* VISUAL BEAST 2026: Progress bar under button */}
      {phase === "launching" && (
        <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] progress-glow transition-all duration-300"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      )}
    </div>
  )
}
