"use client"

import { useEffect, useState } from "react"
import { SECURITY_STATS } from "@/lib/constants"
import { formatNumber } from "@/lib/utils"

export default function TrustBadge() {
  const [now, setNow] = useState<string>("")
  useEffect(() => {
    function fmt() {
      try {
        const d = new Date()
        // Deutsche Kurzform: 22.03.2026, 01:13
        const date = d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
        const time = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
        setNow(`${date}, ${time}`)
      } catch {
        setNow("aktuell")
      }
    }
    fmt()
    const id = window.setInterval(fmt, 60_000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="sticky top-0 z-50 border-b border-gray-800 bg-black/50 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-300">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-red animate-pulseSoft" />
          <strong className="text-gray-100">LIVE</strong> Intel Feed
        </span>
        <span className="text-gray-500 hidden sm:inline">•</span>
        <span className="hidden sm:inline">{formatNumber(SECURITY_STATS.exposedInstances)} exponierte Instanzen</span>
        <span className="text-gray-500 hidden sm:inline">•</span>
        <span className="hidden sm:inline">{formatNumber(SECURITY_STATS.checksTotal)} Checks</span>
        <span className="text-gray-500 hidden md:inline">•</span>
        <span className="hidden md:inline">{SECURITY_STATS.bypassRate}% Auth-Bypass Risiko</span>
        <span className="text-gray-500 hidden md:inline">•</span>
        <span className="hidden md:inline text-gray-400">Update: {now || SECURITY_STATS.lastUpdated}</span>
        <span className="hidden sm:inline text-gray-400 ml-auto">Keine Speicherung deiner Eingaben</span>
      </div>
    </div>
  )
}
