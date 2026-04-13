import type { Metadata } from "next"
import Link from "next/link"

import Container from "@/components/shared/Container"
import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { getCheckMethodologyCopy } from "@/lib/content-check-methodology-i18n"

export const revalidate = 60

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getCheckMethodologyCopy(locale)

  return {
    title: copy.title,
    description: copy.description,
    alternates: buildLocalizedAlternates(locale, "/check-methodology-30-seconds"),
    openGraph: {
      images: ["/og-image.png"],
      title: copy.title,
      description: copy.description,
      type: "article",
    },
  }
}

export default function CheckMethodologyPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const copy = getCheckMethodologyCopy(locale)
  const coreLinks = getCoreSecurityLinks(locale)
  const prefix = `/${locale}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copy.h1,
    description: copy.description,
    inLanguage: locale,
    mainEntityOfPage: `${prefix}/check-methodology-30-seconds`,
  }

  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: isDE ? 'Was analysiert ClawGuru in 30 Sekunden?' : 'What does ClawGuru analyze in 30 seconds?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'ClawGuru 30-Sekunden-Check analysiert: HTTP Security Headers (HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). TLS-Konfiguration (Protokoll-Version, Cipher Suites, Zertifikat-Gültigkeit). Redirect-Verhalten (HTTP→HTTPS). Grundlegende Exposure-Patterns. Ergebnis: Score 0-100 mit priorisierten Fixes. Kein DNS-Lookup, kein Port-Scan, keine gefährlichen Anfragen.' : 'ClawGuru 30-second check analyzes: HTTP security headers (HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). TLS configuration (protocol version, cipher suites, certificate validity). Redirect behavior (HTTP→HTTPS). Basic exposure patterns. Result: score 0-100 with prioritized fixes. No DNS lookup, no port scan, no dangerous requests.' } },
      { '@type': 'Question', name: isDE ? 'Wie wird der ClawGuru Security Score berechnet?' : 'How is the ClawGuru security score calculated?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'ClawGuru Score-Berechnung: Gewichtete Summe aller geprüften Controls. Höchste Gewichtung: HSTS (HTTPS-Enforcement), TLS-Version (kein TLS 1.0/1.1), CSP (XSS-Schutz). Mittlere Gewichtung: X-Frame-Options, X-Content-Type-Options. Niedrigere Gewichtung: Referrer-Policy, Permissions-Policy. Score 80+: gute Basis-Hygiene. Score 60-79: Handlungsbedarf. Score <60: kritische Lücken. Score ist operativer Indikator, kein Pentest-Ersatz.' : 'ClawGuru score calculation: weighted sum of all checked controls. Highest weighting: HSTS (HTTPS enforcement), TLS version (no TLS 1.0/1.1), CSP (XSS protection). Medium weighting: X-Frame-Options, X-Content-Type-Options. Lower weighting: Referrer-Policy, Permissions-Policy. Score 80+: good basic hygiene. Score 60-79: action needed. Score <60: critical gaps. Score is operational indicator, not pentest replacement.' } },
      { '@type': 'Question', name: isDE ? 'Warum dauert der Check nur 30 Sekunden?' : 'Why does the check only take 30 seconds?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'ClawGuru 30-Sekunden-Geschwindigkeit: Nur eine HTTP-Anfrage an deine Domain (kein Crawling). Header-Analyse ist rein rechnerisch (kein externe DB-Lookup nötig). TLS-Handshake-Analyse parallel zur HTTP-Anfrage. Kein aktives Scanning (kein Port-Scan, keine Exploit-Versuche). Optimierter Edge-Worker (nahe am Nutzer). Diese Geschwindigkeit ermöglicht kontinuierliche Überwachung — ein Check pro Minute wäre technisch möglich.' : 'ClawGuru 30-second speed: only one HTTP request to your domain (no crawling). Header analysis is purely computational (no external DB lookup needed). TLS handshake analysis parallel to HTTP request. No active scanning (no port scan, no exploit attempts). Optimized edge worker (close to user). This speed enables continuous monitoring — one check per minute would be technically possible.' } },
      { '@type': 'Question', name: isDE ? 'Was sollte ich nach dem Check als erstes tun?' : 'What should I do first after the check?', acceptedAnswer: { '@type': 'Answer', text: isDE ? 'Nach dem ClawGuru Check: Top-3-Findings priorisieren (höchste Gewichtung im Score). Quick Win: HSTS Header setzen (nginx: add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;). Passendes Runbook auswählen (ClawGuru bietet spezifische Runbooks für jeden Finding-Typ). Fix deployen, dann sofort Re-Check (kostenlos, sofort). Ziel: Score über 80 in einer Stunde für die meisten Standard-Setups.' : 'After the ClawGuru check: prioritize top 3 findings (highest weighting in score). Quick win: set HSTS header (nginx: add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;). Select matching runbook (ClawGuru offers specific runbooks for each finding type). Deploy fix, then immediately re-check (free, instant). Goal: score above 80 within one hour for most standard setups.' } },
    ],
  }

  return (
    <main className="py-14 border-b border-white/5" style={{ background: "var(--surface-0)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container>
        <article className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-400/90">Security Check Methodology</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{copy.h1}</h1>
            <p className="text-zinc-300 max-w-3xl">{copy.intro}</p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.whatTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.whatBullets.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.whatNotTitle}</h2>
            <ul className="space-y-2 text-zinc-300 text-sm">
              {copy.whatNotBullets.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/20 p-6">
            <h2 className="text-xl font-black text-white mb-3">{copy.nextTitle}</h2>
            <ol className="space-y-2 text-zinc-300 text-sm list-decimal pl-5">
              {copy.nextSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-zinc-500">{copy.disclaimer}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={coreLinks.check} className="rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black">
              {copy.ctaCheck}
            </Link>
            <Link href={coreLinks.methodology} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaMethod}
            </Link>
            <Link href={`${prefix}/openclaw-security-check`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaOpenclawCheck}
            </Link>
            <Link href={`${prefix}/ai-agent-security`} className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white">
              {copy.ctaAiSecurity}
            </Link>
          </div>
        </article>
      </Container>
    </main>
  )
}
