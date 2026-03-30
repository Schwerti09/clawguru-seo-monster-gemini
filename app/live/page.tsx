"use client"

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import OpsWall from "@/components/live/OpsWall"
import LoginSaveBanner from "@/components/shared/LoginSaveBanner"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import PageOnboarding from "@/components/onboarding/PageOnboarding"
import LiveDashboardClient from "@/components/live/LiveDashboardClient"
import { useState, useEffect } from "react"

export default function LivePage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Show onboarding if first visit
    const hasVisited = localStorage.getItem("live_visited")
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem("live_visited", "1")
    }
  }, [])

  if (showOnboarding) {
    return (
      <Container>
        <div className="py-16">
          <PageOnboarding 
            pageType="live" 
            onDismiss={() => setShowOnboarding(false)} 
          />
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-16 max-w-6xl mx-auto">
        <SectionTitle
          kicker="LIVE"
          title="Live Ops Cockpit"
          subtitle="Echtzeit-Überwachung deiner Systeme und Bedrohungslandschaft"
        />
        <div className="mt-10">
          <LoginSaveBanner />
          <LiveDashboardClient />
        </div>
        <div className="mt-10">
          <OpsWall />
        </div>
        <div className="mt-10">
          <MyceliumShareCard
            locale="de"
            title="Live Ops Wall · ClawGuru"
            pageUrl="/live"
            className="max-w-2xl"
          />
        </div>
      </div>
    </Container>
  )
}
