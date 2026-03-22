"use client"

import React, { useEffect, useMemo, useState } from "react"

type IntelStats = {
  newCvesToday: number
  activeExploits: number
  avgClawScore: number
  threatLevel: number
  series: number[]
}

type Stat = { label: string; value: number; hint?: string }

export default function StatsDashboard({ dict }: { dict?: any }) {
  const [statsData, setStatsData] = useState<IntelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stop = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/intel?op=stats', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const s: IntelStats = await res.json()
        if (!stop) setStatsData(s)
      } catch (e: any) {
        if (!stop) setError(e?.message || dict?.stats_error || 'Stats-Ladefehler')
      } finally {
        if (!stop) setLoading(false)
      }
    }
    load()
    return () => { stop = true }
  }, [])

  const tiles = useMemo<Stat[]>(() => {
    if (!statsData) return []
    return [
      { label: dict?.tile_new_7d || 'Neue CVEs (Heute)', value: statsData.newCvesToday },
      { label: dict?.tile_with_runbooks || 'Aktive Exploits', value: statsData.activeExploits },
      { label: dict?.tile_avg_cvss || 'Ø ClawScore', value: Math.round((statsData.avgClawScore || 0) * 10) / 10 },
      { label: dict?.tile_top_services || 'Threat Level', value: statsData.threatLevel },
    ]
  }, [statsData])

  const spark = useMemo(() => statsData?.series || [], [statsData])

  if (loading) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-gray-400">{dict?.stats_loading || 'Lade Statistiken…'}</div>
  if (error) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-red-400">{error}</div>
  if (!statsData) return null

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-sm text-cyan-300 mb-3">{dict?.stats_header || 'Statistiken & Trends'}</div>
      <div className="grid md:grid-cols-4 gap-4">
        {tiles.map((s, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/50 p-3">
            <div className="text-xs text-gray-400">{s.label}</div>
            <div className="text-2xl font-black text-white mt-1">{s.value}{s.hint ? <span className="text-sm font-normal text-gray-400 ml-2">{s.hint}</span> : null}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-xs text-gray-400 mb-1">{dict?.spark_title || 'CVE‑Veröffentlichungen (24h)'}{}</div>
        <div className="flex items-end gap-1 h-16">
          {spark.map((v, idx) => (
            <div key={idx} className="w-3 bg-gradient-to-t from-cyan-700 to-cyan-400 rounded"
                 style={{ height: `${Math.min(100, Math.max(6, v*4))}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
