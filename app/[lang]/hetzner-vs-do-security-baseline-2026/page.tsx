import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getHetznerVsDoCopy } from "@/lib/content-hetzner-vs-do-baseline-i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getHetznerVsDoCopy(locale)
  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/hetzner-vs-do-security-baseline-2026"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function HetznerVsDoPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getHetznerVsDoCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/hetzner-vs-do-security-baseline-2026`,
  }

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: isDE ? 'Was ist sicherer: Hetzner oder DigitalOcean?' : 'Which is more secure: Hetzner or DigitalOcean?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Hetzner vs DigitalOcean Security-Vergleich: Hetzner Vorteile: DSGVO-konform (EU-Rechenzentren), BSI C5 Zertifizierung, keine US-Cloud-Act-Exposition. DigitalOcean Vorteile: SOC2 Type II zertifiziert, integrierter Managed Firewall, DDoS-Schutz inklusive, mehr Managed Services. Security-Fazit: Hetzner besser für EU-Datenschutz-Compliance, DigitalOcean besser für out-of-the-box Security-Features. Beide erfordern eigenes Hardening.' : 'Hetzner vs DigitalOcean security comparison: Hetzner advantages: GDPR-compliant (EU data centers), BSI C5 certification, no US Cloud Act exposure. DigitalOcean advantages: SOC2 Type II certified, integrated managed firewall, DDoS protection included, more managed services. Security conclusion: Hetzner better for EU data protection compliance, DigitalOcean better for out-of-the-box security features. Both require own hardening.' } },
      { '@type': 'Question', name: isDE ? 'Welche Security Baseline gilt für Hetzner Cloud Server?' : 'What security baseline applies to Hetzner cloud servers?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Hetzner Cloud Security Baseline 2026: SSH Hardening (Key-only, kein Root-Login, Port ändern). UFW-Firewall (nur nötige Ports). Fail2ban für Brute-Force-Schutz. Automatische Security-Updates (unattended-upgrades). Docker ohne Root-Exposure. HTTPS mit Let\'s Encrypt. Hetzner Firewall (kostenlos, vor VM). Private Networks für interne Kommunikation. Backups aktivieren. Monitoring mit Prometheus/Grafana.' : 'Hetzner cloud security baseline 2026: SSH hardening (key-only, no root login, change port). UFW firewall (only necessary ports). Fail2ban for brute-force protection. Automatic security updates (unattended-upgrades). Docker without root exposure. HTTPS with Let\'s Encrypt. Hetzner firewall (free, in front of VM). Private networks for internal communication. Enable backups. Monitoring with Prometheus/Grafana.' } },
      { '@type': 'Question', name: isDE ? 'Welche Security Baseline gilt für DigitalOcean Droplets?' : 'What security baseline applies to DigitalOcean Droplets?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'DigitalOcean Droplet Security Baseline 2026: DO Cloud Firewall aktivieren (Managed, vor Droplet). SSH Key-only Auth. Automatic Updates. UFW als zweite Firewall-Schicht. Monitoring Alerting für CPU/Memory. DO Spaces für Backups (verschlüsselt). Managed Databases statt selbst betrieben (automatische Security-Patches). VPC für private Kommunikation. DO Security Advisories abonnieren.' : 'DigitalOcean Droplet security baseline 2026: enable DO Cloud Firewall (managed, in front of Droplet). SSH key-only auth. Automatic updates. UFW as second firewall layer. Monitoring alerting for CPU/memory. DO Spaces for backups (encrypted). Managed databases instead of self-operated (automatic security patches). VPC for private communication. Subscribe to DO security advisories.' } },
      { '@type': 'Question', name: isDE ? 'Warum ist DSGVO-Compliance bei der Hosting-Wahl wichtig?' : 'Why is GDPR compliance important when choosing hosting?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'DSGVO und Hosting: Personenbezogene Daten dürfen nur in Ländern mit angemessenem Datenschutzniveau gespeichert werden. EU-Hoster (Hetzner, Netcup, IONOS): keine Drittlandübermittlung, kein US Cloud Act, einfachere DPA. US-Hoster (AWS us-east, DO NYC): US Cloud Act ermöglicht US-Behörden Datenzugriff ohne EU-Benachrichtigung. EU-Standard-Vertragsklauseln möglich, aber rechtlich unsicher nach Schrems II. Hetzner = sichere Wahl für DSGVO-kritische Daten.' : 'GDPR and hosting: personal data may only be stored in countries with adequate data protection level. EU hosters (Hetzner, Netcup, IONOS): no third-country transfer, no US Cloud Act, simpler DPA. US hosters (AWS us-east, DO NYC): US Cloud Act allows US authorities data access without EU notification. EU standard contractual clauses possible but legally uncertain after Schrems II. Hetzner = safe choice for GDPR-critical data.' } },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">Provider Security Baseline</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.compareTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.compareRows.map((row) => (
                <li key={row}>- {row}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-4">{copy.baselineTitle}</h2>
            <ol className="space-y-2 text-zinc-300 text-sm list-decimal pl-5">
              {copy.baselineSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
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
            <Link href={`${prefix}/openclaw-security-check`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaOpenclawCheck}
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
