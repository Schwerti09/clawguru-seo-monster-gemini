import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { AttackTimeline } from "@/components/breaches/AttackTimeline"
import { getScenario, listScenarioSlugs } from "@/lib/breaches"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"

export const revalidate = 3600
export const dynamic = "force-static"

export async function generateStaticParams() {
  const slugs = listScenarioSlugs()
  return SUPPORTED_LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })))
}

export async function generateMetadata(
  { params }: { params: { lang: string; slug: string } }
): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const s = getScenario(params.slug)
  if (!s) return { title: "Scenario not found | ClawGuru" }

  const pageUrl = `${SITE_URL}/${locale}/breaches/${params.slug}`
  const title = `${s.title} — Interactive re-enactment | ClawGuru`

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.title,
    description: s.summary,
    datePublished: s.disclosed,
    author: { "@type": "Organization", name: "ClawGuru" },
    publisher: { "@type": "Organization", name: "ClawGuru", url: SITE_URL },
    mainEntityOfPage: pageUrl,
  }

  return {
    title,
    description: s.summary,
    openGraph: { title, description: s.summary, url: pageUrl, type: "article" },
    alternates: buildLocalizedAlternates(locale, `/breaches/${params.slug}`),
    robots: "index, follow",
    other: { "application/ld+json": JSON.stringify(articleSchema) },
  }
}

export default function BreachScenarioPage({ params }: { params: { lang: string; slug: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const scenario = getScenario(params.slug)
  if (!scenario) notFound()

  return (
    <div className="min-h-screen bg-[#05070a] text-gray-100">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(239,68,68,0.12),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "80px 80px" }}
          aria-hidden
        />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <Link href={`/${locale}/breaches`} className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 mb-5">← Attack Cinema</Link>
            <div className="flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] mb-5">
              {scenario.cve && <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-300">{scenario.cve}</span>}
              {scenario.cvss && <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-red-300">CVSS {scenario.cvss}</span>}
              <span className="text-gray-500">{scenario.disclosed}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 tracking-tight">
              {scenario.title}
            </h1>
            <p className="text-lg md:text-2xl text-red-200/80 font-medium mb-5">{scenario.subtitle}</p>
            <p className="text-sm md:text-base text-gray-400 max-w-3xl leading-relaxed">{scenario.summary}</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <AttackTimeline scenario={scenario} />
        </div>
      </section>
    </div>
  )
}
