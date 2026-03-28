'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import BuyButton from "@/components/commerce/BuyButton"
import { hash10 } from "@/lib/utils"
import { useI18n } from "@/components/i18n/I18nProvider"

type ChatMsg = { id: string; role: "user" | "assistant"; content: string; timestamp?: number }

type ServerResp = {
  reply: string
  followups: string[]
  actions: Array<{ label: string; href?: string; command?: string }>
  confidence: "low" | "medium" | "high"
}

function bubble(role: ChatMsg["role"]) {
  return role === "assistant"
    ? "bg-gradient-to-br from-gray-900/60 to-gray-800/40 border-gray-700/50 shadow-lg"
    : "bg-gradient-to-br from-brand-cyan/15 to-brand-cyan/5 border-brand-cyan/30 shadow-md"
}

export default function CopilotChat() {
  const { locale, dict } = useI18n()
  const prefix = `/${locale}`

  const startMsgs = useMemo<ChatMsg[]>(() => [
    { id: "a0", role: "assistant", content: dict.copilot.greeting, timestamp: Date.now() }
  ], [dict.copilot.greeting])

  const initialFollowups = useMemo(() => [
    dict.copilot.followup1,
    dict.copilot.followup2,
    dict.copilot.followup3,
    dict.copilot.followup4,
  ], [
    dict.copilot.followup1,
    dict.copilot.followup2,
    dict.copilot.followup3,
    dict.copilot.followup4,
  ])

  const [msgs, setMsgs] = useState<ChatMsg[]>(startMsgs)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [followups, setFollowups] = useState<string[]>(initialFollowups)
  const [actions, setActions] = useState<ServerResp["actions"]>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  // Improved scroll: delays & waits for DOM to settle
  const scrollToBottom = () => {
    if (!messagesEndRef.current) return
    // Double-request to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
      }, 50)
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [msgs, loading])

  useEffect(() => {
    setMsgs(startMsgs)
    setFollowups(initialFollowups)
  }, [locale, startMsgs, initialFollowups])

  // Analytics tracking for user behavior
  async function trackEvent(event: string, data: Record<string, unknown>) {
    try {
      await fetch("/api/analytics/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, data })
      }).catch(() => {}) // Silently fail - don't break if analytics is down
    } catch {}
  }

  async function send(text: string) {
    const txt = text.trim()
    if (!txt) return
    setLoading(true)
    setActions([])
    const ts = Date.now()
    setMsgs((m) => [...m, { id: hash10("u:" + ts + txt), role: "user", content: txt, timestamp: ts }])
    setInput("")
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt })
      })
      const data = (await res.json()) as ServerResp
      setMsgs((m) => [...m, { id: hash10("a:" + Date.now()), role: "assistant", content: data.reply, timestamp: Date.now() }])
      setFollowups(data.followups || [])
      setActions(data.actions || [])
    } catch (error) {
      console.error("[copilot]", error)
      setMsgs((m) => [
        ...m,
        {
          id: hash10("a:err:" + Date.now()),
          role: "assistant",
          content: dict.copilot.error,
          timestamp: Date.now()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* Main Chat */}
      <div className="rounded-3xl border border-gray-700/50 bg-gradient-to-br from-black/40 to-gray-900/20 overflow-hidden flex flex-col h-[80vh] sm:h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-700/30 bg-gradient-to-r from-gray-900/40 to-transparent flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
              <div className="font-black text-lg text-brand-cyan">Prof. ClawGuru</div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{dict.copilot.mode}</div>
          </div>
          <a className="text-xs text-gray-400 hover:text-brand-cyan transition py-2 px-3 rounded-lg hover:bg-black/20" href={`${prefix}/security/notfall-leitfaden`}>
            🚨 {dict.copilot.emergencyLink}
          </a>
        </div>

        {/* Quick Prompts / Launchpad */}
        <div className="px-6 py-4 border-b border-gray-700/30 bg-black/20">
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-3">{dict.copilot.launchpad}</div>
          <div className="flex flex-wrap gap-2">
            {followups.slice(0, 5).map((f) => (
              <button
                key={f}
                onClick={() => {
                  trackEvent("followup_clicked", { followup: f })
                  send(f)
                }}
                disabled={loading}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-700/60 bg-gradient-to-br from-gray-800/40 to-gray-900/20 hover:border-brand-cyan/60 hover:text-brand-cyan transition disabled:opacity-40"
              >
                {f.length > 30 ? f.substring(0, 27) + "..." : f}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
          {msgs.map((m, idx) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-4 border ${bubble(m.role)} transition-all hover:shadow-lg`}
              >
                <div className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-semibold">
                  {m.role === "assistant" ? "🧠 ClawGuru" : "👤 " + dict.copilot.you}
                </div>
                <div className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {m.content}
                </div>
                {m.timestamp && (
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(m.timestamp).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-5 py-4 border border-gray-700/30 bg-gray-900/40 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-cyan animate-bounce" />
                  <div className="text-sm text-gray-300">{dict.copilot.thinking}</div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="pt-4" />
        </div>

        {/* Input Section */}
        <div className="px-6 py-5 border-t border-gray-700/30 bg-gradient-to-t from-gray-900/40 to-transparent">
          <div className="flex flex-col gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey && input.trim()) {
                  send(input)
                }
              }}
              placeholder={dict.copilot.placeholder}
              rows={2}
              className="flex-1 p-4 rounded-xl bg-gray-900/60 border border-gray-700/60 focus:border-brand-cyan/80 focus:ring-2 focus:ring-brand-cyan/20 outline-none text-gray-100 placeholder:text-gray-500 resize-none transition"
            />
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">{dict.copilot.tip}</div>
              <button
                disabled={loading || !input.trim()}
                onClick={() => send(input)}
                className="px-5 py-2.5 rounded-lg font-bold text-sm text-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg hover:shadow-cyan-500/20"
              >
                {loading ? "⏳ " + dict.copilot.thinking : "↳ " + dict.copilot.send}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="space-y-5 max-h-[80vh] sm:max-h-[85vh] overflow-y-auto pr-2">
        
        {/* API Status Banner */}
        <div className="p-4 rounded-2xl border border-yellow-700/30 bg-yellow-900/10">
          <div className="text-xs font-bold text-yellow-300 mb-1">⚙️ API Status</div>
          <div className="text-xs text-gray-300">
            {process.env.GEMINI_API_KEY ? (
              <>
                <span className="text-green-400">✓ Gemini Live</span> — Full AI Mode
              </>
            ) : (
              <>
                <span className="text-blue-400">⊚ Rule-Based</span> — No GEMINI_API_KEY
              </>
            )}
          </div>
        </div>

        {/* Actions from last response */}
        {actions.length > 0 && (
          <div className="p-4 rounded-2xl border border-brand-cyan/20 bg-brand-cyan/5">
            <div className="font-bold text-sm text-brand-cyan mb-3">🔗 Suggested Actions</div>
            <div className="space-y-2">
              {actions.map((a) => (
                <a
                  key={a.label}
                  href={a.href || "#"}
                  className="block px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-brand-cyan/10 to-transparent border border-brand-cyan/30 hover:border-brand-cyan/60 text-brand-cyan hover:text-brand-cyan transition"
                >
                  → {a.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Pro Access Card */}
        <div className="p-5 rounded-2xl border border-violet-700/40 bg-gradient-to-br from-violet-900/10 to-transparent">
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">{dict.copilot.proAccess}</div>
          <div className="text-lg font-black text-white mb-2">{dict.copilot.proTitle}</div>
          <div className="text-xs text-gray-300 mb-4 leading-relaxed">
            {dict.copilot.proDesc}
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-violet-700/30 bg-black/20">
              <div className="font-bold text-sm">{dict.copilot.proLabel}</div>
              <div className="text-xs text-gray-400 mt-0.5">{dict.copilot.proSub}</div>
            </div>

            <div className="p-3 rounded-lg border border-yellow-700/30 bg-yellow-900/10">
              <div className="font-bold text-sm text-yellow-300">{dict.copilot.dayPassLabel}</div>
              <div className="text-xs text-gray-400 mt-0.5">{dict.copilot.dayPassSub}</div>
              <div className="mt-2.5">
                <BuyButton
                  product="daypass"
                  label={dict.copilot.dayPassBtn}
                  className="w-full px-3 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:opacity-90 transition"
                />
              </div>
            </div>
          </div>

          <a href={`${prefix}/pricing`} className="block text-center mt-3 text-xs text-brand-cyan hover:text-brand-cyan underline">
            {dict.copilot.allPlans}
          </a>
        </div>

        {/* Quick Links */}
        <div className="p-4 rounded-2xl border border-gray-700/40 bg-gray-900/20">
          <div className="font-bold text-sm mb-3">🌐 Quick Access</div>
          <div className="space-y-2">
            <a href={`${prefix}/check`} className="block text-xs p-2 rounded-lg bg-black/30 border border-gray-700/40 hover:border-brand-cyan/60 text-gray-300 hover:text-brand-cyan transition">
              📊 Live Security Check
            </a>
            <a href={`${prefix}/runbooks`} className="block text-xs p-2 rounded-lg bg-black/30 border border-gray-700/40 hover:border-brand-cyan/60 text-gray-300 hover:text-brand-cyan transition">
              📚 Runbook Vault
            </a>
            <a href={`${prefix}/live`} className="block text-xs p-2 rounded-lg bg-black/30 border border-gray-700/40 hover:border-brand-cyan/60 text-gray-300 hover:text-brand-cyan transition">
              🔴 OpsWall Live
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}
