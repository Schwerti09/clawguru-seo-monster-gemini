"use client"

import { useEffect, useMemo, useState } from "react"

type Incident = {
  id: string
  title: string
  severity: "low" | "medium" | "high"
  category: "exposure" | "websocket" | "secrets" | "supply-chain" | "ops"
  when: string
  summary: string
  actions: string[]
}

export default function LivePreview({ dict = {} }: { dict?: Record<string, string> }) {
  const [items, setItems] = useState<Incident[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    fetch("/api/incidents")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return
        const arr: Incident[] = Array.isArray(d?.items) ? d.items : []
        setItems(arr.slice(0, 3))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const checksToday = useMemo(() => {
    if (typeof window === "undefined") return 0
    try {
      const n = parseInt(localStorage.getItem("cg_check_count") ?? "0", 10)
      return isNaN(n) ? 0 : n
    } catch {
      return 0
    }
  }, [items])

  return (
    <div className="flex flex-col gap-4">
      <div className="relative p-5 rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/60 to-black overflow-hidden">
        <div className="absolute -inset-1 opacity-40 blur-2xl" style={{ background: "radial-gradient(600px 200px at 30% 20%, rgba(0,255,164,0.06), transparent 60%)" }} />
        <div className="relative z-10">
          <div className="text-sm font-mono tracking-widest text-cyan-300">{dict.live_preview_kicker || "LIVE"}</div>
          <div className="text-2xl font-black mt-1">{dict.live_preview_title || "Intel Preview"}</div>
          <div className="mt-3 space-y-3">
            {loading && (
              <div className="space-y-2">
                <div className="h-4 rounded bg-white/5 animate-pulse" />
                <div className="h-4 rounded bg-white/5 animate-pulse" />
                <div className="h-4 rounded bg-white/5 animate-pulse" />
              </div>
            )}
            {!loading && (items?.length ?? 0) === 0 && (
              <div className="text-gray-400 text-sm">{dict.live_preview_empty || "No incidents found."}</div>
            )}
            {!loading && items && items.map((i) => (
              <div key={i.id} className="p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold line-clamp-1">{i.title}</div>
                  <span className={"text-xs px-2 py-0.5 rounded-full border "+(i.severity === "high" ? "border-red-400/40 text-red-300" : i.severity === "medium" ? "border-orange-400/40 text-orange-300" : "border-emerald-400/40 text-emerald-300")}>{i.severity.toUpperCase()}</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">{i.when} · {i.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 to-gray-900/50">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-black text-white">{(checksToday || 0).toLocaleString()}</div>
            <div className="text-[11px] text-gray-400">{dict.live_stats_checks || "Checks today"}</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">3</div>
            <div className="text-[11px] text-gray-400">{dict.live_stats_critical || "critical CVEs"}</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">30s</div>
            <div className="text-[11px] text-gray-400">{dict.live_stats_duration || "avg. duration"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
