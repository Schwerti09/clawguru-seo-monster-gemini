import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"
import { getOpenClawCheckCopy } from "@/lib/landing-pages-i18n"
import GeoOpenClawSprintHubSection from "@/components/marketing/GeoOpenClawSprintHubSection"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getOpenClawCheckCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/openclaw-security-check"),
    openGraph: { title: copy.title, description: copy.description, type: "website" },
  }
}

export default function OpenClawSecurityCheckPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getOpenClawCheckCopy(locale)
  const cro = getHomepageCroCopy(locale)
  const prefix = `/${locale}`
  const coreLinks = getCoreSecurityLinks(locale)
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.h1,
    description: copy.description,
    url: `${prefix}/openclaw-security-check`,
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <Container>
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">OpenClaw Check</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300">{copy.sub}</p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
                {copy.ctaPrimary}
              </Link>
              <Link href={`${prefix}/runbooks/security`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
                {copy.ctaSecondary}
              </Link>
            </div>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-zinc-300 space-y-3">
            <h2 className="text-xl font-black text-white">{copy.sectionTitle}</h2>
            <p>{copy.sectionBodyA}</p>
            <p>{copy.sectionBodyB}</p>
          </section>

          <GeoOpenClawSprintHubSection locale={locale} prefix={prefix} />

          <nav className="text-sm text-zinc-400 flex flex-wrap justify-center gap-4">
            <Link href={coreLinks.methodology} className="hover:text-cyan-300">
              {copy.methodologyLabel}
            </Link>
            <Link href={coreLinks.openclaw} className="hover:text-cyan-300">
              {copy.secondaryLabel}
            </Link>
            <Link href={coreLinks.moltbotHardening} className="hover:text-cyan-300">
              {cro.lpMoltbotTitle}
            </Link>
            <Link href={coreLinks.aiAgentSecurity} className="hover:text-cyan-300">
              {cro.lpAiTitle}
            </Link>
            <Link href={coreLinks.roastMyMoltbot} className="hover:text-cyan-300">
              {cro.heroTertiary}
            </Link>
          </nav>
        </div>
      </Container>
    </main>
  )
}
