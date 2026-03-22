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

type Stat = { label: string; value: number; hint?: string }

function detectServicesFromText(s: string): string[] {
  const t = (s || "").toLowerCase()
  const keys = ["ssh","openssh","nginx","kubernetes","docker","redis","postgres","http2","cloudflare","teamcity","next.js","nextjs"]
  const out: string[] = []
  for (const k of keys) {
    const alts = k === 'openssh' ? ['openssh','ssh']
      : k === 'http2' ? ['http2','http/2']
      : k === 'next.js' ? ['next.js','nextjs']
      : [k]
    if (alts.some(a => t.includes(a))) out.push(k)
  }
  return Array.from(new Set(out))
}

export default function StatsDashboard() {
  const [entries, setEntries] = useState<CveEntry[]>([])
  const [map, setMap] = useState<Mapping>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        const es: CveEntry[] = Array.isArray(feedJ?.entries) ? feedJ.entries : []
        es.sort((a, b) => (a.published || '').localeCompare(b.published || ''))
        if (!stop) setEntries(es)
        if (mapRes && mapRes.ok) {
          const mj = await mapRes.json().catch(() => null)
          if (mj && typeof mj.mapping === 'object' && mj.mapping) setMap(mj.mapping)
        }
      } catch (e: any) {
        if (!stop) setError(e?.message || 'Stats-Ladefehler')
      } finally {
        if (!stop) setLoading(false)
      }
    }
    load()
    return () => { stop = true }
  }, [])

  const stats = useMemo<Stat[]>(() => {
    if (entries.length === 0) return []
    const now = new Date()
    const last7 = entries.filter(e => {
      const d = new Date(e.published)
      return (now.getTime() - d.getTime()) <= 7*24*3600*1000
    })
    const withRb = entries.filter(e => map[e.id])
    const avg = entries.reduce((acc, e) => acc + (Number(e.score || 0)), 0) / entries.length

    const svcCount = new Map<string, number>()
    for (const e of entries) {
      const inMap = map[e.id]
      const services = inMap?.services && inMap.services.length ? inMap.services : detectServicesFromText(`${e.title} ${e.description}`)
      for (const s of services) svcCount.set(s, (svcCount.get(s) || 0) + 1)
    }
    const top = Array.from(svcCount.entries()).sort((a,b)=>b[1]-a[1]).slice(0,3)

    return [
      { label: 'Neue CVEs (7d)', value: last7.length },
      { label: 'CVEs mit Runbooks', value: withRb.length, hint: `${Math.round(withRb.length / entries.length * 100)}%` },
      { label: 'Ø CVSS', value: Math.round(avg*10)/10 },
      { label: 'Top Services', value: 0, hint: top.map(([k,v]) => `${k} (${v})`).join(' · ') },
    ]
  }, [entries, map])

  const spark = useMemo(() => {
    if (entries.length === 0) return [] as number[]
    // Build per-day counts for the last 14 days
    const days = 14
    const buckets: Record<string, number> = {}
    const now = new Date()
    for (let i=days-1;i>=0;i--) {
      const d = new Date(now)
      d.setDate(d.getDate()-i)
      const k = d.toISOString().slice(0,10)
      buckets[k] = 0
    }
    for (const e of entries) {
      const k = new Date(e.published).toISOString().slice(0,10)
      if (k in buckets) buckets[k] += 1
    }
    return Object.values(buckets)
  }, [entries])

  if (loading) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-gray-400">Lade Statistiken…</div>
  if (error) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-red-400">{error}</div>

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-sm text-cyan-300 mb-3">Statistiken & Trends</div>
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-black/50 p-3">
            <div className="text-xs text-gray-400">{s.label}</div>
            <div className="text-2xl font-black text-white mt-1">{s.value}{s.hint ? <span className="text-sm font-normal text-gray-400 ml-2">{s.hint}</span> : null}</div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <div className="text-xs text-gray-400 mb-1">CVE‑Veröffentlichungen (14 Tage)</div>
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
