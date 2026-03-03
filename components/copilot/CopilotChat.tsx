'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import BuyButton from "@/components/commerce/BuyButton"
import { hash10 } from "@/lib/utils"
import { SUPPORTED_LOCALES, type Locale, t } from "@/lib/i18n"

type ChatMsg = { id: string; role: "user" | "assistant"; content: string }

type ServerResp = {
  reply: string
  followups: string[]
  actions: Array<{ label: string; href?: string; command?: string }>
  confidence: "low" | "medium" | "high"
}

function bubble(role: ChatMsg["role"]) {
  return role === "assistant"
    ? "bg-gray-900/50 border-gray-800"
    : "bg-brand-cyan/10 border-brand-cyan/25"
}

export default function CopilotChat() {
  const pathname = usePathname()
  const firstSegment = pathname.split("/").filter(Boolean)[0] as Locale
  const locale: Locale = SUPPORTED_LOCALES.includes(firstSegment) ? firstSegment : "de"

  const startMsgs = useMemo<ChatMsg[]>(() => [
    { id: "a0", role: "assistant", content: t(locale, 'copilotGreeting') }
  ], [locale])

  const initialFollowups = useMemo(() => [
    t(locale, 'copilotFollowup1'),
    t(locale, 'copilotFollowup2'),
    t(locale, 'copilotFollowup3'),
    t(locale, 'copilotFollowup4'),
  ], [locale])

  const [msgs, setMsgs] = useState<ChatMsg[]>(startMsgs)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [followups, setFollowups] = useState<string[]>(initialFollowups)
  const [actions, setActions] = useState<ServerResp["actions"]>([])
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs.length, loading])

  useEffect(() => {
    setMsgs(startMsgs)
    setFollowups(initialFollowups)
  }, [locale, startMsgs, initialFollowups])

  async function send(text: string) {
    const txt = text.trim()
    if (!txt) return
    setLoading(true)
    setActions([])
    setMsgs((m) => [...m, { id: hash10("u:" + Date.now() + txt), role: "user", content: txt }])
    setInput("")
    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt })
      })
      const data = (await res.json()) as ServerResp
      setMsgs((m) => [...m, { id: hash10("a:" + Date.now()), role: "assistant", content: data.reply }])
      setFollowups(data.followups || [])
      setActions(data.actions || [])
    } catch {
      setMsgs((m) => [
        ...m,
        {
          id: hash10("a:err:" + Date.now()),
          role: "assistant",
          content: t(locale, 'copilotError')
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      {/* Chat */}
      <div className="rounded-2xl border border-gray-800 bg-black/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <div className="font-black text-brand-cyan">Copilot</div>
            <div className="text-xs text-gray-400">{t(locale, 'copilotMode')}</div>
          </div>
          <a className="text-xs text-gray-400 hover:text-brand-cyan" href="/security/notfall-leitfaden">
            {t(locale, 'copilotEmergencyLink')}
          </a>
        </div>

        {/* Launchpad */}
        <div className="px-5 py-4 border-b border-gray-800 bg-black/20">
          <div className="text-xs uppercase tracking-widest text-gray-500">{t(locale, 'copilotLaunchpad')}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {followups.slice(0, 6).map((f) => (
              <button
                key={f}
                onClick={() => send(f)}
                className="px-3 py-2 rounded-xl border border-gray-800 bg-black/25 hover:bg-black/35 text-sm text-gray-200"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="p-5 space-y-4 max-h-[62vh] overflow-auto">
          {msgs.map((m) => (
            <div key={m.id} className={"p-4 rounded-2xl border " + bubble(m.role)}>
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                {m.role === "assistant" ? "ClawGuru" : t(locale, 'copilotYou')}
              </div>
              <div className="text-gray-100 whitespace-pre-wrap leading-relaxed">{m.content}</div>
            </div>
          ))}
          {loading ? (
            <div className="p-4 rounded-2xl border border-gray-800 bg-black/20 text-gray-300">
              {t(locale, 'copilotThinking')}
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t border-gray-800 bg-black/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t(locale, 'copilotPlaceholder')}
              rows={3}
              className="flex-1 p-3 rounded-xl bg-gray-900/40 border border-gray-800 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none text-gray-100 placeholder:text-gray-500"
            />
            <button
              disabled={loading || !input.trim()}
              onClick={() => send(input)}
              className="px-6 py-3 rounded-xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "…" : t(locale, 'copilotSend')}
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {t(locale, 'copilotTip')}
          </div>
        </div>
      </div>

      {/* Side panel */}
      <aside className="space-y-6">
        <div className="p-5 rounded-2xl border border-gray-800 bg-black/30">
          <div className="text-xs uppercase tracking-widest text-gray-500">{t(locale, 'copilotProAccess')}</div>
          <div className="mt-2 text-xl font-black">{t(locale, 'copilotProTitle')}</div>
          <div className="mt-3 text-sm text-gray-300">
            {t(locale, 'copilotProDesc')}
          </div>

          <div className="mt-4 grid gap-3">
            <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black">{t(locale, 'copilotProLabel')}</div>
              <div className="text-xs text-gray-400 mt-1">{t(locale, 'copilotProSub')}</div>
              <div className="mt-3">
                
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black">{t(locale, 'copilotDayPassLabel')}</div>
              <div className="text-xs text-gray-400 mt-1">{t(locale, 'copilotDayPassSub')}</div>
              <div className="mt-3">
                <BuyButton
                  product="daypass"
                  label={t(locale, 'copilotDayPassBtn')}
                  className="w-full px-4 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
                />
              </div>
            </div>

            <a href="/pricing" className="text-sm text-cyan-300 underline hover:text-cyan-200 text-center">
              {t(locale, 'copilotAllPlans')}
            </a>
          </div>
        </div>

        {actions.length > 0 ? (
          <div className="p-5 rounded-2xl border border-gray-800 bg-black/30">
            <div className="font-black mb-3">{t(locale, 'copilotLinks')}</div>
            <div className="grid gap-2">
              {actions.map((a) => (
                <a
                  key={a.label}
                  href={a.href || "#"}
                  className="px-4 py-2 rounded-xl bg-black/30 border border-gray-700 hover:bg-black/40"
                >
                  {a.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        <div className="p-5 rounded-2xl border border-gray-800 bg-black/30">
          <div className="font-black">{t(locale, 'copilotLlmTitle')}</div>
          <div className="text-sm text-gray-400 mt-2">
            Setze <code className="text-gray-200">GEMINI_API_KEY</code> (optional{" "}
            <code className="text-gray-200">GEMINI_MODEL</code>) als Env. Ohne Keys läuft alles rule-based.
          </div>
        </div>
      </aside>
    </div>
  )
}
