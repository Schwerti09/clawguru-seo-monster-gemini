import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getHubContent } from "@/lib/academy/hubContent"
import { listMissionsForTrack, getMission } from "@/lib/academy/missions"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const TRACK_SLUG = "beginner"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const copy = getHubContent(locale).tracks[TRACK_SLUG]
  const pageUrl = `${SITE_URL}/${locale}/academy/${TRACK_SLUG}`
  const title = `${copy?.title ?? "Foundations"} — Academy ∞ | ClawGuru`
  return {
    title,
    description: copy?.tagline,
    openGraph: { title, description: copy?.tagline, url: pageUrl, type: "website" },
    alternates: buildLocalizedAlternates(locale, `/academy/${TRACK_SLUG}`),
    robots: "index, follow",
  }
}

export default function FoundationsTrackPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const c = getHubContent(locale)
  const copy = c.tracks[TRACK_SLUG]
  if (!copy) return null

  const entries = listMissionsForTrack(TRACK_SLUG)
  const totalXp = entries.reduce((s, e) => s + e.xp, 0)
  const totalMin = entries.reduce((s, e) => s + e.durationMin, 0)
  const prefix = `/${locale}`

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.1),_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
          aria-hidden
        />
        <div className="relative container mx-auto px-4 py-20 md:py-24">
          <div className="max-w-4xl mx-auto">
            <Link href={`${prefix}/academy`} className="text-xs text-gray-400 hover:text-white transition-colors mb-6 inline-flex items-center gap-2">
              ← Academy
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-300 text-[10px] font-mono tracking-[0.25em] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TRACK · FOUNDATIONS
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tight">{copy.title}</h1>
            <p className="text-lg md:text-xl text-emerald-200/80 font-medium mb-4">{copy.tagline}</p>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed mb-6">{copy.audience}</p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-gray-500">
              <span><span className="text-emerald-400">📚</span> {entries.length} missions</span>
              <span><span className="text-cyan-400">⏱️</span> ~{totalMin} min total</span>
              <span><span className="text-amber-400">⚡</span> {totalXp} XP</span>
              <span><span className="text-violet-400">🏅</span> Defender I on completion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission list */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-xs font-mono tracking-[0.3em] text-emerald-400 mb-6">MISSIONS</div>
            <ol className="space-y-4">
              {entries.map((entry) => {
                const m = getMission(entry.slug)
                if (!m) return null
                const href = `${prefix}/academy/mission/${entry.slug}`
                return (
                  <li key={entry.slug}>
                    <Link
                      href={href}
                      className="group relative block p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-emerald-400/40 hover:bg-emerald-500/[0.03] transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 grid place-items-center font-mono text-sm text-emerald-300">
                          M-{String(entry.order).padStart(3, "0")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-bold text-gray-100 mb-1 group-hover:text-emerald-300 transition-colors">
                            {m.title}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed mb-3">{m.brief}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-gray-500">
                            <span>⏱️ {entry.durationMin} min</span>
                            <span>⚡ {entry.xp} XP</span>
                            <span>🎯 {m.goals.length} goals</span>
                          </div>
                        </div>
                        <div className="hidden sm:block shrink-0 self-center text-sm font-mono text-gray-500 group-hover:text-emerald-300 transition-colors">
                          Launch →
                        </div>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ol>

            {/* Completion callout */}
            <div className="mt-10 p-5 rounded-xl border border-violet-500/20 bg-violet-500/[0.04]">
              <div className="text-[10px] font-mono tracking-[0.25em] text-violet-300 mb-2">COMPLETE ALL 5 MISSIONS</div>
              <div className="text-sm text-gray-200">
                Earn the <span className="text-violet-300 font-bold">Defender I</span> credential — a W3C Verifiable Credential signed by ClawGuru. LinkedIn-shareable, recruiter-recognized.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
