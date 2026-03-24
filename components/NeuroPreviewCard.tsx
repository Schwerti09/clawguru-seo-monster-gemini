"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import Skeleton from "./ui/Skeleton"

function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current || inView) return
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); io.disconnect() }
    }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, [opts, inView])
  return { ref, inView }
}

const ALL_TAGS = [
  "AWS","GCP","Azure","Nginx","Postgres","Kubernetes","Docker","SSH","Terraform"
]

type Props = { prefix?: string }

export default function NeuroPreviewCard({ prefix = "" }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" })
  const [selected, setSelected] = useState<string[]>(["AWS","Nginx","Postgres"]) 
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // debounce tags
  const [debounced, setDebounced] = useState(selected)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(selected), 400)
    return () => clearTimeout(t)
  }, [selected])

  useEffect(() => {
    if (!inView) return
    if (!debounced.length) return
    let canceled = false
    setLoading(true)
    setError(null)
    const stack = debounced.join(",")
    fetch(`/api/neuro?stack=${encodeURIComponent(stack)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => { if (!canceled) setData(j) })
      .catch(() => { if (!canceled) setError("Fehler beim Laden") })
      .finally(() => { if (!canceled) setLoading(false) })
    return () => { canceled = true }
  }, [inView, debounced])

  const top = useMemo(() => (data?.recommended_runbooks || []).slice(0, 4), [data])

  function toggle(tag: string) {
    setSelected((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  function benefitFor(rb: any) {
    if (selected.includes("AWS")) return "Schützt vor 10+ AWS‑spezifischen Angriffen"
    if (selected.includes("Nginx")) return "Erhöht Nginx‑Sicherheits‑Score um 30%"
    if (selected.includes("Postgres")) return "Verschlüsselt Daten & reduziert Exfiltration"
    return "Reduziert Angriffsfläche deutlich"
  }

  function parsePlan(plan: string): string[] {
    if (!plan) return []
    const parts = plan
      .split(/\n|->|•|\u2022|;|\||,|\./)
      .map((s) => s.trim())
      .filter(Boolean)
    return parts.length > 1 ? parts.slice(0, 5) : [plan]
  }

  return (
    <div ref={ref}>
      <FeaturePreviewCard
        title="Neuro"
        description="Wähle deine Technologien – ich erstelle einen maßgeschneiderten Sicherheitsplan."
        link={`${prefix}/neuro`}
      >
        <div className="text-xs text-gray-400 mb-2">Wähle deinen Tech‑Stack – ich zeige dir, was du jetzt sichern solltest.</div>
        <div className="flex flex-wrap gap-2">
          {ALL_TAGS.map((t) => {
            const active = selected.includes(t)
            return (
              <button
                key={t}
                onClick={() => toggle(t)}
                className={`px-2.5 py-1 rounded-md text-[12px] border transition-all ${active?"bg-cyan-500/10 border-cyan-400/30 text-cyan-200":"bg-white/5 border-white/10 text-gray-300 hover:border-white/20"}`}
              >
                {t}
              </button>
            )
          })}
        </div>
        <div className="mt-2 text-[11px] text-gray-500">98% personalisierte Passgenauigkeit</div>
        <div className="mt-4">
          {loading && (
            <div className="space-y-3">
              <div className="text-xs text-gray-400">Erstelle deinen persönlichen Sicherheitsplan…</div>
              <Skeleton className="h-4 w-1/2" />
              {[0,1,2,3].map((k) => (
                <div key={k} className="p-3 rounded-lg bg-black/30 border border-white/10">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                    <div className="bg-cyan-500 h-1 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && error && <div className="text-sm text-red-400">{error}</div>}
          {!loading && !error && data && (
            <>
              <div className="text-sm text-cyan-400 mb-2">Dein Plan:</div>
              {parsePlan(data.execution_plan || "").length > 0 && (
                <ul className="mb-2 pl-4 list-disc text-xs text-gray-300 space-y-1">
                  {parsePlan(data.execution_plan || "").map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              )}
              <div className="space-y-2">
                {top.length === 0 && (
                  <div className="text-sm text-gray-400">Keine passenden Empfehlungen. Wähle mehr oder andere Technologien aus.</div>
                )}
                {top.map((rb: any, i: number) => (
                  <a key={i} href={`${prefix}/runbook/${encodeURIComponent(rb.slug)}`} target="_blank" rel="noreferrer"
                     className="block p-3 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-400/30 transition-colors">
                    <div className="flex justify-between items-center gap-3">
                      <div className="text-sm font-mono text-gray-200 line-clamp-1">{rb.title}</div>
                      <div className="text-xs text-gray-400">{rb.relevance}%</div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                      <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${rb.relevance}%` }} />
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400">{benefitFor(rb)}</div>
                    <div className="mt-0.5 text-[11px] text-gray-500">ClawScore: {rb.clawScore}%</div>
                  </a>
                ))}
              </div>
              <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                  <path d="M12 8v5l3 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="2" />
                </svg>
                In {data.estimated_time} sicherer
              </div>
            </>
          )}
        </div>
      </FeaturePreviewCard>
    </div>
  )
}
