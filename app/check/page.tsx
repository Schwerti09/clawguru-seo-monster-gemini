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
          title="Security-Check"
          subtitle="IP/Domain rein. Score raus. Und dann: klare nächste Schritte."
        />
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
