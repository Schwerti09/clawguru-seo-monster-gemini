"use client"

import { useState } from "react"
import { Mail, Send, Check, Bell } from "lucide-react"

interface RoastEmailCaptureProps {
  locale?: string
  variant?: "card" | "inline" | "hero"
}

export function RoastEmailCapture({ locale = "de", variant = "card" }: RoastEmailCaptureProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || loading) return

    setLoading(true)
    // TODO: POST /api/subscribe { email, source: "roast_digest" }
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setLoading(false)
  }

  const content = {
    de: {
      title: "Weekly Roast Digest",
      subtitle: "Die besten Roasts, Fixes und Score-Sprünge — jede Woche in deinem Inbox.",
      placeholder: "deine@email.com",
      button: "Abonnieren",
      success: "✅ Du bekommst den nächsten Digest!",
      privacy: "Kein Spam. Jederzeit abbestellbar.",
      stats: "2,847 Abonnenten",
    },
    en: {
      title: "Weekly Roast Digest",
      subtitle: "The best roasts, fixes, and score jumps — weekly in your inbox.",
      placeholder: "your@email.com",
      button: "Subscribe",
      success: "✅ You'll get the next digest!",
      privacy: "No spam. Unsubscribe anytime.",
      stats: "2,847 subscribers",
    },
  }

  const t = content[locale as keyof typeof content] || content.de

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.placeholder}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          required
        />
        <button
          type="submit"
          disabled={loading || submitted}
          className="px-4 py-2 bg-cyan-900/50 border border-cyan-700/50 rounded-lg hover:bg-cyan-900 transition-colors disabled:opacity-50"
        >
          {submitted ? <Check className="w-4 h-4 text-green-400" /> : <Send className="w-4 h-4 text-cyan-400" />}
        </button>
      </form>
    )
  }

  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 ${variant === "hero" ? "text-center" : ""}`}>
      <div className={`flex items-center gap-3 mb-4 ${variant === "hero" ? "justify-center" : ""}`}>
        <div className="w-10 h-10 bg-amber-900/50 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-100">{t.title}</h3>
          <p className="text-xs text-amber-400">{t.stats}</p>
        </div>
      </div>

      {submitted ? (
        <div className="flex items-center gap-2 text-green-400">
          <Check className="w-5 h-5" />
          <span>{t.success}</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-zinc-400 mb-4">{t.subtitle}</p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm text-gray-300 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? "..." : <Send className="w-4 h-4" />}
              {t.button}
            </button>
          </form>
          <p className="text-xs text-zinc-500 mt-3">{t.privacy}</p>
        </>
      )}
    </div>
  )
}
