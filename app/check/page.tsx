import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import SectionTitle from "@/components/shared/SectionTitle"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Was ist der Security‑Check?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Antwort‑first Check: IP/Domain rein, Score und nächste Schritte raus – direktes Runbook mit Verifikation.",
                  },
                },
              ],
            }),
          }}
        />
        <section className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Antwort‑First: 30‑Sekunden Risiko‑Check</h1>
          <p className="mt-2 text-gray-300">Klare Prioritäten, direktes Runbook, <span className="text-cyan-300 font-semibold">4,2 Millionen</span> vernetzte Runbooks als Basis.</p>
        </section>
        <SectionTitle
          kicker="LIVE"
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
