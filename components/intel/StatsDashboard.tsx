"use client"

import React, { useEffect, useMemo, useState } from "react"

type CveEntry = {
  id: string
  title: string
  description: string
  score: number
  severity: string
  published: string
}

type IntelStats = {
  updatedAt: string | null
  totals: { total: number; critical: number; high: number; medium: number; low: number; unknown: number }
  avgScore: number
  newThisWeek: number
  topServices: { name: string; count: number }[]
  coverage: { mapped: number; total: number; ratio: number }
}

type Stat = { label: string; value: number; hint?: string }

export default function StatsDashboard({ dict }: { dict?: any }) {
  const [items, setItems] = useState<CveEntry[]>([])
  const [statsData, setStatsData] = useState<IntelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stop = false
    async function load() {
      setLoading(true)
      try {
        const [statsRes, listRes] = await Promise.all([
          fetch('/api/intel/stats', { cache: 'no-store' }),
          fetch('/api/intel/cves?limit=200&offset=0', { cache: 'no-store' }),
        ])
        if (!statsRes.ok) throw new Error(`Stats HTTP ${statsRes.status}`)
        if (!listRes.ok) throw new Error(`CVEs HTTP ${listRes.status}`)
        const s: IntelStats = await statsRes.json()
        const lj = await listRes.json()
        const es: CveEntry[] = Array.isArray(lj?.items) ? lj.items : []
        es.sort((a, b) => (a.published || '').localeCompare(b.published || ''))
        if (!stop) {
          setStatsData(s)
          setItems(es)
        }
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
    const top = (statsData.topServices || []).slice(0, 3)
    return [
      { label: dict?.tile_new_7d || 'Neue CVEs (7d)', value: statsData.newThisWeek },
      { label: dict?.tile_with_runbooks || 'CVEs mit Runbooks', value: statsData.coverage.mapped, hint: `${Math.round((statsData.coverage.ratio || 0) * 100)}%` },
      { label: dict?.tile_avg_cvss || 'Ø CVSS', value: Math.round((statsData.avgScore || 0) * 10) / 10 },
      { label: dict?.tile_top_services || 'Top Services', value: 0, hint: top.map((t) => `${t.name} (${t.count})`).join(' · ') },
    ]
  }, [statsData])

  const spark = useMemo(() => {
    if (items.length === 0) return [] as number[]
    const days = 14
    const buckets: Record<string, number> = {}
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const k = d.toISOString().slice(0, 10)
      buckets[k] = 0
    }
    for (const e of items) {
      const k = new Date(e.published).toISOString().slice(0, 10)
      if (k in buckets) buckets[k] += 1
    }
    return Object.values(buckets)
  }, [items])

  if (loading) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-gray-400">{dict?.stats_loading || 'Lade Statistiken…'}</div>
  if (error) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-red-400">{error}</div>

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
        <div className="text-xs text-gray-400 mb-1">{dict?.spark_title || 'CVE‑Veröffentlichungen (14 Tage)'}</div>
        <div className="flex items-end gap-1 h-16">
          {spark.map((v, idx) => (
            <div key={idx} className="w-3 bg-gradient-to-t from-cyan-700 to-cyan-400 rounded"
                 style={{ height: `${Math.min(100, Math.max(6, v*8))}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
