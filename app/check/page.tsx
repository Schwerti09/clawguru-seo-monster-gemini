import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"

export const metadata: Metadata = {
  title: "Security-Check | ClawGuru",
  description:
    "IP/Domain prüfen. Score in 30 Sekunden. Klare nächste Schritte: Runbook → Fix → Re-Check. Kostenlos, ohne Account.",
  alternates: { canonical: "/check" }
}

export default function CheckPage() {
  return (
    <Container>
      <div className="py-16">
        <SectionTitle
          kicker="LIVE"
          title="Security-Check"
          subtitle="IP/Domain rein. Score raus. Und dann: klare nächste Schritte."
        />
        <div className="mt-8">
          <HeroSecurityCheck />
        </div>
      </div>
    </Container>
  )
}
