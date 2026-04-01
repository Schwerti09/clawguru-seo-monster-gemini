"use client"

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import PageOnboarding from "@/components/onboarding/PageOnboarding"
import { useState, useEffect } from "react"

export default function CheckPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

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
          title="Security-Check in 30 Sekunden"
          subtitle="Public Target rein, Claw Score raus: Risiko sehen, Top-Fehler verstehen und sofort konkrete nächste Schritte starten."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-3 max-w-4xl">
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-100">
            Keine Registrierung fuer den ersten Check
          </div>
          <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 px-4 py-3 text-sm text-cyan-100">
            Ergebnis in unter 30 Sekunden
          </div>
          <div className="rounded-xl border border-violet-900/40 bg-violet-950/20 px-4 py-3 text-sm text-violet-100">
            Share-Badge + konkrete Fix-Empfehlungen
          </div>
        </div>
        <div className="mt-8">
          <HeroSecurityCheck />
        </div>
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
