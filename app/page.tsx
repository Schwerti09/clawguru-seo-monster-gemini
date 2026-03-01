import Container from "@/components/shared/Container"
import NeuralGrid from "@/components/visual/NeuralGrid"
import HeroInstitution from "@/components/marketing/HeroInstitution"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import TrustSecurity from "@/components/marketing/TrustSecurity"
import SectionTitle from "@/components/shared/SectionTitle"
import IntelPreview from "@/components/pages/IntelPreview"
import CopilotPreview from "@/components/pages/CopilotPreview"
import FAQ from "@/components/marketing/FAQ"
import TransparencyWidget from "@/components/marketing/TransparencyWidget"
import BuyButton from "@/components/commerce/BuyButton"
import { COMMUNITY } from "@/lib/constants"

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Speichert ClawGuru meine Eingaben?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nein. Der Check ist privat: wir speichern keine Targets. Pro-Funktionen speichern nur, was du explizit in deinem Account aktivierst."
        }
      },
      {
        "@type": "Question",
        name: "Ist das ein Blog oder ein Tool?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tool-first. Du kommst für deinen Score, bleibst für Runbooks, Kits und Mission Control."
        }
      },
      {
        "@type": "Question",
        name: "Was ist Pro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dashboard + Kits + Copilot Runbooks + (bald) Weekly Digest. Ergebnis statt Theorie."
        }
      }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* VISUAL UPGRADE 2026: Full-viewport hero section with animated grid background */}
      <section className="min-h-screen border-b border-white/10 relative overflow-hidden">
        <NeuralGrid />
        <Container>
          <HeroInstitution />
          <HeroSecurityCheck />
        </Container>
      </section>

      {/* TRUST & SECURITY FORTRESS 2026: Institutional trust section directly after hero */}
      <TrustSecurity />

      {/* Jackpot CTA – VISUAL UPGRADE 2026: glassmorphism cards */}
      <section className="py-14 bg-gradient-to-b from-[#0a0a0a] to-gray-950">
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionTitle
              kicker="Jackpot"
              title="Du willst nicht „lesen“. Du willst lösen."
              subtitle="ClawGuru ist eine operative Security-Schicht: Score → Runbook → Fix → Re-Check → Share."
            />

            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["Live Score", "30 Sekunden. Kein Gelaber. Deine Top 3 Risiken."],
                ["Copilot Runbooks", "Du beschreibst den Stack. Wir geben ein Runbook zum Abarbeiten."],
                ["Kits + Templates", "Copy/Paste Assets, die du direkt in Produktion ziehen kannst."],
                ["Live Ops Wall", "Trends + Hot Fixes. Schneller entscheiden, schneller fixen."]
              ].map(([t, d]) => (
                <div key={t} className="p-6 rounded-3xl glass-card glass-card-hover">
                  <div className="text-xl font-black font-heading">{t}</div>
                  <div className="mt-2 text-sm text-gray-300">{d}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              
              <BuyButton product="daypass" label="Day Pass (24h)" />
              <a href="/runbooks" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                Runbooks →
              </a>
              <a href="/pricing" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                Alle Pläne →
              </a>
              <a href={COMMUNITY.discordInvite} className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                Discord Ops-Room →
              </a>
            </div>

            <div className="mt-6 p-5 rounded-3xl glass-card text-sm text-gray-400">
              Pro-Tipp: Nach dem Checkout klickst du auf <span className="text-gray-200 font-bold">„Zugriff aktivieren“</span> → Dashboard.
            </div>
          </div>
        </Container>
      </section>

      {/* Previews */}
      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <CopilotPreview />
            <IntelPreview />
          </div>
        </Container>
      </section>

      {/* Mycelial Singularity Engine CTA – VISUAL UPGRADE 2026: neon border accent */}
      <section className="py-16 bg-gradient-to-r from-gray-950 to-[#001a2e] border-y border-white/10">
        <Container>
          <div className="max-w-5xl mx-auto p-8 rounded-3xl glass-panel" style={{ borderColor: "rgba(0, 255, 157, 0.15)" }}>
            <div className="text-xs font-mono text-[#00ff9d] uppercase tracking-widest">GENESIS PROTOKOLL AKTIV · MYCELIAL SINGULARITY ENGINE v3.0</div>
            <div className="mt-2 text-3xl font-black font-heading">
              Das lebende Mycelium. 1M+ Runbooks. Jetzt.
            </div>
            <p className="mt-4 text-gray-300 max-w-3xl">
              Jeder Knoten ist eine Wissenseinheit. Jede Kante eine semantische Beziehung. Das Netzwerk
              wächst, lernt und evolviert autonom durch Darwinian Selection.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/clawverse" className="px-6 py-3 rounded-2xl font-black text-black bg-claw-green hover:shadow-neon-green transition-all duration-300">
                ClawVerse →
              </a>
              <a href="/mycelium" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                Living Mycelium öffnen →
              </a>
              <a href="/dashboard" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                Dashboard →
              </a>
              <a href="/mission-control" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                Mission Control →
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <SectionTitle
                kicker="FAQ"
                title="Kurz. Hart. Hilfreich."
                subtitle="Einige Fragen kommen immer. Hier sind die Antworten."
              />
              <FAQ />
            </div>
            <div>
              <TransparencyWidget />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
