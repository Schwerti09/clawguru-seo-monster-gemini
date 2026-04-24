import Link from "next/link"
import { getMission, listMissionsForTrack } from "@/lib/academy/missions"
import type { Locale } from "@/lib/i18n"

interface Props {
  locale: Locale
  trackSlug: string
  accent?: "emerald" | "blue" | "red" | "cyan" | "amber" | "violet" | "pink" | "lime"
}

const ACCENT_BAND: Record<string, { bg: string; border: string; text: string; hoverBorder: string; hoverBg: string; chipBg: string; chipBorder: string; chipText: string }> = {
  emerald: { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-emerald-300",  hoverBorder: "hover:border-emerald-400/40", hoverBg: "hover:bg-emerald-500/[0.03]", chipBg: "bg-emerald-500/10", chipBorder: "border-emerald-500/20", chipText: "text-emerald-300" },
  blue:    { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-blue-300",     hoverBorder: "hover:border-blue-400/40",    hoverBg: "hover:bg-blue-500/[0.03]",    chipBg: "bg-blue-500/10",    chipBorder: "border-blue-500/20",    chipText: "text-blue-300" },
  red:     { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-red-300",      hoverBorder: "hover:border-red-400/40",     hoverBg: "hover:bg-red-500/[0.03]",     chipBg: "bg-red-500/10",     chipBorder: "border-red-500/20",     chipText: "text-red-300" },
  cyan:    { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-cyan-300",     hoverBorder: "hover:border-cyan-400/40",    hoverBg: "hover:bg-cyan-500/[0.03]",    chipBg: "bg-cyan-500/10",    chipBorder: "border-cyan-500/20",    chipText: "text-cyan-300" },
  amber:   { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-amber-300",    hoverBorder: "hover:border-amber-400/40",   hoverBg: "hover:bg-amber-500/[0.03]",   chipBg: "bg-amber-500/10",   chipBorder: "border-amber-500/20",   chipText: "text-amber-300" },
  violet:  { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-violet-300",   hoverBorder: "hover:border-violet-400/40",  hoverBg: "hover:bg-violet-500/[0.03]",  chipBg: "bg-violet-500/10",  chipBorder: "border-violet-500/20",  chipText: "text-violet-300" },
  pink:    { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-pink-300",     hoverBorder: "hover:border-pink-400/40",    hoverBg: "hover:bg-pink-500/[0.03]",    chipBg: "bg-pink-500/10",    chipBorder: "border-pink-500/20",    chipText: "text-pink-300" },
  lime:    { bg: "bg-white/[0.02]", border: "border-white/10", text: "text-lime-300",     hoverBorder: "hover:border-lime-400/40",    hoverBg: "hover:bg-lime-500/[0.03]",    chipBg: "bg-lime-500/10",    chipBorder: "border-lime-500/20",    chipText: "text-lime-300" },
}

// Renders a numbered mission list for a given track. Only live, playable
// missions are shown. If a track has no missions yet, returns null — the
// TrackShowcase component handles the "coming soon" state via showWaitlist.
export function MissionList({ locale, trackSlug, accent = "emerald" }: Props) {
  const entries = listMissionsForTrack(trackSlug)
  if (entries.length === 0) return null

  const a = ACCENT_BAND[accent] ?? ACCENT_BAND.emerald
  const prefix = `/${locale}`
  const totalXp = entries.reduce((s, e) => s + e.xp, 0)
  const totalMin = entries.reduce((s, e) => s + e.durationMin, 0)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className={`text-xs font-mono tracking-[0.3em] ${a.text}`}>PLAYABLE MISSIONS</div>
        <div className="flex gap-x-5 gap-y-1 text-[11px] font-mono text-gray-500 flex-wrap">
          <span>📚 {entries.length} missions</span>
          <span>⏱️ ~{totalMin} min</span>
          <span>⚡ {totalXp} XP</span>
        </div>
      </div>
      <ol className="space-y-4">
        {entries.map((entry) => {
          const m = getMission(entry.slug)
          if (!m) return null
          const href = `${prefix}/academy/mission/${entry.slug}`
          return (
            <li key={entry.slug}>
              <Link
                href={href}
                className={`group relative block p-5 rounded-xl border ${a.border} ${a.bg} ${a.hoverBorder} ${a.hoverBg} transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-10 h-10 rounded-lg ${a.chipBg} border ${a.chipBorder} grid place-items-center font-mono text-sm ${a.chipText}`}>
                    M-{String(entry.order).padStart(3, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base md:text-lg font-bold text-gray-100 mb-1 group-hover:${a.text.replace("-300", "-200")} transition-colors`}>
                      {m.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">{m.brief}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-gray-500">
                      <span>⏱️ {entry.durationMin} min</span>
                      <span>⚡ {entry.xp} XP</span>
                      <span>🎯 {m.goals.length} goals</span>
                    </div>
                  </div>
                  <div className={`hidden sm:block shrink-0 self-center text-sm font-mono text-gray-500 group-hover:${a.text.replace("-300", "-200")} transition-colors`}>
                    Launch →
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
