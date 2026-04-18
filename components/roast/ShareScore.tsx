"use client"

import { useState } from "react"
import { Twitter, Linkedin, Download, Link2, Check } from "lucide-react"

interface ShareScoreProps {
  score: number
  roastSummary: string
  stackName?: string
  locale?: string
}

export function ShareScore({ score, roastSummary, stackName = "My Stack", locale = "de" }: ShareScoreProps) {
  const [copied, setCopied] = useState(false)
  
  const isGood = score >= 80
  const isMedium = score >= 50 && score < 80
  const isBad = score < 50
  
  const scoreEmoji = isGood ? "🛡️" : isMedium ? "⚠️" : "🔥"
  const scoreLabel = isGood ? "PROTECTED" : isMedium ? "NEEDS WORK" : "ROASTED"
  
  const shareText = locale === "de" 
    ? `Mein Moltbot-Stack "${stackName}" wurde geröstet! ${scoreEmoji} Score: ${score}/100 (${scoreLabel})\n\n${roastSummary.slice(0, 100)}...\n\nRoast deinen Stack auf clawguru.org 🔥`
    : `My Moltbot stack "${stackName}" got roasted! ${scoreEmoji} Score: ${score}/100 (${scoreLabel})\n\n${roastSummary.slice(0, 100)}...\n\nRoast your stack at clawguru.org 🔥`

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=https://clawguru.org/roast-my-moltbot&summary=${encodeURIComponent(shareText)}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://clawguru.org/roast-my-moltbot`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadBadge = () => {
    // PNG Badge Export - simplified version
    const canvas = document.createElement("canvas")
    canvas.width = 1200
    canvas.height = 630
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630)
    gradient.addColorStop(0, "#0a0a0a")
    gradient.addColorStop(1, "#1a1a2e")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1200, 630)

    // Border
    ctx.strokeStyle = isGood ? "#22c55e" : isMedium ? "#f59e0b" : "#ef4444"
    ctx.lineWidth = 8
    ctx.strokeRect(20, 20, 1160, 590)

    // Title
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 64px system-ui"
    ctx.textAlign = "center"
    ctx.fillText("ROAST MY MOLTBOT", 600, 120)

    // Score
    ctx.font = "bold 180px system-ui"
    ctx.fillStyle = isGood ? "#22c55e" : isMedium ? "#f59e0b" : "#ef4444"
    ctx.fillText(`${score}`, 600, 320)

    // Label
    ctx.font = "bold 48px system-ui"
    ctx.fillStyle = "#ffffff"
    ctx.fillText(scoreLabel, 600, 400)

    // Footer
    ctx.font = "32px system-ui"
    ctx.fillStyle = "#888888"
    ctx.fillText("clawguru.org/roast-my-moltbot", 600, 550)

    // Download
    const link = document.createElement("a")
    link.download = `roast-badge-${score}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <p className="text-sm text-zinc-400">{locale === "de" ? "Teile deinen Roast:" : "Share your roast:"}</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {/* Twitter/X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-zinc-700 rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <Twitter className="w-4 h-4 text-white" />
          <span className="text-sm text-white font-medium">Twitter/X</span>
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] border border-[#0A66C2] rounded-lg hover:bg-[#0958a8] transition-colors"
        >
          <Linkedin className="w-4 h-4 text-white" />
          <span className="text-sm text-white font-medium">LinkedIn</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Link2 className="w-4 h-4 text-zinc-400" />}
          <span className="text-sm text-zinc-300 font-medium">{copied ? (locale === "de" ? "Kopiert!" : "Copied!") : (locale === "de" ? "Link kopieren" : "Copy link")}</span>
        </button>

        {/* Download Badge */}
        <button
          onClick={handleDownloadBadge}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-900/50 to-red-900/50 border border-amber-700/50 rounded-lg hover:border-amber-500 transition-colors"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-300 font-medium">{locale === "de" ? "Badge downloaden" : "Download badge"}</span>
        </button>
      </div>
    </div>
  )
}
