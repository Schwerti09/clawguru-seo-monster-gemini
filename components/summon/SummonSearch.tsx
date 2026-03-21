"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Skeleton from "@/components/ui/Skeleton"
import { usePathname } from "next/navigation"

function useLocalePrefix() {
  const pathname = usePathname()
  return useMemo(() => {
    if (!pathname) return ""
    const seg = pathname.split("/").filter(Boolean)[0]
    if (!seg) return ""
    if (seg.length <= 5) return `/${seg}`
    return ""
  }, [pathname])
}

export default function SummonSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const prefix = useLocalePrefix()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  useEffect(() => {
    if (!query) {
      setResult(null)
      return
    }
    const t = setTimeout(() => {
      setLoading(true)
      setError(null)
      fetch(`/api/summon?q=${encodeURIComponent(query)}`)
        .then((r) => r.ok ? r.json() : Promise.reject(new Error(`${r.status}`)))
        .then((data) => setResult(data))
        .catch((e) => setError("Fehler beim Laden."))
        .finally(() => setLoading(false))
    }, 450)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z.B. ssh hardening"
          className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {error && !loading && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-cyan-400">Zusammenfassung</h3>
            <p className="mt-2 text-gray-200">{result.problem}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>Confidence</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.affected_services?.map((service: string) => (
                <span key={service} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Passende Runbooks</h3>
            <div className="space-y-3">
              {result.relevant_runbooks?.slice(0,5).map((rb: any) => (
                <div key={rb.slug} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-lg font-medium text-white">{rb.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{rb.summary}</p>
                    </div>
                    <Link href={`${prefix}/runbook/${rb.slug}`} className="text-cyan-400 hover:text-cyan-300 shrink-0">
                      Ansehen →
                    </Link>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Score</span>
                      <span>{rb.clawScore}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                      <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${rb.clawScore}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result.confidence > 80 && (
            <div className="bg-gradient-to-r from-cyan-500/20 to-transparent rounded-xl p-4 border border-cyan-500/30">
              <p className="text-cyan-300">
                🚀 Dieses Problem kann mit einem Daypass automatisch behoben werden – inklusive Ausführung und Nachweis!
              </p>
              <Link href={`${prefix}/pricing`} className="inline-block mt-2 text-white bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-full text-sm">
                Daypass sichern
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
