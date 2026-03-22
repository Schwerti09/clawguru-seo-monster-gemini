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

type Mapping = Record<string, { slug: string; title: string; clawScore: number; services?: string[] }>

type Detail = {
  cve?: CveEntry | null
  mapping?: { slug: string; title: string; clawScore: number; services?: string[] } | null
  summon?: { slug: string; title: string; clawScore?: number } | null
}

export default function CveAnalyzer(props: { prefix?: string }) {
  const { prefix = "" } = props
  const [q, setQ] = useState("")
  const [feed, setFeed] = useState<CveEntry[]>([])
  const [map, setMap] = useState<Mapping>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let stop = false
    async function load() {
      setLoading(true)
      try {
        const [feedRes, mapRes] = await Promise.all([
          fetch('/cve-feed.json', { cache: 'no-store' }),
          fetch('/cve-runbook-mapping.json', { cache: 'no-store' }).catch(() => null as any),
        ])
        if (!feedRes.ok) throw new Error(`HTTP ${feedRes.status}`)
        const feedJ = await feedRes.json()
        const entries: CveEntry[] = Array.isArray(feedJ?.entries) ? feedJ.entries : []
        if (!stop) setFeed(entries)
        if (mapRes && mapRes.ok) {
          const mj = await mapRes.json().catch(() => null)
          if (mj && typeof mj.mapping === 'object' && mj.mapping) setMap(mj.mapping)
        }
      } catch (e: any) {
        if (!stop) setError(e?.message || 'Analyzer-Ladefehler')
      } finally {
        if (!stop) setLoading(false)
      }
    }
    load()
    return () => { stop = true }
  }, [])

  const recent = useMemo(() => feed.slice(0, 10), [feed])

  async function analyze() {
    const term = q.trim()
    if (!term) return
    setBusy(true)
    try {
      const byId = feed.find((e) => e.id.toUpperCase() === term.toUpperCase())
      const byTitle = !byId ? feed.find((e) => e.title?.toLowerCase().includes(term.toLowerCase())) : undefined
      const cve = byId || byTitle || null
      const mapping = cve ? map[cve.id] : undefined
      let summon: Detail['summon'] = null
      if (!mapping && cve) {
        try {
          const res = await fetch(`/api/summon?q=${encodeURIComponent(cve.title || term)}`)
          if (res.ok) {
            const j = await res.json().catch(() => null)
            const rb = Array.isArray(j?.relevant_runbooks) ? j.relevant_runbooks[0] : null
            if (rb) summon = { slug: rb.slug, title: rb.title, clawScore: rb.clawScore }
          }
        } catch {}
      }
      setDetail({ cve, mapping: mapping || null, summon })
    } finally {
      setBusy(false)
    }
  }

  function sevPill(s: string) {
    const sev = (s||'').toLowerCase()
    const color = sev.includes('critical') ? 'bg-red-500/10 text-red-300 border-red-500/30'
      : sev.includes('high') ? 'bg-orange-500/10 text-orange-300 border-orange-500/30'
      : sev.includes('medium') ? 'bg-yellow-500/10 text-yellow-200 border-yellow-500/30'
      : sev.includes('low') ? 'bg-green-500/10 text-green-300 border-green-500/30'
      : 'bg-gray-500/10 text-gray-300 border-gray-500/30'
    return <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${color}`}>{s?.toUpperCase()}</span>
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-sm text-cyan-300 mb-2">CVE‑Analyzer & Runbook‑Matcher</div>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="CVE‑ID (z. B. CVE-2024-6387) oder Stichwort (z. B. ssh)"
          className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />
        <button onClick={analyze} disabled={busy}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold">
          {busy ? 'Analysiere…' : 'Analysieren'}
        </button>
      </div>

      {loading && <div className="mt-4 text-sm text-gray-400">Lade Feed…</div>}
      {!loading && recent.length > 0 && (
        <div className="mt-3 text-xs text-gray-400">Beispiele: {recent.map((e, i) => (
          <button key={e.id} className="underline hover:text-gray-200 mr-2" onClick={() => setQ(e.id)}>{e.id}</button>
        ))}</div>
      )}

      {detail?.cve && (
        <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-mono text-gray-400">{detail.cve.id}</div>
            <div className="flex items-center gap-2">
              {sevPill(detail.cve.severity)}
              <span className="text-xs text-gray-400">CVSS {detail.cve.score?.toFixed?.(1)}</span>
            </div>
          </div>
          <div className="mt-1 text-white font-semibold">{detail.cve.title}</div>
          <div className="mt-1 text-sm text-gray-400">{detail.cve.description}</div>
          <div className="mt-2 text-xs text-gray-500">Veröffentlicht: {new Date(detail.cve.published).toISOString().slice(0,10)}</div>

          {(detail.mapping || detail.summon) && (
            <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3">
              <div className="text-xs font-mono text-gray-400">Empfohlenes Runbook</div>
              <div className="text-sm text-white font-semibold">
                <a href={`${prefix || ''}/runbook/${(detail.mapping?.slug || detail.summon?.slug)}`}
                   className="hover:underline">
                  {detail.mapping?.title || detail.summon?.title}
                </a>
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <a className="underline text-cyan-300" href={`${prefix || ''}/oracle`}>Oracle</a>
                <a className="underline text-emerald-300" href={`${prefix || ''}/mycelium`}>Mycelium</a>
                <a className="underline text-indigo-300" href={`${prefix || ''}/neuro`}>Neuro</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
