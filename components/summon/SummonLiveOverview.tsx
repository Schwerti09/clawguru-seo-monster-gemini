"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

type IntelItem = { id: string; title: string; severity: string; category: string; when: string; tags: string[] }

type LiveData = {
  ok: boolean
  counts: { runbooks: number; tags: number; providers: number; sitemapUrls: number }
  quality: { avgClaw: number; p90Claw: number; gold: number; silver: number; sampleSize: number }
  live?: { pulse?: number; topTags?: Array<{ name: string; count: number }>; trending?: Array<{ slug: string; title: string; summary?: string; tags?: string[] }> }
  intel: { items: IntelItem[]; total: number; updatedAt: string } | null
  topRunbooks: Array<{ slug: string; title: string; summary: string; clawScore: number }>
  generatedAt: string
}

export default function SummonLiveOverview() {
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  const [data, setData] = useState<LiveData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stop = false
    async function load() {
      try {
        const res = await fetch("/api/live", { cache: "no-store" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const j = (await res.json()) as LiveData
        if (!stop) setData(j)
      } catch (e: any) {
        if (!stop) setError(e?.message || "failed")
      }
    }
    load()
    const id = window.setInterval(load, 30_000)
    return () => { stop = true; window.clearInterval(id) }
  }, [])

  if (error) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-red-500/30 bg-black/40 p-4 text-red-300 text-sm">Live-Daten konnten nicht geladen werden: {error}</div>
      </section>
    )
  }

  if (!data || !data.ok) return null

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <div
          className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-3"
          style={{ borderColor: "rgba(0,184,255,0.35)", color: "#00b8ff", background: "rgba(0,184,255,0.06)" }}
        >
          Live‑Operations • Realtime Overview
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white">Claw Swarm Oracle – Live</h2>
        <p className="mt-2 text-gray-400">Aktuelle Runbooks, Qualität, Trends & Intel Feed</p>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: "Runbooks", v: data.counts.runbooks }, { label: "Tags", v: data.counts.tags }, { label: "Provider", v: data.counts.providers }, { label: "Sitemap URLs", v: data.counts.sitemapUrls }].map((c) => (
          <div key={c.label} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center shadow-[0_0_40px_rgba(0,184,255,0.06)]">
            <div className="text-2xl md:text-3xl font-black text-white">{c.v.toLocaleString()}</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[{ label: "Ø ClawScore", v: data.quality.avgClaw }, { label: "P90 ClawScore", v: data.quality.p90Claw }, { label: "Gold", v: data.quality.gold }, { label: "Silber", v: data.quality.silver }].map((c) => (
          <div key={c.label} className="rounded-2xl border border-emerald-400/20 bg-black/40 p-4 text-center shadow-[0_0_40px_rgba(0,255,157,0.06)]">
            <div className="text-2xl md:text-3xl font-black text-white">{typeof c.v === 'number' ? c.v.toLocaleString() : (c.v as any)}</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {(data.live?.trending?.length || data.intel?.items?.length) && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10">
          <div className="animate-[marquee_25s_linear_infinite] whitespace-nowrap py-3 px-4 text-sm">
            {[
              ...(data.live?.trending || []).map((t) => `Trending: ${t.title}`),
              ...(data.intel?.items || []).map((i) => `Intel(${i.severity}): ${i.title}`),
            ].map((s, i) => (
              <span key={i} className="mx-6 text-gray-300">• {s}</span>
            ))}
          </div>
          <style>{`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
        </div>
      )}

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="text-sm font-bold text-white mb-3">Top Runbooks (ClawScore)</div>
          <div className="divide-y divide-white/5">
            {data.topRunbooks.map((r) => (
              <a key={r.slug} href={`${prefix}/runbook/${r.slug}`} className="flex items-center justify-between py-3 hover:bg-white/[0.02] rounded-lg px-2">
                <div>
                  <div className="text-sm text-white font-semibold">{r.title}</div>
                  <div className="text-xs text-gray-400 line-clamp-1">{r.summary}</div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(0,255,157,0.08)", color: "#00ff9d", border: "1px solid rgba(0,255,157,0.3)" }}>{r.clawScore}</div>
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="text-sm font-bold text-white mb-3">Latest Intel Feed</div>
          <div className="space-y-3">
            {(data.intel?.items || []).map((i) => (
              <div key={i.id} className="flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-black/30">
                <div className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ background: "rgba(255,0,102,0.12)", color: "#ff2b6a", border: "1px solid rgba(255,0,102,0.3)" }}>{i.severity}</div>
                <div>
                  <div className="text-sm text-white font-semibold">{i.title}</div>
                  <div className="text-xs text-gray-400">{new Date(i.when).toLocaleString()}</div>
                  <div className="mt-1 text-xs text-gray-400">Tags: {i.tags.join(", ")}</div>
                </div>
              </div>
            ))}
            {!data.intel?.items?.length && <div className="text-xs text-gray-500">Kein öffentlicher Intel‑Feed verfügbar.</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
