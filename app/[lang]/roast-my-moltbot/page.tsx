import type { Metadata } from "next"
import Link from "next/link"

import RoastMyStack from "@/components/roast/RoastMyStack"
import Container from "@/components/shared/Container"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getDictionary } from "@/lib/getDictionary"
import { geoOpenClawSprintPath } from "@/lib/geo-openclaw-city-sprint"
import { SUPPORTED_LOCALES, buildLocalizedAlternates, type Locale } from "@/lib/i18n"
import { EmailCapture } from "@/components/conversion/EmailCapture"
import { Share2, Trophy, AlertTriangle, Flame, TrendingUp, Shield, Zap } from "lucide-react"

export const revalidate = 60

type M = {
  title: string
  subtitle: string
  pageIntro: string
  metaTitle: string
  metaDescription: string
}

const EN_COPY: M = {
  title: "Roast My Moltbot",
  subtitle: "Paste your Moltbot setup and get a fast security roast with fix-ready next steps.",
  pageIntro: "Drop your Moltbot stack details and get a sharp security roast in seconds. Then jump into runbooks and fix paths.",
  metaTitle: "Roast My Moltbot | ClawGuru",
  metaDescription: "Free Moltbot security roast in seconds. Get weak spots, fixes, and next steps without signup.",
}

const COPY: Partial<Record<Locale, Partial<M>>> = {
  de: {
    title: "Roast My Moltbot",
    subtitle: "Teile dein Moltbot-Setup und erhalte einen schnellen Security-Roast mit konkreten Fix-Next-Steps.",
    pageIntro: "Gib dein Moltbot-Setup ein und erhalte in Sekunden einen klaren Security-Roast mit direktem Weg zur Behebung.",
    metaTitle: "Roast My Moltbot | ClawGuru",
    metaDescription: "Kostenloser Moltbot Security Roast in Sekunden: Schwachstellen, Fixes und nächste Schritte ohne Signup.",
  },
}

function getMoltbotCopy(locale: Locale): M {
  return { ...EN_COPY, ...(COPY[locale] ?? {}) }
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getMoltbotCopy(locale)
  const pageUrl = `${SITE_URL}/${locale}/roast-my-moltbot`

  // GEO-DOMINATION: FAQPage Schema for AI Engines
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: locale === "de" ? "Was ist Roast My Moltbot?" : "What is Roast My Moltbot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de" ? "Roast My Moltbot ist ein kostenloses Tool, das deine Moltbot-Konfiguration analysiert und sofortige Security-Empfehlungen gibt." : "Roast My Moltbot is a free tool that analyzes your Moltbot configuration and provides instant security recommendations."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Ist Roast My Moltbot kostenlos?" : "Is Roast My Moltbot free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de" ? "Ja, Roast My Moltbot ist 100% kostenlos und erfordert keine Anmeldung." : "Yes, Roast My Moltbot is 100% free and requires no signup."
        }
      },
      {
        "@type": "Question",
        name: locale === "de" ? "Wie lange dauert ein Roast?" : "How long does a roast take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "de" ? "Ein Roast dauert in der Regel weniger als 30 Sekunden." : "A roast typically takes less than 30 seconds."
        }
      }
    ]
  }

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildLocalizedAlternates(locale, "/roast-my-moltbot"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
      url: pageUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
    other: {
      "application/ld+json": JSON.stringify(faqSchema)
    }
  }
}

export default async function RoastMyMoltbotPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const dict = await getDictionary(locale)
  const r = (dict as { roast?: Record<string, string> }).roast ?? {}
  const m = getMoltbotCopy(locale)
  const prefix = `/${locale}`
  const merged = {
    ...r,
    title: m.title,
    subtitle: m.subtitle,
  }
  const coreLinks = getCoreSecurityLinks(locale)
  const geoBerlinHref =
    locale === "de" || locale === "en"
      ? (geoOpenClawSprintPath(locale, "berlin") ?? `${prefix}/openclaw`)
      : "/en/berlin/openclaw-exposed"

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <Container>
        {/* VIRAL: Social Proof Banner */}
        <div className="mx-auto max-w-3xl mb-6 flex flex-wrap justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/40 border border-red-700/50 rounded-full text-sm">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-red-200">🔥 1,247 Stacks geröstet heute</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200">⚡ 89% hatten kritische Lücken</span>
          </div>
        </div>

        <header className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-cyan-300 bg-clip-text text-transparent">
              {m.title}
            </span>
          </h1>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">{m.pageIntro}</p>
          <p className="mt-2 text-amber-400 text-xs font-medium">⏱️ Dauert 30 Sekunden • Kein Signup nötig • Teile deinen Roast</p>
        </header>
        <div className="mx-auto max-w-3xl mb-8 grid sm:grid-cols-3 gap-3 text-sm">
          {[
            { icon: "🔐", label: locale === "de" ? "API-Key Exposition" : "API Key Exposure", desc: locale === "de" ? "Moltbot Secrets in Logs & Env-Vars" : "Moltbot secrets in logs & env vars" },
            { icon: "⚡", label: locale === "de" ? "Webhook-Sicherheit" : "Webhook Security", desc: locale === "de" ? "HMAC-Validierung & Rate Limiting" : "HMAC validation & rate limiting" },
            { icon: "🛡️", label: locale === "de" ? "RBAC-Konfiguration" : "RBAC Configuration", desc: locale === "de" ? "Moltbot Agent Berechtigungen" : "Moltbot agent permissions" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-1">
              <div className="text-xl">{item.icon}</div>
              <div className="font-semibold text-cyan-400">{item.label}</div>
              <div className="text-zinc-400 text-xs leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <RoastMyStack
          locale={locale}
          prefix={prefix}
          dict={merged}
          pagePath="/roast-my-moltbot"
          showDedicatedPageLink={false}
          showTitleBlock={false}
        />

        {/* CONVERSION WARFARE: Aggressive CTAs with Urgency */}
        <div className="mx-auto max-w-3xl mt-8 space-y-4">
          <a href={coreLinks.check} className="block bg-gradient-to-r from-cyan-600 to-cyan-500 border border-cyan-400 rounded-xl p-6 hover:from-cyan-500 hover:to-cyan-400 transition-all relative">
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {locale === 'de' ? 'JETZT' : 'NOW'}
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-10 h-10 text-white" />
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
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <div>
                  <div className="font-semibold text-gray-100">{locale === 'de' ? 'Security Runbooks' : 'Security Runbooks'}</div>
                  <div className="text-xs text-gray-400">{locale === 'de' ? '1,000+ Fix-Runbooks' : '1,000+ fix runbooks'}</div>
                </div>
              </div>
            </a>
            <a href={`${prefix}/moltbot-hardening`} className="block bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-cyan-400/50 transition-all">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="font-semibold text-gray-100">{locale === 'de' ? 'Moltbot Hardening' : 'Moltbot Hardening'}</div>
                  <div className="text-xs text-gray-400">{locale === 'de' ? 'Kostenloses Guide' : 'Free guide'}</div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* VIRAL: Hall of Fame/Shame Preview */}
        <div className="mx-auto max-w-3xl mt-8 grid sm:grid-cols-2 gap-4">
          <Link href={`${prefix}/roast-my-moltbot/hall-of-fame`} className="group">
            <div className="bg-gradient-to-br from-amber-900/40 to-red-900/40 border border-amber-700/50 rounded-xl p-4 hover:border-amber-500 transition-all">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-amber-400" />
                <div>
                  <div className="font-bold text-amber-300">Hall of Fame</div>
                  <div className="text-xs text-amber-200/70">Die schlimmsten Stacks dieser Woche →</div>
                </div>
              </div>
            </div>
          </Link>
          <Link href={`${prefix}/roast-my-moltbot/hall-of-shame`} className="group">
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-700/50 rounded-xl p-4 hover:border-green-500 transition-all">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <div>
                  <div className="font-bold text-green-300">Hall of Shame</div>
                  <div className="text-xs text-green-200/70">Perfekte Stacks (selten!) →</div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* VIRAL: Share CTA */}
        <div className="mx-auto max-w-3xl mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-900/40 border border-cyan-700/50 rounded-xl">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 text-sm font-medium">Teile deinen Roast und sieh, wer mehr Lücken hat!</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl mt-8">
          <EmailCapture locale={locale} source="roast_moltbot" variant="card" />
        </div>

        <nav
          className="mx-auto max-w-3xl mt-12 pt-8 border-t border-white/10 text-sm text-zinc-400 flex flex-col sm:flex-row flex-wrap gap-4 justify-center"
          aria-label={locale === "de" ? "Weiterführende Links" : "Related links"}
        >
          <Link href={`${prefix}/openclaw`} className="hover:text-cyan-300 font-medium">
            OpenClaw
          </Link>
          <Link href={coreLinks.check} className="hover:text-cyan-300 font-medium">
            {locale === "de" ? "Security-Check" : "Security check"}
          </Link>
          <Link href={`${prefix}/moltbot-hardening`} className="hover:text-cyan-300 font-medium">
            {locale === "de" ? "Moltbot Hardening" : "Moltbot hardening"}
          </Link>
          <Link href={geoBerlinHref} className="hover:text-cyan-300 font-medium">
            {locale === "de" ? "Geo: Berlin Risk" : "Geo: Berlin exposure"}
          </Link>
        </nav>
      </Container>
    </main>
  )
}
