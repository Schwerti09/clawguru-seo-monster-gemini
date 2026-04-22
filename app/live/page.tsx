"use client"

import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import OpsWall from "@/components/live/OpsWall"
import LoginSaveBanner from "@/components/shared/LoginSaveBanner"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"

export default function LivePage() {
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
