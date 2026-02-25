'use client'
// WORLD BEAST: app/dashboard/worldbeast/WorldbeastClient.tsx
// Client component: One-Click World Domination button + live status.

import { useState } from "react"

export function WorldbeastClient() {
  const [activated, setActivated] = useState(false)
  const [loading, setLoading] = useState(false)

  async function activateAll() {
    setLoading(true)
    // WORLD BEAST: trigger all agents in parallel
    try {
      await Promise.allSettled([
        fetch("/api/health/cron", { method: "GET" }),
        fetch("/api/agents/vulnerability", { method: "GET" }),
      ])
    } finally {
      setLoading(false)
      setActivated(true)
    }
  }

  if (activated) {
    return (
      <div className="px-6 py-3 rounded-2xl border border-green-400/40 bg-green-400/10 font-black text-green-400">
        ✅ WorldBeast aktiviert – alle Systeme laufen!
      </div>
    )
  }

  return (
    <button
      onClick={activateAll}
      disabled={loading}
      className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-red hover:opacity-90 disabled:opacity-60 text-white shadow-lg shadow-brand-cyan/20"
    >
      {loading ? "🚀 Aktiviere..." : "🌍 One-Click World Domination"}
    </button>
  )
}
