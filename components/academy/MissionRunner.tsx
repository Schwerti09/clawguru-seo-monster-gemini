"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import type { Mission, MissionState } from "@/lib/academy/missionEngine"
import { getMission } from "@/lib/academy/missions"
import { LiveRangeTerminal } from "./LiveRangeTerminal"
import { SentinelChat } from "./SentinelChat"

interface Props {
  missionSlug: string
  backHref: string
  locale: string
}

// Split layout: terminal (left) + goals/brief panel (right).
// Keeps state mirrored from engine via onStateChange callbacks.
export function MissionRunner({ missionSlug, backHref, locale }: Props) {
  const mission: Mission | undefined = getMission(missionSlug)
  const [state, setState] = useState<MissionState>(
    mission?.initialState ?? { cwd: "/", fs: {}, env: {}, goalsMet: [], history: [] }
  )
  const [complete, setComplete] = useState(false)

  const handleStateChange = useCallback((s: MissionState) => setState(s), [])
  const handleComplete = useCallback(() => setComplete(true), [])

  if (!mission) return null

  const metCount = state.goalsMet.length
  const totalCount = mission.goals.length
  const pct = Math.round((metCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      {/* top bar */}
      <div className="border-b border-white/5 bg-black/30 backdrop-blur">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href={backHref} className="text-xs text-gray-400 hover:text-white transition-colors">
            ← Academy
          </Link>
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-mono text-cyan-300 truncate">M-001 · {mission.title}</span>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-400">{metCount}/{totalCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 max-w-7xl mx-auto">
          {/* Terminal */}
          <div>
            <LiveRangeTerminal
              mission={mission}
              onStateChange={handleStateChange}
              onComplete={handleComplete}
            />
            <p className="text-[11px] font-mono text-gray-500 mt-3 leading-relaxed">
              Tip: press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Enter</kbd> to run a command.
              Start with <span className="text-cyan-400">help</span> or <span className="text-cyan-400">cat README</span>.
              This is a simulated shell — no real server is touched.
            </p>
          </div>

          {/* Side panel */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 mb-2">MISSION BRIEF</div>
              <h2 className="text-base font-bold text-gray-100 mb-2">{mission.title}</h2>
              <p className="text-xs text-gray-400 leading-relaxed">{mission.brief}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-[10px] font-mono tracking-[0.25em] text-emerald-400 mb-3">OBJECTIVES</div>
              <ol className="space-y-2.5">
                {mission.goals.map((g, i) => {
                  const done = state.goalsMet.includes(g.id)
                  return (
                    <li key={g.id} className="flex gap-3 text-xs">
                      <span className={`font-mono shrink-0 ${done ? "text-emerald-400" : "text-gray-500"}`}>
                        {done ? "✓" : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={done ? "text-gray-500 line-through" : "text-gray-200"}>{g.label}</span>
                    </li>
                  )
                })}
              </ol>
            </div>

            {complete && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <div className="text-[10px] font-mono tracking-[0.25em] text-emerald-300 mb-2">MISSION COMPLETE</div>
                <p className="text-xs text-emerald-100/80 leading-relaxed mb-3">
                  You just shipped a real-world nginx header fix against a simulated vhost. Your Defender XP increased.
                </p>
                <Link
                  href={backHref}
                  className="inline-block text-xs font-bold px-4 py-2 rounded-lg bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
                >
                  Back to Academy →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      <SentinelChat mission={mission} state={state} locale={locale} />
    </div>
  )
}
