"use client"

import type { SummonResult } from "@/components/summon/SummonButton"

export default function SwarmResults({ r }: { r: SummonResult }) {
  const fixUrl = r.oneClickFixUrl || `/runbook/${r.runbookSlug}#quickfix`
  return (
    <div className="mt-10 rounded-3xl border border-red-900/40 bg-black/40 p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-widest font-mono text-red-300">Swarm Result · {r.type.toUpperCase()}</div>
        <div className="text-xs text-gray-400">ETA {(r.etaMs/1000).toFixed(1)}s</div>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-red-900/40 bg-gradient-to-b from-red-500/10 to-red-900/10 aspect-[16/10] grid place-items-center text-red-300">
          3D Angriffspfade Animation
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-lg font-black text-white">Vorhersage</div>
          <div className="text-sm text-gray-300 leading-relaxed">{r.prediction}</div>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <a href={`/runbook/${r.runbookSlug}`} className="px-4 py-3 rounded-2xl border border-white/10 text-gray-200 hover:bg-white/5 text-center font-bold">Runbook öffnen</a>
            <a href={fixUrl} className="px-4 py-3 rounded-2xl text-black font-black text-center" style={{ background:"linear-gradient(135deg,#ff0066,#ff9900)", boxShadow:"0 0 20px rgba(255,0,102,0.35)"}}>One‑Click‑Fix</a>
          </div>
        </div>
      </div>
    </div>
  )
}
