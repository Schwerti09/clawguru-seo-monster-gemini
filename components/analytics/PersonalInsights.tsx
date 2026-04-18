"use client"

import { BarChart3, TrendingUp, Shield, AlertTriangle, CheckCircle } from "lucide-react"

interface PersonalInsightsProps {
  userId?: string
  locale?: string
}

const mockInsights = {
  totalRoasts: 23,
  averageScore: 67,
  improvementRate: 12, // percentage
  topVulnerabilities: [
    { type: "API Keys in Logs", count: 8, trend: "down" },
    { type: "Missing RBAC", count: 6, trend: "down" },
    { type: "Outdated Dependencies", count: 5, trend: "up" },
  ],
  scoreHistory: [45, 52, 58, 61, 67],
  fixRate: 78, // percentage
}

export function PersonalInsights({ userId, locale = "de" }: PersonalInsightsProps) {
  const isDE = locale === "de"

  const content = {
    de: {
      title: "Roast Insights",
      subtitle: "Deine persönlichen Statistiken",
      totalRoasts: "Gesamte Roasts",
      avgScore: "Durchschnittsscore",
      improvement: "Verbesserungsrate",
      fixRate: "Fix-Rate",
      topVulns: "Top Vulnerabilities",
      scoreHistory: "Score-Verlauf",
    },
    en: {
      title: "Roast Insights",
      subtitle: "Your personal statistics",
      totalRoasts: "Total roasts",
      avgScore: "Average score",
      improvement: "Improvement rate",
      fixRate: "Fix rate",
      topVulns: "Top vulnerabilities",
      scoreHistory: "Score history",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-cyan-400" />
        <div>
          <h3 className="font-semibold text-gray-100">{t.title}</h3>
          <p className="text-xs text-zinc-500">{t.subtitle}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-zinc-500 mb-1">{t.totalRoasts}</div>
          <div className="text-2xl font-bold text-gray-100">{mockInsights.totalRoasts}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-zinc-500 mb-1">{t.avgScore}</div>
          <div className="text-2xl font-bold text-gray-100">{mockInsights.averageScore}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-zinc-500 mb-1">{t.improvement}</div>
          <div className="text-2xl font-bold text-green-400">+{mockInsights.improvementRate}%</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="text-sm text-zinc-500 mb-1">{t.fixRate}</div>
          <div className="text-2xl font-bold text-cyan-400">{mockInsights.fixRate}%</div>
        </div>
      </div>

      {/* Top Vulnerabilities */}
      <div className="mb-6">
        <h4 className="text-sm text-zinc-500 mb-3">{t.topVulns}</h4>
        <div className="space-y-2">
          {mockInsights.topVulnerabilities.map((vuln, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                {vuln.trend === "down" ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span className="text-sm text-gray-300">{vuln.type}</span>
              </div>
              <span className="text-sm text-zinc-500">{vuln.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score History */}
      <div>
        <h4 className="text-sm text-zinc-500 mb-3">{t.scoreHistory}</h4>
        <div className="flex items-end gap-2 h-24">
          {mockInsights.scoreHistory.map((score, index) => (
            <div
              key={index}
              className="flex-1 bg-cyan-900/50 rounded-t flex flex-col justify-end"
              style={{ height: `${(score / 100) * 100}%` }}
            >
              <div className="text-center text-xs text-cyan-400 pb-1">{score}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-2">
          <span>1st</span>
          <span>5th</span>
        </div>
      </div>
    </div>
  )
}
