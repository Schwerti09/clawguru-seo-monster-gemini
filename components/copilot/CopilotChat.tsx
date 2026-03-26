'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import BuyButton from "@/components/commerce/BuyButton"
import { hash10 } from "@/lib/utils"
import { useI18n } from "@/components/i18n/I18nProvider"

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
  const { locale, dict } = useI18n()
  const prefix = `/${locale}`

  const startMsgs = useMemo<ChatMsg[]>(() => [
    { id: "a0", role: "assistant", content: dict.copilot.greeting }
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
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msgs.length, loading])

  // Persist/restore session per-locale
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`cg_copilot_chat_${locale}`)
      if (raw) {
        const parsed = JSON.parse(raw) as { msgs?: ChatMsg[]; followups?: string[] }
        if (Array.isArray(parsed?.msgs) && parsed.msgs.length > 0) setMsgs(parsed.msgs)
        if (Array.isArray(parsed?.followups)) setFollowups(parsed.followups)
        return
      }
    } catch {}
    setMsgs(startMsgs)
    setFollowups(initialFollowups)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  useEffect(() => {
    try {
      const payload = JSON.stringify({ msgs, followups })
      localStorage.setItem(`cg_copilot_chat_${locale}`, payload)
    } catch {}
  }, [msgs, followups, locale])

  // Voice integration: listen for custom event dispatched by VoiceCopilot
  useEffect(() => {
    function onVoice(ev: Event) {
      const anyEv = ev as unknown as { detail?: { text?: string } }
      const text = anyEv?.detail?.text || ""
      if (typeof text === "string" && text.trim()) {
        setInput(text)
        void send(text)
      }
    }
    window.addEventListener("copilot:voice", onVoice as EventListener)
    return () => window.removeEventListener("copilot:voice", onVoice as EventListener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          content: dict.copilot.error
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
            <div className="text-xs text-gray-400">{dict.copilot.mode}</div>
          </div>
          <a className="text-xs text-gray-400 hover:text-brand-cyan" href={`${prefix}/security/notfall-leitfaden`}>
            {dict.copilot.emergencyLink}
          </a>
        </div>

        {/* Launchpad */}
        <div className="px-5 py-4 border-b border-gray-800 bg-black/20">
          <div className="text-xs uppercase tracking-widest text-gray-500">{dict.copilot.launchpad}</div>
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
                {m.role === "assistant" ? "ClawGuru" : dict.copilot.you}
              </div>
              <div className="text-gray-100 whitespace-pre-wrap leading-relaxed">{m.content}</div>
            </div>
          ))}
          {loading ? (
            <div className="p-4 rounded-2xl border border-gray-800 bg-black/20 text-gray-300">
              {dict.copilot.thinking}
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
              placeholder={dict.copilot.placeholder}
              rows={3}
              className="flex-1 p-3 rounded-xl bg-gray-900/40 border border-gray-800 focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/20 outline-none text-gray-100 placeholder:text-gray-500"
            />
            <button
              disabled={loading || !input.trim()}
              onClick={() => send(input)}
              className="px-6 py-3 rounded-xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "…" : dict.copilot.send}
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            {dict.copilot.tip}
          </div>
        </div>
      </div>

      {/* Side panel */}
      <aside className="space-y-6">
        <div className="p-5 rounded-2xl border border-gray-800 bg-black/30">
          <div className="text-xs uppercase tracking-widest text-gray-500">{dict.copilot.proAccess}</div>
          <div className="mt-2 text-xl font-black">{dict.copilot.proTitle}</div>
          <div className="mt-3 text-sm text-gray-300">
            {dict.copilot.proDesc}
          </div>

          <div className="mt-4 grid gap-3">
            <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black">{dict.copilot.proLabel}</div>
              <div className="text-xs text-gray-400 mt-1">{dict.copilot.proSub}</div>
              <div className="mt-3">
                
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-gray-800 bg-black/30">
              <div className="font-black">{dict.copilot.dayPassLabel}</div>
              <div className="text-xs text-gray-400 mt-1">{dict.copilot.dayPassSub}</div>
              <div className="mt-3">
                <BuyButton
                  product="daypass"
                  label={dict.copilot.dayPassBtn}
                  className="w-full px-4 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
                />
              </div>
            </div>

            <a href={`${prefix}/pricing`} className="text-sm text-cyan-300 underline hover:text-cyan-200 text-center">
              {dict.copilot.allPlans}
            </a>
          </div>
        </div>

        {actions.length > 0 ? (
          <div className="p-5 rounded-2xl border border-gray-800 bg-black/30">
            <div className="font-black mb-3">{dict.copilot.links}</div>
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
          <div className="font-black">{dict.copilot.llmTitle}</div>
          <div className="text-sm text-gray-400 mt-2">
            Setze <code className="text-gray-200">GEMINI_API_KEY</code> (optional{" "}
            <code className="text-gray-200">GEMINI_MODEL</code>) als Env. Ohne Keys läuft alles rule-based.
          </div>
        </div>
      </aside>
    </div>
  )
}
