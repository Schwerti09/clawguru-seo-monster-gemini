import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { EmailCapture } from "@/components/conversion/EmailCapture"
import { TRACKS, getHubContent } from "@/lib/academy/hubContent"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const c = getHubContent(locale)
  const pageUrl = `${SITE_URL}/${locale}/academy`

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.meta.title,
    description: c.meta.description,
    provider: {
      "@type": "Organization",
      name: "ClawGuru",
      sameAs: SITE_URL,
    },
    hasCourseInstance: TRACKS.filter((t) => t.status === "live").map((t) => ({
      "@type": "CourseInstance",
      name: c.tracks[t.slug]?.title,
      courseMode: "online",
      url: `${SITE_URL}/${locale}/academy/${t.slug}`,
    })),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: "Academy", item: pageUrl },
    ],
  }

  return {
    title: c.meta.title,
    description: c.meta.description,
    openGraph: {
      title: c.meta.title,
      description: c.meta.description,
      type: "website",
      url: pageUrl,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ClawGuru Academy ∞" }],
    },
    alternates: buildLocalizedAlternates(locale, "/academy"),
    robots: "index, follow",
    other: {
      "application/ld+json": JSON.stringify([courseSchema, breadcrumbSchema]),
    },
  }
}

// Accent → Tailwind class map. Explicit, so Tailwind's JIT keeps them.
const ACCENT: Record<string, { border: string; hoverBorder: string; bg: string; ring: string; text: string; chip: string; cta: string }> = {
  emerald:{ border: "border-emerald-700/60", hoverBorder: "hover:border-emerald-400",  bg: "bg-emerald-950/40",  ring: "ring-emerald-500/10", text: "text-emerald-300",  chip: "bg-emerald-900/60 text-emerald-200", cta: "bg-emerald-500 text-black hover:bg-emerald-400" },
  blue:   { border: "border-blue-700/60",    hoverBorder: "hover:border-blue-400",     bg: "bg-blue-950/40",     ring: "ring-blue-500/10",    text: "text-blue-300",     chip: "bg-blue-900/60 text-blue-200",       cta: "bg-blue-500 text-black hover:bg-blue-400" },
  red:    { border: "border-red-700/60",     hoverBorder: "hover:border-red-400",      bg: "bg-red-950/40",      ring: "ring-red-500/10",     text: "text-red-300",      chip: "bg-red-900/60 text-red-200",         cta: "bg-red-500 text-black hover:bg-red-400" },
  cyan:   { border: "border-cyan-700/60",    hoverBorder: "hover:border-cyan-400",     bg: "bg-cyan-950/40",     ring: "ring-cyan-500/10",    text: "text-cyan-300",     chip: "bg-cyan-900/60 text-cyan-200",       cta: "bg-cyan-500 text-black hover:bg-cyan-400" },
  amber:  { border: "border-amber-700/60",   hoverBorder: "hover:border-amber-400",    bg: "bg-amber-950/40",    ring: "ring-amber-500/10",   text: "text-amber-300",    chip: "bg-amber-900/60 text-amber-200",     cta: "bg-amber-500 text-black hover:bg-amber-400" },
  violet: { border: "border-violet-700/60",  hoverBorder: "hover:border-violet-400",   bg: "bg-violet-950/40",   ring: "ring-violet-500/10",  text: "text-violet-300",   chip: "bg-violet-900/60 text-violet-200",   cta: "bg-violet-500 text-black hover:bg-violet-400" },
  pink:   { border: "border-pink-700/60",    hoverBorder: "hover:border-pink-400",     bg: "bg-pink-950/40",     ring: "ring-pink-500/10",    text: "text-pink-300",     chip: "bg-pink-900/60 text-pink-200",       cta: "bg-pink-500 text-black hover:bg-pink-400" },
  lime:   { border: "border-lime-700/60",    hoverBorder: "hover:border-lime-400",     bg: "bg-lime-950/40",     ring: "ring-lime-500/10",    text: "text-lime-300",     chip: "bg-lime-900/60 text-lime-200",       cta: "bg-lime-500 text-black hover:bg-lime-400" },
}

export default async function AcademyPage({ params }: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const c = getHubContent(locale)
  const prefix = `/${locale}`

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background layers — atmospheric */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(244,63,94,0.08),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-screen"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)" }}
          aria-hidden
        />

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-300 text-xs font-mono tracking-wider mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{c.hero.badge}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-8">
              <span className="text-gray-100">{c.hero.headline}</span>{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 via-cyan-300 to-violet-400">
                {c.hero.headlineAccent}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-300/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              {c.hero.sub}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-400 font-mono">
              <span className="flex items-center gap-2"><span className="text-emerald-400">🌍</span> {c.hero.stats.langs}</span>
              <span className="flex items-center gap-2"><span className="text-cyan-400">📚</span> {c.hero.stats.missions}</span>
              <span className="flex items-center gap-2"><span className="text-violet-400">💰</span> {c.hero.stats.free}</span>
              <span className="flex items-center gap-2"><span className="text-amber-400">🔓</span> {c.hero.stats.noSignup}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ NOTICE ═══════════════ */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-amber-900/20 border-l-4 border-amber-500 px-6 py-4 rounded-r-lg text-sm text-amber-100/90">
            <strong className="font-bold text-amber-200">{c.notice.label}</strong>{" "}
            {c.notice.body}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED MISSION (Live POC) ═══════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href={`${prefix}/academy/mission/nginx-hsts`}
            className="block max-w-5xl mx-auto group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-[#07090c] to-cyan-500/5 hover:border-emerald-400/40 transition-all"
          >
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(110,231,183,0.4) 0px, rgba(110,231,183,0.4) 1px, transparent 1px, transparent 3px)" }}
              aria-hidden
            />
            <div className="relative p-8 md:p-10 grid md:grid-cols-[auto_1fr_auto] items-center gap-6">
              <div className="text-5xl">🖥️</div>
              <div>
                <div className="text-[10px] font-mono tracking-[0.3em] text-emerald-300 mb-2">
                  LIVE RANGE · PLAYABLE NOW · NO SIGNUP
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-100 mb-2">
                  Mission M-001 — Ship HSTS before the crawler comes
                </h3>
                <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                  Browser-native terminal. Simulated nginx 1.24 on Ubuntu 22.04. 60 seconds to fix a broken security header before a compliance crawler hits production.
                </p>
              </div>
              <div className="shrink-0 hidden md:block">
                <div className="font-mono text-xs px-5 py-3 rounded-lg bg-emerald-500 text-black font-black group-hover:bg-emerald-400 transition-colors">
                  LAUNCH →
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════ TRACK GRID ═══════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto mb-12 text-center">
            <div className="text-xs font-mono tracking-[0.3em] text-cyan-400 mb-3">{c.sections.tracksEyebrow}</div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-100 mb-4">{c.sections.tracksTitle}</h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">{c.sections.tracksSub}</p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {TRACKS.map((t) => {
              const copy = c.tracks[t.slug]
              if (!copy) return null
              const a = ACCENT[t.accent] ?? ACCENT.emerald
              const href = t.status === "live" ? `${prefix}/academy/${t.slug}` : `${prefix}/academy/${t.slug}`
              const statusLabel = c.trackStatusLabel[t.status]
              const cta = t.status === "live" ? c.ctaStart : c.ctaSoon
              const missionLabel = c.missionCount.replace("{n}", String(t.missionCount))

              return (
                <Link
                  key={t.slug}
                  href={href}
                  className={`group relative flex flex-col ${a.bg} border ${a.border} ${a.hoverBorder} ring-1 ${a.ring} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_-10px_currentColor] overflow-hidden`}
                  aria-label={`${copy.title} — ${statusLabel}`}
                >
                  {/* status pill */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-3xl">{t.icon}</div>
                    <span className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded ${a.chip}`}>{statusLabel}</span>
                  </div>

                  <h3 className="text-xl font-black text-gray-100 mb-1">{copy.title}</h3>
                  <p className={`text-sm font-medium ${a.text} mb-3`}>{copy.tagline}</p>

                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">{copy.audience}</p>

                  <ul className="text-xs text-gray-300/90 space-y-1.5 mb-5 list-none flex-1">
                    {copy.bullets.slice(0, 5).map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className={a.text}>▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                    {copy.bullets.length > 5 && (
                      <li className="text-gray-500 italic">+ {copy.bullets.length - 5} more</li>
                    )}
                  </ul>

                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 mb-4">
                    <span>{missionLabel}</span>
                    {copy.badge && <span className={a.text}>{copy.badge}</span>}
                  </div>

                  <div className={`text-center py-2.5 rounded-lg font-bold text-sm ${t.status === "live" ? a.cta : "bg-white/5 text-gray-400 hover:bg-white/10"} transition-colors`}>
                    {cta}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ ARSENAL TEASER ═══════════════ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href={`${prefix}/tools`}
            className="block max-w-5xl mx-auto group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-[#05070a] to-violet-500/5 hover:border-cyan-400/40 transition-all"
          >
            <div className="p-8 md:p-10 grid md:grid-cols-[auto_1fr_auto] items-center gap-6">
              <div className="text-5xl">🛠️</div>
              <div>
                <div className="text-[10px] font-mono tracking-[0.3em] text-cyan-300 mb-2">THE ARSENAL · 15 FREE TOOLS</div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-100 mb-2">
                  Header Doctor · TLS X-Ray · Prompt Injection Sandbox · and more
                </h3>
                <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
                  Inline security tools that run in your browser. No signups. No data retention. Paste, run, copy the fix.
                </p>
              </div>
              <div className="shrink-0 hidden md:block">
                <div className="font-mono text-xs px-5 py-3 rounded-lg bg-cyan-500 text-black font-black group-hover:bg-cyan-400 transition-colors">
                  OPEN →
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════════════ STORY TEASER ═══════════════ */}
      <section className="py-20 relative overflow-hidden border-y border-white/5 bg-gradient-to-br from-violet-950/30 via-[#05070a] to-cyan-950/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-xs font-mono tracking-[0.3em] text-violet-300 mb-3">{c.story.eyebrow}</div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-100 mb-6">{c.story.title}</h2>
            <p className="text-base md:text-lg text-gray-300/90 max-w-2xl mx-auto mb-8 leading-relaxed">{c.story.body}</p>
            <Link
              href={`${prefix}/academy/story`}
              className="inline-block bg-gradient-to-r from-violet-500 to-cyan-500 text-black font-black text-sm tracking-wider px-7 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              {c.story.cta} →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER CTA ═══════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-gray-100 mb-4">{c.footer.title}</h2>
            <p className="text-base md:text-lg text-gray-400 mb-8 max-w-2xl mx-auto">{c.footer.sub}</p>
            <Link
              href={`${prefix}/consulting`}
              className="inline-block bg-white text-black font-black px-7 py-3.5 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {c.footer.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <EmailCapture locale={locale} source="academy_page" variant="card" />
          </div>
        </div>
      </section>
    </div>
  )
}
