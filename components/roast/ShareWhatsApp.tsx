"use client"

import { MessageCircle } from "lucide-react"
import { pick } from "@/lib/i18n-pick"

interface ShareWhatsAppProps {
  score?: number
  stackName?: string
  locale?: string
}

export function ShareWhatsApp({ score = 45, stackName = "My Stack", locale = "de" }: ShareWhatsAppProps) {
  const handleShare = () => {
    const isDE = locale === "de"
    const isGood = score >= 80
    const isBad = score < 50

    const text = isDE 
      ? `🔥 Ich habe meinen Stack geröstet: ${stackName}\n\nScore: ${score}/100\n\n${isGood ? "Exzellent! Mein Stack ist sicher." : isBad ? "Kritisch! Mein Stack braucht sofortige Hilfe." : "Durchschnitt. Verbesserungen nötig."}\n\nRoaste deinen Stack: https://clawguru.org/roast-my-moltbot`
      : `🔥 I roasted my stack: ${stackName}\n\nScore: ${score}/100\n\n${isGood ? "Excellent! My stack is secure." : isBad ? "Critical! My stack needs immediate help." : "Average. Improvements needed."}\n\nRoast your stack: https://clawguru.org/roast-my-moltbot`

    const encodedText = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    
    window.open(whatsappUrl, "_blank")
  }

  const isDE = locale === "de"

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-900/50 hover:bg-green-900/70 border border-green-700/50 rounded-lg transition-colors"
    >
      <MessageCircle className="w-5 h-5 text-green-400" />
      <span className="font-medium text-gray-100">{pick(isDE, "WhatsApp", "WhatsApp")}</span>
    </button>
  )
}
