"use client"

import { useState } from "react"
import { Flame, Skull, Trophy, Zap, Heart } from "lucide-react"

interface Reaction {
  emoji: string
  icon: React.ReactNode
  label: string
  count: number
  color: string
}

interface ReactionBarProps {
  roastId?: string
  locale?: string
}

export function ReactionBar({ roastId, locale = "de" }: ReactionBarProps) {
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set())
  const [reactions, setReactions] = useState<Reaction[]>([
    { emoji: "🔥", icon: <Flame className="w-4 h-4" />, label: "Brutal", count: 247, color: "text-red-400" },
    { emoji: "💀", icon: <Skull className="w-4 h-4" />, label: "RIP", count: 89, color: "text-gray-400" },
    { emoji: "🏆", icon: <Trophy className="w-4 h-4" />, label: "Respect", count: 156, color: "text-amber-400" },
    { emoji: "⚡", icon: <Zap className="w-4 h-4" />, label: "Fix it", count: 203, color: "text-cyan-400" },
    { emoji: "❤️", icon: <Heart className="w-4 h-4" />, label: "Feel you", count: 134, color: "text-pink-400" },
  ])

  const handleReaction = (emoji: string) => {
    if (userReactions.has(emoji)) {
      // Already reacted - remove
      setUserReactions(prev => {
        const next = new Set(prev)
        next.delete(emoji)
        return next
      })
      setReactions(prev => prev.map(r => 
        r.emoji === emoji ? { ...r, count: r.count - 1 } : r
      ))
    } else {
      // Add reaction
      setUserReactions(prev => new Set(prev).add(emoji))
      setReactions(prev => prev.map(r => 
        r.emoji === emoji ? { ...r, count: r.count + 1 } : r
      ))
    }
    // TODO: POST /api/roast/reaction { roastId, emoji }
  }

  return (
    <div className="w-full">
      <p className="text-sm text-zinc-400 text-center mb-3">
        {locale === "de" ? "Wie fandest du diesen Roast?" : "How did you like this roast?"}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {reactions.map((reaction) => {
          const isActive = userReactions.has(reaction.emoji)
          return (
            <button
              key={reaction.emoji}
              onClick={() => handleReaction(reaction.emoji)}
              className={`
                inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                ${isActive 
                  ? `bg-gray-700 border-gray-500 ${reaction.color}` 
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 text-zinc-400"
                }
              `}
            >
              <span className={isActive ? reaction.color : "text-zinc-400"}>
                {reaction.icon}
              </span>
              <span className="text-sm font-medium">{reaction.emoji}</span>
              <span className={`text-sm ${isActive ? "text-white" : "text-zinc-500"}`}>
                {reaction.count.toLocaleString()}
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-zinc-500 text-center mt-2">
        {locale === "de" 
          ? `${reactions.reduce((sum, r) => sum + r.count, 0).toLocaleString()} Reaktionen total`
          : `${reactions.reduce((sum, r) => sum + r.count, 0).toLocaleString()} reactions total`
        }
      </p>
    </div>
  )
}
