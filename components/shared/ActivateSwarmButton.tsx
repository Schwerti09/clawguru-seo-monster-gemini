"use client"
// SWARM DEPLOYMENT v3.2 – Overlord AI
// ActivateSwarmButton – One-click "Deploy Swarm on my infrastructure" for Pro/Enterprise users.
// Visible on every runbook page. Free users see a "Pro only" upgrade prompt.
// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Also supports "Activate Approved Swarm" mode.

import { useState } from "react"
import {
  makeDeploymentId,
  makeApprovedSwarmId,
  type TargetEnvironment,
  type RemediationScope,
  SWARM_AGENT_MIN,
  SWARM_AGENT_MAX,
  SCOPE_LABELS,
} from "@/lib/swarm"

// SWARM DEPLOYMENT v3.2 – Overlord AI: Available deployment targets
const TARGETS: { value: TargetEnvironment; label: string; icon: string }[] = [
  { value: "kubernetes", label: "Kubernetes Cluster", icon: "⎈" },
  { value: "aws",        label: "AWS Account",        icon: "☁" },
  { value: "gcp",        label: "GCP Project",        icon: "🌐" },
  { value: "azure",      label: "Azure Subscription", icon: "🔷" },
  { value: "hetzner",    label: "Hetzner Cloud",      icon: "🖥" },
  { value: "on-prem",    label: "On-Premises",        icon: "🏢" },
]

// APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Remediation scope options
const SCOPES: { value: RemediationScope; icon: string }[] = [
  { value: "cluster",   icon: "⎈" },
  { value: "account",   icon: "☁" },
  { value: "namespace", icon: "📦" },
  { value: "region",    icon: "🌍" },
  { value: "workload",  icon: "⚙" },
]

interface Props {
  slug: string
  /** Pass true only when session confirms Pro/Enterprise access */
  isPro?: boolean
}

export function ActivateSwarmButton({ slug, isPro = false }: Props) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<"swarm" | "approved">("swarm")
  const [selected, setSelected] = useState<TargetEnvironment>("kubernetes")
  const [scope, setScope] = useState<RemediationScope>("cluster")
  const [launching, setLaunching] = useState(false)

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Simulate launch sequence + navigate to dashboard
  function handleLaunch() {
    setLaunching(true)
    if (mode === "approved") {
      // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Navigate to approved swarm dashboard
      const swarmId = makeApprovedSwarmId(slug, scope)
      setTimeout(() => {
        window.location.href = `/swarm/${swarmId}?runbook=${encodeURIComponent(slug)}&mode=approved&scope=${encodeURIComponent(scope)}`
      }, 900)
    } else {
      const deploymentId = makeDeploymentId(slug)
      // SWARM DEPLOYMENT v3.2 – Overlord AI: brief delay for UX tension before redirect
      setTimeout(() => {
        window.location.href = `/swarm/${deploymentId}?runbook=${encodeURIComponent(slug)}&target=${encodeURIComponent(selected)}`
      }, 900)
    }
  }

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Non-Pro users see upgrade CTA
  if (!isPro) {
    return (
      <div className="flex flex-wrap gap-2">
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 text-orange-300 text-xs font-black hover:bg-orange-500/15 transition-colors"
          title="Pro/Enterprise only – upgrade to activate"
        >
          {/* SWARM DEPLOYMENT v3.2 – Overlord AI */}
          <span>🐝</span>
          <span>ACTIVATE SWARM</span>
          <span className="text-[10px] font-mono border border-orange-500/40 rounded px-1 py-0.5">PRO</span>
        </a>
        {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Approved swarm upgrade CTA */}
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-black hover:bg-emerald-500/15 transition-colors"
          title="Enterprise only – upgrade to activate"
        >
          <span>🛡</span>
          <span>APPROVED SWARM</span>
          <span className="text-[10px] font-mono border border-emerald-500/40 rounded px-1 py-0.5">ENTERPRISE</span>
        </a>
      </div>
    )
  }

  return (
    <>
      {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Button group */}
      <div className="flex flex-wrap gap-2">
        {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Primary CTA button */}
        <button
          type="button"
          onClick={() => { setMode("swarm"); setOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-orange-500/60 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 text-xs font-black hover:from-orange-500/30 hover:to-red-500/30 transition-all"
        >
          <span>🐝</span>
          <span>ACTIVATE SWARM</span>
        </button>

        {/* APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Approved swarm CTA */}
        <button
          type="button"
          onClick={() => { setMode("approved"); setOpen(true) }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-500/60 bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 text-emerald-300 text-xs font-black hover:from-emerald-500/25 hover:to-cyan-500/25 transition-all"
        >
          <span>🛡</span>
          <span>ACTIVATE APPROVED SWARM</span>
        </button>
      </div>

      {/* SWARM DEPLOYMENT v3.2 / APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => !launching && setOpen(false)}
        >
          <div
            className="relative w-full max-w-md mx-4 rounded-3xl border bg-[#05060A] p-7 shadow-[0_0_60px_rgba(251,146,60,0.15)]"
            style={{ borderColor: mode === "approved" ? "rgba(52,211,153,0.3)" : "rgba(251,146,60,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className={`text-xs font-mono tracking-widest mb-3 uppercase ${mode === "approved" ? "text-emerald-400/80" : "text-orange-400/80"}`}>
              {mode === "approved"
                ? "APPROVED REMEDIATION SWARM v3.2 SAFE · OVERLORD AI"
                : "SWARM DEPLOYMENT v3.2 · OVERLORD AI"}
            </div>
            <h2 className="text-xl font-black text-white mb-1">
              {mode === "approved" ? "Activate Approved Swarm" : "Deploy Swarm"}
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              {mode === "approved"
                ? "Select the remediation scope. A Remediation Plan will be generated and submitted for your explicit approval before any action is taken."
                : `Select your target infrastructure. The swarm will deploy ${SWARM_AGENT_MIN}–${SWARM_AGENT_MAX} micro-agents and begin autonomous self-healing immediately.`}
            </p>

            {mode === "approved" ? (
              // APPROVED REMEDIATION SWARM v3.2 SAFE – Overlord AI: Scope selector
              <div className="grid grid-cols-2 gap-2 mb-5">
                {SCOPES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setScope(s.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      scope === s.value
                        ? "border-emerald-500/70 bg-emerald-500/15 text-emerald-300"
                        : "border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{SCOPE_LABELS[s.value]}</span>
                  </button>
                ))}
              </div>
            ) : (
              // SWARM DEPLOYMENT v3.2 – Overlord AI: Target selector grid
              <div className="grid grid-cols-2 gap-2 mb-5">
                {TARGETS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setSelected(t.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      selected === t.value
                        ? "border-orange-500/70 bg-orange-500/15 text-orange-300"
                        : "border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Safety consent gate */}
            <div className={`mb-5 rounded-xl border p-3 text-xs ${mode === "approved" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300/80" : "border-yellow-500/20 bg-yellow-500/5 text-yellow-300/80"}`}>
              {mode === "approved" ? (
                <>
                  <span className="font-black text-emerald-300">🛡 Approval Gate:</span> A Remediation
                  Plan is generated for your review. Every proposed action requires individual
                  human sign-off. No change is applied without explicit approval. Emergency Kill-Switch
                  and full Audit Log are available at all times.
                </>
              ) : (
                <>
                  <span className="font-black text-yellow-300">⚠ Consent Gate:</span> This deploys
                  read-only diagnostic agents to your selected infrastructure. A kill-switch is
                  available at any time on the dashboard. Agents operate in sandbox mode and make
                  no destructive changes without explicit confirmation.
                </>
              )}
            </div>

            {/* Launch button */}
            <button
              type="button"
              onClick={handleLaunch}
              disabled={launching}
              className={`w-full py-3 rounded-2xl font-black text-sm hover:opacity-90 disabled:opacity-60 transition-opacity bg-gradient-to-r ${
                mode === "approved"
                  ? "from-emerald-500 to-cyan-600"
                  : "from-orange-500 to-red-600"
              }`}
            >
              {launching
                ? "⚡ Creating Remediation Plan…"
                : mode === "approved"
                  ? "🛡 Create Remediation Plan →"
                  : "🐝 Deploy Swarm on my infrastructure →"}
            </button>

            {!launching && (
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 w-full text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
