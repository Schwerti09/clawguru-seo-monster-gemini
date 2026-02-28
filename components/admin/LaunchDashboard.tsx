"use client"

// File: components/admin/LaunchDashboard.tsx
// 1M LIVE LAUNCH v2.0 – Overlord AI: Client component for the launch dashboard.

import { useEffect, useState } from "react"

type QualitySample = {
  sampled: number
  passed: number
  failed: number
  passRate: number
  avgScore: number
  goldCount: number
  silverCount: number
  topViolations: Array<{ field: string; count: number }>
}

type LaunchStats = {
  launch: string
  totalRunbookSlugs: number
  sitemapPages: number
  sitemapPageSize: number
  qualityGateThreshold: number
  qualitySample: QualitySample
  nextBatch: { startSlugIndex: number; endSlugIndex: number; label: string }
  generatedAt: string
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/30 p-5">
      <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-black text-white">{value}</div>
      {sub && <div className="text-sm text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

export default function LaunchDashboard() {
  const [data, setData] = useState<LaunchStats | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(true)

  async function load() {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch("/api/launch/stats", { cache: "no-store" })
      if (res.status === 401) {
        window.location.href = "/admin"
        return
      }
      if (!res.ok) {
        setErr("Fehler beim Laden der Launch-Stats")
        return
      }
      setData((await res.json()) as LaunchStats)
    } catch {
      setErr("Netzwerkfehler")
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [])

  if (busy && !data) {
    return <div className="text-gray-400 animate-pulse">Lade Launch-Stats…</div>
  }
  if (err) {
    return (
      <div className="rounded-2xl border border-red-800 bg-red-950/30 p-5 text-red-400">
        {err}
        <button onClick={load} className="ml-4 underline text-red-300">Retry</button>
      </div>
    )
  }
  if (!data) return null

  const { qualitySample: qs } = data
  const passColor = qs.passRate >= 90 ? "text-green-400" : qs.passRate >= 70 ? "text-yellow-400" : "text-red-400"

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-500">
          ✅ 1M LIVE LAUNCH v2.0 · auto-refresh 60s · {data.generatedAt.slice(0, 19).replace("T", " ")} UTC
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-2xl font-black bg-gradient-to-r from-cyan-500 to-violet-600 hover:opacity-90 text-white text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Main stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Runbook Slugs"
          value={data.totalRunbookSlugs.toLocaleString()}
          sub="Provider × Service × Issue × Year"
        />
        <StatCard
          label="Sitemap Pages"
          value={data.sitemapPages.toLocaleString()}
          sub={`${data.sitemapPageSize.toLocaleString()} URLs / file`}
        />
        <StatCard
          label="Quality Gate Score"
          value={`≥ ${data.qualityGateThreshold}`}
          sub="Minimum pass threshold (2.0)"
        />
        <StatCard
          label="Sample Pass-Rate"
          value={`${qs.passRate}%`}
          sub={`${qs.passed}/${qs.sampled} runbooks passed`}
        />
      </div>

      {/* Quality Gate detail */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-800 bg-black/30 p-5 space-y-3">
          <div className="text-xs text-gray-500 uppercase tracking-widest">Quality Gate 2.0 – Sample Results</div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span>Avg Score: <strong className="text-white">{qs.avgScore}/100</strong></span>
            <span className={passColor}>Pass-Rate: <strong>{qs.passRate}%</strong></span>
            <span>🥇 Gold: <strong className="text-yellow-400">{qs.goldCount}</strong></span>
            <span>🥈 Silver: <strong className="text-gray-300">{qs.silverCount}</strong></span>
          </div>
          {qs.topViolations.length > 0 && (
            <div>
              <div className="text-xs text-gray-600 mb-1">Top violations (sample)</div>
              <ul className="space-y-1">
                {qs.topViolations.map((v) => (
                  <li key={v.field} className="text-xs text-gray-400 flex justify-between">
                    <span>{v.field}</span>
                    <span className="text-gray-500">{v.count}×</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Next batch */}
        <div className="rounded-2xl border border-gray-800 bg-black/30 p-5 space-y-3">
          <div className="text-xs text-gray-500 uppercase tracking-widest">Next 50k Batch</div>
          <div className="text-lg font-black text-white">{data.nextBatch.label}</div>
          <div className="text-sm text-gray-400">
            Slugs {data.nextBatch.startSlugIndex.toLocaleString()} – {data.nextBatch.endSlugIndex.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-2">
            Cron: <code className="text-gray-400">/api/launch/cron?page=1</code> (every 6 h via Vercel Cron)
          </div>
        </div>
      </div>
    </div>
  )
}
