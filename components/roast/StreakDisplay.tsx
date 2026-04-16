"use client"

import { useState } from "react"
import { Flame, Calendar, Trophy, Lock } from "lucide-react"

interface Streak {
  current: number
  longest: number
  totalRoasts: number
  nextMilestone: number
  lastRoastDate: string
  streakDates: string[] // ISO dates
}

interface StreakDisplayProps {
  streak?: Streak
  locale?: string
}

const mockStreak: Streak = {
  current: 5,
  longest: 12,
  totalRoasts: 23,
  nextMilestone: 7,
  lastRoastDate: "2026-04-15",
  streakDates: ["2026-04-15", "2026-04-14", "2026-04-13", "2026-04-12", "2026-04-11"],
}

export function StreakDisplay({ streak = mockStreak, locale = "de" }: StreakDisplayProps) {
  const [showCalendar, setShowCalendar] = useState(false)

  // Generate calendar days for current month
  const daysInMonth = 30
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `2026-04-${day.toString().padStart(2, "0")}`
    return {
      day,
      isRoasted: streak.streakDates.includes(dateStr),
      isToday: day === 16,
    }
  })

  const content = {
    de: {
      title: "🔥 Streak",
      subtitle: `${streak.current} Tage am Stück`,
      longest: `Rekord: ${streak.longest}`,
      nextMilestone: `${streak.nextMilestone}-Tage-Badge`,
      daysLeft: `${streak.nextMilestone - streak.current} Tage übrig`,
      total: `${streak.totalRoasts} Roasts total`,
      viewCalendar: "Kalender ansehen",
      hideCalendar: "Kalender ausblenden",
    },
    en: {
      title: "🔥 Streak",
      subtitle: `${streak.current} days in a row`,
      longest: `Record: ${streak.longest}`,
      nextMilestone: `${streak.nextMilestone}-day badge`,
      daysLeft: `${streak.nextMilestone - streak.current} days left`,
      total: `${streak.totalRoasts} roasts total`,
      viewCalendar: "View calendar",
      hideCalendar: "Hide calendar",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-red-500 rounded-xl flex items-center justify-center">
              <Flame className="w-8 h-8 text-white" />
            </div>
            {streak.current >= 7 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs">
                ⭐
              </div>
            )}
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400">{streak.current}</div>
            <div className="text-sm text-zinc-500">{t.subtitle}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-zinc-400">{t.longest}</div>
          <div className="text-xs text-zinc-500">{t.total}</div>
        </div>
      </div>

      {/* Progress to next milestone */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-amber-400">{t.nextMilestone}</span>
          <span className="text-zinc-500">{t.daysLeft}</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all"
            style={{ width: `${(streak.current / streak.nextMilestone) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Calendar Toggle */}
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <Calendar className="w-4 h-4" />
        {showCalendar ? t.hideCalendar : t.viewCalendar}
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

      {/* Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[3, 7, 14, 30].map((milestone) => (
          <div
            key={milestone}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              streak.current >= milestone
                ? "bg-amber-900/50 text-amber-400 border border-amber-700/50"
                : "bg-gray-700/50 text-zinc-500 border border-gray-600"
            }`}
          >
            {streak.current >= milestone ? "🔥" : <Lock className="w-3 h-3 inline" />} {milestone} {locale === "de" ? "Tage" : "days"}
          </div>
        ))}
      </div>
    </div>
  )
}
