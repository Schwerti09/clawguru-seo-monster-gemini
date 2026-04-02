import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getOpenClawCopy } from "@/lib/landing-pages-i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getOpenClawCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/openclaw"),
    openGraph: { title: copy.title, description: copy.description, type: "website" },
  }
}

export default function OpenClawPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getOpenClawCopy(locale)
  const prefix = `/${locale}`
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
              <Link href={`${prefix}/check`} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
                {copy.ctaPrimary}
              </Link>
              <Link href={`${prefix}/runbooks/security`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
                {copy.ctaSecondary}
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

          <nav className="text-sm text-zinc-400 flex flex-wrap gap-4">
            <Link href={`${prefix}/methodik`} className="hover:text-cyan-300">
              {copy.methodologyLabel}
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
