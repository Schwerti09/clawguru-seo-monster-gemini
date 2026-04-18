import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"
import {
  GEO_OPENCLAW_SPRINT_CITIES,
  GEO_OPENCLAW_SPRINT_CITY_LABELS,
  geoOpenClawSprintPath,
} from "@/lib/geo-openclaw-city-sprint"
import { getOpenClawCopy } from "@/lib/landing-pages-i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getOpenClawCopy(locale)
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/openclaw"),
    openGraph: {
      images: ["/og-image.png"], title: copy.title, description: copy.description, type: "website", url: `${SITE_URL}/${locale}/openclaw` },
  }
}

export default function OpenClawPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getOpenClawCopy(locale)
  const cro = getHomepageCroCopy(locale)
  const prefix = `/${locale}`
  const coreLinks = getCoreSecurityLinks(locale)
  const showGeoCityHub = locale === "de" || locale === "en"
  const pageUrl = `${prefix}/openclaw`
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.h1,
    description: copy.description,
    url: pageUrl,
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: copy.faqPentestQ,
        acceptedAnswer: {
          "@type": "Answer",
          text: copy.faqPentestA,
        },
      },
      {
        "@type": "Question",
        name: copy.faqNextQ,
        acceptedAnswer: {
          "@type": "Answer",
          text: copy.faqNextA,
        },
      },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Container>
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">OpenClaw Ops</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.sub}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
                {copy.ctaPrimary}
              </Link>
              <Link href={coreLinks.runbooksSecurity} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
                {copy.ctaSecondary}
              </Link>
              <Link href={coreLinks.roastMyMoltbot} className="rounded-xl border border-amber-400/35 px-5 py-3 text-sm font-semibold text-amber-100">
                {cro.heroTertiary}
              </Link>
            </div>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.problemsTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.problems.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.howTitle}</h2>
            <ol className="space-y-2 text-zinc-300 text-sm list-decimal pl-5">
              {copy.how.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-zinc-500">{copy.note}</p>
          </section>

          {/* CONVERSION WARFARE ROUND 4: Aggressive CTAs with Urgency */}
          <div className="space-y-4">
            <a href={coreLinks.check} className="block bg-gradient-to-r from-cyan-600 to-cyan-500 border border-cyan-400 rounded-xl p-6 hover:from-cyan-500 hover:to-cyan-400 transition-all relative">
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                {locale === 'de' ? 'JETZT' : 'NOW'}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl">🛡️</div>
                <div>
                  <div className="font-bold text-white text-lg">
                    {locale === 'de' ? '🛡️ Vollständiger Security-Check' : '🛡️ Full Security Check'}
                  </div>
                  <div className="text-cyan-100 text-sm">
                    {locale === 'de' ? 'Deine gesamte Infrastruktur in 30 Sekunden prüfen' : 'Check your entire infrastructure in 30 seconds'}
                  </div>
                </div>
              </div>
            </a>

            <div className="grid sm:grid-cols-2 gap-4">
              <a href={`${prefix}/runbooks`} className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📚</div>
                  <div>
                    <div className="font-semibold text-cyan-400">{locale === 'de' ? 'Security Runbooks' : 'Security Runbooks'}</div>
                    <div className="text-xs text-gray-400">{locale === 'de' ? '1,000+ Fix-Runbooks' : '1,000+ fix runbooks'}</div>
                  </div>
                </div>
              </a>
              <a href={`${prefix}/roast-my-moltbot`} className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-amber-400/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔥</div>
                  <div>
                    <div className="font-semibold text-amber-400">{locale === 'de' ? 'Roast My Moltbot' : 'Roast My Moltbot'}</div>
                    <div className="text-xs text-gray-400">{locale === 'de' ? 'Kostenloser Security-Roast' : 'Free security roast'}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {showGeoCityHub ? (
            <section className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6">
              <h2 className="text-xl font-black text-white mb-2">
                {locale === "de" ? "Stadt-Sprint: Risk & Exposition" : "City sprint: risk & exposure"}
              </h2>
              <p className="text-sm text-zinc-400 mb-4">
                {locale === "de"
                  ? "Geo-Seiten mit Heatmap-Kontext, Free-Check-CTA und Fix-Pfaden—Start z. B. in Berlin oder München."
                  : "Geo pages with heatmap context, free check CTAs, and fix paths—start in Berlin or Munich."}
              </p>
              <div className="flex flex-wrap gap-2">
                {GEO_OPENCLAW_SPRINT_CITIES.map((city) => {
                  const href = geoOpenClawSprintPath(locale, city)
                  if (!href) return null
                  const label = GEO_OPENCLAW_SPRINT_CITY_LABELS[city][locale === "de" ? "de" : "en"]
                  return (
                    <Link
                      key={city}
                      href={href}
                      className="rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-cyan-400/50 hover:text-cyan-200"
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </section>
          ) : null}

          <nav className="text-sm text-zinc-400 flex flex-wrap gap-4">
            <Link href={coreLinks.methodology} className="hover:text-cyan-300">
              {copy.methodologyLabel}
            </Link>
            <Link href={coreLinks.openclawSecurityCheck} className="hover:text-cyan-300">
              {cro.lpCheckTitle}
            </Link>
            <Link href={coreLinks.moltbotHardening} className="hover:text-cyan-300">
              {cro.lpMoltbotTitle}
            </Link>
            <Link href={coreLinks.aiAgentSecurity} className="hover:text-cyan-300">
              {cro.lpAiTitle}
            </Link>
            <Link href={`${prefix}/runbooks/cloud`} className="hover:text-cyan-300">
              {copy.runbooksLabel}
            </Link>
          </nav>
        </div>
      </Container>
    </main>
  )
}
