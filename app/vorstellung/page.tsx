import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import { GlowButton } from "@/components/ui/GlowButton"
import dynamic from "next/dynamic"

const MyceliumClientLoader = dynamic(() => import("@/components/visual/MyceliumClientLoader"), { ssr: false })

export const metadata: Metadata = {
  title: "Vorstellung • ClawGuru",
  description: "Die ClawGuru Plattform erklärt – Mycelium, Copilot, Vault, Ops‑Intel, Mission Control. Modern, schnell, visuell.",
  alternates: { canonical: "/vorstellung" },
}

export default function VorstellungPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--surface-0, #0a0a0a)" }}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-10 px-4">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          maskImage: "radial-gradient(80% 80% at 50% 50%, black, transparent)",
          opacity: 0.4,
        }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white leading-tight">ClawGuru vorgestellt</h1>
          <p className="mt-4 text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Die Ops‑Intelligence Plattform: schnell, fokussiert, ergebnisorientiert. Hier siehst du in 60 Sekunden, was du bekommst.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <GlowButton variant="primary" href="/check">Jetzt testen</GlowButton>
            <GlowButton variant="outline" href="/pricing">Pläne</GlowButton>
          </div>
        </div>
      </section>

      <Container>
        <div className="py-10 max-w-6xl mx-auto space-y-12">
          {/* Mycelium Tablet Preview */}
          <div className="rounded-[24px] border border-white/10 bg-black/30 p-4">
            <div className="text-sm text-gray-400 mb-2">Mycelium Vorschau</div>
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-black/60">
              <MyceliumClientLoader ui="embed" />
            </div>
          </div>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-300 mb-1">Copilot</div>
              <h2 className="text-xl font-black text-white">Runbooks on demand</h2>
              <p className="text-gray-300 mt-2 text-sm">Beschreibe dein System + Problem – du bekommst ein passendes, ausführbares Runbook inkl. Validierung & Rollback.</p>
            </div>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-300 mb-1">Vault</div>
              <h2 className="text-xl font-black text-white">500+ Playbooks</h2>
              <p className="text-gray-300 mt-2 text-sm">Hardening, Recovery, CSP, SSH, Docker, Webhooks – sofort einsetzbar, produktionsreif.</p>
            </div>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-300 mb-1">Ops Intel</div>
              <h2 className="text-xl font-black text-white">Live Threats & Fixes</h2>
              <p className="text-gray-300 mt-2 text-sm">Trending Fixes, CVE‑Pulse und Mission Control. Sieh, was heute zählt – mit direktem Runbook‑Link.</p>
            </div>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-yellow-300 mb-1">Security Score</div>
              <h2 className="text-xl font-black text-white">Top‑Risiken in 30 Sekunden</h2>
              <p className="text-gray-300 mt-2 text-sm">Claw Security Score zeigt dir die größten Lücken sofort – inkl. Nächste‑Schritte.</p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center pt-6">
            <GlowButton variant="primary" href="/daypass">Day Pass 7€ – Sofortzugang</GlowButton>
          </div>
        </div>
      </Container>
    </main>
  )
}
