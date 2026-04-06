"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"

type Item = {
  slug: string
  title: string
  summary: string
  tags: string[]
  lastmod?: string
  clawScore?: number
}

type ApiResponse = {
  q: string
  tags: string[]
  page: number
  limit: number
  total: number
  items: Item[]
  warning?: string
}

function useDebounced<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  const ref = useRef<number | undefined>(undefined)
  return useCallback((...args: Parameters<T>) => {
    if (ref.current) window.clearTimeout(ref.current)
    ref.current = window.setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

export default function RunbookNexus() {
  const [q, setQ] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(24)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Keep a ref to the latest search params so the page-change effect never sees stale values
  const latestParams = useRef({ q, tags, limit })
  useEffect(() => {
    latestParams.current = { q, tags, limit }
  })

  const fetchData = useCallback(async (params: { q: string; tags: string[]; page: number; limit: number }) => {
    setLoading(true)
    setError(null)
    try {
      const sp = new URLSearchParams()
      if (params.q.trim()) sp.set("q", params.q.trim())
      if (params.tags.length) sp.set("tags", params.tags.join(","))
      sp.set("page", String(params.page))
      sp.set("limit", String(params.limit))
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 10000)
      const res = await fetch(`/api/runbooks/search?${sp.toString()}`, { next: { revalidate: 0 }, signal: controller.signal })
      window.clearTimeout(timeout)
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Search failed (${res.status}): ${text.slice(0, 160)}`)
      }
      // Some hosting layers may return text/plain for JSON bodies during errors – try JSON, then fallback
      let json: ApiResponse | null = null
      try {
        json = (await res.json()) as ApiResponse
      } catch (e) {
        const text = await res.text().catch(() => "")
        throw new Error(text || 'Unexpected non-JSON response from search API')
      }
      setData(json!)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedSearch = useDebounced((nextQ: string) => {
    setPage(1)
    fetchData({ q: nextQ, tags, page: 1, limit })
  }, 300)

  useEffect(() => {
    const { q: currentQ, tags: currentTags, limit: currentLimit } = latestParams.current
    fetchData({ q: currentQ, tags: currentTags, page, limit: currentLimit })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // simple preset tags until we expose full tag cloud
  const preset = useMemo(() => [
    "aws", "kubernetes", "nginx", "ssh", "docker", "hardening"
  ], [])

  const totalPages = useMemo(() => {
    if (!data) return 1
    return Math.max(1, Math.ceil(data.total / data.limit))
  }, [data])

  // Infer locale from current pathname (e.g., /de/runbooks) to localize detail links
  const localePrefix = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const seg = (window.location.pathname.split('/')[1] || '').trim()
    return /^[a-z]{2}(?:-[A-Z]{2})?$/.test(seg) ? `/${seg}` : ''
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-indigo-950/40 to-slate-900/40">
        <div className="pointer-events-none absolute -inset-1 opacity-40 blur-3xl" style={{ background: "radial-gradient(600px 300px at 10% 10%, rgba(0,255,157,0.08), transparent 60%)" }} />
        <div className="relative z-10">
          <div className="text-xs font-mono tracking-[0.35em] uppercase text-cyan-300">MYCELIAL</div>
          <h2 className="mt-2 text-4xl md:text-5xl font-black font-display tracking-tight">Runbook Nexus</h2>
          <p className="mt-3 text-gray-300 max-w-2xl">Sofortiger Zugriff auf operative Fixes. Suche, filtere und öffne jedes Runbook im Mycelium‑Stil.</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1">
          <input
            aria-label="Search runbooks"
            placeholder="Search runbooks (e.g. nginx, aws ssh)"
            className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            value={q}
            onChange={(e) => { setQ(e.target.value); debouncedSearch(e.target.value) }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {preset.map((t) => {
            const active = tags.includes(t)
            return (
              <button
                key={t}
                onClick={() => {
                  const next = active ? tags.filter((x) => x !== t) : [...tags, t]
                  setTags(next)
                  setPage(1)
                  fetchData({ q, tags: next, page: 1, limit })
                }}
                className={`px-3 py-2 rounded-xl text-sm border transition-all ${active ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200" : "border-white/10 hover:border-white/20 text-gray-300"}`}
              >
                #{t}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      <div>
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] animate-pulse h-40" />
            ))}
          </div>
        )}
        {!loading && data && (
          <>
            <div className="text-sm text-gray-400 mb-3">{data.total.toLocaleString()} Ergebnisse</div>
            {data.items.length === 0 ? (
              <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-gray-400">
                {q || tags.length ? 'Keine Runbooks gefunden.' : 'Noch keine Ergebnisse. Starte eine Suche.'}
                {data.warning ? <div className="mt-2 text-xs text-amber-300">Hinweis: {data.warning}</div> : null}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.items.map((rb) => (
                  <Link key={rb.slug} href={`${localePrefix}/runbook/${rb.slug}`} className="group relative p-5 rounded-2xl border border-cyan-500/20 bg-white/[0.03] hover:bg-white/[0.06] transition-all hover:shadow-[0_0_20px_rgba(0,255,157,0.15)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-lg font-bold leading-snug line-clamp-2 text-white">{rb.title}</div>
                      <div className="mt-1 ml-2 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-300 line-clamp-3">{rb.summary}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(rb.tags || []).slice(0, 4).map((t) => (
                        <span key={t} className="text-[11px] px-2 py-1 rounded-full border border-white/10 text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <span>Score: {Math.round((rb.clawScore || 0))}</span>
                      <span>Updated: {rb.lastmod || "—"}</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-xl border border-white/10 text-gray-300 disabled:opacity-40"
                >
                  Prev
                </button>
                <div className="text-sm text-gray-400">Page {page} / {totalPages}</div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-2 rounded-xl border border-white/10 text-gray-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        {!loading && !data && (
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-gray-400">No results yet.</div>
        )}
        {error && (
          <div className="mt-3 p-4 rounded-2xl border border-red-500/30 text-red-200 bg-red-500/10 text-sm">{error}</div>
        )}
      </div>
    </div>
  )
}
