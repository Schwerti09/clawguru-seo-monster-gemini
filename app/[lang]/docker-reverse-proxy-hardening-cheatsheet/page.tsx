import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getDockerProxyCopy } from "@/lib/content-docker-reverse-proxy-hardening-i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getDockerProxyCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/docker-reverse-proxy-hardening-cheatsheet"),
    openGraph: {
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function DockerReverseProxyCheatsheetPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getDockerProxyCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/docker-reverse-proxy-hardening-cheatsheet`,
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">Docker Proxy Hardening</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.checklistTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.checklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.configTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.configItems.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.verifyTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.verify.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-zinc-500">{copy.disclaimer}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
              {copy.ctaCheck}
            </Link>
            <Link href={`${prefix}/moltbot-hardening`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaMoltbot}
            </Link>
            <Link href={`${prefix}/openclaw`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaOpenclaw}
            </Link>
            <Link href={coreLinks.methodology} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaMethodik}
            </Link>
          </div>
        </article>
      </Container>
    </main>
  )
}
