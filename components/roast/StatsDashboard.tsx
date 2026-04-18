"use client"

import { TrendingUp, BarChart3, Target, Clock, Shield, AlertTriangle } from "lucide-react"

interface StatsDashboardProps {
  stats?: {
    totalRoasts: number
    avgScore: number
    bestScore: number
    totalImprovement: number
    fixesApplied: number
    timeSaved: string
    vulnerabilitiesFound: number
    vulnerabilitiesFixed: number
  }
  locale?: string
}

const mockStats = {
  totalRoasts: 23,
  avgScore: 67,
  bestScore: 89,
  totalImprovement: 156,
  fixesApplied: 47,
  timeSaved: "12.5h",
  vulnerabilitiesFound: 89,
  vulnerabilitiesFixed: 76,
}

export function StatsDashboard({ stats = mockStats, locale = "de" }: StatsDashboardProps) {
  const content = {
    de: {
      title: "Deine Roast-Statistiken",
      totalRoasts: "Total Roasts",
      avgScore: "Ø Score",
      bestScore: "Bester Score",
      improvement: "Verbesserung",
      fixes: "Fixes applied",
      timeSaved: "Zeit gespart",
      vulnsFound: "Vulns gefunden",
      vulnsFixed: "Vulns gefixt",
      fixRate: "Fix-Rate",
    },
    en: {
      title: "Your Roast Stats",
      totalRoasts: "Total Roasts",
      avgScore: "Avg Score",
      bestScore: "Best Score",
      improvement: "Improvement",
      fixes: "Fixes applied",
      timeSaved: "Time saved",
      vulnsFound: "Vulns found",
      vulnsFixed: "Vulns fixed",
      fixRate: "Fix rate",
    },
  }

  const t = content[locale as keyof typeof content] || content.de
  const fixRate = Math.round((stats.vulnerabilitiesFixed / stats.vulnerabilitiesFound) * 100)

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-cyan-900/50 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="font-semibold text-gray-100">{t.title}</h3>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-cyan-400">{stats.totalRoasts}</div>
          <div className="text-xs text-zinc-500">{t.totalRoasts}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{stats.avgScore}</div>
          <div className="text-xs text-zinc-500">{t.avgScore}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.bestScore}</div>
          <div className="text-xs text-zinc-500">{t.bestScore}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">+{stats.totalImprovement}</div>
          <div className="text-xs text-zinc-500">{t.improvement}</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 bg-gray-900/30 rounded-lg p-3">
          <div className="w-8 h-8 bg-green-900/50 rounded flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-100">{stats.fixesApplied}</div>
            <div className="text-xs text-zinc-500">{t.fixes}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-900/30 rounded-lg p-3">
          <div className="w-8 h-8 bg-cyan-900/50 rounded flex items-center justify-center">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-100">{stats.timeSaved}</div>
            <div className="text-xs text-zinc-500">{t.timeSaved}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-900/30 rounded-lg p-3">
          <div className="w-8 h-8 bg-amber-900/50 rounded flex items-center justify-center">
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="font-semibold text-gray-100">{fixRate}%</div>
            <div className="text-xs text-zinc-500">{t.fixRate}</div>
          </div>
        </div>
      </div>

      {/* Vulnerabilities Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-zinc-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {t.vulnsFound}: {stats.vulnerabilitiesFound}
          </span>
          <span className="text-green-400">
            {t.vulnsFixed}: {stats.vulnerabilitiesFixed}
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
            style={{ width: `${fixRate}%` }}
          ></div>
        </div>
      </div>

      {/* Monthly Trend (Mock) */}
      <div className="mt-6">
        <div className="text-sm text-zinc-500 mb-3">{locale === "de" ? "Score-Trend (letzte 6 Monate)" : "Score trend (last 6 months)"}</div>
        <div className="flex items-end gap-2 h-24">
          {[34, 42, 51, 58, 64, 67].map((score, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-cyan-900/50 rounded-t transition-all hover:bg-cyan-800/50"
                style={{ height: `${(score / 100) * 100}%` }}
              ></div>
              <span className="text-xs text-zinc-600">{["O", "N", "D", "J", "F", "M"][idx]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
