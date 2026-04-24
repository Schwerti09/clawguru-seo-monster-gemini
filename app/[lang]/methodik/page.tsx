import type { Metadata } from "next"
import Link from "next/link"

import { SUPPORTED_LOCALES, type Locale, buildLocalizedAlternates } from "@/lib/i18n"
import { getCoreSecurityLinks } from "@/lib/core-security-links"
import { t } from "@/lib/article-i18n"
import { pick } from "@/lib/i18n-pick"

export const revalidate = 3600

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata(props: { params: { lang: string } }): Promise<Metadata> {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const title = t(locale, "Methodik: Wie ClawGuru Security-Checks bewertet", "Methodology: How ClawGuru evaluates security checks")
  const description = t(locale, "Transparente Methodik fuer den Claw Security Check: Datenquellen, Bewertung, Grenzen und empfohlene Validierungsschritte.", "Transparent methodology for the Claw Security Check: data sources, scoring logic, limitations, and recommended validation steps.")

  return {
    title,
    description,
    alternates: buildLocalizedAlternates(locale, "/methodik"),
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      type: "article",
      url: `/${locale}/methodik`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function MethodikPage(props: { params: { lang: string } }) {
  const locale = (SUPPORTED_LOCALES.includes(props.params.lang as Locale) ? props.params.lang : "de") as Locale
  const prefix = `/${locale}`
  const coreLinks = getCoreSecurityLinks(locale)
  const isDE = locale === 'de'
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: pick(isDE, 'Wie funktioniert der ClawGuru Security Check?', 'How does the ClawGuru security check work?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Der ClawGuru Security Check analysiert in 30 Sekunden: HTTP Security Headers (HSTS, CSP, X-Frame-Options, X-Content-Type), TLS-Konfiguration und Zertifikat, Redirect-Verhalten, offene bekannte Schwachstellen-Patterns. Ergebnis: Score 0-100 mit priorisierten Handlungsempfehlungen. Kein Agent auf deinem Server n\u00f6tig.', 'The ClawGuru security check analyzes in 30 seconds: HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type), TLS configuration and certificate, redirect behavior, open known vulnerability patterns. Result: score 0-100 with prioritized action recommendations. No agent needed on your server.') } },
      { '@type': 'Question', name: pick(isDE, 'Welche Datenquellen nutzt ClawGuru f\u00fcr den Security Check?', 'What data sources does ClawGuru use for the security check?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'ClawGuru Datenquellen: Live HTTP-Response-Analyse (direkte Anfrage an deine Domain). TLS-Handshake-Analyse (Cipher Suites, Protokoll-Versionen). NVD CVE-Datenbank f\u00fcr bekannte Schwachstellen. Shodan-Integration f\u00fcr Port-Sichtbarkeit (optional). OWASP Top 10 als Bewertungsreferenz. Alle Analysen sind passiv \u2014 kein aktives Scanning oder Exploitation.', 'ClawGuru data sources: live HTTP response analysis (direct request to your domain). TLS handshake analysis (cipher suites, protocol versions). NVD CVE database for known vulnerabilities. Shodan integration for port visibility (optional). OWASP Top 10 as evaluation reference. All analyses are passive - no active scanning or exploitation.') } },
      { '@type': 'Question', name: pick(isDE, 'Was sind die Grenzen des ClawGuru Security Checks?', 'What are the limitations of the ClawGuru security check?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'ClawGuru Check-Grenzen: Kein Pentest-Ersatz (findet keine Logic-Bugs oder Auth-Bypasses). Analysiert nur extern sichtbare Eigenschaften. Keine Insider-Threat-Erkennung. Kein statisches Code-Review. Empfehlung: ClawGuru-Score als Hygiene-Baseline + regelm\u00e4\u00dfiger Pentest durch zertifizierte Tester f\u00fcr kritische Systeme. Score-Verbesserung bedeutet reduziertes, nicht nulles Risiko.', 'ClawGuru check limitations: no pentest replacement (does not find logic bugs or auth bypasses). Only analyzes externally visible properties. No insider threat detection. No static code review. Recommendation: ClawGuru score as hygiene baseline + regular pentest by certified testers for critical systems. Score improvement means reduced, not zero risk.') } },
      { '@type': 'Question', name: pick(isDE, 'Wie oft sollte ich den Security Check ausf\u00fchren?', 'How often should I run the security check?'), acceptedAnswer: { '@type': 'Answer', text: pick(isDE, 'Security Check Frequenz-Empfehlung: Nach jeder Infrastruktur\u00e4nderung (neues Deployment, Config-\u00c4nderung). W\u00f6chentlich als Hygiene-Ritual. Vor/nach Security-Sprints. Nach neuen Mitarbeitern mit Infrastruktur-Zugriff. Automatisiert in CI/CD-Pipeline. ClawGuru Pro bietet Continuous Monitoring mit Alerts bei Score-Verschlechterung.', 'Security check frequency recommendation: after every infrastructure change (new deployment, config change). Weekly as hygiene ritual. Before/after security sprints. After new employees with infrastructure access. Automated in CI/CD pipeline. ClawGuru Pro offers continuous monitoring with alerts on score degradation.') } },
    ],
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-900 via-black to-slate-900">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            {t(locale, "Transparenz", "Transparency")}
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black">
            {t(locale, "Methodik: So bewertet ClawGuru den Security-Check", "Methodology: How ClawGuru evaluates the Security Check")}
          </h1>
          <p className="mt-4 text-zinc-300 leading-relaxed">
            {t(locale, "Diese Seite beschreibt, welche oeffentlich sichtbaren Signale wir nutzen, wie der Claw Score entsteht und wo die Grenzen einer schnellen heuristischen Bewertung liegen.", "This page explains which publicly visible signals we use, how the Claw Score is derived, and where the limits of a fast heuristic assessment are.")}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">{t(locale, "1) Datengrundlage", "1) Data foundation")}</h2>
          <ul className="mt-3 space-y-2 text-zinc-300 text-sm">
            <li>{t(locale, "• Oeffentlich erreichbare Netzwerk-/HTTP-Signale.", "• Publicly reachable network and HTTP signals.")}</li>
            <li>{t(locale, "• Typische Exposure-Muster (z. B. Service-Freilegung, Header-Baselines).", "• Common exposure patterns (e.g. service exposure, header baselines).")}</li>
            <li>{t(locale, "• Vergleich mit bewaehrten Hardening-Baselines.", "• Comparison against proven hardening baselines.")}</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">{t(locale, "2) Scoring-Logik", "2) Scoring logic")}</h2>
          <p className="mt-3 text-zinc-300 text-sm leading-relaxed">
            {t(locale, "Der Claw Score ist eine heuristische Priorisierung: je niedriger der Wert, desto dringender die naechsten Hardening-Schritte. Die Logik ist auf schnelle operative Orientierung ausgelegt, nicht auf Audit-Endgueltigkeit.", "The Claw Score is a heuristic prioritization: the lower the score, the more urgent the next hardening steps. The logic is optimized for rapid operational orientation, not final audit certainty.")}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">{t(locale, "3) Grenzen & Risiken", "3) Limits and risks")}</h2>
          <ul className="mt-3 space-y-2 text-zinc-300 text-sm">
            <li>{t(locale, "• Kein Ersatz fuer Penetrationstest, Code Review oder interne Architektur-Pruefung.", "• Not a replacement for penetration testing, code review, or internal architecture review.")}</li>
            <li>{t(locale, "• Interne Konfigurationen ohne externe Sichtbarkeit werden nicht direkt bewertet.", "• Internal configurations without external visibility are not directly evaluated.")}</li>
            <li>{t(locale, "• Empfehlungen sollten immer mit Logs, Config und Change-Management validiert werden.", "• Recommendations should always be validated against logs, config, and change management.")}</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">{t(locale, "4) Empfohlener Workflow", "4) Recommended workflow")}</h2>
          <ol className="mt-3 space-y-2 text-zinc-300 text-sm">
            <li>{t(locale, "1. Check laufen lassen und Top-Risiken priorisieren.", "1. Run a check and prioritize top risks.")}</li>
            <li>{t(locale, "2. Runbook-Fixes umsetzen (Quick Wins zuerst).", "2. Execute runbook fixes (quick wins first).")}</li>
            <li>{t(locale, "3. Intern validieren (Config, Logs, Monitoring).", "3. Validate internally (config, logs, monitoring).")}</li>
            <li>{t(locale, "4. Re-Check und Fortschritt dokumentieren.", "4. Re-check and document progress.")}</li>
          </ol>
        </article>

        <div className="rounded-2xl border border-cyan-900/40 bg-cyan-950/20 p-6">
          <h2 className="text-lg font-bold">{t(locale, "Naechster Schritt", "Next step")}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={coreLinks.check} className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-black font-semibold">
              {t(locale, "Security-Check starten", "Start Security Check")}
            </Link>
            <Link href={`${prefix}/runbooks`} className="px-4 py-2 rounded-lg border border-white/20 hover:border-white/40 text-white">
              {t(locale, "Runbooks ansehen", "Browse runbooks")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
