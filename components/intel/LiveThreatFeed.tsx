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

type Tier = "free" | "daypass" | "pro" | "enterprise"

export default function LiveThreatFeed(props: { prefix?: string }) {
  const { prefix = "" } = props
  const [entries, setEntries] = useState<CveEntry[]>([])
  const [tier, setTier] = useState<Tier>("free")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyExport, setBusyExport] = useState(false)

  useEffect(() => {
    let stop = false
    async function load() {
      setLoading(true)
      try {
        const [feedRes, tierRes] = await Promise.all([
          fetch('/cve-feed.json', { cache: 'no-store' }),
          fetch('/api/auth/tier', { cache: 'no-store' }).catch(() => null as any),
        ])
        if (!feedRes.ok) throw new Error(`HTTP ${feedRes.status}`)
        const feed = await feedRes.json()
        const list: CveEntry[] = Array.isArray(feed?.entries) ? feed.entries : []
        list.sort((a, b) => (b.published || '').localeCompare(a.published || ''))
        if (!stop) setEntries(list)
        if (tierRes && tierRes.ok) {
          const j = await tierRes.json().catch(() => null)
          const t = (j?.tier as string) || "free"
          if (!stop) setTier(t === 'daypass' || t === 'pro' || t === 'enterprise' ? (t as Tier) : 'free')
        } else if (!stop) {
          setTier('free')
        }
      } catch (e: any) {
        if (!stop) setError(e?.message || 'Feed-Ladefehler')
      } finally {
        if (!stop) setLoading(false)
      }
    }
    load()
    return () => { stop = true }
  }, [])

  const visible = useMemo(() => {
    const max = tier === 'free' ? 5 : 50
    return entries.slice(0, max)
  }, [entries, tier])

  function sevColor(sev: string) {
    const s = (sev || '').toLowerCase()
    if (s.includes('critical')) return 'text-red-400'
    if (s.includes('high')) return 'text-orange-400'
    if (s.includes('medium')) return 'text-yellow-300'
    if (s.includes('low')) return 'text-green-400'
    return 'text-gray-400'
  }

  if (loading) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-gray-400">Lade CVE‑Feed…</div>
  if (error) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-red-400">{error}</div>

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
      <div className="p-3 flex items-center justify-between">
        <div className="text-sm text-cyan-300">Live Threat Feed</div>
        {tier !== 'free' ? (
          <div className="flex items-center gap-2">
            <button disabled={busyExport} onClick={() => exportCsv(entries, setBusyExport)} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200">Export CSV</button>
            <button disabled={busyExport} onClick={() => exportJson(entries, setBusyExport)} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200">Export JSON</button>
            <button disabled={busyExport} onClick={() => exportPdfLike(entries, setBusyExport)} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200">PDF (Drucken)</button>
          </div>
        ) : null}
      </div>
      <div className="divide-y divide-white/5">
        {visible.map((e) => (
        <div key={e.id} className="p-4 hover:bg-white/5 transition-colors group">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-mono text-gray-400">{e.id}</div>
            <div className={`text-xs font-bold ${sevColor(e.severity)}`}>{e.severity?.toUpperCase()} · {e.score?.toFixed?.(1)}</div>
          </div>
          <div className="mt-1 text-white font-semibold">{e.title}</div>
          <div className="mt-1 text-sm text-gray-400 line-clamp-2">{e.description}</div>
          <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
            <span>{new Date(e.published).toISOString().slice(0,10)}</span>
            <a href={`${prefix || ''}/solutions/fix-${encodeURIComponent(e.id)}`} className="opacity-0 group-hover:opacity-100 underline text-cyan-300 transition-opacity">Fix‑Runbook öffnen</a>
          </div>
        </div>
      ))}
      </div>
      {tier === 'free' && entries.length > visible.length && (
        <div className="p-4 text-sm text-gray-400 flex items-center justify-between">
          <span>Nur die letzten 5 CVEs sichtbar. Mit Daypass siehst du den kompletten Feed und kannst exportieren.</span>
          <a href={`${prefix || ''}/daypass`} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 text-white text-xs font-semibold">Daypass kaufen</a>
        </div>
      )}
    </div>
  )
}

function exportCsv(entries: CveEntry[], setBusy: (b: boolean) => void) {
  setBusy(true)
  try {
    const header = ["id","title","description","score","severity","published"].join(",")
    const rows = entries.map(e => [e.id, q(e.title), q(e.description), String(e.score ?? ""), String(e.severity ?? ""), String(e.published ?? "")].join(","))
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cve-feed-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  } finally { setBusy(false) }
}

function exportJson(entries: CveEntry[], setBusy: (b: boolean) => void) {
  setBusy(true)
  try {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), entries }, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cve-feed-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  } finally { setBusy(false) }
}

function exportPdfLike(entries: CveEntry[], setBusy: (b: boolean) => void) {
  setBusy(true)
  try {
    const w = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
    if (!w) return
    const rows = entries.map(e => `<tr><td style="font-family:monospace;padding:6px 8px;border-bottom:1px solid #ddd">${e.id}</td><td style="padding:6px 8px;border-bottom:1px solid #ddd">${escapeHtml(e.title)}</td><td style="padding:6px 8px;border-bottom:1px solid #ddd">${escapeHtml(e.severity?.toUpperCase() || '')} · ${e.score?.toFixed?.(1) || ''}</td><td style="padding:6px 8px;border-bottom:1px solid #ddd">${new Date(e.published).toISOString().slice(0,10)}</td></tr>`).join('')
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>CVE Export</title></head><body><h1 style="font-family:system-ui">CVE Feed Export</h1><table style="width:100%;border-collapse:collapse">${rows}</table><script>setTimeout(()=>window.print(),200)</script></body></html>`
    w.document.write(html)
    w.document.close()
  } finally { setBusy(false) }
}

function q(s?: string) {
  const v = (s || '').replace(/"/g, '""')
  return `"${v}"`
}

function escapeHtml(s?: string) {
  const t = (s || '')
  return t.replace(/[&<>\"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'} as any)[c] || c)
}
