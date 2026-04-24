"use client"

import { useState } from "react"
import { Users, Crown, Shield, Sword, Plus, Search } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface Clan {
  id: string
  name: string
  members: number
  totalScore: number
  rank: number
  emblem: string
  isPublic: boolean
}

interface ClanSystemProps {
  userClanId?: string
  locale?: string
}

const mockClans: Clan[] = [
  { id: "1", name: "Security First", members: 12, totalScore: 8500, rank: 1, emblem: "🛡️", isPublic: true },
  { id: "2", name: "DevOps Elite", members: 8, totalScore: 7200, rank: 2, emblem: "⚡", isPublic: true },
  { id: "3", name: "Cloud Warriors", members: 15, totalScore: 6800, rank: 3, emblem: "☁️", isPublic: true },
  { id: "4", name: "Zero Trust Squad", members: 6, totalScore: 5400, rank: 4, emblem: "🔒", isPublic: true },
  { id: "5", name: "AI Guardians", members: 10, totalScore: 4900, rank: 5, emblem: "🤖", isPublic: true },
]

export function ClanSystem({ userClanId, locale = "de" }: ClanSystemProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const isDE = locale === "de"

  const userClan = userClanId ? mockClans.find(c => c.id === userClanId) : null
  const filteredClans = mockClans.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const content = {
    de: {
      title: "Clans",
      subtitle: "Teams können gemeinsam rosten",
      yourClan: "Dein Clan",
      noClan: "Du bist keinem Clan beigetreten",
      createClan: "Clan erstellen",
      joinClan: "Beitreten",
      searchPlaceholder: "Clan suchen...",
      members: "Mitglieder",
      score: "Score",
      rank: "Rang",
      emblem: "Wappen",
    },
    en: {
      title: "Clans",
      subtitle: "Teams can roast together",
      yourClan: "Your Clan",
      noClan: "You haven't joined a clan",
      createClan: "Create Clan",
      joinClan: "Join",
      searchPlaceholder: "Search clans...",
      members: "Members",
      score: "Score",
      rank: "Rank",
      emblem: "Emblem",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  return (
    <div className="w-full bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-100">{t.title}</h3>
            <p className="text-xs text-zinc-500">{t.subtitle}</p>
          </div>
        </div>
        {!userClan && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.createClan}
          </button>
        )}
      </div>

      {/* User's Clan */}
      {userClan && (
        <div className="mb-6 bg-gradient-to-r from-purple-900/30 to-gray-800 rounded-lg p-4 border border-purple-700/50">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{userClan.emblem}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-gray-100">{userClan.name}</span>
              </div>
              <div className="flex gap-4 text-sm text-zinc-500">
                <span>#{userClan.rank} {t.rank}</span>
                <span>{userClan.members} {t.members}</span>
                <span>{userClan.totalScore} {t.score}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-zinc-500"
        />
      </div>

      {/* Clan List */}
      <div className="space-y-2">
        {filteredClans.map((clan) => (
          <div
            key={clan.id}
            className="flex items-center gap-4 bg-gray-900/50 rounded-lg p-3 hover:bg-gray-900/70 transition-colors"
          >
            <div className="text-2xl">{clan.emblem}</div>
            <div className="flex-1">
              <div className="font-medium text-gray-100">{clan.name}</div>
              <div className="flex gap-3 text-xs text-zinc-500">
                <span>#{clan.rank} {t.rank}</span>
                <span>{clan.members} {t.members}</span>
                <span>{clan.totalScore} {t.score}</span>
              </div>
            </div>
            {clan.id !== userClan?.id && (
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors">
                {t.joinClan}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4">
            <h4 className="font-semibold text-gray-100 mb-4">{t.createClan}</h4>
            <input
              type="text"
              placeholder="Clan Name"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {pick(isDE, "Abbrechen", "Cancel")}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm text-white transition-colors"
              >
                {pick(isDE, "Erstellen", "Create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
