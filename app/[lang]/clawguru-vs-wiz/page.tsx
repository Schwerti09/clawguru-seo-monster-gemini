import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from '@/lib/i18n'
import { pick } from "@/lib/i18n-pick"
import { clawGuruCompareTablePriceRow, clawGuruFaqWizPriceAnswerDe, clawGuruFaqWizPriceAnswerEn, clawGuruPricingCtaSubline } from "@/lib/pricing"

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  return {
    title: 'ClawGuru vs Wiz: Cloud Security Platform Vergleich 2024',
    description: 'ClawGuru vs Wiz im Vergleich. Self-Hosted vs Cloud-Native CSPM, Preismodell, DSGVO-Konformität, Runbook-Support und SMB vs Enterprise-Fokus.',
    keywords: ['clawguru vs wiz','wiz alternative','cspm vergleich','cloud security posture management','wiz security','clawguru cloud security'],
    authors: [{ name: 'ClawGuru Security Team' }],
    openGraph: {
      images: ["/og-image.png"], title: 'ClawGuru vs Wiz Cloud Security 2024', description: 'ClawGuru vs Wiz CSPM Vergleich.', type: 'article', url: `https://clawguru.org/${lang}/clawguru-vs-wiz` },
    alternates: buildLocalizedAlternates(lang as Locale, '/clawguru-vs-wiz'),
    robots: 'index, follow',
  };
}

export default function ClawGuruVsWizPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) notFound();
  const isDE = lang === "de"
  const pricingLocale = isDE ? "de" : "en"
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: pick(isDE, 'Was ist der Unterschied zwischen ClawGuru und Wiz?', 'What is the difference between ClawGuru and Wiz?'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: pick(
            isDE,
            'Wiz ist eine Enterprise Cloud Security Plattform ab ca. $100k/Jahr, Cloud-only (kein Self-Hosting). ClawGuru ist die Self-Hosted, DSGVO-konforme Alternative für SMBs und Tech-Teams mit Executable Runbooks und Live-Score.',
            'Wiz is a cloud-only enterprise cloud security platform typically priced in the ~$100k+/year range, with no self-hosting. ClawGuru is a self-hosted, GDPR-friendly alternative for SMB/tech teams with executable runbooks and a live security score.',
          ),
        },
      },
      {
        '@type': 'Question',
        name: pick(isDE, 'Ist ClawGuru günstiger als Wiz?', 'Is ClawGuru cheaper than Wiz?'),
        acceptedAnswer: { '@type': 'Answer', text: isDE ? clawGuruFaqWizPriceAnswerDe() : clawGuruFaqWizPriceAnswerEn() },
      },
      {
        '@type': 'Question',
        name: pick(isDE, 'Kann ClawGuru Self-Hosted betrieben werden?', 'Can ClawGuru be self-hosted?'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: pick(
            isDE,
            'Ja. ClawGuru ist vollständig self-hosted betreibbar — alle Daten bleiben in Ihrer Infrastruktur. Wiz ist ein reines Cloud-SaaS-Produkt ohne Self-Hosting-Option.',
            'Yes. ClawGuru can be run fully self-hosted, keeping data in your infrastructure. Wiz is cloud SaaS and does not offer a self-hosting option.',
          ),
        },
      },
      {
        '@type': 'Question',
        name: pick(isDE, 'Welches Tool ist besser für DSGVO-Compliance?', 'Which tool is better for GDPR compliance?'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: pick(
            isDE,
            'ClawGuru ist EU-First und DSGVO-konform durch Self-Hosting. Wiz speichert Daten in US-Cloud-Rechenzentren, was für EU-Unternehmen datenschutzrechtliche Herausforderungen mit sich bringt.',
            'ClawGuru is EU-first and can be operated GDPR-friendly via self-hosting. Wiz is US-cloud oriented, which can create data residency challenges for EU companies.',
          ),
        },
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-900 border-l-4 border-amber-500 p-4 mb-8 text-sm text-amber-100">
          <strong>{pick(isDE, "Vergleichsseite", "Comparison")}</strong>
          {pick(isDE, ": ClawGuru und Wiz sind für unterschiedliche Zielgruppen optimiert. Dieser Guide hilft bei der Entscheidung.", ": ClawGuru and Wiz target different buying centers. This guide helps you pick.")}
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-100">
          {pick(isDE, "ClawGuru vs Wiz: Cloud Security Plattform Vergleich", "ClawGuru vs Wiz: Cloud security platform comparison")}
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          {pick(
            isDE,
            "Wiz ist eine Enterprise-Cloud-Security-Plattform (&gt;$100M ARR). ClawGuru ist die Self-Hosted Alternative für SMBs und Tech-Teams mit Datenschutz-Anforderungen.",
            "Wiz is an enterprise cloud security platform. ClawGuru is the self-hosted alternative for SMB/tech teams with strong data residency requirements.",
          )}
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">⚔️ {pick(isDE, "Direkter Vergleich", "Head-to-head")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="bg-gray-800 text-white"><th className="p-3 text-left">{pick(isDE, "Kriterium", "Criteria")}</th><th className="p-3 text-center">🛡️ ClawGuru</th><th className="p-3 text-center">⚡ Wiz</th></tr></thead>
              <tbody>
                {[
                  [pick(isDE, 'Zielgruppe', 'Target audience'), pick(isDE, 'SMB / Tech-Teams', 'SMB / tech teams'), pick(isDE, 'Enterprise (500+ MAs)', 'Enterprise (500+ employees)')],
                  [pick(isDE, 'Deployment', 'Deployment'), pick(isDE, '✅ Self-Hosted + Cloud', '✅ Self-hosted + cloud'), pick(isDE, '❌ Cloud-only (SaaS)', '❌ Cloud-only (SaaS)')],
                  [pick(isDE, 'DSGVO / EU-Daten', 'GDPR / EU data'), pick(isDE, '✅ EU-First', '✅ EU-first'), pick(isDE, '⚠️ US-basiert', '⚠️ US-based')],
                  [pick(isDE, 'Preis', 'Price'), clawGuruCompareTablePriceRow(pricingLocale), pick(isDE, '❌ ab $100k/Jahr', '❌ typically ~$100k+/yr')],
                  [pick(isDE, 'Executable Runbooks', 'Executable runbooks'), pick(isDE, '✅ Kern-Feature', '✅ Core focus'), pick(isDE, '⚠️ Nur Recommendations', '⚠️ Recommendations')],
                  [pick(isDE, 'CSPM (Cloud Posture)', 'CSPM (cloud posture)'), pick(isDE, '✅ AWS, GCP, Azure', '✅ AWS, GCP, Azure'), pick(isDE, '✅ Multi-Cloud Spezialist', '✅ Multi-cloud depth')],
                  [pick(isDE, 'Agentless Scanning', 'Agentless scanning'), pick(isDE, '⚠️ Teilweise', '⚠️ Partially'), pick(isDE, '✅ Agentless Kernfeature', '✅ Core strength')],
                  [pick(isDE, 'Kubernetes Security', 'Kubernetes security'), pick(isDE, '✅ K8s Hardening', '✅ Kubernetes hardening'), pick(isDE, '✅ KSPM inklusive', '✅ KSPM included')],
                  [pick(isDE, 'Compliance Frameworks', 'Compliance frameworks'), pick(isDE, '✅ SOC2, ISO27001, GDPR', '✅ SOC2, ISO27001, GDPR'), pick(isDE, '✅ 50+ Frameworks', '✅ 50+ frameworks')],
                  [pick(isDE, 'Setup-Aufwand', 'Time-to-value'), pick(isDE, '✅ < 1 Stunde', '✅ < 1 hour'), pick(isDE, '⚠️ Enterprise-Onboarding', '⚠️ Enterprise onboarding')],
                ].map(([criteria, claw, wiz]) => (
                  <tr key={criteria} className="border-b hover:bg-gray-800">
                    <td className="p-3 font-medium">{criteria}</td>
                    <td className="p-3 text-center text-sm">{claw}</td>
                    <td className="p-3 text-center text-sm">{wiz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🏆 {pick(isDE, "Wann welches Tool?", "Which tool when?")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900 border border-green-700 p-5 rounded-lg">
              <h3 className="font-bold text-green-300 mb-3">🛡️ {pick(isDE, "ClawGuru ist die Wahl wenn...", "Choose ClawGuru when...")}</h3>
              <ul className="space-y-1.5 text-sm text-green-200">
                {(isDE ? [
                  "• Budget &lt; $50k/Jahr für Security Tools",
                  "• Datenschutz / DSGVO zwingend",
                  "• Self-Hosted oder On-Prem nötig",
                  "• Executable Runbooks gewünscht",
                  "• Team &lt; 200 Mitarbeiter",
                ] : [
                  "• Security tooling budget is &lt; $50k/year",
                  "• Data residency / GDPR is mandatory",
                  "• Self-hosted or on-prem is required",
                  "• You want executable runbooks, not just findings",
                  "• Team size is &lt; 200",
                ]).map((t) => (
                  <li key={t} dangerouslySetInnerHTML={{ __html: t }} />
                ))}
              </ul>
            </div>
            <div className="bg-blue-900 border border-blue-700 p-5 rounded-lg">
              <h3 className="font-bold text-blue-300 mb-3">⚡ {pick(isDE, "Wiz ist die Wahl wenn...", "Choose Wiz when...")}</h3>
              <ul className="space-y-1.5 text-sm text-blue-200">
                {(isDE ? [
                  "• Enterprise mit &gt;$100k Security Budget",
                  "• Multi-Cloud CSPM als Hauptanforderung",
                  "• Agentless Scanning über alles",
                  "• &gt;50 Compliance-Frameworks nötig",
                  "• Dedicated Security-Team vorhanden",
                ] : [
                  "• You have a &gt;$100k/year enterprise security budget",
                  "• Multi-cloud CSPM is the primary goal",
                  "• Agentless scanning is the top priority",
                  "• You need a very large catalog of compliance frameworks",
                  "• You have a dedicated security team for rollout",
                ]).map((t) => (
                  <li key={t} dangerouslySetInnerHTML={{ __html: t }} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-100">🔗 {pick(isDE, "ClawGuru entdecken", "Explore ClawGuru")}</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href={`/${lang}/securitycheck`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">🛡️ {pick(isDE, "Security Check", "Security check")}</div>
              <div className="text-sm text-gray-300">{pick(isDE, "Kostenlos starten", "Start free")}</div>
            </a>
            <a href={`/${lang}/pricing`} className="block bg-gray-800 p-4 rounded-lg border border-gray-700 hover:bg-gray-700">
              <div className="font-semibold text-cyan-400">💰 {pick(isDE, "Preise", "Pricing")}</div>
              <div className="text-sm text-gray-300">{clawGuruPricingCtaSubline(pricingLocale)}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
