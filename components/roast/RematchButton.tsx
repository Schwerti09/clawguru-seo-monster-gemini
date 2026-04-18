"use client"

import { useState } from "react"
import { RefreshCw, TrendingUp, Clock } from "lucide-react"

interface RematchButtonProps {
  previousScore: number
  newScore?: number
  lastRoastDate?: string
  locale?: string
}

export function RematchButton({ 
  previousScore, 
  newScore, 
  lastRoastDate = "2 weeks ago",
  locale = "de" 
}: RematchButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const handleRematch = async () => {
    setLoading(true)
    // Simulate new roast
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setShowResult(true)
  }

  const improvement = newScore ? newScore - previousScore : null
  const hasImproved = improvement && improvement > 0

  const content = {
    de: {
      title: "Roast Me Again",
      subtitle: `Letzter Roast: ${previousScore}/100 • ${lastRoastDate}`,
      button: "Neuer Roast",
      loading: "Roaste...",
      improved: `🎉 +${improvement} Punkte! Dein Stack ist sicherer!`,
      same: `Keine Veränderung. Zeit für Fixes?`,
      worse: `⚠️ -${Math.abs(improvement || 0)} Punkte. Neue Vulnerabilities entdeckt.`,
      cta: "Zum Fix-Guide →",
    },
    en: {
      title: "Roast Me Again",
      subtitle: `Last roast: ${previousScore}/100 • ${lastRoastDate}`,
      button: "New Roast",
      loading: "Roasting...",
      improved: `🎉 +${improvement} points! Your stack is more secure!`,
      same: `No change. Time for fixes?`,
      worse: `⚠️ -${Math.abs(improvement || 0)} points. New vulnerabilities found.`,
      cta: "Go to Fix Guide →",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  if (showResult && improvement !== null) {
    return (
      <div className={`rounded-xl border p-4 ${
        hasImproved 
          ? "bg-green-900/30 border-green-700/50" 
          : improvement === 0
            ? "bg-amber-900/30 border-amber-700/50"
            : "bg-red-900/30 border-red-700/50"
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            hasImproved ? "bg-green-900/50" : improvement === 0 ? "bg-amber-900/50" : "bg-red-900/50"
          }`}>
            {hasImproved ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <RefreshCw className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-100">
              {hasImproved ? t.improved : improvement === 0 ? t.same : t.worse}
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowResult(false)}
          className="text-sm text-cyan-400 hover:underline"
        >
          {t.cta}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleRematch}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-900/50 to-red-900/50 border border-amber-700/50 rounded-xl hover:border-amber-500 transition-all disabled:opacity-50"
    >
      {loading ? (
        <>
          <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="font-semibold text-amber-300">{t.loading}</span>
        </>
      ) : (
        <>
          <Clock className="w-5 h-5 text-amber-400" />
          <div className="text-left">
            <div className="font-semibold text-amber-300">{t.title}</div>
            <div className="text-xs text-amber-200/70">{t.subtitle}</div>
          </div>
        </>
      )}
    </button>
  )
}
