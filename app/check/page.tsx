"use client"

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import PageOnboarding from "@/components/onboarding/PageOnboarding"
import { useI18n } from "@/components/i18n/I18nProvider"
import { useState, useEffect } from "react"

export default function CheckPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { locale } = useI18n()
  const isGerman = locale === "de"

  useEffect(() => {
    // Show onboarding if first visit
    const hasVisited = localStorage.getItem("check_visited")
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem("check_visited", "1")
    }
  }, [])

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
        </section>
        <div className="mt-8 max-w-2xl">
          <MyceliumShareCard
            title="Security-Check · ClawGuru"
            pageUrl="/check"
          />
        </div>
      </div>
    </Container>
  )
}
