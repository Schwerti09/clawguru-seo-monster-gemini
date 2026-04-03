import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getHomepageCroCopy } from "@/lib/homepage-cro-i18n"
import { getAiAgentCopy } from "@/lib/landing-pages-i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getAiAgentCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/ai-agent-security"),
    openGraph: { title: copy.title, description: copy.description, type: "website" },
  }
}

export default function AIAgentSecurityPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getAiAgentCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.h1,
    description: copy.description,
    url: `${prefix}/ai-agent-security`,
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <Container>
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">AI Agent Security</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.sub}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.sectionTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>- {copy.sectionBodyA}</li>
              <li>- {copy.sectionBodyB}</li>
            </ul>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
              {copy.ctaPrimary}
            </Link>
            <Link href={coreLinks.runbooksSecurity} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaSecondary}
            </Link>
            <Link href={coreLinks.roastMyMoltbot} className="rounded-xl border border-amber-400/40 px-5 py-3 text-sm font-semibold text-amber-100">
              {cro.heroTertiary}
            </Link>
            <Link href={coreLinks.methodology} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.methodologyLabel}
            </Link>
          </div>

          <nav className="text-sm text-zinc-400 flex flex-wrap gap-4 pt-2 border-t border-white/5">
            <Link href={coreLinks.openclaw} className="hover:text-cyan-300">
              {cro.lpOpenclawTitle}
            </Link>
            <Link href={coreLinks.openclawSecurityCheck} className="hover:text-cyan-300">
              {cro.lpCheckTitle}
            </Link>
            <Link href={coreLinks.moltbotHardening} className="hover:text-cyan-300">
              {cro.lpMoltbotTitle}
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
