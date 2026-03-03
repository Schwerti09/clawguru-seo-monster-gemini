import Container from "@/components/shared/Container"
import MycelialSingularityHero from "@/components/visual/MycelialSingularityHero"
import HeroSecurityCheck from "@/components/marketing/HeroSecurityCheck"
import TrustSecurity from "@/components/marketing/TrustSecurity"
import SectionTitle from "@/components/shared/SectionTitle"
import IntelPreview from "@/components/pages/IntelPreview"
import CopilotPreview from "@/components/pages/CopilotPreview"
import FAQ from "@/components/marketing/FAQ"
import TransparencyWidget from "@/components/marketing/TransparencyWidget"
import BuyButton from "@/components/commerce/BuyButton"
import { COMMUNITY } from "@/lib/constants"
import type { Dictionary } from "@/lib/getDictionary"

interface HomeProps {
  dict?: Dictionary
}

export default function Home({ dict }: HomeProps) {
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

      {/* LUXURY DESIGN 2026: Full-viewport Mycelial Singularity Hero with interactive canvas */}
      <MycelialSingularityHero />

      {/* Security check – luxury glass card */}
      <section className="relative py-16 border-b border-white/5 overflow-hidden" style={{ background: "var(--surface-1)" }}>
        <div className="pointer-events-none absolute inset-0 bg-vault-gradient opacity-60" aria-hidden="true" />
        <Container>
          <HeroSecurityCheck />
        </Container>
      </section>

      {/* UNIVERSE MODULE – LUXURY DESIGN 2026: Gold+Cyan premium section */}
      <section className="relative py-28 overflow-hidden" style={{ background: "var(--surface-1)" }}>
        {/* Gold orb */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
          <div style={{ width: "700px", height: "350px", background: "radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, rgba(0,184,255,0.04) 50%, transparent 70%)", filter: "blur(50px)" }} />
        </div>
        {/* Gold edge line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.2), transparent)" }} aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
          <div className="mb-4 text-xs font-mono tracking-[0.3em] uppercase neon-text-gold">
            {dict?.home.clawVerseKicker ?? "CLAWVERSE · UNIVERSE CORE · OPERATIONAL KNOWLEDGE NETWORK"}
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black font-display leading-[1.05] tracking-tight text-white">
            {dict?.home.clawVerseTitle ?? "Enter the ClawVerse"}
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
            {dict?.home.clawVerseDesc ?? "One living mycelium connecting all operational security knowledge across tools, time & intelligence layers. The Universe is live."}
          </p>
          <a
            href="/universe"
            className="btn-luxury-gold mt-10 inline-block px-10 py-4 rounded-2xl font-black text-base tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d4af37]"
          >
            {dict?.home.clawVerseCta ?? "Enter the Universe →"}
          </a>
        </div>
      </section>

      {/* TRUST & SECURITY FORTRESS 2026: Institutional trust section directly after hero */}
      <TrustSecurity />

      {/* Jackpot CTA – LUXURY DESIGN 2026: vault glass cards */}
      <section className="py-14" style={{ background: "var(--surface-0)" }}>
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionTitle
              kicker={dict?.jackpot.kicker ?? "Jackpot"}
              title={dict?.jackpot.title ?? "Du willst nicht „lesen“. Du willst lösen."}
              subtitle={dict?.jackpot.subtitle ?? "ClawGuru ist eine operative Security-Schicht: Score → Runbook → Fix → Re-Check → Share."}
            />

            <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                [dict?.jackpot.liveScore ?? "Live Score", dict?.jackpot.liveScoreDesc ?? "30 Sekunden. Kein Gelaber. Deine Top 3 Risiken."],
                [dict?.jackpot.copilotRunbooks ?? "Copilot Runbooks", dict?.jackpot.copilotRunbooksDesc ?? "Du beschreibst den Stack. Wir geben ein Runbook zum Abarbeiten."],
                [dict?.jackpot.kitsTemplates ?? "Kits + Templates", dict?.jackpot.kitsTemplatesDesc ?? "Copy/Paste Assets, die du direkt in Produktion ziehen kannst."],
                [dict?.jackpot.liveOpsWall ?? "Live Ops Wall", dict?.jackpot.liveOpsWallDesc ?? "Trends + Hot Fixes. Schneller entscheiden, schneller fixen."]
              ].map(([t, d]) => (
                <div key={t} className="p-6 rounded-3xl glass-vault glass-elite-hover">
                  <div className="text-xl font-black font-display text-gold-gradient">{t}</div>
                  <div className="mt-2 text-sm text-gray-300">{d}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              
              <BuyButton product="daypass" label={dict?.dayPass.label ?? "Day Pass (24h)"} />
              <a href="/runbooks" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                {dict?.jackpot.runbooksLink ?? "Runbooks →"}
              </a>
              <a href="/pricing" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                {dict?.jackpot.allPlans ?? "Alle Pläne →"}
              </a>
              <a href={COMMUNITY.discordInvite} className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                {dict?.jackpot.discordOpsRoom ?? "Discord Ops-Room →"}
              </a>
            </div>

            <div className="mt-6 p-5 rounded-3xl glass-card text-sm text-gray-400">
              {dict?.jackpot.proTip ?? "Pro-Tipp: Nach dem Checkout klickst du auf"}{" "}
              <span className="text-gray-200 font-bold">{dict?.jackpot.activateAccess ?? "„Zugriff aktivieren“"}</span>{" "}
              {dict?.jackpot.then ?? "→ Dashboard."}
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

      {/* Mycelial Singularity Engine CTA – LUXURY DESIGN 2026: gold border accent */}
      <section className="py-16 border-y border-white/5" style={{ background: "var(--surface-1)" }}>
        <Container>
          <div className="max-w-5xl mx-auto p-8 rounded-3xl glass-vault" style={{ borderColor: "rgba(212,175,55,0.18)" }}>
            <div className="text-xs font-mono neon-text-gold uppercase tracking-widest">{dict?.home.genesisProtocol ?? "GENESIS PROTOKOLL AKTIV · MYCELIAL SINGULARITY ENGINE v3.0"}</div>
            <div className="mt-2 text-3xl font-black font-display">
              {dict?.home.myceliumTitle ?? "Das lebende Mycelium. 1M+ Runbooks. Jetzt."}
            </div>
            <p className="mt-4 text-gray-300 max-w-3xl">
              {dict?.home.myceliumDesc ?? "Jeder Knoten ist eine Wissenseinheit. Jede Kante eine semantische Beziehung. Das Netzwerk wächst, lernt und evolviert autonom durch Darwinian Selection."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/clawverse" className="px-6 py-3 rounded-2xl font-black text-black btn-luxury-gold shadow-neon-gold transition-all duration-300">
                ClawVerse →
              </a>
              <a href="/mycelium" className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300">
                {dict?.home.openMycelium ?? "Living Mycelium öffnen →"}
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
                kicker={dict?.faq.kicker ?? "FAQ"}
                title={dict?.faq.title ?? "Kurz. Hart. Hilfreich."}
                subtitle={dict?.faq.subtitle ?? "Einige Fragen kommen immer. Hier sind die Antworten."}
              />
              <FAQ dict={dict?.faq} />
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
