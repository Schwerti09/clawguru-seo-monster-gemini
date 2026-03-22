"use client"

import React, { useEffect, useState } from "react"

type Risk = {
  cve_id: string
  title: string
  probability: number
  recommended_runbook?: { slug: string; title: string; clawScore: number } | null
  services?: string[]
}

type OracleResp = {
  critical_risk: Risk[]
  timeline?: string
  summary?: string
}

export default function PredictiveRadar(props: { prefix?: string }) {
  const { prefix = "" } = props
  const [data, setData] = useState<OracleResp | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stop = false
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/oracle?days=7`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const j = await res.json()
        if (!stop) setData(j)
      } catch (e: any) {
        if (!stop) setError(e?.message || 'Oracle-Fehler')
      } finally {
        if (!stop) setLoading(false)
      }
    }
    load()
    return () => { stop = true }
  }, [])

  if (loading) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-gray-400">Lade Prognosen…</div>
  if (error) return <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-red-400">{error}</div>
  if (!data) return null

  const risks = (data.critical_risk || []).slice(0, 3)

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="text-sm text-emerald-300 mb-2">Predictive Threat Radar</div>
      <div className="space-y-3">
        {risks.map((r) => (
          <div key={r.cve_id} className="rounded-xl border border-white/10 bg-black/50 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-mono text-gray-400">{r.cve_id}</div>
              <div className="text-xs text-amber-300">{r.probability}%</div>
            </div>
            <div className="mt-1 text-white font-semibold">{r.title}</div>
            {r.recommended_runbook && (
              <div className="mt-2 text-sm">
                <a href={`${prefix || ''}/runbook/${r.recommended_runbook.slug}`} className="underline text-cyan-300">
                  {r.recommended_runbook.title}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 text-right">
        <a href={`${prefix || ''}/oracle`} className="text-xs underline text-gray-400 hover:text-gray-200">Mehr im Oracle‑Dashboard →</a>
      </div>
    </div>
  )
}
