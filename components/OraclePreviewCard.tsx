"use client"

import React, { useEffect, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import Skeleton from "./ui/Skeleton"

function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current || inView) return
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, [opts, inView])
  return { ref, inView }
}

type Risk = {
  cve_id: string
  title: string
  probability: number
  recommended_runbook?: { slug: string; title: string; clawScore: number } | null
}

type Props = { prefix?: string }

export default function OraclePreviewCard({ prefix = "" }: Props) {
  const scopes: Array<{ value: string; label: string }> = [
    { value: "alle", label: "Alle CVEs" },
    { value: "aws", label: "Meine Cloud (AWS)" },
    { value: "gcp", label: "Meine Cloud (GCP)" },
    { value: "azure", label: "Meine Cloud (Azure)" },
  ]
  const [scope, setScope] = useState("alle")
  const [data, setData] = useState<{ critical_risk: Risk[]; timeline?: string; summary?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" })

  useEffect(() => {
    if (!inView) return
    let canceled = false
    setLoading(true)
    setError(null)
    const q = scope === "alle" ? "" : scope
    fetch(`/api/oracle?scope=${encodeURIComponent(q)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((j) => {
        if (!canceled) setData(j)
      })
      .catch(() => { if (!canceled) setError("Fehler beim Laden") })
      .finally(() => { if (!canceled) setLoading(false) })
    return () => { canceled = true }
  }, [inView, scope])

  return (
    <div ref={ref}>
      <FeaturePreviewCard
        title="Oracle"
        description="Welche Bedrohungen kommen auf dich zu? Oracle warnt rechtzeitig – mit klaren Next‑Steps."
        link={`${prefix}/oracle`}
      >
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400">Welche Bedrohungen sind für dich relevant?</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
          >
            {scopes.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="mt-2 text-[11px] text-gray-500">1.200+ aktive CVEs überwacht</div>
        <div className="mt-4">
          {loading && (
            <div className="space-y-3">
              <div className="text-xs text-gray-400">Analysiere aktuelle Bedrohungen…</div>
              <Skeleton className="h-4 w-2/3" />
              {[0,1,2].map((k) => (
                <div key={k} className="p-3 rounded-lg bg-black/30 border border-white/10">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                    <div className="bg-violet-500 h-1 rounded-full w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && error && <div className="text-sm text-red-400">{error}</div>}
          {!loading && !error && data && (
            <>
              {data.summary && <div className="text-sm text-violet-300 mb-2">{data.summary}</div>}
              <div className="space-y-2">
                {(data.critical_risk || []).slice(0,3).map((r, i) => {
                  const urgent = r.title?.toLowerCase().includes("openssh")
                    ? "Kritische OpenSSH-Lücke – Ausnutzung in <48h wahrscheinlich. Jetzt patchen."
                    : r.title?.toLowerCase().includes("xz")
                    ? "Neue XZ-Backdoor – schnelles Handeln erforderlich."
                    : `${r.title}`
                  return (
                    <a key={i} href={`https://nvd.nist.gov/vuln/detail/${encodeURIComponent(r.cve_id)}`} target="_blank" rel="noreferrer"
                       className="block p-3 rounded-lg bg-black/30 border border-white/10 hover:border-violet-400/30 transition-colors">
                      <div className="flex justify-between items-center gap-3">
                        <div className="text-sm font-mono text-gray-200 line-clamp-1">{r.cve_id} — {urgent}</div>
                        <div className="text-xs text-gray-400">{r.probability}%</div>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                        <div className={`h-1 rounded-full ${r.probability>70?"bg-red-500":r.probability>30?"bg-yellow-400":"bg-emerald-400"}`} style={{ width: `${r.probability}%` }} />
                      </div>
                      {r.recommended_runbook && (
                        <div className="mt-2 text-xs text-gray-400">
                          Empfohlenes Runbook: <a href={`${prefix}/runbook/${encodeURIComponent(r.recommended_runbook.slug)}`} target="_blank" className="text-violet-300 hover:text-violet-200">{r.recommended_runbook.title} →</a>
                        </div>
                      )}
                    </a>
                  )
                })}
              </div>
              {(!data.critical_risk || data.critical_risk.length === 0) && (
                <div className="text-sm text-emerald-300 mt-2">Deine Umgebung ist aktuell sicher. Überwachen wir weiter.</div>
              )}
              {data.timeline && <div className="mt-2 text-[11px] text-gray-500">Erstes kritisches Ereignis: {data.timeline}</div>}
            </>
          )}
        </div>
      </FeaturePreviewCard>
    </div>
  )
}
