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

type Props = { prefix?: string; dict?: Record<string, string> }

export default function SummonPreviewCard({ prefix = "", dict = {} }: Props) {
  const examples = [
    dict.summon_example1 || "I discovered a critical SSH vulnerability – what now?",
    dict.summon_example2 || "My AWS instances are under attack, how do I stop this?",
    dict.summon_example3 || "Kubernetes cluster shows open ports – act immediately!",
  ]

  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`${prefix}/api/summon/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      setResults([])
    }
    setLoading(false)
  }

  const { ref, inView } = useInView({ threshold: 0.1 })

  return (
    <FeaturePreviewCard
      title="Summon"
      description="Describe your security problem – ClawGuru finds matching runbooks instantly."
      link={`${prefix}/features/summon`}
    >
      <div ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.summon_placeholder || "I discovered a critical SSH vulnerability – what now?"}
              className="w-full p-3 rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {examples.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-500/10 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all"
          >
            {loading ? "Searching..." : "Search Runbooks"}
          </button>

          {results.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {results.map((rb) => (
                <div key={rb.slug} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-lg font-medium text-white">{rb.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{rb.summary}</p>
                    </div>
                    <a href={`${prefix}/runbook/${rb.slug}`} className="text-cyan-400 hover:text-cyan-300 shrink-0">
                      →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FeaturePreviewCard>
  )
}