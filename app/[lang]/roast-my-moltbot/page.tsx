import type { Metadata } from "next"
import Link from "next/link"

import RoastMyStack from "@/components/roast/RoastMyStack"
import Container from "@/components/shared/Container"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getDictionary } from "@/lib/getDictionary"
import { geoOpenClawSprintPath } from "@/lib/geo-openclaw-city-sprint"
import { SUPPORTED_LOCALES, getLocaleHrefLang, localeAlternates, type Locale } from "@/lib/i18n"

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

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getMoltbotCopy(locale)
  const alternates = localeAlternates("/roast-my-moltbot")
  const hrefLang = getLocaleHrefLang(locale)
  const canonical = alternates.languages[hrefLang] ?? alternates.canonical

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical, languages: alternates.languages },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
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
        <header className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-cyan-300 bg-clip-text text-transparent">
              {m.title}
            </span>
          </h1>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">{m.pageIntro}</p>
        </header>
        <RoastMyStack
          locale={locale}
          prefix={prefix}
          dict={merged}
          pagePath="/roast-my-moltbot"
          showDedicatedPageLink={false}
          showTitleBlock={false}
        />

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
