"use client"

import { useEffect, useRef, useState } from "react"
import type { Mission, MissionState } from "@/lib/academy/missionEngine"

interface Props {
  mission: Mission
  state: MissionState
  locale: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

// Floating AI tutor. Minimal surface: a pill bottom-right that expands into a
// chat panel. Keeps conversation in local state. Every turn sends the current
// mission snapshot (title, brief, goals+done, last 6 commands) so the model
// knows exactly where the learner is stuck.
export function SentinelChat({ mission, state, locale }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const [provider, setProvider] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  async function send(userText: string) {
    const trimmed = userText.trim()
    if (!trimmed || pending) return
    const nextMsgs: ChatMessage[] = [...messages, { role: "user", content: trimmed }]
    setMessages(nextMsgs)
    setInput("")
    setPending(true)
    try {
      const res = await fetch("/api/academy/sentinel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMsgs,
          locale,
          mission: {
            slug: mission.slug,
            title: mission.title,
            brief: mission.brief,
            goals: mission.goals.map((g) => ({
              id: g.id,
              label: g.label,
              hint: g.hint,
              done: state.goalsMet.includes(g.id),
            })),
            recentHistory: state.history.slice(-6),
          },
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { reply: string; provider?: string }
      setMessages([...nextMsgs, { role: "assistant", content: data.reply }])
      if (data.provider) setProvider(data.provider)
    } catch {
      setMessages([
        ...nextMsgs,
        { role: "assistant", content: "Sentinel is offline right now. Try `hint` in the terminal for a nudge." },
      ])
    } finally {
      setPending(false)
    }
  }

  const metCount = state.goalsMet.length
  const placeholderDE = locale.startsWith("de") ? "Frag mich alles zur Mission…" : "Ask anything about the mission…"

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-auto">
      {open ? (
        <div className="w-[min(380px,calc(100vw-2rem))] h-[520px] max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl border border-white/10 bg-[#0a0d12]/95 backdrop-blur shadow-2xl shadow-black/60">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 grid place-items-center text-black font-black text-xs">S</div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-gray-100 truncate">Sentinel</div>
                <div className="text-[10px] font-mono text-gray-500 truncate">
                  AI Tutor · {metCount}/{mission.goals.length} goals{provider ? ` · ${provider}` : ""}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-white transition-colors text-lg leading-none w-7 h-7 grid place-items-center"
              aria-label="Close Sentinel"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="text-xs text-gray-500 leading-relaxed">
                <p className="mb-2 font-mono tracking-wider text-emerald-400">SENTINEL · READY</p>
                <p className="mb-2">
                  I&apos;m your tutor for <span className="text-gray-300">{mission.title}</span>. Ask in any language — I&apos;ll nudge you toward the next step without spoiling the whole solution.
                </p>
                <p className="text-gray-600">
                  Try: &ldquo;what does <span className="text-cyan-400">patch hsts</span> actually do?&rdquo;
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl px-3.5 py-2 bg-emerald-500 text-black"
                      : "max-w-[85%] rounded-2xl px-3.5 py-2 bg-white/5 border border-white/10 text-gray-100 whitespace-pre-wrap"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {pending && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-3.5 py-2 bg-white/5 border border-white/10 text-gray-400 text-xs font-mono">
                  thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            className="p-3 border-t border-white/10 flex gap-2"
            onSubmit={(e) => { e.preventDefault(); send(input) }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholderDE}
              className="flex-1 bg-white/5 border border-white/10 focus:border-emerald-400/50 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 outline-none"
              disabled={pending}
              autoFocus
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="px-4 rounded-lg bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-2.5 pl-2.5 pr-4 py-2.5 rounded-full border border-white/10 bg-[#0a0d12]/95 backdrop-blur shadow-2xl shadow-black/60 hover:border-emerald-400/50 transition-colors"
          aria-label="Open Sentinel"
        >
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 grid place-items-center text-black font-black text-xs">S</span>
          <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">
            Sentinel<span className="text-gray-500 font-normal"> · need a hint?</span>
          </span>
        </button>
      )}
    </div>
  )
}
