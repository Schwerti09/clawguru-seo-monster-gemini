"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import FeaturePreviewCard from "./FeaturePreviewCard"
import { motion } from "framer-motion"
import Skeleton from "./ui/Skeleton"
import { useI18n } from "@/components/i18n/I18nProvider"

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
  const { dict } = useI18n()
  const p = (dict as any)?.previews ?? {}
  const t = {
    desc: p.summonDesc || "Describe your incident – Summon delivers the best fix in seconds.",
    placeholder: p.summonPlaceholder || "I discovered a critical SSH vulnerability – what now?",
    defaultQuery: p.summonDefaultQuery || "My AWS servers are under massive attack – how do I harden SSH?",
    ex1: p.summonEx1 || "I discovered a critical SSH vulnerability – what now?",
    ex2: p.summonEx2 || "My AWS instances are under attack, how do I stop it?",
    ex3: p.summonEx3 || "Kubernetes cluster shows open ports – act immediately!",
    counter: p.summonCounter || "Over 4.2M runbooks searched",
    searching: p.summonSearching || "Searching the knowledge network…",
    error: p.summonError || "Error loading",
    noResults: p.summonNoResults || "No matching runbooks found. Tip: Be more specific or try a different term.",
    reduces80: p.summonReduces80 || "Reduces attack surface by 80%+",
    protects: p.summonProtects || "Protects against common attacks",
    baseHardening: p.summonBaseHardening || "Solid baseline hardening",
    highRelevance: p.summonHighRelevance || "High relevance",
    mediumMatch: p.summonMediumMatch || "Medium match",
    lowMatch: p.summonLowMatch || "Low match",
  }

  const examples = [t.ex1, t.ex2, t.ex3]
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState(query)
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "200px" })

  // Set default query from translations once dict is ready
  useEffect(() => {
    if (!query) setQuery(t.defaultQuery)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.defaultQuery])

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(timer)
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
      .catch(() => { if (!canceled) setError(t.error) })
      .finally(() => { if (!canceled) setLoading(false) })
    return () => { canceled = true }
  }, [inView, debounced])

  const top = useMemo(() => (data?.relevant_runbooks || []).slice(0, 3), [data])

  function benefitLabel(score: number) {
    if (score >= 80) return t.reduces80
    if (score >= 50) return t.protects
    return t.baseHardening
  }

  function confidenceLabel(confidence: number) {
    if (confidence >= 70) return t.highRelevance
    if (confidence >= 40) return t.mediumMatch
    return t.lowMatch
  }

  return (
    <div ref={ref}>
      <FeaturePreviewCard
        title="Summon"
        description={t.desc}
        link={`${prefix}/summon`}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
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
        <div className="mt-2 text-[11px] text-gray-500">{t.counter}</div>
        <div className="mt-4">
          {loading && (
            <div className="space-y-3">
              <div className="text-xs text-gray-400">{t.searching}</div>
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
                  <div className="text-sm text-gray-400">{t.noResults}</div>
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
                    <div className="mt-1 text-[11px] text-gray-400">{benefitLabel(rb.clawScore)}</div>
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
                <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{confidenceLabel(data.confidence)}</span>
              </div>
            </>
          )}
        </div>
      </FeaturePreviewCard>
    </div>
  )
}
