"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

export default function NeuroHero({ prefix = "", locale: locProp }: { prefix?: string; locale?: string }) {
  const pathname = usePathname()
  const locale = useMemo(() => locProp || pathname?.split("/").filter(Boolean)[0] || "de", [locProp, pathname])
  const isDe = String(locale).startsWith("de")
  const [selectedCount, setSelectedCount] = useState(0)
  const [foundCount, setFoundCount] = useState<number | null>(null)

  useEffect(() => {
    function onSel(e: Event) {
      const ce = e as CustomEvent
      const n = Number(ce.detail?.selected)
      if (!isNaN(n)) setSelectedCount(n)
    }
    function onFound(e: Event) {
      const ce = e as CustomEvent
      const n = Number(ce.detail?.found)
      if (!isNaN(n)) setFoundCount(n)
    }
    window.addEventListener("neuro:selected", onSel as any)
    window.addEventListener("neuro:found", onFound as any)
    return () => {
      window.removeEventListener("neuro:selected", onSel as any)
      window.removeEventListener("neuro:found", onFound as any)
    }
  }, [])

  return (
    <section className="relative py-14 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
          {isDe ? "Neuro – Dein persönlicher Runbook‑Guide" : "Neuro – Your personal runbook guide"}
        </h1>
        <p className="mt-4 text-gray-300 text-base sm:text-lg">
          {isDe
            ? "Gib deinen Technologie‑Stack an – ClawGuru findet die wichtigsten Runbooks, priorisiert nach Relevanz und gibt dir einen klaren Plan."
            : "Provide your tech stack – ClawGuru finds the most relevant runbooks, prioritized with a clear execution plan."}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            {isDe ? "Tags ausgewählt" : "Tags selected"}: {selectedCount}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            {isDe ? "Empfehlungen (live)" : "Recommendations (live)"}: {foundCount == null ? "—" : foundCount}
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
