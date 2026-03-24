"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import { motion } from "framer-motion"
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

type Props = { prefix?: string }

export default function SummonPreviewCard({ prefix = "" }: Props) {
  const examples = [
    "Ich habe eine kritische SSH-Lücke entdeckt – was jetzt?",
    "Meine AWS-Instanzen werden angegriffen, wie stoppe ich das?",
    "Kubernetes-Cluster zeigt offene Ports – sofort handeln!",
  ]
  const [query, setQuery] = useState("Meine AWS-Server werden massiv angegriffen – wie härte ich SSH?")
  const [debounced, setDebounced] = useState(query)
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" })

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (!inView) return
    const q = (debounced || "ssh hardening").trim()
    if (!q) return
    let canceled = false
    setLoading(true)
    setError(null)
    fetch(`/api/summon?q=${encodeURIComponent(q)}`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error(String(res.status))))
      .then((j) => { if (!canceled) setData(j) })
      .catch((e) => { if (!canceled) setError("Fehler beim Laden") })
      .finally(() => { if (!canceled) setLoading(false) })
    return () => { canceled = true }
  }, [inView, debounced])

  const top = useMemo(() => (data?.relevant_runbooks || []).slice(0, 3), [data])

  return (
    <div ref={ref}>
      <FeaturePreviewCard
        title="Summon"
        description="Beschreibe dein Vorfall – Summon liefert dir in Sekunden den besten Fix."
        link={`${prefix}/summon`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ich habe eine kritische SSH-Lücke entdeckt – was jetzt?"
          className="w-full p-3 rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setQuery(ex)}
              className="text-[11px] bg-white/5 border border-white/10 hover:border-cyan-400/30 hover:bg-cyan-500/10 text-gray-300 rounded-full px-3 py-1 transition"
            >
              {ex.length > 46 ? ex.slice(0, 46) + "…" : ex}
            </button>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-gray-500">Über 4,2 Mio. Runbooks durchsucht</div>
        <div className="mt-4">
          {loading && (
            <div className="space-y-3">
              <div className="text-xs text-gray-400">Durchsuche das Wissensnetzwerk…</div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="grid gap-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          )}
          {!loading && error && (
            <div className="text-sm text-red-400">{error}</div>
          )}
          {!loading && !error && data && (
            <>
              <div className="text-sm text-cyan-400 mb-2">Problem: {data.problem}</div>
              <div className="space-y-2">
                {top.length === 0 && (
                  <div className="text-sm text-gray-400">Keine passenden Runbooks gefunden. Tipp: Formuliere konkreter oder versuche einen anderen Begriff.</div>
                )}
                {top.map((rb: any, idx: number) => (
                  <motion.a
                    key={idx}
                    href={`${prefix}/runbook/${encodeURIComponent(rb.slug)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-black/30 rounded-lg p-3 border border-white/10 hover:border-cyan-400/30 transition-colors"
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex justify-between items-center gap-3">
                      <span className="font-mono text-sm text-gray-200 line-clamp-1">{rb.title}</span>
                      <span className="text-cyan-400 text-xs">{rb.clawScore}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                      <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${rb.clawScore}%` }} />
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400">{rb.clawScore >= 80 ? "Reduziert Angriffsfläche um 80%+" : rb.clawScore >= 50 ? "Schützt vor häufigen Angriffen" : "Solide Basis‑Härtung"}</div>
                  </motion.a>
                ))}
              </div>
              {!!(data.affected_services?.length) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.affected_services.slice(0, 6).map((s: string) => (
                    <span key={s} className="px-2 py-1 rounded-md text-[11px] bg-white/5 border border-white/10 text-gray-300">{s}</span>
                  ))}
                </div>
              )}
              <div className="mt-3 text-xs text-gray-400">
                Confidence: {data.confidence}%
                <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{data.confidence >= 70 ? "Hohe Relevanz" : data.confidence >= 40 ? "Mittlere Passung" : "Niedrige Passung"}</span>
              </div>
            </>
          )}
        </div>
      </FeaturePreviewCard>
    </div>
  )
}
