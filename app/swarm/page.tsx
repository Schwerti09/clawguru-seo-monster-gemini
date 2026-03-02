// APPROVED REMEDIATION SWARM v3.2 – INDEX PAGE – Overlord AI
// Swarm index: hub for the Approved Remediation Swarm. Quantum Void Elegance 2050.

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Approved Remediation Swarm | ClawGuru",
  description:
    "Approved Remediation Swarm – Human-in-the-loop autonomous remediation. Distributed agents operating in concert with full audit trail, kill-switch, and compliance export.",
  alternates: { canonical: "/swarm" },
  robots: { index: false, follow: false },
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

export default function SwarmIndexPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: QV.void, color: QV.coldWhite }}
    >
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
    </div>
  )
}
