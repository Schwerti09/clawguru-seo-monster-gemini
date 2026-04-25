"use client"

import { useEffect, useState } from "react"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"
import { RUNBOOK_COUNT_LONG_DE, RUNBOOK_COUNT_SHORT_EN } from "@/lib/stats"

export default function SummonHero({ prefix = "", dict }: { prefix?: string; dict?: any }) {
  const [rbCount, setRbCount] = useState<number | null>(null)
  const [avgConf, setAvgConf] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/stats/runbooks").then(r => r.json()).then(d => setRbCount(d?.count || 0)).catch(() => setRbCount(null))
    function onConf(e: Event) {
      const ce = e as CustomEvent
      const c = Number((ce as any).detail?.confidence)
      if (!isNaN(c)) setAvgConf(prev => prev == null ? c : Math.round((prev * 0.7 + c * 0.3)))
    }
    window.addEventListener("summon:confidence", onConf as any)
    return () => window.removeEventListener("summon:confidence", onConf as any)
  }, [])

  return (
    <section className="relative py-14 text-center px-4">
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-900 border border-cyan-700 text-[#00ff9d] text-xs font-bold px-3 py-1 rounded-full mb-4">
          🔥 E-E-A-T · TRUST & EXPERIENCE
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
          Claw Swarm Oracle – Summon
        </h1>
        <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
          ClawGuru ist die KI-gestützte SecOps-Plattform mit über {RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.
        </p>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-cyan-400">{RUNBOOK_COUNT_SHORT_EN}+</div>
            <div className="text-xs text-gray-400 mt-1">Runbooks</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-emerald-400">30s</div>
            <div className="text-xs text-gray-400 mt-1">Problem → Fix</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-fuchsia-400">15+</div>
            <div className="text-xs text-gray-400 mt-1">Jahre Erfahrung</div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-yellow-400">24/7</div>
            <div className="text-xs text-gray-400 mt-1">Incident Response</div>
          </div>
        </div>

        {/* Social Proof Counter */}
        <div className="mt-4 max-w-lg mx-auto mb-6">
          <SocialProofCounter variant="compact" />
        </div>

        <div className="mt-6">
          <a href={`${prefix}/daypass`} className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
            Day Pass holen →
          </a>
        </div>
      </div>
    </section>
  )
}
