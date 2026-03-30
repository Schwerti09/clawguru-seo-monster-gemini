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
  const [ready, setReady] = useState(false)
  const [sorted, setSorted] = useState<string[]>([])
  const [visible, setVisible] = useState<string[]>([])
  const [cloudTags, setCloudTags] = useState<string[]>([])
  const [runbookCount, setRunbookCount] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("All Tags")
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])

  useEffect(() => {
    try {
      const isMd = typeof window !== "undefined" ? window.innerWidth >= 768 : false
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
      setShow3D(isMd && !reduce && glOK)
    } catch {
      setShow3D(false)
    }
  }, [reduce])

  useEffect(() => {
    let mounted = true
    let timer: any = null
    ;(async () => {
      try {
        const res = await fetch(`/api/stats/tags?limit=10000`, { cache: "no-store" })
        if (!res.ok) throw new Error(String(res.status))
        const { tags, counts, avgClaw, runbookCount } = await res.json()
        if (mounted) {
          if (Array.isArray(tags) && tags.length > 0) {
            const s = tags.slice().sort((a: string, b: string) => (counts[b] || 0) - (counts[a] || 0) || a.localeCompare(b))
            setTags(tags)
            setCounts(counts || {})
            setAvgClaw(avgClaw || {})
            setSorted(s)
            setVisible(s)
            setCloudTags(s.slice(0, 300))
            setRunbookCount(typeof runbookCount === "number" ? runbookCount : tags.length)
          } else {
            const demo = [
              "security","nginx","aws","kubernetes","docker","cloudflare","ssh","firewall","waf","backup"
            ]
            const demoCounts = Object.fromEntries(demo.map((t, i) => [t, 100 - i * 7])) as Record<string, number>
            const demoAvg = Object.fromEntries(demo.map((t, i) => [t, 70 + (i % 5)])) as Record<string, number>
            const s = demo.slice().sort((a, b) => (demoCounts[b] || 0) - (demoCounts[a] || 0) || a.localeCompare(b))
            setTags(demo)
            setCounts(demoCounts)
            setAvgClaw(demoAvg)
            setSorted(s)
            setVisible(s)
            setCloudTags(s.slice(0, 300))
            setRunbookCount(demo.length)
          }
          setReady(true)
        }
      } catch {
        if (mounted) {
          const demo = [
            "security","nginx","aws","kubernetes","docker","cloudflare","ssh","firewall","waf","backup"
          ]
          const demoCounts = Object.fromEntries(demo.map((t, i) => [t, 100 - i * 7])) as Record<string, number>
          const demoAvg = Object.fromEntries(demo.map((t, i) => [t, 70 + (i % 5)])) as Record<string, number>
          const s = demo.slice().sort((a, b) => (demoCounts[b] || 0) - (demoCounts[a] || 0) || a.localeCompare(b))
          setTags(demo)
          setCounts(demoCounts)
          setAvgClaw(demoAvg)
          setSorted(s)
          setVisible(s)
          setCloudTags(s.slice(0, 300))
          setRunbookCount(demo.length)
          setReady(true)
        }
      }
    })()
    // Safety net: if after 2s noch keine Tags, setze Demo-Tags
    timer = setTimeout(() => {
      if (mounted && !tags) {
        const demo = [
          "security","nginx","aws","kubernetes","docker","cloudflare","ssh","firewall","waf","backup"
        ]
        const demoCounts = Object.fromEntries(demo.map((t, i) => [t, 100 - i * 7])) as Record<string, number>
        const demoAvg = Object.fromEntries(demo.map((t, i) => [t, 70 + (i % 5)])) as Record<string, number>
        const s = demo.slice().sort((a, b) => (demoCounts[b] || 0) - (demoCounts[a] || 0) || a.localeCompare(b))
        setTags(demo)
        setCounts(demoCounts)
        setAvgClaw(demoAvg)
        setSorted(s)
        setVisible(s)
        setCloudTags(s.slice(0, 300))
        setRunbookCount(demo.length)
        setReady(true)
      }
    }, 2000)
    return () => { mounted = false; if (timer) clearTimeout(timer) }
  }, [])

  const tabs = useMemo(() => [
    "All Tags",
    "Most Popular",
    "New 2026",
    "Security",
    "DevOps",
    "Cloud",
  ], [])

  const baseList = useMemo(() => {
    const lower = (s: string) => s.toLowerCase()
    const popular = sorted.slice(0, 200)
    switch (activeTab) {
      case "Most Popular":
        return popular
      case "New 2026": {
        const sel = sorted.filter((t) => {
          const tl = lower(t)
          return tl.includes("2026") || tl.startsWith("year:2026")
        })
        return sel.slice(0, 200)
      }
      case "Security": {
        const keys = ["security","waf","csp","cve","hardening","auth","zero-trust","mfa","mitre"]
        return sorted.filter((t) => {
          const tl = lower(t)
          return keys.some((k) => tl.includes(k))
        }).slice(0, 200)
      }
      case "DevOps": {
        const keys = ["kubernetes","docker","ci","cd","pipeline","helm","devops","terraform"]
        return sorted.filter((t) => {
          const tl = lower(t)
          return keys.some((k) => tl.includes(k))
        }).slice(0, 200)
      }
      case "Cloud": {
        const keys = ["aws","gcp","azure","cloudflare","hetzner","provider:"]
        return sorted.filter((t) => {
          const tl = lower(t)
          return keys.some((k) => tl.includes(k))
        }).slice(0, 200)
      }
      default:
        return sorted
    }
  }, [activeTab, sorted])

  // Update visible tags when query or tab changes; cloudTags remain stable
  useEffect(() => {
    if (!ready) return
    const ql = q.trim().toLowerCase()
    if (!ql) {
      setVisible(baseList)
    } else {
      setVisible(baseList.filter((t) => t.toLowerCase().includes(ql)))
    }
  }, [q, ready, baseList])

  const top10 = useMemo(() => sorted.slice(0, 100), [sorted])

  const lblTop = (dict?.top_label as string) || "Top Tags"
  const lblRunbooks = (dict?.runbooks_label as string) || "Runbooks"
  const lblAvg = (dict?.avg_claw_label as string) || "Ø ClawScore"
  const lblSearch = (dict?.search_placeholder as string) || "Tags durchsuchen…"
  const lblCats = (dict?.categories_label as string) || "Beliebteste Kategorien"

  const topCats = top10.slice(0, 6)

  if (!ready) {
    return (
      <Container>
        <div className="py-16 max-w-6xl mx-auto">
          <SectionTitle
            kicker="Internal Link Clusters"
            title="Tag Index"
            subtitle="Provider · Error · Topic · Config – jede Kombination wird ein Einstiegspunkt."
          />
          <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
            <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04] animate-pulse" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl border border-white/10 bg-black/30 animate-pulse" />
            ))}
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Internal Link Clusters"
          title="Tag Index"
          subtitle="Provider · Error · Topic · Config – jede Kombination wird ein Einstiegspunkt."
        />

      {show3D ? (
        cloudTags && cloudTags.length > 0 ? (
          <ErrorBoundary fallback={
            <div className="relative mx-auto my-10 h-[460px] max-w-5xl rounded-[36px] overflow-hidden">
              <div className="absolute inset-0 rounded-[36px] border border-white/10 bg-white/[0.04]" />
            </div>
          }>
            <TagOrbitCloud3D tags={cloudTags} counts={counts} avgClaw={avgClaw} />
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
        <div className="text-xs text-gray-400">
          {Intl && typeof Intl.NumberFormat !== "undefined" ? new Intl.NumberFormat().format(visible.length) : visible.length} Tags · {Intl && typeof Intl.NumberFormat !== "undefined" ? new Intl.NumberFormat().format(runbookCount) : runbookCount} Runbooks
        </div>
      </div>

      <div className="mt-4 overflow-x-auto scrollbar-none">
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${activeTab === t ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20" : "text-gray-400 hover:text-gray-200"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

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

      {visible.length > 0 && (
        <ErrorBoundary fallback={<div className="mt-6 text-sm text-gray-500">Tags nicht verfügbar.</div>}>
          <TagList tags={visible} counts={counts} />
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
  override componentDidCatch() {}
  override render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children as any
  }
}
