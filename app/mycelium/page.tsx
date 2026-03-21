// MYCELIAL SINGULARITY v3.0 – The Singularity Page
// The entire ClawGuru runbook library rendered as a living, breathing mycelium.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import NextDynamic from "next/dynamic"
import MyceliumShareCard from "@/components/share/MyceliumShareCard"
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/getDictionary"
 
export const dynamic = "force-static"
export const revalidate = 3600
export const dynamicParams = false
export const runtime = "nodejs"
export const maxDuration = 180

export const metadata: Metadata = {
  title: "Mycelial Singularity | ClawGuru",
  description:
    "The living mycelium of 1M+ runbooks. Every node a knowledge unit, every edge a semantic relationship. " +
    "Force-directed graph, Darwinian evolution engine, and oracle mode — the most advanced ops knowledge graph on Earth.",
  alternates: { canonical: "/mycelium" },
}

export default async function MyceliumPage() {
  const locale = DEFAULT_LOCALE as Locale
  const dict = await getDictionary(locale)
  const prefix = `/${locale}`

  return (
    <>
      {/* MYCELIAL SINGULARITY v3.0 – Page header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-gray-950 to-[#050608] py-10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <div className="flex-1">
              <div className="text-xs font-mono text-[#00ff9d] tracking-widest mb-2 uppercase">
                {dict.hero.badge}
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
        {(() => {
          const MyceliumClientLoader = NextDynamic(() => import("@/components/visual/MyceliumClientLoader"), {
            ssr: false,
            loading: () => (
              <div className="h-[50vh] rounded-3xl animate-pulse bg-white/[0.04] border border-white/10" />
            ),
          })
          // Use lightweight embed UI for faster initial load
          return <MyceliumClientLoader ui="embed" />
        })()}
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

      {/* MYCELIAL SINGULARITY v3.0 – Viral Share Card */}
      <div className="py-8 border-t border-white/5">
        <Container>
          <MyceliumShareCard
            locale={locale}
            title="Live Ops Wall · ClawGuru"
            pageUrl={`${prefix}/mycelium`}
            className="max-w-2xl"
          />
        </Container>
      </div>
    </>
  )
}
