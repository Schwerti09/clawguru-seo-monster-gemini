"use client"

import dynamic from "next/dynamic"

const MyceliumClientLoader = dynamic(() => import("@/components/visual/MyceliumClientLoader"), { ssr: false })

type OracleResult = { id: string; title: string }

type TeaserData = {
  risks: number
  top: OracleResult | null
  results: OracleResult[]
  runbook: { slug: string; title: string; summary: string } | null
  runbook2?: { slug: string; title: string; summary: string } | null
  prediction: string
  threat?: string
  score?: number
}

export default function TeaserResultPanel({ teaser, secondsLeft }: { teaser: TeaserData; secondsLeft: number }) {
  const score = typeof teaser.score === "number" ? teaser.score : 0
  const pct = Math.min(100, Math.max(0, score))
  const ring = `conic-gradient(#0be6a8 ${pct}%, rgba(11,230,168,0.15) ${pct}% 100%)`
  const runbookEntries = [teaser.runbook, teaser.runbook2].filter(Boolean)

  return (
    <div className="relative rounded-3xl border border-cyan-400/20 bg-black/70 p-6 shadow-[0_0_60px_rgba(0,255,209,0.18)]">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-[13px] font-mono uppercase tracking-[0.3em] text-cyan-200">Live Oracle Feed</div>
          <div className="mt-2 text-3xl md:text-4xl font-black text-white">
            Dein Swarm hat {teaser.risks} kritische Risiken entdeckt
          </div>
          <div className="mt-2 text-sm text-emerald-200/80">
            {teaser.prediction}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px,1fr,200px] items-start">
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-400/30 bg-white/5/10 p-4"
               style={{ background: "rgba(0,10,8,0.65)", boxShadow: "inset 0 0 30px rgba(0,255,209,0.18)" }}>
            <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Score</div>
            <div className="relative">
              <div className="w-32 h-32 rounded-full grid place-items-center animate-pulse"
                   style={{ background: ring, boxShadow: "0 0 40px rgba(0,255,209,0.35)" }}>
                <div className="w-24 h-24 rounded-full bg-black/80 border border-cyan-200/30 grid place-items-center">
                  <div>
                    <div className="text-3xl font-black text-white">{score}</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">/100</div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 animate-ping rounded-full border border-emerald-200/20" />
            </div>
            <div className="text-center text-xs text-gray-400">Claw Security Score · Fitness {teaser.top?.title ? "verifiziert" : "generisch"}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur">
            <div className="text-xs font-mono text-gray-400">Teaser‑Runbooks aus echter Library</div>
            <div className="mt-3 space-y-4">
              {runbookEntries.map((rb, idx) => (
                <div key={`${rb!.slug}-${idx}`} className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-sm font-semibold text-white">{rb!.title}</div>
                  <div className="mt-1 text-xs text-gray-400 line-clamp-3">{rb!.summary} …</div>
                </div>
              ))}
              {runbookEntries.length === 0 && (
                <div className="text-sm text-gray-400">Keine Runbooks gefunden – lade echten Oracle-Feed …</div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full border border-red-400/40 text-red-200 bg-red-900/20 uppercase tracking-[0.2em]">
                Threat
              </span>
              <span className="text-red-200 font-semibold">{teaser.threat ?? "CVE-2024-6387 – OpenSSH RegreSSHion"}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-400/30 bg-black/50 overflow-hidden shadow-[0_0_40px_rgba(255,0,102,0.25)]">
            <div className="aspect-[4/5]">
              <MyceliumClientLoader ui="embed" />
            </div>
            <div className="px-4 py-3 text-[11px] font-mono uppercase tracking-[0.25em] text-gray-400 border-t border-white/5">
              3D Threat Map · Red Spores
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            60 Sekunden Vorschau · <span className="font-bold text-white">{secondsLeft}s</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Paywall öffnet gleich – sichere den Run</span>
          </div>
        </div>
      </div>
    </div>
  )
}
