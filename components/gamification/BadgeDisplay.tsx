"use client"

import { Trophy, Star, Lock, Zap } from "lucide-react"
import { achievements, getAchievementsByRarity, getRarityColor } from "@/lib/achievements"
import { pick } from "@/lib/i18n-pick"

interface BadgeDisplayProps {
  unlockedIds?: string[]
  locale?: string
}

export function BadgeDisplay({ unlockedIds = [], locale = "de" }: BadgeDisplayProps) {
  const isDE = locale === "de"
  const unlockedAchievements = achievements.filter(a => unlockedIds.includes(a.id))
  const lockedAchievements = achievements.filter(a => !unlockedIds.includes(a.id))

  const content = {
    de: {
      title: "Badges",
      unlocked: "Freigeschaltet",
      locked: "Gesperrt",
      total: `${unlockedAchievements.length}/${achievements.length}`,
      points: "Punkte",
    },
    en: {
      title: "Badges",
      unlocked: "Unlocked",
      locked: "Locked",
      total: `${unlockedAchievements.length}/${achievements.length}`,
      points: "Points",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h3 className="font-semibold text-gray-100">{t.title}</h3>
        </div>
        <div className="text-sm text-zinc-500">{t.total}</div>
      </div>

      {/* Unlocked Badges */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-6">
          <div className="text-sm text-zinc-500 mb-3">{t.unlocked}</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unlockedAchievements.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} unlocked locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      <div>
        <div className="text-sm text-zinc-500 mb-3">{t.locked}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {lockedAchievements.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} unlocked={false} locale={locale} />
          ))}
        </div>
      </div>

      {/* Total Points */}
      <div className="mt-6 pt-6 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-zinc-500">{t.points}</div>
        <div className="text-xl font-bold text-amber-400">
          {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}
        </div>
      </div>
    </div>
  )
}

function BadgeCard({ badge, unlocked, locale }: { badge: any; unlocked: boolean; locale: string }) {
  const rarityColor = getRarityColor(badge.rarity)
  const isDE = locale === "de"

  return (
    <div
      className={`
        relative rounded-lg p-4 text-center transition-all
        ${unlocked ? "bg-gray-900/50 border-2" : "bg-gray-900/30 border border-gray-700 opacity-50"}
      `}
      style={unlocked ? { borderColor: rarityColor } : {}}
    >
      {!unlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-zinc-600" />
        </div>
      )}
      <div className="text-3xl mb-2">{badge.icon}</div>
      <div className="text-xs font-medium text-gray-300 mb-1">{badge.name}</div>
      <div className="text-xs text-zinc-500 mb-2">{badge.points} {pick(isDE, "Pkt", "pts")}</div>
      <div
        className={`text-xs px-2 py-1 rounded-full inline-block ${
          unlocked ? "bg-gray-700" : "bg-gray-800"
        }`}
        style={unlocked ? { color: rarityColor } : {}}
      >
        {badge.rarity}
      </div>
    </div>
  )
}
