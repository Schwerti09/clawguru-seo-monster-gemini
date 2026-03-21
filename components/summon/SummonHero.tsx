"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

export default function SummonHero({ prefix = "", locale: locProp }: { prefix?: string; locale?: string }) {
  const pathname = usePathname()
  const locale = useMemo(() => locProp || pathname?.split("/").filter(Boolean)[0] || "de", [locProp, pathname])
  const isDe = String(locale).startsWith("de")
  const [rbCount, setRbCount] = useState<number | null>(null)
  const [avgConf, setAvgConf] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/stats/runbooks").then(r => r.json()).then(d => setRbCount(d?.count || 0)).catch(() => setRbCount(null))
    function onConf(e: Event) {
      const ce = e as CustomEvent
      const c = Number(ce.detail?.confidence)
      if (!isNaN(c)) setAvgConf(prev => prev == null ? c : Math.round((prev * 0.7 + c * 0.3)))
    }
    window.addEventListener("summon:confidence", onConf as any)
    return () => window.removeEventListener("summon:confidence", onConf as any)
  }, [])

  return (
    <section className="relative py-14 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
          {isDe ? "Summon – Wissen, das sofort wirkt" : "Summon – Instant operational knowledge"}
        </h1>
        <p className="mt-4 text-gray-300 text-base sm:text-lg">
          {isDe
            ? "Stell eine Frage zu deinem Sicherheits‑ oder Betriebsproblem, und ClawGuru liefert passende Runbooks – inkl. Confidence."
            : "Ask about your ops/security issue and ClawGuru returns matching runbooks – incl. confidence."}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            {isDe ? "Runbooks im Index" : "Runbooks in index"}: {rbCount ?? "—"}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            {isDe ? "Ø‑Confidence (live)" : "Avg. confidence (live)"}: {avgConf == null ? "—" : `${avgConf}%`}
          </span>
        </div>
        <div className="mt-6">
          <a href="/api/stripe/checkout?plan=daypass" className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
            {isDe ? "Jetzt Daypass kaufen" : "Buy Daypass"}
          </a>
        </div>
      </div>
    </section>
  )
}
