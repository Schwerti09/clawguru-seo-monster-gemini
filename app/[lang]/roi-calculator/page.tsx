import type { Metadata } from "next"
import Link from "next/link"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import RoiCalculator from "@/components/roi/RoiCalculator"
import AuthorBox from "@/components/seo/AuthorBox"
import LastUpdated from "@/components/seo/LastUpdated"
import { buildAuthoredArticleSchema } from "@/lib/seo/author"

interface PageProps { params: { lang: string } }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clawguru.org"
const PATH = "/roi-calculator"
const PUBLISHED = "2026-04-20"
const MODIFIED = "2026-04-20"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"
  const pageUrl = `${SITE_URL}/${locale}${PATH}`
  const title = isDE
    ? "Security ROI-Rechner — Was kosten Incidents ohne Runbooks? | ClawGuru"
    : "Security ROI Calculator — What do incidents cost without runbooks? | ClawGuru"
  const description = isDE
    ? "Berechne in 30 Sekunden, wie viel dich Security-Incidents und Compliance-Vorbereitung ohne Runbooks kosten. Konservative Annahmen, transparente Formel."
    : "Calculate in 30 seconds how much security incidents and compliance prep cost you without runbooks. Conservative assumptions, transparent formula."
  return {
    title,
    description,
    keywords: ["security roi calculator", "incident cost calculator", "mttr calculator", "soc 2 roi", "dora roi"],
    authors: [{ name: "ClawGuru Security Team" }],
    openGraph: { title, description, type: "article", url: pageUrl, images: ["/og-image.png"] },
    alternates: buildLocalizedAlternates(locale, PATH),
    robots: "index, follow",
  }
}

export default function RoiCalculatorPage({ params }: PageProps) {
  const locale = (SUPPORTED_LOCALES.includes(params.lang as Locale) ? params.lang : "de") as Locale
  const isDE = locale === "de"

  const articleSchema = buildAuthoredArticleSchema({
    headline: isDE
      ? "Security ROI-Rechner — Was kosten Incidents ohne Runbooks?"
      : "Security ROI Calculator — What do incidents cost without runbooks?",
    description: isDE
      ? "Interaktiver Rechner für Security-Team-Kosten. MTTR-Reduktion, Compliance-Automatisierung, 3-Jahres-ROI."
      : "Interactive calculator for security team costs. MTTR reduction, compliance automation, 3-year ROI.",
    url: `${SITE_URL}/${locale}${PATH}`,
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    inLanguage: locale,
    articleType: "Article",
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href={`/${locale}`} className="hover:text-cyan-400">ClawGuru</Link></li>
            <li>/</li>
            <li className="text-gray-300">{isDE ? "ROI-Rechner" : "ROI Calculator"}</li>
          </ol>
        </nav>

        <div className="mb-10">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            {isDE ? "Transparent · Konservativ · Shareable" : "Transparent · Conservative · Shareable"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
            {isDE
              ? "Was kosten dich Security-Incidents wirklich?"
              : "What do security incidents really cost you?"}
          </h1>
          <LastUpdated date={MODIFIED} publishedDate={PUBLISHED} showPublished locale={locale} className="mb-4" />
          <p className="text-lg text-gray-300 max-w-3xl">
            {isDE
              ? "Die meisten Teams unterschätzen den echten Kosten-Impact von Incidents und Compliance-Arbeit um den Faktor 3-5. Hier siehst du konkrete Zahlen für dein Team — in 30 Sekunden."
              : "Most teams underestimate the real cost impact of incidents and compliance work by 3-5×. See concrete numbers for your team — in 30 seconds."}
          </p>
        </div>

        <RoiCalculator locale={locale} source="roi_calculator_page" />

        {/* Methodology */}
        <section className="mt-12 mb-10 bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {isDE ? "Methodik — Wie wir rechnen" : "Methodology — how we calculate"}
          </h2>
          <div className="space-y-4 text-sm text-gray-300">
            <div>
              <div className="font-semibold text-cyan-300 mb-1">
                {isDE ? "MTTR-Reduktion: 65%" : "MTTR reduction: 65%"}
              </div>
              <p>
                {isDE
                  ? "Expert-reviewte Runbooks eliminieren Research-Zeit bei Incidents. Branchen-Benchmarks (Atlassian, PagerDuty, Gartner) zeigen 50-80% MTTR-Reduktion durch standardisierte Response-Prozesse. Wir rechnen konservativ mit 65%."
                  : "Expert-reviewed runbooks eliminate research time during incidents. Industry benchmarks (Atlassian, PagerDuty, Gartner) show 50-80% MTTR reduction via standardized response. We use a conservative 65%."}
              </p>
            </div>
            <div>
              <div className="font-semibold text-cyan-300 mb-1">
                {isDE ? "Compliance-Automatisierung: 60%" : "Compliance automation: 60%"}
              </div>
              <p>
                {isDE
                  ? "Vorgefertigte SOC 2, DORA, GDPR-Templates sparen die erste 60% der Arbeit. Den Rest kostet die unternehmensspezifische Anpassung und der Audit-Prozess selbst."
                  : "Pre-built SOC 2, DORA, GDPR templates save the first 60% of work. The rest is company-specific adaptation and the audit itself."}
              </p>
            </div>
            <div>
              <div className="font-semibold text-cyan-300 mb-1">
                {isDE ? "Konservative Annahmen" : "Conservative assumptions"}
              </div>
              <p>
                {isDE
                  ? "Wir rechnen nicht Opportunity Cost (entgangene Deals wegen fehlender SOC 2), nicht Reputation-Schaden nach Breach, nicht regulatorische Bußgelder. Der tatsächliche ROI ist in der Praxis oft deutlich höher."
                  : "We don't include opportunity cost (lost deals from missing SOC 2), reputation damage from breaches, or regulatory fines. Actual ROI is often significantly higher in practice."}
              </p>
            </div>
          </div>
        </section>

        <AuthorBox locale={locale} variant="full" className="mt-12" />
      </div>
    </div>
  )
}
