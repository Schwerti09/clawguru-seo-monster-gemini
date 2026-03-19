"use client"

import { useMemo, useState } from "react"
import TierGateOverlay from "@/components/summon/TierGateOverlay"

export type SwarmType = "neuro" | "oracle" | "hunter" | "defense"

export type SummonResult = {
  id: string
  type: SwarmType
  etaMs: number
  startedAt: number
  finishedAt: number
  prediction: string
  runbookSlug: string
  oneClickFixUrl?: string
  paths: Array<{ from: string; to: string; risk: number }>
}

export default function SummonButton({
  allowed,
  onResult
}: {
  allowed: boolean
  onResult: (r: SummonResult) => void
}) {
  const [kind, setKind] = useState<SwarmType>("oracle")
  const [busy, setBusy] = useState(false)
  const kinds: { k: SwarmType; label: string }[] = useMemo(() => [
    { k: "neuro", label: "Neuro" },
    { k: "oracle", label: "Oracle" },
    { k: "hunter", label: "Hunter" },
    { k: "defense", label: "Defense" },
  ], [])

  async function summon() {
    if (!allowed || busy) return
    setBusy(true)
    try {
      const res = await fetch("/api/summon/swarm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind })
      })
      const json = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = (json?.error as string) || `HTTP ${res.status}`
        alert(msg)
        return
      }
      onResult(json as SummonResult)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative">
      <TierGateOverlay allowed={allowed} needed="daypass" />
      <div className="flex justify-center gap-2 mb-5">
        {kinds.map(({ k, label }) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={"px-3 py-1.5 rounded-full text-xs font-black border transition " + (kind === k ? "bg-red-600 text-white border-red-400" : "border-red-900 text-red-300 hover:border-red-700")}
          >{label}</button>
        ))}
      </div>
      <button
        onClick={summon}
        disabled={!allowed || busy}
        className="relative w-full max-w-xl mx-auto block px-10 py-8 rounded-[28px] text-2xl font-black tracking-wide text-white shadow-lg select-none"
        style={{
          background: "radial-gradient(120% 120% at 50% 20%, rgba(255,0,102,0.9) 0%, rgba(120,0,30,0.9) 55%, rgba(80,0,20,0.85) 100%)",
          boxShadow: busy ? "0 0 40px rgba(255,0,120,0.45)" : "0 0 30px rgba(255,0,120,0.3)",
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
          filter: busy ? "saturate(1.3)" : undefined
        }}
      >
        <span className="absolute -inset-1 rounded-[30px] blur-xl opacity-40" style={{ background: "radial-gradient(circle, rgba(255,0,120,0.7), rgba(255,0,120,0.05))" }} aria-hidden />
        <span className="relative z-10 flex items-center justify-center gap-3">
          <span className="animate-pulse">🔥</span>
          <span>{busy ? "Summoning…" : "SUMMON THE SWARM"}</span>
          <span className="animate-pulse">🧬</span>
        </span>
      </button>
      <div className="mt-2 text-center text-xs text-red-300">Tausende Sporen fliegen los • Mycelium‑Armee aktiv</div>
    </div>
  )
}
