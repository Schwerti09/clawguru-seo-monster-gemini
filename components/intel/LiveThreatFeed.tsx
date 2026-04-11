"use client"

import React, { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
type Source = "NVD" | "EXPLOIT_DB" | "CLAWGURU"
type FeedItem = {
  id: string
  title: string
  severity: Severity
  source: Source
  published: string
  clawScore: number
  runbook?: { slug: string; title: string; clawScore: number }
}

type IntelDict = {
  live_header?: string
  live_loading?: string
  live_error?: string
  scope_all?: string
}

export default function LiveThreatFeed({ prefix = "", dict = {} as IntelDict }: { prefix?: string; dict?: IntelDict }) {
  const reduce = useReducedMotion()
  const [severity, setSeverity] = useState<"" | Severity>("")
  const [source, setSource] = useState<"" | Source>("")
  const [items, setItems] = useState<FeedItem[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const nf = useMemo(() => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-US"), [])

  async function load() {
    setErr(null)
    setItems(null)
    const u = new URL("/api/intel", window.location.origin)
    u.searchParams.set("op", "feed")
    if (severity) u.searchParams.set("severity", severity)
    if (source) u.searchParams.set("source", source)
    try {
      const r = await fetch(u.toString(), { cache: "no-store" })
      if (!r.ok) throw new Error(String(r.status))
      const j = (await r.json()) as { items: FeedItem[] }
      setItems(j.items)
    } catch (e: any) {
      setErr(e?.message || "Load error")
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [severity, source])

  const header = dict.live_header || "Live Threat Feed"
  const loading = dict.live_loading || "Loading…"
  const errorText = dict.live_error || "Feed load error"

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-white">{header}</div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as any)}
            className="text-xs bg-black/60 text-gray-200 border border-white/10 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="">{dict.scope_all || "All"}</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select
            aria-label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            className="text-xs bg-black/60 text-gray-200 border border-white/10 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="">{dict.scope_all || "All"}</option>
            <option value="NVD">NVD</option>
            <option value="EXPLOIT_DB">Exploit-DB</option>
            <option value="CLAWGURU">ClawGuru</option>
          </select>
        </div>
      </div>

      {!items && !err && (
        <div className="mt-3 h-10 rounded-md bg-white/5 animate-pulse grid place-items-center text-[11px] text-gray-300">{loading}</div>
      )}
      {err && <div className="mt-3 text-xs text-red-300">{errorText}: {err}</div>}

      {items && (
        <div className="relative overflow-hidden mt-3">
          <div className={`flex gap-6 whitespace-nowrap ${reduce ? "" : "animate-[ticker_30s_linear_infinite]"}`} style={{ willChange: reduce ? undefined : "transform" }}>
            {[...items, ...items].map((it, idx) => (
              <motion.a
                key={`${it.id}-${idx}`}
                href={it.runbook?.slug ? `${prefix}/runbook/${it.runbook.slug}`.replace(/\/\//g, "/") : `${prefix}/runbooks`.replace(/\/\//g, "/")}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                whileHover={reduce ? undefined : { scale: 1.025, y: -2 }}
              >
                <span className={`text-[10px] px-2 py-[2px] rounded-full border ${
                  it.severity === "CRITICAL" ? "border-red-500/40 text-red-300" :
                  it.severity === "HIGH" ? "border-orange-500/40 text-orange-300" :
                  it.severity === "MEDIUM" ? "border-yellow-500/40 text-yellow-200" : "border-green-500/40 text-green-300"
                }`}>{it.id}</span>
                <span className="text-xs text-gray-200">{it.title}</span>
                <span className="text-[10px] text-cyan-200 ml-1">ClawScore {nf.format(it.clawScore)}</span>
              </motion.a>
            ))}
          </div>
          <style>{`
            @keyframes ticker { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
          `}</style>
        </div>
      )}
    </div>
  )
}
