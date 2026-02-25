'use client'
// WORLD BEAST FINAL LAUNCH + VISUAL UPGRADE 2026: app/dashboard/worldbeast/WorldbeastClient.tsx
// "Unleash the Beast" button with loading animation and particle-style visual effect.

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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

export function WorldbeastClient() {
  const [phase, setPhase] = useState<"idle" | "launching" | "done" | "error">("idle")
  const [result, setResult] = useState<LaunchResult | null>(null)
  const [showContent, setShowContent] = useState(false)

  async function startGlobalLaunch() {
    setPhase("launching")
    // WORLD BEAST FINAL LAUNCH: track launch button click
    trackEvent("launch_button_clicked")

    try {
      const res = await fetch("/api/launch", { method: "POST" })
      if (!res.ok) {
        setPhase("error")
        return
      }
      const data = await res.json() as LaunchResult
      setResult(data)
      setPhase("done")
    } catch {
      setPhase("error")
    }
  }

  if (phase === "done" && result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* VISUAL UPGRADE 2026: Success banner with neon glow */}
        <div
          className="px-6 py-4 rounded-2xl font-black flex items-center gap-3 mb-4"
          style={{
            background: "rgba(0, 255, 157, 0.08)",
            border: "1px solid rgba(0, 255, 157, 0.3)",
            color: "#00ff9d",
            boxShadow: "0 0 20px rgba(0, 255, 157, 0.1)",
          }}
        >
          ✅ Global Launch aktiv — alle Systeme laufen!
        </div>

        {/* Agent results */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-xl glass-card text-center">
            <div className="text-xs text-gray-500">CVE Hunter</div>
            <div className={`text-sm font-black ${result.agents.vulnerabilityHunter.ok ? "" : "text-red-400"}`}
              style={result.agents.vulnerabilityHunter.ok ? { color: "#00ff9d" } : {}}>
              {result.agents.vulnerabilityHunter.ok
                ? `✅ ${result.agents.vulnerabilityHunter.runbooksCreated ?? 0} Runbooks`
                : "❌ Fehler"}
            </div>
          </div>
          <div className="p-3 rounded-xl glass-card text-center">
            <div className="text-xs text-gray-500">Growth Agent</div>
            <div className={`text-sm font-black ${result.agents.growthAgent.ok ? "" : "text-red-400"}`}
              style={result.agents.growthAgent.ok ? { color: "#00ff9d" } : {}}>
              {result.agents.growthAgent.ok
                ? `✅ ${result.agents.growthAgent.suggestionsFound ?? 0} Keywords`
                : "❌ Fehler"}
            </div>
          </div>
          <div className="p-3 rounded-xl glass-card text-center">
            <div className="text-xs text-gray-500">Self-Heal</div>
            <div className={`text-sm font-black`}
              style={{ color: result.agents.healthCron.ok ? "#00ff9d" : "#ffcc00" }}>
              {result.agents.healthCron.ok ? "✅ Aktiv" : "⚠️ Skip"}
            </div>
          </div>
        </div>

        {/* Launch content toggle */}
        {result.launchContent && (
          <div>
            <button
              onClick={() => setShowContent(!showContent)}
              className="w-full px-4 py-2 rounded-xl glass-card hover:border-claw-green/40 text-sm font-bold text-left transition-all duration-300"
            >
              {showContent ? "▲" : "▼"} Launch-Content anzeigen ({result.launchContent.xThread.length} Tweets · LinkedIn · Reddit · HN · Bluesky)
            </button>
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-4 rounded-xl glass-card text-xs text-gray-300 space-y-3 max-h-64 overflow-y-auto"
                >
                  <div>
                    <div className="font-black text-gray-200 mb-1">🐦 X-Thread (ersten 3):</div>
                    {result.launchContent.xThread.slice(0, 3).map((t, i) => (
                      <div key={i} className="mb-1 pl-2 border-l" style={{ borderColor: "rgba(0, 255, 157, 0.3)" }}>{t}</div>
                    ))}
                  </div>
                  <div>
                    <div className="font-black text-gray-200 mb-1">📰 HN Title:</div>
                    <div className="pl-2 border-l" style={{ borderColor: "rgba(0, 255, 157, 0.3)" }}>{result.launchContent.hnTitle}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    )
  }

  if (phase === "error") {
    return (
      <div
        className="px-6 py-3 rounded-2xl font-black"
        style={{
          background: "rgba(255, 59, 92, 0.08)",
          border: "1px solid rgba(255, 59, 92, 0.3)",
          color: "#ff3b5c",
        }}
      >
        ❌ Launch fehlgeschlagen – bitte erneut versuchen.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* VISUAL UPGRADE 2026: Particle effect glow behind button */}
      {phase === "launching" && (
        <div className="absolute inset-0 -m-4 rounded-3xl animate-pulse" style={{
          background: "radial-gradient(circle, rgba(0, 255, 157, 0.15) 0%, transparent 70%)",
        }} />
      )}
      <motion.button
        onClick={startGlobalLaunch}
        disabled={phase === "launching"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-6 py-3 rounded-2xl font-black text-black disabled:opacity-60 transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #00ff9d, #00b8ff)",
          boxShadow: phase === "launching"
            ? "0 0 40px rgba(0, 255, 157, 0.4), 0 0 80px rgba(0, 184, 255, 0.2)"
            : "0 0 20px rgba(0, 255, 157, 0.2)",
        }}
      >
        {/* VISUAL UPGRADE 2026: Loading spinner animation */}
        {phase === "launching" ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Unleashing...
          </span>
        ) : (
          "🚀 UNLEASH THE BEAST"
        )}
      </motion.button>
    </div>
  )
}
