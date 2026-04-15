"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Share2, MessageCircle, Send, Mail, Copy, ShieldCheck } from "lucide-react"

export type SecurityCheckShareDict = {
  share_title: string
  share_x: string
  share_li: string
  share_wa: string
  share_tg: string
  share_mail: string
  copy_link: string
  copied: string
}

type Props = {
  score: number
  target: string
  vulnerable: boolean
  dict: SecurityCheckShareDict
  shareUrl: string
}

function scoreColor(score: number): string {
  if (score >= 90) return "#22c55e"
  if (score >= 75) return "#eab308"
  if (score >= 60) return "#f97316"
  return "#ef4444"
}

function viralMessage(score: number, target: string, vulnerable: boolean): string {
  if (score >= 90) {
    return `My ${target} scored ${score}/100 on ClawGuru Security Check. 🛡️ Excellent baseline!`
  }
  if (score >= 75) {
    return `Got ${score}/100 for ${target}. Not bad, but room to improve. How's your infrastructure?`
  }
  if (score >= 60) {
    return `${score}/100 for ${target} — exposed vulnerabilities detected. ⚠️ Time to harden!`
  }
  return `${score}/100... my ${target} got DESTROYED by ClawGuru Security Check. 🔥 Fix this NOW.`
}

function scoreEmoji(score: number): string {
  if (score >= 90) return "🛡️"
  if (score >= 75) return "✅"
  if (score >= 60) return "⚠️"
  return "🚨"
}

export function SecurityCheckShareCard({ score, target, vulnerable, dict, shareUrl }: Props) {
  const [copied, setCopied] = useState(false)
  const viral = viralMessage(score, target, vulnerable)
  const emoji = scoreEmoji(score)
  const tweet = `${emoji} ${viral}`
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}&url=${encodeURIComponent(shareUrl)}`
  const liHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const waText = `${emoji} ${viral} ${shareUrl}`
  const waHref = `https://wa.me/?text=${encodeURIComponent(waText)}`
  const tgHref = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${emoji} ${viral}`)}`
  const mailSubject = `ClawGuru Security Score: ${score}/100`
  const mailBody = `${viral}\n\nCheck your infrastructure: ${shareUrl}`
  const mailHref = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-700 p-6"
      style={{
        background: "linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(10,10,10,0.96) 100%)",
        boxShadow: "0 0 40px rgba(34,211,238,0.03)",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Share2 className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-gray-100">{dict.share_title}</h3>
      </div>

      <div className="mb-4 p-4 rounded-xl bg-gray-900 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{emoji}</span>
          <div className="text-sm text-gray-300 font-mono">{viral}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Twitter/X */}
        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-gray-200 text-sm font-medium"
        >
          <Share2 className="h-4 w-4" />
          <span>{dict.share_x}</span>
        </a>

        {/* LinkedIn */}
        <a
          href={liHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-gray-200 text-sm font-medium"
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{dict.share_li}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-gray-200 text-sm font-medium"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{dict.share_wa}</span>
        </a>

        {/* Telegram */}
        <a
          href={tgHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-gray-200 text-sm font-medium"
        >
          <Send className="h-4 w-4" />
          <span>{dict.share_tg}</span>
        </a>

        {/* Email */}
        <a
          href={mailHref}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors text-gray-200 text-sm font-medium"
        >
          <Mail className="h-4 w-4" />
          <span>{dict.share_mail}</span>
        </a>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700/50 transition-colors text-cyan-200 text-sm font-medium"
        >
          <Copy className="h-4 w-4" />
          <span>{copied ? dict.copied : dict.copy_link}</span>
        </button>
      </div>
    </motion.div>
  )
}
