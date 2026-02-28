"use client"
// SWARM DEPLOYMENT v3.2 – Overlord AI
// ActivateSwarmButton – One-click "Deploy Swarm on my infrastructure" for Pro/Enterprise users.
// Visible on every runbook page. Free users see a "Pro only" upgrade prompt.

import { useState } from "react"
import { makeDeploymentId, type TargetEnvironment, SWARM_AGENT_MIN, SWARM_AGENT_MAX } from "@/lib/swarm"

// SWARM DEPLOYMENT v3.2 – Overlord AI: Available deployment targets
const TARGETS: { value: TargetEnvironment; label: string; icon: string }[] = [
  { value: "kubernetes", label: "Kubernetes Cluster", icon: "⎈" },
  { value: "aws",        label: "AWS Account",        icon: "☁" },
  { value: "gcp",        label: "GCP Project",        icon: "🌐" },
  { value: "azure",      label: "Azure Subscription", icon: "🔷" },
  { value: "hetzner",    label: "Hetzner Cloud",      icon: "🖥" },
  { value: "on-prem",    label: "On-Premises",        icon: "🏢" },
]

interface Props {
  slug: string
  /** Pass true only when session confirms Pro/Enterprise access */
  isPro?: boolean
}

export function ActivateSwarmButton({ slug, isPro = false }: Props) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<TargetEnvironment>("kubernetes")
  const [launching, setLaunching] = useState(false)

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Simulate launch sequence + navigate to dashboard
  function handleLaunch() {
    setLaunching(true)
    const deploymentId = makeDeploymentId(slug)
    // SWARM DEPLOYMENT v3.2 – Overlord AI: brief delay for UX tension before redirect
    setTimeout(() => {
      window.location.href = `/swarm/${deploymentId}?runbook=${encodeURIComponent(slug)}&target=${encodeURIComponent(selected)}`
    }, 900)
  }

  // SWARM DEPLOYMENT v3.2 – Overlord AI: Non-Pro users see upgrade CTA
  if (!isPro) {
    return (
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
    )
  }

  return (
    <>
      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Primary CTA button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-orange-500/60 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 text-xs font-black hover:from-orange-500/30 hover:to-red-500/30 transition-all"
      >
        <span>🐝</span>
        <span>ACTIVATE SWARM</span>
      </button>

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Target selection modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => !launching && setOpen(false)}
        >
          <div
            className="relative w-full max-w-md mx-4 rounded-3xl border border-orange-500/30 bg-[#05060A] p-7 shadow-[0_0_60px_rgba(251,146,60,0.15)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Modal header */}
            <div className="text-xs font-mono text-orange-400/80 tracking-widest mb-3 uppercase">
              SWARM DEPLOYMENT v3.2 · OVERLORD AI
            </div>
            <h2 className="text-xl font-black text-white mb-1">Deploy Swarm</h2>
            <p className="text-sm text-gray-400 mb-5">
              Select your target infrastructure. The swarm will deploy {SWARM_AGENT_MIN}–{SWARM_AGENT_MAX} micro-agents
              and begin autonomous self-healing immediately.
            </p>

            {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Target selector grid */}
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

            {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Safety consent gate */}
            <div className="mb-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-300/80">
              <span className="font-black text-yellow-300">⚠ Consent Gate:</span> This deploys
              read-only diagnostic agents to your selected infrastructure. A kill-switch is
              available at any time on the dashboard. Agents operate in sandbox mode and make
              no destructive changes without explicit confirmation.
            </div>

            {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Launch button */}
            <button
              type="button"
              onClick={handleLaunch}
              disabled={launching}
              className="w-full py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-orange-500 to-red-600 hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {launching ? "⚡ Initialising Swarm…" : "🐝 Deploy Swarm on my infrastructure →"}
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
