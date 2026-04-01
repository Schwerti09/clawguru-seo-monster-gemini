"use client"

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import PageOnboarding from "@/components/onboarding/PageOnboarding"
import { useI18n } from "@/components/i18n/I18nProvider"
import { useState, useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

export default function CheckPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { locale } = useI18n()
  const isGerman = locale === "de"
  const prefix = `/${locale}`
  const faqItems = isGerman
    ? [
        {
          q: "Speichert ClawGuru meine Eingaben?",
          a: "Nein. Der Check speichert keine Targets dauerhaft. Technisch notwendige Request-Metadaten koennen in Server-Logs auftauchen.",
        },
        {
          q: "Ist das ein Penetrationstest?",
          a: "Nein. Es ist eine schnelle heuristische Bewertung oeffentlich sichtbarer Signale. Fuer verbindliche Aussagen braucht es interne Validierung.",
        },
        {
          q: "Was mache ich nach dem Score?",
          a: "Die Top-Empfehlungen direkt umsetzen, danach mit Runbooks nachhaerten und erneut pruefen.",
        },
      ]
    : [
        {
          q: "Does ClawGuru store my inputs?",
          a: "No. The check does not persist targets. Technically required request metadata can appear in server logs.",
        },
        {
          q: "Is this a penetration test?",
          a: "No. It is a fast heuristic evaluation of publicly visible signals. For binding conclusions, validate internally.",
        },
        {
          q: "What should I do after the score?",
          a: "Execute the top recommendations, harden with runbooks, then re-check for improvement.",
        },
      ]
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  }

  useEffect(() => {
    // Show onboarding if first visit
    const hasVisited = localStorage.getItem("check_visited")
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem("check_visited", "1")
    }
    trackEvent("check_page_view", { locale })
  }, [locale])

  if (showOnboarding) {
    return (
      <Container>
        <div className="py-16">
          <PageOnboarding 
            pageType="check" 
            onDismiss={() => setShowOnboarding(false)} 
          />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-16">
        <SectionTitle
          kicker="SECURITY"
          title={isGerman ? "Security-Check in 30 Sekunden" : "Security Check in 30 seconds"}
          subtitle={
            isGerman
              ? "Public Target rein, Claw Score raus: Risiko sehen, Top-Fehler verstehen und sofort konkrete nächste Schritte starten."
              : "Enter a public target, get your Claw Score: see risk instantly, understand top gaps, and start concrete next steps."
          }
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3 max-w-4xl">
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-100">
            {isGerman ? "Keine Registrierung fuer den ersten Check" : "No registration for your first check"}
          </div>
          <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 px-4 py-3 text-sm text-cyan-100">
            {isGerman ? "Ergebnis in unter 30 Sekunden" : "Result in under 30 seconds"}
          </div>
          <div className="rounded-xl border border-violet-900/40 bg-violet-950/20 px-4 py-3 text-sm text-violet-100">
            {isGerman ? "Share-Badge + konkrete Fix-Empfehlungen" : "Share badge + concrete fix recommendations"}
          </div>
        </div>
        <div className="mt-8">
          <HeroSecurityCheck />
        </div>
        <section className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-6 max-w-4xl">
          <h3 className="text-lg font-bold text-white">
            {isGerman ? "Methodik & Grenzen" : "Methodology & limitations"}
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            {isGerman
              ? "Der Check bewertet nur oeffentlich sichtbare Signale (z. B. erreichbare Services, Header-/TLS-Indikatoren und typische Exposure-Muster). Kein Penetrationstest, keine Garantie."
              : "This check evaluates publicly visible signals only (e.g. reachable services, header/TLS indicators, and common exposure patterns). It is not a penetration test and not a guarantee."}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li>{isGerman ? "• Score ist heuristisch und priorisiert schnelle Orientierung." : "• Score is heuristic and optimized for fast orientation."}</li>
            <li>{isGerman ? "• Fuer belastbare Aussagen immer Konfiguration, Logs und interne Scans verifizieren." : "• For reliable conclusions, always verify config, logs, and internal scans."}</li>
            <li>{isGerman ? "• Empfehlungen sind auf schnelle Hardening-Umsetzung mit Runbooks ausgerichtet." : "• Recommendations are designed for fast hardening execution via runbooks."}</li>
          </ul>
          <a
            href={`${prefix}/methodik`}
            onClick={() => trackEvent("methodik_click", { locale, source: "check_methodology_block" })}
            className="mt-4 inline-flex text-sm text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
          >
            {isGerman ? "Vollstaendige Methodik ansehen" : "View full methodology"}
          </a>
        </section>
        <section className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 max-w-4xl">
          <h3 className="text-lg font-bold text-white">
            {isGerman ? "Direkt weiter haerten" : "Harden further right away"}
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            {isGerman
              ? "Die haeufigsten Folgefragen nach dem Check: konkrete Hardening-Anleitungen fuer typische Stack-Bausteine."
              : "Most common follow-ups after the check: concrete hardening guides for common stack components."}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a
              href={`${prefix}/nginx-hardening`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "nginx-hardening", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Nginx Hardening
            </a>
            <a
              href={`${prefix}/kubernetes-network-policies`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "kubernetes-network-policies", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Kubernetes Network Policies
            </a>
            <a
              href={`${prefix}/vault-hardening`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "vault-hardening", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Vault Hardening
            </a>
            <a
              href={`${prefix}/aws-iam-security`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "aws-iam-security", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              AWS IAM Security
            </a>
            <a
              href={`${prefix}/postgresql-security`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "postgresql-security", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              PostgreSQL Security
            </a>
            <a
              href={`${prefix}/docker-security-hardening`}
              onClick={() => trackEvent("hardening_link_click", { locale, target: "docker-security-hardening", source: "check_link_hub" })}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-cyan-300 hover:border-cyan-500/40 hover:text-cyan-200"
            >
              Docker Security Hardening
            </a>
          </div>
        </section>
        <section className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6 max-w-4xl">
          <h3 className="text-lg font-bold text-white">
            {isGerman ? "FAQ zum Security-Check" : "Security Check FAQ"}
          </h3>
          <div className="mt-4 space-y-3">
            {faqItems.map((item) => (
              <div key={item.q} className="rounded-xl border border-white/10 px-4 py-3">
                <p className="font-semibold text-white">{item.q}</p>
                <p className="mt-1 text-sm text-gray-300">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-8 max-w-2xl">
          <MyceliumShareCard
            title="Security-Check · ClawGuru"
            pageUrl="/check"
          />
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </div>
    </Container>
  )
}
