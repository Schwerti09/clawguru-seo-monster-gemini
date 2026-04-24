"use client"

import { useState } from "react"
import { Users, Gift, Copy, Check, Share2 } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface ReferralSystemProps {
  userId?: string
  referralCode?: string
  referralCount?: number
  rewards?: {
    points: number
    freeRoasts: number
    premiumDays: number
  }
  locale?: string
}

const mockReferral = {
  referralCode: "ROAST2026",
  referralCount: 7,
  rewards: {
    points: 350,
    freeRoasts: 3,
    premiumDays: 0,
  },
}

export function ReferralSystem({ 
  userId, 
  referralCode = mockReferral.referralCode, 
  referralCount = mockReferral.referralCount, 
  rewards = mockReferral.rewards,
  locale = "de" 
}: ReferralSystemProps) {
  const [copied, setCopied] = useState(false)

  const referralUrl = `https://clawguru.org/roast-my-moltbot?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: locale === "de" ? "Roast My Moltbot" : "Roast My Moltbot",
        text: locale === "de" 
          ? `Roaste deinen Stack mit meinem Link: ${referralUrl}`
          : `Roast your stack with my link: ${referralUrl}`,
        url: referralUrl,
      })
    } else {
      handleCopy()
    }
  }

  const isDE = locale === "de"

  return (
    <div className="w-full bg-gradient-to-br from-purple-900/30 to-gray-800 rounded-xl border border-purple-700/50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-100">
            {pick(isDE, "Lade Freunde ein", "Invite Friends")}
          </h3>
          <p className="text-xs text-zinc-500">
            {isDE ? `${referralCount} eingeladen` : `${referralCount} invited`}
          </p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="mb-4">
        <label className="text-sm text-zinc-400 block mb-2">
          {pick(isDE, "Dein einzigartiger Link", "Your unique link")}
        </label>
        <div className="relative">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-10 py-2 text-sm text-gray-300"
          />
          <button
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Rewards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">{rewards.points}</div>
          <div className="text-xs text-zinc-500">{pick(isDE, "Punkte", "Points")}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-cyan-400">{rewards.freeRoasts}</div>
          <div className="text-xs text-zinc-500">{pick(isDE, "Gratis Roasts", "Free Roasts")}</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{rewards.premiumDays}</div>
          <div className="text-xs text-zinc-500">{pick(isDE, "Premium Tage", "Premium Days")}</div>
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold text-white transition-colors"
      >
        <Share2 className="w-5 h-5" />
        {pick(isDE, "Jetzt teilen", "Share Now")}
      </button>

      {/* Info */}
      <p className="text-xs text-zinc-500 mt-3 text-center">
        {pick(isDE, "Für jeden eingeladenen Freund bekommst du 50 Punkte + 1 Gratis Roast.", "Get 50 points + 1 free roast for each friend you invite.")}
      </p>
    </div>
  )
}
