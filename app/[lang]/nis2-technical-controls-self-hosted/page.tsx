import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getNIS2Copy } from "@/lib/content-nis2-controls-i18n"
import { pick } from "@/lib/i18n-pick"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getNIS2Copy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/nis2-technical-controls-self-hosted"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function NIS2ControlsPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getNIS2Copy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/nis2-technical-controls-self-hosted`,
  }

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: pick(isDE, 'Was sind die NIS2 technischen Anforderungen für Self-Hosted?', 'What are the NIS2 technical requirements for self-hosted?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'NIS2 technische Controls für Self-Hosted: Patch-Management (kritische CVEs in 72h). Netzwerk-Segmentierung. Multi-Faktor-Authentifizierung für privilegierte Accounts. Verschlüsselung at rest und in transit. Backup und Recovery (getestete Wiederherstellung). SIEM/Log-Management. Incident-Detection-Systeme. Supply-Chain-Security (SBOM). Vulnerability Scanning. Diese Controls gelten für KRITIS-Betreiber und wichtige Einrichtungen nach NIS2.', 'NIS2 technical controls for self-hosted: patch management (critical CVEs within 72h). Network segmentation. Multi-factor authentication for privileged accounts. Encryption at rest and in transit. Backup and recovery (tested restoration). SIEM/log management. Incident detection systems. Supply chain security (SBOM). Vulnerability scanning. These controls apply to critical infrastructure operators and important entities under NIS2.') } },
      { '@type': 'Question', name: pick(isDE, 'Welche Unternehmen fallen unter NIS2?', 'Which companies fall under NIS2?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'NIS2 Geltungsbereich: Wesentliche Einrichtungen (Essential Entities): Energie, Transport, Bankwesen, Gesundheit, Trinkwasser, digitale Infrastruktur, öffentliche Verwaltung (250+ Mitarbeiter oder 50M+ EUR Umsatz). Wichtige Einrichtungen (Important Entities): Post, Abfallwirtschaft, Chemie, Lebensmittel, Herstellung, digitale Anbieter (50+ Mitarbeiter oder 10M+ EUR). In DE: Umsetzung durch NIS2UmsuCG (Nationale Gesetzgebung). BSI ist zuständige Behörde.', 'NIS2 scope: essential entities: energy, transport, banking, healthcare, drinking water, digital infrastructure, public administration (250+ employees or 50M+ EUR turnover). Important entities: postal, waste management, chemicals, food, manufacturing, digital providers (50+ employees or 10M+ EUR). In Germany: implementation through NIS2UmsuCG. BSI is competent authority.') } },
      { '@type': 'Question', name: pick(isDE, 'Welche Meldepflichten hat NIS2 bei Incidents?', 'What are NIS2 incident reporting obligations?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'NIS2 Incident-Meldepflichten: Erheblicher Vorfall muss gemeldet werden an BSI: Frühwarnung innerhalb 24h nach Kenntnisnahme. Incident-Benachrichtigung innerhalb 72h (mit vorläufiger Bewertung). Zwischenbericht auf Anfrage. Abschlussbericht innerhalb 1 Monat. Erheblich = erhebliche Auswirkung auf Dienstverfügbarkeit oder Datenintegrität. Bußgeld bei Nicht-Meldung: bis 10 Mio. EUR oder 2% Weltjahresumsatz.', 'NIS2 incident reporting obligations: significant incident must be reported to BSI: early warning within 24h of awareness. Incident notification within 72h (with preliminary assessment). Interim report on request. Final report within 1 month. Significant = significant impact on service availability or data integrity. Fine for non-reporting: up to 10 million EUR or 2% of global annual turnover.') } },
      { '@type': 'Question', name: pick(isDE, 'Wie implementiere ich NIS2-konformes Patch-Management?', 'How do I implement NIS2-compliant patch management?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'NIS2-konformes Patch-Management: CVE-Monitoring via Moltbot Real-Time CVE Feed. SLA: Critical (CVSS 9+) in 24h, High in 72h, Medium in 30 Tagen. Patch-Prozess: Test in Staging, dann Prod. Change-Management-Dokumentation. Automatisierung: Dependabot für Dependencies, unattended-upgrades für OS. SBOM für vollständiges Software-Inventory. Monatliche Vulnerability-Scan-Reports als Compliance-Evidenz.', 'NIS2-compliant patch management: CVE monitoring via Moltbot real-time CVE feed. SLA: critical (CVSS 9+) in 24h, high in 72h, medium in 30 days. Patch process: test in staging, then prod. Change management documentation. Automation: Dependabot for dependencies, unattended-upgrades for OS. SBOM for complete software inventory. Monthly vulnerability scan reports as compliance evidence.') } },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">NIS2 Control Baseline</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.controlsTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.controls.map((control) => (
                <li key={control}>- {control}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.evidenceTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.evidence.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.nextTitle}</h2>
            <ol className="space-y-2 text-zinc-300 text-sm list-decimal pl-5">
              {copy.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-zinc-500">{copy.disclaimer}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
              {copy.ctaCheck}
            </Link>
            <Link href={`${prefix}/ai-agent-security`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaAiSecurity}
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
