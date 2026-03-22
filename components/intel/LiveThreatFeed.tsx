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
    <div className="rounded-2xl border border-white/10 bg-black/40 divide-y divide-white/5 overflow-hidden">
      {visible.map((e) => (
        <div key={e.id} className="p-4 hover:bg-white/5 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-mono text-gray-400">{e.id}</div>
            <div className={`text-xs font-bold ${sevColor(e.severity)}`}>{e.severity?.toUpperCase()} · {e.score?.toFixed?.(1)}</div>
          </div>
          <div className="mt-1 text-white font-semibold">{e.title}</div>
          <div className="mt-1 text-sm text-gray-400 line-clamp-2">{e.description}</div>
          <div className="mt-2 text-xs text-gray-500">{new Date(e.published).toISOString().slice(0,10)}</div>
        </div>
      ))}
      {tier === 'free' && entries.length > visible.length && (
        <div className="p-4 text-sm text-gray-400 flex items-center justify-between">
          <span>Nur die letzten 5 CVEs sichtbar. Mit Daypass siehst du den kompletten Feed und kannst exportieren.</span>
          <a href={`${prefix || ''}/daypass`} className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-700 text-white text-xs font-semibold">Daypass kaufen</a>
        </div>
      )}
    </div>
  )
}
