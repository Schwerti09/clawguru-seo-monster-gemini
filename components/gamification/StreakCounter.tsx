"use client"

import { useState } from "react"
import { Flame, Calendar, Lock } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface StreakCounterProps {
  currentStreak?: number
  longestStreak?: number
  lastRoastDate?: string
  locale?: string
}

const mockStreak = {
  currentStreak: 5,
  longestStreak: 12,
  lastRoastDate: new Date().toISOString(),
}

export function StreakCounter({ 
  currentStreak = mockStreak.currentStreak,
  longestStreak = mockStreak.longestStreak,
  lastRoastDate = mockStreak.lastRoastDate,
  locale = "de" 
}: StreakCounterProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const isDE = locale === "de"

  // Calculate if streak is active (roasted in last 24 hours)
  const lastRoast = new Date(lastRoastDate)
  const now = new Date()
  const hoursSinceRoast = Math.floor((now.getTime() - lastRoast.getTime()) / (1000 * 60 * 60))
  const streakActive = hoursSinceRoast < 24

  // Generate calendar for current month
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = new Date(now.getFullYear(), now.getMonth(), day).toISOString().split("T")[0]
    const lastRoastDateStr = lastRoastDate.split("T")[0]
    const isToday = day === now.getDate()
    
    return {
      day,
      isRoasted: dateStr <= lastRoastDateStr && streakActive,
      isToday,
    }
  })

  const content = {
    de: {
      title: "Streak",
      subtitle: `${currentStreak} Tage am Stück`,
      longest: `Rekord: ${longestStreak} Tage`,
      active: "🔥 Aktiv",
      inactive: "⏰ Inaktiv",
      hoursLeft: `${24 - hoursSinceRoast}h übrig`,
      viewCalendar: "Kalender",
    },
    en: {
      title: "Streak",
      subtitle: `${currentStreak} days in a row`,
      longest: `Record: ${longestStreak} days`,
      active: "🔥 Active",
      inactive: "⏰ Inactive",
      hoursLeft: `${24 - hoursSinceRoast}h left`,
      viewCalendar: "Calendar",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
              streakActive ? "bg-gradient-to-br from-amber-500 to-red-500" : "bg-gray-700"
            }`}>
              <Flame className={`w-8 h-8 ${streakActive ? "text-white" : "text-zinc-500"}`} />
            </div>
            {currentStreak >= 7 && streakActive && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs">
                ⭐
              </div>
            )}
          </div>
          <div>
            <div className={`text-3xl font-bold ${streakActive ? "text-amber-400" : "text-zinc-500"}`}>
              {currentStreak}
            </div>
            <div className="text-sm text-zinc-500">{t.subtitle}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm ${streakActive ? "text-amber-400" : "text-zinc-500"}`}>
            {streakActive ? t.active : t.inactive}
          </div>
          {streakActive && (
            <div className="text-xs text-zinc-500">{t.hoursLeft}</div>
          )}
        </div>
      </div>

      {/* Longest Streak */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-zinc-500">{t.longest}</span>
        <span className="text-zinc-400">{longestStreak} Tage</span>
      </div>

      {/* Calendar Toggle */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        {t.viewCalendar}
      </button>

      {/* Calendar */}
      {showCalendar && (
        <div className="mt-4 grid grid-cols-7 gap-1">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
            <div key={day} className="text-center text-xs text-zinc-500 py-1">
              {day}
            </div>
          ))}
          {calendarDays.map((day) => (
            <div
              key={day.day}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                day.isRoasted
                  ? "bg-gradient-to-br from-amber-500 to-red-500 text-white"
                  : day.isToday
                    ? "border border-cyan-500 text-cyan-400"
                    : "bg-gray-700/50 text-zinc-500"
              }`}
            >
              {day.isRoasted ? <Flame className="w-4 h-4" /> : day.day}
            </div>
          ))}
        </div>
      )}

      {/* Milestones */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[3, 7, 14, 30].map((milestone) => (
          <div
            key={milestone}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentStreak >= milestone
                ? "bg-amber-900/50 text-amber-400 border border-amber-700/50"
                : "bg-gray-700/50 text-zinc-500 border border-gray-600"
            }`}
          >
            {currentStreak >= milestone ? "🔥" : <Lock className="w-3 h-3 inline" />} {milestone} {pick(isDE, "Tage", "days")}
          </div>
        ))}
      </div>
    </div>
  )
}
