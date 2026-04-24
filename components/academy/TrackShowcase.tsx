import Link from "next/link"
import type { ReactNode } from "react"
import type { Locale } from "@/lib/i18n"
import { EmailCapture } from "@/components/conversion/EmailCapture"
import { getHubContent, type Track } from "@/lib/academy/hubContent"
import { getShowcaseLabels, getTrackDetail } from "@/lib/academy/trackShowcase"

interface Props {
  locale: Locale
  track: Track
  /** Optional: rendered between the hero and the showcase sections (e.g., the mission list for live tracks). */
  missionsSlot?: ReactNode
  /** Show the waitlist EmailCapture prominently. True for "soon" tracks. */
  showWaitlist?: boolean
}

const ACCENT: Record<
  string,
  { bg: string; border: string; text: string; chip: string; glow: string; grad: string }
> = {
  emerald: { bg: "from-emerald-500/10", border: "border-emerald-500/30",  text: "text-emerald-300",  chip: "bg-emerald-500/15 text-emerald-200", glow: "rgba(16,185,129,0.15)",  grad: "from-emerald-300 to-cyan-300" },
  blue:    { bg: "from-blue-500/10",    border: "border-blue-500/30",     text: "text-blue-300",     chip: "bg-blue-500/15 text-blue-200",       glow: "rgba(59,130,246,0.15)",  grad: "from-blue-300 to-violet-300" },
  red:     { bg: "from-red-500/10",     border: "border-red-500/30",      text: "text-red-300",      chip: "bg-red-500/15 text-red-200",         glow: "rgba(239,68,68,0.15)",   grad: "from-red-300 to-amber-300" },
  cyan:    { bg: "from-cyan-500/10",    border: "border-cyan-500/30",     text: "text-cyan-300",     chip: "bg-cyan-500/15 text-cyan-200",       glow: "rgba(6,182,212,0.15)",   grad: "from-cyan-300 to-emerald-300" },
  amber:   { bg: "from-amber-500/10",   border: "border-amber-500/30",    text: "text-amber-300",    chip: "bg-amber-500/15 text-amber-200",     glow: "rgba(251,191,36,0.15)",  grad: "from-amber-300 to-red-300" },
  violet:  { bg: "from-violet-500/10",  border: "border-violet-500/30",   text: "text-violet-300",   chip: "bg-violet-500/15 text-violet-200",   glow: "rgba(139,92,246,0.15)",  grad: "from-violet-300 to-cyan-300" },
  pink:    { bg: "from-pink-500/10",    border: "border-pink-500/30",     text: "text-pink-300",     chip: "bg-pink-500/15 text-pink-200",       glow: "rgba(236,72,153,0.15)",  grad: "from-pink-300 to-violet-300" },
  lime:    { bg: "from-lime-500/10",    border: "border-lime-500/30",     text: "text-lime-300",     chip: "bg-lime-500/15 text-lime-200",       glow: "rgba(132,204,22,0.15)",  grad: "from-lime-300 to-emerald-300" },
}

export function TrackShowcase({ locale, track, missionsSlot, showWaitlist }: Props) {
  const hub = getHubContent(locale)
  const copy = hub.tracks[track.slug]
  const detail = getTrackDetail(locale, track.slug)
  const labels = getShowcaseLabels(locale)
  if (!copy || !detail) return null

  const a = ACCENT[track.accent] ?? ACCENT.emerald
  const prefix = `/${locale}`
  const statusLabel = hub.trackStatusLabel[track.status]

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at top, ${a.glow}, transparent 60%)` }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
          aria-hidden
        />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <Link
              href={`${prefix}/academy`}
              className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-6"
            >
              ← Academy
            </Link>

            <div className="flex items-center gap-3 flex-wrap mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${a.border} bg-white/[0.02] ${a.text} text-[10px] font-mono tracking-[0.25em]`}>
                <span className={`w-1.5 h-1.5 rounded-full ${a.text.replace("text-", "bg-")} animate-pulse`} />
                <span className="uppercase">{track.icon}  TRACK</span>
              </span>
              <span className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded ${a.chip}`}>
                {statusLabel}
              </span>
              {copy.badge && (
                <span className="text-[10px] font-mono tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-300 uppercase">
                  {copy.badge}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-5 tracking-tight">
              <span className={`text-transparent bg-clip-text bg-gradient-to-br ${a.grad}`}>
                {copy.title}
              </span>
            </h1>
            <p className={`text-lg md:text-2xl ${a.text} font-medium mb-4`}>{copy.tagline}</p>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">{copy.audience}</p>

            {detail.stats && detail.stats.length > 0 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
                {detail.stats.map((s, i) => (
                  <div key={i} className={`rounded-xl border ${a.border} bg-white/[0.02] p-4`}>
                    <div className={`text-xl md:text-2xl font-black ${a.text}`}>{s.value}</div>
                    <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ SCENARIO + WHY (two-column on large) ═══════════════ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-3`}>{labels.sectionScenario}</div>
              <p className="text-base md:text-lg text-gray-200 leading-relaxed">{detail.scenario}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-3`}>{labels.sectionWhy}</div>
              <p className="text-base md:text-lg text-gray-200 leading-relaxed">{detail.whyItMatters}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SLOT for missions (live tracks) ═══════════════ */}
      {missionsSlot ? (
        <section className="py-8">
          <div className="container mx-auto px-4">{missionsSlot}</div>
        </section>
      ) : null}

      {/* ═══════════════ WAITLIST (prominent for soon tracks) ═══════════════ */}
      {showWaitlist && (
        <section className="py-16 relative overflow-hidden border-y border-white/5 bg-gradient-to-br from-white/[0.02] via-[#05070a] to-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-6">
                <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-3`}>{statusLabel}</div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-3">{labels.waitlistTitle}</h2>
                <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">{labels.waitlistSub}</p>
              </div>
              <EmailCapture locale={locale} source={`academy_track_${track.slug}_waitlist`} variant="card" />
              {detail.earlyAccessPerks && detail.earlyAccessPerks.length > 0 && (
                <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-3`}>{labels.sectionPerks}</div>
                  <ul className="space-y-2">
                    {detail.earlyAccessPerks.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-200">
                        <span className={`${a.text} shrink-0`}>✦</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ WHAT YOU SHIP ═══════════════ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-4`}>{labels.sectionShip}</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-8 tracking-tight">
              Concrete outcomes. No lecture notes.
            </h2>
            <ul className="grid md:grid-cols-2 gap-3">
              {detail.youWillShip.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-white/20 transition-colors"
                >
                  <span className={`font-mono text-sm ${a.text} shrink-0`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-gray-200 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════ IDEAL FOR + COMPLIANCE ═══════════════ */}
      <section className="py-16 md:py-20 bg-white/[0.015] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-4`}>{labels.sectionIdealFor}</div>
              <ul className="space-y-2">
                {detail.idealFor.map((who, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-200 leading-relaxed">
                    <span className={`${a.text} shrink-0`}>▸</span>
                    <span>{who}</span>
                  </li>
                ))}
              </ul>
            </div>
            {detail.complianceAngle && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-3`}>{labels.sectionCompliance}</div>
                <p className="text-sm text-gray-200 leading-relaxed">{detail.complianceAngle}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIAL ═══════════════ */}
      {detail.testimonial && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className={`text-6xl ${a.text} leading-none select-none`}>&ldquo;</div>
              <blockquote className="text-xl md:text-2xl font-medium text-gray-100 leading-relaxed -mt-6">
                {detail.testimonial.quote}
              </blockquote>
              <div className="mt-6 text-sm">
                <div className="text-gray-200 font-bold">{detail.testimonial.author}</div>
                <div className="text-xs text-gray-500 mt-0.5">{detail.testimonial.role}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CERTIFICATION ═══════════════ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-4`}>{labels.sectionCert}</div>
            <div className={`rounded-2xl border-2 ${a.border} bg-gradient-to-br ${a.bg} to-transparent p-6 md:p-8`}>
              <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
                <div className={`shrink-0 w-20 h-20 rounded-xl border-2 ${a.border} ${a.chip} flex items-center justify-center text-3xl`}>
                  🏆
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-2xl md:text-3xl font-black ${a.text} mb-1`}>{detail.cert.name}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{detail.cert.requirement}</p>
                  <ul className="space-y-2">
                    {detail.cert.benefits.map((b, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-200">
                        <span className={`${a.text} shrink-0`}>✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-16 md:py-20 bg-white/[0.015] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className={`text-[10px] font-mono tracking-[0.3em] ${a.text} mb-4`}>{labels.sectionFaq}</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-8 tracking-tight">Questions we already got.</h2>
            <div className="space-y-3">
              {detail.faq.map((f, i) => (
                <details key={i} className="group rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <summary className="cursor-pointer px-5 py-4 flex items-start justify-between gap-4 hover:bg-white/[0.02]">
                    <span className="text-sm font-bold text-gray-100">{f.q}</span>
                    <span className={`${a.text} text-xs font-mono shrink-0 group-open:rotate-45 transition-transform`}>+</span>
                  </summary>
                  <p className="px-5 pb-5 text-sm text-gray-300 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CLOSING WAITLIST (also show for live tracks — upsell next track) ═══════════════ */}
      {!showWaitlist && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <EmailCapture locale={locale} source={`academy_track_${track.slug}_upsell`} variant="card" />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
