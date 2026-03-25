"use client"

import React, { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { useReducedMotion } from "framer-motion"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"

const TagList = dynamic(() => import("@/components/tags/TagList"), { ssr: false })
const TagOrbitCloud3D = dynamic(() => import("@/components/tags/TagOrbitCloud3D"), {
  ssr: false,
  loading: () => (
    <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
      <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04] animate-pulse" />
    </div>
  ),
})

export default function TagsClientLoader({ dict }: { dict?: any }) {
  const reduce = useReducedMotion()
  const [tags, setTags] = useState<string[] | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [avgClaw, setAvgClaw] = useState<Record<string, number>>({})
  const [q, setQ] = useState("")
  const pathname = usePathname()
  const [show3D, setShow3D] = useState(false)
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])

  useEffect(() => {
    try {
      const isMd = typeof window !== "undefined" ? window.innerWidth >= 768 : false
      const usp = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
      const allow3d = usp ? usp.get("3d") === "1" : false
      let glOK = false
      if (typeof document !== "undefined") {
        try {
          const c = document.createElement("canvas")
          const ctx = (c.getContext("webgl") || c.getContext("experimental-webgl")) as any
          glOK = !!ctx
        } catch {
          glOK = false
        }
      }
      setShow3D(isMd && !reduce && glOK && allow3d)
    } catch {
      setShow3D(false)
    }
  }, [reduce])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/stats/tags?limit=10000`, { cache: "no-store" })
        if (!res.ok) throw new Error(String(res.status))
        const { tags, counts, avgClaw } = await res.json()
        if (mounted) { setTags(tags); setCounts(counts); setAvgClaw(avgClaw) }
      } catch {
        if (mounted) setTags([
          "security","nginx","aws","kubernetes","docker","cloudflare","ssh","firewall","waf","backup"
        ])
      }
    })()
    return () => { mounted = false }
  }, [])

  // Do not early-return before hooks to preserve hook order across renders

  const sortedByFreq = useMemo(() => {
    return (tags || []).slice().sort((a, b) => {
      const da = counts[a] || 0
      const db = counts[b] || 0
      if (db !== da) return db - da
      return a.localeCompare(b)
    })
  }, [tags, counts])

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase()
    if (!ql) return sortedByFreq
    return sortedByFreq.filter((t) => t.toLowerCase().includes(ql))
  }, [sortedByFreq, q])

  const top10 = useMemo(() => {
    return [...(tags || [])]
      .sort((a, b) => (counts[b] || 0) - (counts[a] || 0))
      .slice(0, 10)
  }, [tags, counts])

  const lblTop = (dict?.top_label as string) || "Top Tags"
  const lblRunbooks = (dict?.runbooks_label as string) || "Runbooks"
  const lblAvg = (dict?.avg_claw_label as string) || "Ø ClawScore"
  const lblSearch = (dict?.search_placeholder as string) || "Tags durchsuchen…"
  const lblCats = (dict?.categories_label as string) || "Beliebteste Kategorien"

  const topCats = top10.slice(0, 6)

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Internal Link Clusters"
          title="Tag Index"
          subtitle="Provider · Error · Topic · Config – jede Kombination wird ein Einstiegspunkt."
        />

      {show3D ? (
        tags && tags.length > 0 ? (
          <ErrorBoundary fallback={
            <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
              <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04]" />
            </div>
          }>
            <TagOrbitCloud3D tags={tags} />
          </ErrorBoundary>
        ) : (
          <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
            <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04] animate-pulse" />
          </div>
        )
      ) : (
        <div className="relative mx-auto my-10 h-[460px] w-full max-w-[1400px] rounded-[36px] overflow-hidden">
          <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04]" />
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={lblSearch}
          className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-200"
        />
      </div>

      {!tags && (
        <div className="text-sm text-gray-500 mt-6">Lade Tags…</div>
      )}

      {top10.length > 0 && (
        <div className="mt-8">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">{lblTop}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {top10.map((t) => (
              <a
                key={t}
                href={`${prefix}/tag/${encodeURIComponent(t)}`}
                className="p-4 rounded-2xl border border-white/10 bg-black/35 hover:bg-white/[0.04] transition-colors shadow-[0_0_0_1px_rgba(34,211,238,0.15)_inset]"
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-bold text-gray-100">{t}</div>
                  <div className="text-xs text-gray-400">{counts[t] || 0} {lblRunbooks}</div>
                </div>
                <div className="mt-1 text-xs text-cyan-300">{lblAvg} {avgClaw[t] ?? 0}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {topCats.length > 0 && (
        <div className="mt-10">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">{lblCats}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topCats.map((t) => (
              <a
                key={`cat-${t}`}
                href={`${prefix}/tag/${encodeURIComponent(t)}`}
                className="p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 hover:from-cyan-500/10 hover:to-emerald-500/10 transition-colors"
              >
                <div className="font-bold text-white">{t}</div>
                <div className="mt-1 text-xs text-gray-400">{counts[t] || 0} {lblRunbooks} · {lblAvg} {avgClaw[t] ?? 0}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {tags && (
        <ErrorBoundary fallback={<div className="mt-6 text-sm text-gray-500">Tags nicht verfügbar.</div>}>
          <TagList tags={filtered} counts={counts} />
        </ErrorBoundary>
      )}

      <div className="mt-10 text-sm text-gray-500">
        Tipp: Tags sind ein Link-Graph. Je mehr Runbooks du fütterst, desto stärker wird die interne Autorität.
      </div>
      </div>
    </Container>
  )
}

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children as any
  }
}
