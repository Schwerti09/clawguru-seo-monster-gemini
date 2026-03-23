"use client"

import type { SummonResult } from "@/components/summon/SummonButton"
import { useMemo } from "react"
import { usePathname } from "next/navigation"

export default function SummonHistory({ items, permanent }: { items: SummonResult[]; permanent: boolean }) {
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  if (!items?.length) return (
    <div className="mt-8 text-sm text-gray-400">Noch keine Swarms gestartet.</div>
  )
  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-black/30 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold text-white">Swarm-History</div>
        <div className="text-xs text-gray-500">{permanent ? "dauerhaft gespeichert" : "temporär (Daypass)"}</div>
      </div>
      <div className="grid gap-2">
        {items.map((r) => (
          <a key={r.id} href={`${prefix}/runbook/${r.runbookSlug}`} className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-400">{new Date(r.finishedAt).toLocaleString()}</span>
              <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded-full border border-red-900/40 text-red-300">{r.type}</span>
              <span className="text-sm text-gray-200">{r.prediction.slice(0, 80)}…</span>
            </div>
            <span className="text-xs text-gray-400">{(r.etaMs/1000).toFixed(1)}s</span>
          </a>
        ))}
      </div>
    </div>
  )
}
