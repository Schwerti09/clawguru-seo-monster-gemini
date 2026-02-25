// WORLD BEAST UPGRADE: app/threatmap/page.tsx
// Real-time Global Threat Map – Canvas-based interactive world map showing live exposed instances.
// Clicking a region filters runbooks by that geographic area.

import type { Metadata } from "next"
import { Suspense } from "react"
import Container from "@/components/shared/Container"
import ThreatMapClient from "./ThreatMapClient"
import { THREAT_REGIONS } from "@/lib/threatmap-data"

export const metadata: Metadata = {
  title: "Global Threat Map 2026 | ClawGuru",
  description:
    "Live-Weltkarte mit exponierten Instanzen weltweit. Klicke auf eine Region, um relevante Sicherheits-Runbooks zu filtern.",
  alternates: { canonical: "/threatmap" },
  openGraph: {
    title: "ClawGuru Global Threat Map",
    description: "Realtime map of exposed cloud instances worldwide.",
    images: ["/og-image.png"],
  },
}

// WORLD BEAST UPGRADE: 5-minute ISR revalidation → force-dynamic to prevent build timeout
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function ThreatMapPage() {
  const totalThreats = THREAT_REGIONS.reduce((sum, r) => sum + r.threats, 0)

  return (
    <Container>
      <div className="py-12 max-w-6xl mx-auto">
        {/* WORLD BEAST UPGRADE: Header */}
        <div className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#ff3b5c" }}>
          ▸ Live Intelligence · Updated every 5 min
        </div>
        <h1 className="text-4xl font-black font-heading mb-3">
          🌍 Global Threat Map
        </h1>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Live-Weltkarte exponierter Cloud-Instanzen. Klicke auf eine Region um passende Runbooks zu filtern.
        </p>

        {/* WORLD BEAST UPGRADE: Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Exponierte Instanzen", value: totalThreats.toLocaleString(), color: "#ff3b5c" },
            { label: "Kritische Regionen", value: String(THREAT_REGIONS.filter(r => r.severity === "critical").length), color: "#ff6b35" },
            { label: "Überwachte Länder", value: String(THREAT_REGIONS.length), color: "#00b8ff" },
            { label: "Live-Updates", value: "5 min", color: "#00ff9d" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl glass-card">
              <div className="text-2xl font-black font-heading" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* WORLD BEAST UPGRADE: Interactive threat map canvas (client component) */}
        <Suspense fallback={
          <div className="h-96 rounded-2xl glass-panel flex items-center justify-center">
            <div className="text-gray-400 font-mono text-sm animate-pulse">● Loading threat data...</div>
          </div>
        }>
          <ThreatMapClient regions={THREAT_REGIONS} />
        </Suspense>

        {/* WORLD BEAST UPGRADE: Region list with runbook links */}
        <div className="mt-8">
          <h2 className="text-xl font-black font-heading mb-4">📍 Top Threat Regions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...THREAT_REGIONS]
              .sort((a, b) => b.threats - a.threats)
              .map((region) => {
                const severityColor =
                  region.severity === "critical" ? "#ff3b5c"
                    : region.severity === "high" ? "#ff6b35"
                      : region.severity === "medium" ? "#ffcc00"
                        : "#00ff9d"
                return (
                  <a
                    key={region.id}
                    href={`/runbooks?region=${region.id}`}
                    className="flex items-center justify-between p-4 rounded-xl glass-card glass-card-hover"
                  >
                    <div>
                      <div className="font-bold text-sm">{region.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {region.threats.toLocaleString()} exposed instances
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: severityColor,
                          background: `${severityColor}18`,
                          border: `1px solid ${severityColor}40`,
                        }}
                      >
                        {region.severity}
                      </span>
                      <span className="text-xs text-gray-600">→ Runbooks</span>
                    </div>
                  </a>
                )
              })}
          </div>
        </div>

        {/* WORLD BEAST UPGRADE: CTA */}
        <div className="mt-8 p-6 rounded-2xl glass-panel flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="font-black text-lg">Ist deine Instanz sicher?</div>
            <p className="text-gray-400 text-sm mt-1">
              Überprüfe deinen Claw Security Score in 30 Sekunden.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/check"
              className="px-6 py-3 rounded-2xl font-black text-black transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #00ff9d, #00b8ff)" }}
            >
              Jetzt prüfen →
            </a>
            <a
              href="/runbooks"
              className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300"
            >
              Runbooks →
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
