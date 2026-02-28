// MYCELIAL SINGULARITY v3.0 – The Singularity Page
// The entire ClawGuru runbook library rendered as a living, breathing mycelium.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import MyceliumView from "@/components/visual/MyceliumView"
import { RUNBOOKS } from "@/lib/pseo"
import {
  buildMyceliumGraph,
  type RunbookSummary,
} from "@/lib/mycelium"

export const metadata: Metadata = {
  title: "Mycelial Singularity | ClawGuru",
  description:
    "The living mycelium of 1M+ runbooks. Every node a knowledge unit, every edge a semantic relationship. " +
    "Force-directed graph, Darwinian evolution engine, and oracle mode — the most advanced ops knowledge graph on Earth.",
  alternates: { canonical: "/mycelium" },
}

// MYCELIAL SINGULARITY v3.0 – ISR: regenerate graph snapshot every 60 minutes
// (mirrors the hourly genetic evolution cron cadence)
export const revalidate = 3600

export default function MyceliumPage() {
  // MYCELIAL SINGULARITY v3.0 – Build the living graph from the full runbook library
  // Server-side only: keeps heavy Runbook blocks out of the client bundle
  const graph = buildMyceliumGraph(RUNBOOKS, 250)

  // MYCELIAL SINGULARITY v3.0 – Lightweight oracle summaries (title+summary+tags)
  // Sent to client for in-browser similarity search — no API key required
  const summaries: Record<string, RunbookSummary> = {}
  for (const r of RUNBOOKS) {
    summaries[r.slug] = {
      title: r.title,
      summary: r.summary ?? "",
      tags: r.tags,
    }
  }

  return (
    <>
      {/* MYCELIAL SINGULARITY v3.0 – Page header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-gray-950 to-[#050608] py-10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <div className="flex-1">
              <div className="text-xs font-mono text-[#00ff9d] tracking-widest mb-2 uppercase">
                GENESIS PROTOKOLL AKTIV · MYCELIAL SINGULARITY ENGINE v3.0
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
                The{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #00ff9d, #00b8ff, #b464ff)",
                  }}
                >
                  Living Mycelium
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
                Every runbook is a mycel-node. Edges are semantic relationships:{" "}
                <em className="text-[#00ff9d] not-italic">prevents</em>,{" "}
                <em className="text-[#ff4646] not-italic">causes</em>,{" "}
                <em className="text-[#00b8ff] not-italic">depends-on</em>,{" "}
                <em className="text-[#b464ff] not-italic">evolves-from</em>,{" "}
                <em className="text-[#ffc800] not-italic">mutates-into</em>. The network
                grows, learns, and evolves autonomously through Darwinian selection.
              </p>
            </div>

            {/* MYCELIAL SINGULARITY v3.0 – Stats bar */}
            <div className="flex flex-wrap gap-4 md:gap-6 shrink-0">
              {[
                { label: "Library Size", value: `${(RUNBOOKS.length).toLocaleString()}+`, color: "#00ff9d" },
                { label: "Active Nodes", value: graph.nodes.length.toString(), color: "#00b8ff" },
                { label: "Synapses", value: graph.edges.length.toString(), color: "#b464ff" },
                {
                  label: "Evolved",
                  value: graph.nodes.filter((n) => n.evolved).length.toString(),
                  color: "#ffc800",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-2xl font-black font-mono"
                    style={{ color }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MYCELIAL SINGULARITY v3.0 – Feature description chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              "⚡ Force-directed graph",
              "🧬 Genetic evolution engine",
              "♾️ Autopoietic self-maintenance",
              "🔮 Oracle mode",
              "📡 Live mutation feed",
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

      {/* MYCELIAL SINGULARITY v3.0 – Main graph view (full-width, no container padding) */}
      <div className="px-4 py-4">
        <MyceliumView
          graph={graph}
          summaries={summaries}
          totalRunbooks={RUNBOOKS.length}
        />
      </div>

      {/* MYCELIAL SINGULARITY v3.0 – Genetic algorithm explainer */}
      <div className="border-t border-white/10 mt-4">
        <Container>
          <div className="py-12 grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-[#00ff9d] font-black text-lg mb-2">
                🧬 Darwinian Breeding
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every hour, the top 1,000 runbooks are paired for genetic crossover. Steps are
                recombined, commands mutated, fitness re-scored through Quality Gate 2.0.
                Successful mutants earn the <span className="text-[#ffc800]">★ Evolved</span> badge.
              </p>
            </div>
            <div>
              <div className="text-[#00b8ff] font-black text-lg mb-2">
                ♾️ Autopoietic Repair
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Runbooks scoring below 85 are automatically &ldquo;fed&rdquo; by their three strongest
                neighbours — knowledge is transferred via the mycelial network until the
                weak node reaches elite fitness or is gracefully recombined.
              </p>
            </div>
            <div>
              <div className="text-[#b464ff] font-black text-lg mb-2">
                🔮 Singularity Oracle
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Describe any ops problem. The oracle traces the optimal path through the
                semantic graph — scoring nodes on content similarity × evolutionary fitness —
                and returns the most evolved runbook for your exact scenario.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
