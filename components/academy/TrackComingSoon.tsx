import Link from "next/link"
import { EmailCapture } from "@/components/conversion/EmailCapture"
import type { Locale } from "@/lib/i18n"
import { getHubContent } from "@/lib/academy/hubContent"

interface Props {
  locale: Locale
  slug: string
}

// Rendered for every track whose status is "soon". Single shell, consistent
// look, route is live so we can collect sitemap / interest + email captures.
export function TrackComingSoon({ locale, slug }: Props) {
  const c = getHubContent(locale)
  const copy = c.tracks[slug]
  if (!copy) return null

  const prefix = `/${locale}`

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.1),_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
          aria-hidden
        />

        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <Link href={`${prefix}/academy`} className="text-sm text-gray-400 hover:text-white transition-colors mb-8 inline-flex items-center gap-2">
              ← Academy
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-300 text-[10px] font-mono tracking-[0.25em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>{c.trackStatusLabel.soon}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
              {copy.title}
            </h1>
            <p className="text-lg md:text-xl text-violet-200/80 font-medium mb-5">{copy.tagline}</p>
            <p className="text-base text-gray-400 max-w-2xl leading-relaxed">{copy.audience}</p>
          </div>
        </div>
      </section>

      {/* Mission preview list */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-mono tracking-[0.3em] text-cyan-400 mb-6">MISSIONS IN THIS TRACK</h2>
            <ol className="space-y-3">
              {copy.bullets.map((b, i) => (
                <li key={i} className="flex gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-lg hover:border-violet-500/30 transition-colors">
                  <span className="font-mono text-sm text-violet-400 shrink-0 w-8">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-gray-200">{b}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-transparent to-violet-950/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-gray-100 mb-3">{c.ctaSoon}</h2>
            <p className="text-sm text-gray-400">
              Live tracks: <Link href={`${prefix}/academy/beginner`} className="text-emerald-300 hover:underline">Foundations</Link>{" · "}
              <Link href={`${prefix}/academy/intermediate`} className="text-blue-300 hover:underline">Stack Hardening</Link>{" · "}
              <Link href={`${prefix}/academy/advanced`} className="text-red-300 hover:underline">AI Agent Security</Link>
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <EmailCapture locale={locale} source={`academy_track_${slug}`} variant="card" />
          </div>
        </div>
      </section>
    </div>
  )
}
