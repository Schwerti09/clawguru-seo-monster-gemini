"use client"

import { useState } from "react"
import { Sparkles, AlertTriangle, TrendingDown, Shield } from "lucide-react"

interface PredictionProps {
  currentScore: number
  stackType?: string
  locale?: string
}

export function RoastPrediction({ currentScore, stackType = "generic", locale = "de" }: PredictionProps) {
  const [showPrediction, setShowPrediction] = useState(false)
  
  const isGood = currentScore >= 80
  const isMedium = currentScore >= 50 && currentScore < 80
  const isBad = currentScore < 50

  // AI prediction logic (mock)
  const prediction = {
    hackChance: isGood ? 5 : isMedium ? 35 : 78,
    timeline: isGood ? "12+ months" : isMedium ? "3-6 months" : "< 30 days",
    topRisk: isGood ? "None critical" : isMedium ? "API Key exposure" : "Multiple critical",
    recommendation: isGood 
      ? (locale === "de" ? "Maintain current posture" : "Maintain current posture")
      : isMedium
        ? (locale === "de" ? "Fix API keys and egress" : "Fix API keys and egress")
        : (locale === "de" ? "Emergency fix recommended" : "Emergency fix recommended"),
  }

  const content = {
    de: {
      title: "🔮 AI Vorhersage",
      subtitle: "Basierend auf deinem Score und 10K+ historischen Roasts",
      button: "Meine Vorhersage anzeigen",
      hackChance: "Hack-Wahrscheinlichkeit",
      timeline: "Geschätztes Zeitfenster",
      topRisk: "Höchstes Risiko",
      recommendation: "Empfohlene Aktion",
      low: "Niedrig",
      medium: "Mittel",
      high: "Kritisch",
    },
    en: {
      title: "🔮 AI Prediction",
      subtitle: "Based on your score and 10K+ historical roasts",
      button: "Show my prediction",
      hackChance: "Hack probability",
      timeline: "Estimated timeframe",
      topRisk: "Top risk",
      recommendation: "Recommended action",
      low: "Low",
      medium: "Medium",
      high: "Critical",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-xl border border-purple-700/50 p-6">
      {!showPrediction ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-purple-300 mb-2">{t.title}</h3>
          <p className="text-sm text-zinc-400 mb-4">{t.subtitle}</p>
          <button
            onClick={() => setShowPrediction(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold text-white transition-colors"
          >
            {t.button}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-bold text-purple-300">{t.title}</h3>
          </div>

          {/* Prediction Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">{t.hackChance}</div>
              <div className={`text-2xl font-bold ${
                prediction.hackChance < 20 ? "text-green-400" :
                prediction.hackChance < 50 ? "text-amber-400" : "text-red-400"
              }`}>
                {prediction.hackChance}%
              </div>
              <div className="text-xs text-zinc-400">
                {prediction.hackChance < 20 ? t.low :
                 prediction.hackChance < 50 ? t.medium : t.high}
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-3">
              <div className="text-xs text-zinc-500 mb-1">{t.timeline}</div>
              <div className="text-lg font-bold text-amber-400">
                {prediction.timeline}
              </div>
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-300">{t.topRisk}</span>
            </div>
            <div className="text-sm text-zinc-300">{prediction.topRisk}</div>
          </div>

          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-300">{t.recommendation}</span>
            </div>
            <div className="text-sm text-zinc-300">{prediction.recommendation}</div>
          </div>

          <button
            onClick={() => setShowPrediction(false)}
            className="w-full py-2 text-sm text-purple-400 hover:text-purple-300"
          >
            ← {locale === "de" ? "Zurück" : "Back"}
          </button>
        </div>
      )}
    </div>
  )
}
