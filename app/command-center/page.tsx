"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import Container from "@/components/shared/Container"
import { useSearchParams, useRouter } from "next/navigation"

const SummonPanel = dynamic(() => import("@/components/command-center/SummonPanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Summon…</div> })
const OraclePanel = dynamic(() => import("@/components/command-center/OraclePanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Oracle…</div> })
const NeuroPanel = dynamic(() => import("@/components/command-center/NeuroPanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Neuro…</div> })
const MyceliumPanel = dynamic(() => import("@/components/command-center/MyceliumPanel"), { ssr: false, loading: () => <div className="p-6 rounded-2xl border border-white/10 bg-black/30 text-sm text-gray-400">Lade Mycelium…</div> })

function TabButton({ id, current, onClick, label }: { id: string; current: string; onClick: (id: string) => void; label: string }) {
  const active = current === id
  return (
    <button onClick={() => onClick(id)} className={`px-3 py-2 rounded-xl text-sm font-bold border transition-colors ${active ? "bg-cyan-600/30 border-cyan-500/50 text-cyan-200" : "bg-black/30 border-white/10 text-gray-300 hover:bg-black/40"}`}>
      {label}
    </button>
  )
}

export default function CommandCenterPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const initial = sp.get("tab") || "summon"
  const [tab, setTab] = useState(initial)
  useEffect(() => {
    const cur = sp.get("tab") || "summon"
    if (cur !== tab) setTab(cur)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp])
  const onTab = (id: string) => {
    const u = new URL(window.location.href)
    u.searchParams.set("tab", id)
    router.push(u.pathname + "?" + u.searchParams.toString())
    setTab(id)
  }

  const Panel = useMemo(() => {
    switch (tab) {
      case "oracle":
        return <OraclePanel />
      case "neuro":
        return <NeuroPanel />
      case "mycelium":
        return <MyceliumPanel />
      case "summon":
      default:
        return <SummonPanel />
    }
  }, [tab])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      {/* HERO SECTION */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/20 to-[#0a0a0a]">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-xs font-mono tracking-widest uppercase text-[#00ff9d] mb-4">Command Center</div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              AI-Powered Security Intelligence
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mb-8">
              Find the right runbooks in seconds, predict CVEs before they hit, and visualize your threat landscape — all powered by AI.
            </p>
            <div className="flex gap-4">
              <a href="/check" className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg transition-colors">
                Start Security Check →
              </a>
              <a href="/pricing" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg border border-gray-700 transition-colors">
                View Pricing
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* STATS BAR */}
      <section className="py-8 border-y border-gray-800">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-black text-cyan-400">4,200+</div>
                <div className="text-sm text-gray-400">AI Runbooks</div>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400">AI-Powered</div>
                <div className="text-sm text-gray-400">Threat Detection</div>
              </div>
              <div>
                <div className="text-3xl font-black text-fuchsia-400">16</div>
                <div className="text-sm text-gray-400">Languages</div>
              </div>
              <div>
                <div className="text-3xl font-black text-yellow-400">Live</div>
                <div className="text-sm text-gray-400">CVE Feed</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* TABS AND PANELS */}
      <section className="py-10">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Mission Control</h2>
                <p className="text-gray-400 text-sm">Select a tool to get started</p>
              </div>
              <div className="flex gap-2">
                <TabButton id="summon" current={tab} onClick={onTab} label="Summon" />
                <TabButton id="oracle" current={tab} onClick={onTab} label="Oracle" />
                <TabButton id="neuro" current={tab} onClick={onTab} label="Neuro" />
                <TabButton id="mycelium" current={tab} onClick={onTab} label="Mycelium" />
              </div>
            </div>
            <div className="min-h-[480px]">{Panel}</div>

            {/* RICH CONTENT PER TAB */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {tab === "summon" && (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-cyan-400 mb-3">Summon: AI-Runbook-Suche</h3>
                  <p className="text-gray-300 mb-4">
                    Beschreibe dein Problem in natürlicher Sprache — Summon findet die passenden Runbooks aus 4,200+ AI-generierten Fix-Guides in Sekunden.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>✓ Natürliche Sprache (DE/EN)</li>
                    <li>✓ Confidence-Score für Ergebnisse</li>
                    <li>✓ Direkte Links zu relevanten Runbooks</li>
                  </ul>
                </div>
              )}
              {tab === "oracle" && (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-emerald-400 mb-3">Oracle: CVE-Vorhersage</h3>
                  <p className="text-gray-300 mb-4">
                    Proaktive Threat Intelligence: Oracle analysiert CVE-Trends und vorhersagt, welche Schwachstellen deine Infrastruktur in den nächsten 7-30 Tagen treffen könnten.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>✓ Timeline-basierte Vorhersagen</li>
                    <li>✓ Critical Risk Probability</li>
                    <li>✓ Direkte Fix-Guide Links</li>
                  </ul>
                </div>
              )}
              {tab === "neuro" && (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Neuro: Stack-Empfehlungen</h3>
                  <p className="text-gray-300 mb-4">
                    Gib deinen Tech-Stack ein (z.B. aws,nginx,postgres) — Neuro generiert einen personalisierten Hardening-Plan mit den relevantesten Runbooks.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>✓ Stack-basierte Empfehlungen</li>
                    <li>✓ Relevance-Score pro Runbook</li>
                    <li>✓ Execution Plan mit Zeit-Schätzung</li>
                  </ul>
                </div>
              )}
              {tab === "mycelium" && (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3">Mycelium: 3D Threat Network</h3>
                  <p className="text-gray-300 mb-4">
                    Visualisiere deine Infrastruktur als interaktives 3D-Netzwerk: Threats, Runbooks, Security-Checks, Compliance-Metriken — alle in Echtzeit.
                  </p>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>✓ Interaktive 3D-Visualisierung (R3F)</li>
                    <li>✓ Filter nach Node-Typ</li>
                    <li>✓ Live Stats und Critical Threats</li>
                  </ul>
                </div>
              )}
            </div>

            {/* FOOTER CTA */}
            <div className="mt-16 bg-gradient-to-r from-cyan-900/30 to-[#0a0a0a] border border-cyan-500/20 rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to secure your infrastructure?</h3>
                <p className="text-gray-400 mb-6">Start with a free security check or explore our Pro features for teams.</p>
                <div className="flex gap-4 justify-center">
                  <a href="/check" className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg transition-colors">
                    Start Security Check →
                  </a>
                  <a href="/academy" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold px-6 py-3 rounded-lg border border-gray-700 transition-colors">
                    Learn Security →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
