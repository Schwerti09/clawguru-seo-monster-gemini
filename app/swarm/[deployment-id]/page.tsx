// SWARM DEPLOYMENT v3.2 – Overlord AI
// /swarm/[deployment-id] – Live Swarm Dashboard page.
// Renders the real-time swarm visualisation, agent graph, and control panel.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import SwarmDashboard from "@/components/visual/SwarmDashboard"
import { generateSwarmDeployment } from "@/lib/swarm"

// SWARM DEPLOYMENT v3.2 – Overlord AI: Always dynamic – never statically cached
export const dynamic = "force-dynamic"

export function generateMetadata({ params, searchParams }: PageProps): Metadata {
  const runbookSlug = searchParams.runbook
  const deploymentId = params["deployment-id"]
  const titleSuffix = runbookSlug ? ` – ${runbookSlug}` : ` – ${deploymentId}`
  return {
    title: `Swarm Dashboard${titleSuffix} | ClawGuru`,
    description:
      `Live SWARM DEPLOYMENT dashboard${runbookSlug ? ` for ${runbookSlug}` : ""} – Agents alive, self-healing events, zone heatmap and swarm controls.`,
    robots: { index: false, follow: false },
  }
}

interface PageProps {
  params: { "deployment-id": string }
  searchParams: { runbook?: string; target?: string }
}

export default function SwarmPage({ params, searchParams }: PageProps) {
  // SWARM DEPLOYMENT v3.2 – Overlord AI: Generate deterministic deployment snapshot server-side
  const deploymentId = params["deployment-id"]
  const runbookSlug = searchParams.runbook ?? "unknown-runbook"
  const deployment = generateSwarmDeployment(deploymentId, runbookSlug)

  return (
    <>
      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Page header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-gray-950 to-[#050608] py-10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <div className="flex-1">
              <div className="text-xs font-mono text-orange-400 tracking-widest mb-2 uppercase">
                SWARM DEPLOYMENT v3.2 · OVERLORD AI · {deployment.target.toUpperCase()}
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                The{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(90deg, #fb923c, #ef4444, #b464ff)",
                  }}
                >
                  Swarm has awakened
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                {deployment.totalAgents} micro-agents deployed across{" "}
                <span className="text-orange-400 font-bold">{deployment.zones.length} zones</span>.
                Autonomous self-healing active. The Mycelium watches and learns in real-time.
              </p>
            </div>

            {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Quick stats header bar */}
            <div className="flex flex-wrap gap-4 md:gap-6 shrink-0">
              {[
                { label: "Total Agents", value: deployment.totalAgents.toString(), color: "#fb923c" },
                { label: "Active",       value: deployment.activeAgents.toString(), color: "#00ff9d" },
                { label: "Heal Events",  value: deployment.healEventsThisHour.toString(), color: "#ffc800" },
                { label: "Zones",        value: deployment.zones.length.toString(), color: "#00b8ff" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black font-mono" style={{ color }}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Feature chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              "🐝 Autonomous self-healing",
              "🕸 Secure WebSocket mesh",
              "🧬 Mycelium-linked evolution",
              "⚠ Kill-switch available",
              "🔒 Sandbox mode",
            ].map((feat) => (
              <span
                key={feat}
                className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
              >
                {feat}
              </span>
            ))}
          </div>
        </Container>
      </div>

      {/* SWARM DEPLOYMENT v3.2 – Overlord AI: Main dashboard */}
      <div className="py-8">
        <Container>
          {runbookSlug !== "unknown-runbook" && (
            <div className="mb-5 text-sm text-gray-500">
              Deployed from runbook:{" "}
              <a
                href={`/runbook/${runbookSlug}`}
                className="text-cyan-400 hover:underline font-mono"
              >
                {runbookSlug}
              </a>
            </div>
          )}

          <SwarmDashboard deployment={deployment} />
        </Container>
      </div>
    </>
  )
}
