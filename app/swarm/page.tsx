// APPROVED REMEDIATION SWARM v3.2 – INDEX PAGE – Overlord AI
// Swarm index: hub for the Approved Remediation Swarm. Quantum Void Elegance 2050.

import type { Metadata } from "next"
import { BASE_URL } from "@/lib/config"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"
import { RUNBOOK_COUNT_LONG_DE, RUNBOOK_COUNT_SHORT_EN } from "@/lib/stats"

export const metadata: Metadata = {
  title: "Approved Remediation Swarm — Human-in-the-Loop | ClawGuru",
  description:
    `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden. Approved Remediation Swarm mit Human-in-the-Loop.`,
  keywords: [
    "approved remediation swarm",
    "human-in-the-loop",
    "autonomous remediation",
    "security automation",
    "incident response automation",
    "distributed agents",
    "audit trail",
    "kill-switch",
    "compliance export",
  ],
  openGraph: {
    title: "Approved Remediation Swarm — Human-in-the-Loop | ClawGuru",
    description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
    type: "website",
    url: `${BASE_URL}/swarm`,
    images: [{
      url: `${BASE_URL}/og/swarm.png`,
      width: 1200,
      height: 630,
      alt: "ClawGuru Approved Remediation Swarm — Human-in-the-Loop"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Approved Remediation Swarm — Human-in-the-Loop | ClawGuru",
    description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
    images: [`${BASE_URL}/og/swarm.png`]
  },
  alternates: { canonical: "/swarm" },
  robots: { index: true, follow: true },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ClawGuru",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon-512.png`,
  foundingDate: "2024",
  description: `ClawGuru ist die KI-gestützte SecOps-Plattform mit über ${RUNBOOK_COUNT_LONG_DE} ausführbaren Runbooks – für Incident Response, Hardening und Compliance in Echtzeit. Vom Problem zum Fix in unter 30 Sekunden.`,
  sameAs: [
    "https://github.com/clawguru",
  ],
}

/* ── Quantum Void colour tokens ── */
const QV = {
  void: "#050505",
  gold: "#c9a84c",
  violet: "#8b6cdf",
  coldWhite: "#d4dce8",
  green: "#00ff9d",
  blue: "#00b8ff",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.08)",
} as const

/* ── Feature list ── */
const FEATURES = [
  {
    icon: "🛡",
    label: "Human-Approval-Gated",
    desc: "Zero actions execute without explicit human approval. You remain in full control.",
    color: QV.green,
  },
  {
    icon: "📋",
    label: "Full Audit Trail",
    desc: "Every proposed and approved action is logged immutably to the Provenance Singularity.",
    color: QV.gold,
  },
  {
    icon: "🔒",
    label: "Sandbox Mode",
    desc: "Test remediation plans in an isolated environment before touching production.",
    color: QV.violet,
  },
  {
    icon: "📎",
    label: "GitOps / Terraform Artifacts",
    desc: "Export approved plans as Terraform modules or GitOps PRs — one click.",
    color: QV.blue,
  },
  {
    icon: "🛑",
    label: "Kill-Switch",
    desc: "Instantly halt all swarm agents with a single command. No residual processes.",
    color: "#ff4646",
  },
  {
    icon: "📄",
    label: "Compliance Report Export",
    desc: "Generate SOC 2, ISO 27001, and NIST-aligned compliance reports from audit logs.",
    color: QV.coldWhite,
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Was ist der ClawGuru Approved Remediation Swarm?', acceptedAnswer: { '@type': 'Answer', text: 'Der Approved Remediation Swarm ist ClawGurus automatisiertes System zur koordinierten Behebung von Security-Findings. Mehrere spezialisierte Runbooks werden in der richtigen Reihenfolge ausgeführt (Swarm-Execution). Vorteil: abhängige Fixes werden korrekt sequenziert (z.B. erst TLS, dann HSTS). Approval-Workflow: kritische Änderungen erfordern manuelle Bestätigung vor Ausführung. Audit-Trail: alle Swarm-Aktionen werden geloggt.' } },
    { '@type': 'Question', name: 'Wie starte ich einen Remediation Swarm?', acceptedAnswer: { '@type': 'Answer', text: 'Remediation Swarm starten: 1) Security Check für deine Domain durchführen. 2) Mehrere Findings auswählen. 3) "Als Swarm ausführen" klicken — ClawGuru erstellt automatisch einen optimierten Ausführungsplan. 4) Approval-Screen: kritische Schritte bestätigen. 5) Swarm läuft sequenziell durch alle Runbooks. 6) Re-Check am Ende zeigt Score-Verbesserung. Verfügbar ab Pro-Plan.' } },
    { '@type': 'Question', name: 'Was ist der Unterschied zwischen Swarm und einzelnem Runbook?', acceptedAnswer: { '@type': 'Answer', text: 'Einzelnes Runbook: behebt einen spezifischen Finding (z.B. nur HSTS setzen). Swarm: orchestriert mehrere Runbooks intelligent — erkennt Abhängigkeiten, vermeidet Konflikte, optimiert Reihenfolge. Beispiel: CSP-Policy hängt von nginx-Konfiguration ab — Swarm führt nginx-Runbook zuerst aus. Zeitersparnis: Swarm erledigt in einer Session was sonst mehrere manuelle Iterationen braucht.' } },
    { '@type': 'Question', name: 'Kann ich einen Swarm rückgängig machen?', acceptedAnswer: { '@type': 'Answer', text: 'Swarm Rollback: Ja — jeder Swarm-Step erstellt automatisch einen Checkpoint (Config-Snapshot). Rollback über Dashboard: einzelne Steps oder kompletten Swarm rückgängig machen. CLI: clawguru swarm rollback <swarm-id>. Zeitfenster: Rollback möglich innerhalb 24h nach Ausführung. Nach 24h: manuelle Rollback-Anleitung im Swarm-History-Log. Empfehlung: immer zuerst in Staging-Umgebung testen.' } },
  ],
}

export default function SwarmIndexPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: QV.void, color: QV.coldWhite }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* ── Header ── */}
      <div className="pt-16 pb-10 px-4 text-center">
        <a
          href="/universe"
          className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase mb-6 transition-opacity opacity-40 hover:opacity-80"
          style={{ color: QV.gold }}
        >
          ← Universe
        </a>
        <div
          className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4"
          style={{ color: `${QV.violet}88` }}
        >
          Approved Remediation Swarm · v3.2 · Human-in-the-Loop
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${QV.violet}, ${QV.coldWhite} 45%, ${QV.gold})`,
            }}
          >
            Swarm
          </span>
        </h1>
        <p
          className="text-sm max-w-lg mx-auto leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Distributed autonomous agents operating in concert.
          Every action human-approved. Full audit trail maintained.
        </p>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-6 max-w-3xl mx-auto">
          <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.gold}18` }}>
            <div className="text-2xl font-black" style={{ color: QV.gold }}>{RUNBOOK_COUNT_SHORT_EN}+</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Runbooks</div>
          </div>
          <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.violet}18` }}>
            <div className="text-2xl font-black" style={{ color: QV.violet }}>30s</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Problem → Fix</div>
          </div>
          <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.coldWhite}18` }}>
            <div className="text-2xl font-black" style={{ color: QV.coldWhite }}>15+</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Jahre Erfahrung</div>
          </div>
          <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.green}18` }}>
            <div className="text-2xl font-black" style={{ color: QV.green }}>24/7</div>
            <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Incident Response</div>
          </div>
        </div>

        {/* Social Proof Counter */}
        <div className="mt-4 max-w-lg mx-auto mb-6">
          <SocialProofCounter variant="compact" />
        </div>
      </div>

      {/* ── Feature grid ── */}
      <div className="mx-auto w-full max-w-3xl px-4 mb-12">
        <div
          className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Swarm Capabilities
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex gap-3 rounded-2xl p-5 border"
              style={{
                background: QV.glass,
                border: `1px solid ${f.color}18`,
              }}
            >
              <span className="text-xl shrink-0">{f.icon}</span>
              <div>
                <div
                  className="text-xs font-bold mb-1"
                  style={{ color: f.color }}
                >
                  {f.label}
                </div>
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How to launch a Swarm ── */}
      <div className="mx-auto w-full max-w-3xl px-4 mb-16">
        <div
          className="rounded-3xl p-8 border"
          style={{
            background: QV.glass,
            border: `1px solid ${QV.violet}18`,
          }}
        >
          <div
            className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
            style={{ color: `${QV.violet}88` }}
          >
            Launch a Swarm Deployment
          </div>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Swarm deployments are initiated from a runbook page. Navigate to any
            runbook, click &ldquo;Deploy Swarm&rdquo;, and the Approved Remediation Swarm
            will generate a human-gated remediation plan for your scope.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/runbooks"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300"
              style={{
                background: `${QV.violet}10`,
                border: `1px solid ${QV.violet}44`,
                color: QV.violet,
              }}
            >
              Browse Runbooks →
            </a>
            <a
              href="/universe"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${QV.glassBorder}`,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              ← Universe
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom inscription ── */}
      <div className="pb-8 text-center">
        <div
          className="text-[9px] font-mono tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.07)" }}
        >
          Human-in-the-loop. Always. · Swarm v3.2 · ClawGuru.org
        </div>
      </div>

      {/* E-E-A-T Signals */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-[0.25em] mb-6" style={{ color: "rgba(255,255,255,0.2)" }}>
            Warum wir vertrauenswürdig sind
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Experience",
                desc: "15+ Jahre Incident Response Erfahrung. Wir haben Dutzende Produktions-Incidents nachts um 03:00 Uhr behoben.",
                color: QV.gold,
              },
              {
                title: "Expertise",
                desc: `${RUNBOOK_COUNT_LONG_DE} AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. Jeder Guide ist getestet und validiert.`,
                color: QV.violet,
              },
              {
                title: "Authoritativeness",
                desc: "Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.",
                color: QV.coldWhite,
              },
              {
                title: "Trustworthiness",
                desc: "DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. Transparenz über Methodik und Limitationen.",
                color: QV.green,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-4 border" style={{ background: QV.glass, borderColor: `${item.color}18` }}>
                <div className="font-bold text-sm mb-2" style={{ color: item.color }}>{item.title}</div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
