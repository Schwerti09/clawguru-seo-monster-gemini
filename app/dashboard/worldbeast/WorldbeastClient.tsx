'use client'
// WORLD BEAST FINAL LAUNCH: app/dashboard/worldbeast/WorldbeastClient.tsx
// Client component: 🚀 START GLOBAL LAUNCH button — triggers all agents parallel,
// generates launch content, and activates upsell flow.

import { useState } from "react"
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
      <div className="w-full max-w-2xl">
        {/* Success banner */}
        <div className="px-6 py-4 rounded-2xl border border-green-400/40 bg-green-400/10 font-black text-green-400 flex items-center gap-3 mb-4">
          ✅ Global Launch aktiv — alle Systeme laufen!
        </div>

        {/* Agent results */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-xl border border-gray-800 bg-black/20 text-center">
            <div className="text-xs text-gray-500">CVE Hunter</div>
            <div className={`text-sm font-black ${result.agents.vulnerabilityHunter.ok ? "text-green-400" : "text-red-400"}`}>
              {result.agents.vulnerabilityHunter.ok
                ? `✅ ${result.agents.vulnerabilityHunter.runbooksCreated ?? 0} Runbooks`
                : "❌ Fehler"}
            </div>
          </div>
          <div className="p-3 rounded-xl border border-gray-800 bg-black/20 text-center">
            <div className="text-xs text-gray-500">Growth Agent</div>
            <div className={`text-sm font-black ${result.agents.growthAgent.ok ? "text-green-400" : "text-red-400"}`}>
              {result.agents.growthAgent.ok
                ? `✅ ${result.agents.growthAgent.suggestionsFound ?? 0} Keywords`
                : "❌ Fehler"}
            </div>
          </div>
          <div className="p-3 rounded-xl border border-gray-800 bg-black/20 text-center">
            <div className="text-xs text-gray-500">Self-Heal</div>
            <div className={`text-sm font-black ${result.agents.healthCron.ok ? "text-green-400" : "text-yellow-400"}`}>
              {result.agents.healthCron.ok ? "✅ Aktiv" : "⚠️ Skip"}
            </div>
          </div>
        </div>

        {/* Launch content toggle */}
        {result.launchContent && (
          <div>
            <button
              onClick={() => setShowContent(!showContent)}
              className="w-full px-4 py-2 rounded-xl border border-gray-700 hover:border-brand-cyan/40 text-sm font-bold text-left"
            >
              {showContent ? "▲" : "▼"} Launch-Content anzeigen ({result.launchContent.xThread.length} Tweets · LinkedIn · Reddit · HN · Bluesky)
            </button>
            {showContent && (
              <div className="mt-3 p-4 rounded-xl border border-gray-800 bg-black/20 text-xs text-gray-300 space-y-3 max-h-64 overflow-y-auto">
                <div>
                  <div className="font-black text-gray-200 mb-1">🐦 X-Thread (ersten 3):</div>
                  {result.launchContent.xThread.slice(0, 3).map((t, i) => (
                    <div key={i} className="mb-1 pl-2 border-l border-gray-700">{t}</div>
                  ))}
                </div>
                <div>
                  <div className="font-black text-gray-200 mb-1">📰 HN Title:</div>
                  <div className="pl-2 border-l border-gray-700">{result.launchContent.hnTitle}</div>
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
      <div className="px-6 py-3 rounded-2xl border border-red-400/40 bg-red-400/10 font-black text-red-400">
        ❌ Launch fehlgeschlagen – bitte erneut versuchen.
      </div>
    )
  }

  return (
    <button
      onClick={startGlobalLaunch}
      disabled={phase === "launching"}
      className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-red hover:opacity-90 disabled:opacity-60 text-white shadow-lg shadow-brand-cyan/20"
    >
      {phase === "launching" ? "🚀 Launching..." : "🚀 START GLOBAL LAUNCH"}
    </button>
  )
}
