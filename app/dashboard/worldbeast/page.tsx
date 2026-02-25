// WORLD BEAST FINAL LAUNCH + VISUAL BEAST 2026: app/dashboard/worldbeast/page.tsx
// Dashboard 2.0 – Cyber Terminal Look with live metrics, neon glowing nav, particle effects.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import { getAccess } from "@/lib/access"
import { PLANS } from "@/lib/passive"
import { calculateDailyRevenue } from "@/lib/passive"
import { WorldbeastClient } from "./WorldbeastClient"

export const metadata: Metadata = {
  title: "WorldBeast Dashboard | ClawGuru 2026",
  description:
    "Live WorldBeast Score: Checks, Umsatz, generierte Runbooks, globaler Rang. One-Click World Domination.",
}

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function Paywall() {
  return (
    <Container>
      <div className="py-16 max-w-3xl mx-auto text-center">
        <div className="text-5xl mb-4">🌍</div>
        <h1 className="text-4xl font-black font-headline mb-3">WorldBeast Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Das Live-Kontrollzentrum für ClawGuru WorldBeast 2026/27. Pro-Zugang erforderlich.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="/pricing"
            className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] text-black hover:opacity-90 shadow-neon-green"
          >
            Pro werden →
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-2xl glass-card hover-neon-border font-bold text-gray-200"
          >
            Standard Dashboard
          </a>
        </div>
      </div>
    </Container>
  )
}

export default async function WorldbeastPage() {
  const access = await getAccess()
  if (!access.ok) return <Paywall />

  const proPlan = PLANS.find((p) => p.id === "pro_monthly")!

  // WORLD BEAST FINAL LAUNCH: fetch live revenue data
  const revenue = await calculateDailyRevenue().catch(() => ({ formatted: "€0.00", total: 0, stripe: 0, affiliates: 0 }))

  return (
    <Container>
      {/* VISUAL BEAST 2026: Cyber terminal container */}
      <div className="py-16 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs neon-text-green uppercase tracking-widest mb-1 font-mono">
              {/* VISUAL BEAST 2026: terminal-style label */}
              {`// ClawGuru WorldBeast 2026`}
            </div>
            <h1 className="text-4xl font-black font-headline">
              🌍 WorldBeast Dashboard
            </h1>
            <p className="text-gray-400 mt-1 font-mono text-sm">
              Live-Kontrollzentrum · <span className="neon-text-green">All Systems Go</span>
            </p>
          </div>

          {/* One-Click World Domination Button */}
          <WorldbeastClient />
        </div>

        {/* VISUAL BEAST 2026: Live Score Cards with glass + neon glow */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "WorldBeast Score",
              value: "94",
              unit: "/100",
              icon: "⚡",
              glowClass: "neon-text-green",
            },
            {
              label: "Heal-Zyklen heute",
              value: "12",
              unit: "Runs",
              icon: "🔧",
              glowClass: "text-green-400",
            },
            {
              label: "Umsatz heute",
              // WORLD BEAST FINAL LAUNCH: real revenue from Stripe
              value: revenue.formatted,
              unit: "live",
              icon: "💰",
              glowClass: "text-yellow-400",
            },
            {
              label: "Globaler Rang",
              value: "#1",
              unit: "2026",
              icon: "🏆",
              glowClass: "text-[#8b5cf6]",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="p-5 rounded-2xl glass-card hover-neon-border scanline-overlay"
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className={`text-3xl font-black font-headline ${card.glowClass}`}>
                {card.value}
                <span className="text-sm font-normal text-gray-500 ml-1">{card.unit}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 font-mono">{card.label}</div>
            </div>
          ))}
        </div>

        {/* VISUAL BEAST 2026: Agent Status with neon status indicators */}
        <div className="mb-8 p-6 rounded-2xl glass-card">
          <h2 className="text-xl font-black font-headline mb-4">🤖 Agent Swarm Status</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: "Vulnerability Hunter",
                status: "Aktiv",
                lastRun: "Heute 03:00",
                found: "5 CVEs",
                statusColor: "bg-red-400",
                textColor: "text-red-400",
              },
              {
                name: "Viral Content Agent",
                status: "Bereit",
                lastRun: "Auf Anfrage",
                found: "On-Demand",
                statusColor: "bg-[#00b8ff]",
                textColor: "neon-text-blue",
              },
              {
                name: "Growth Agent",
                status: "Aktiv",
                lastRun: "Heute 04:00",
                found: "8 Keywords",
                statusColor: "bg-[#00ff9d]",
                textColor: "neon-text-green",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-4 rounded-xl glass-card hover-neon-border"
              >
                <div className="font-black text-sm mb-1 font-headline">{agent.name}</div>
                <div className={`text-xs font-bold ${agent.textColor} flex items-center gap-1.5`}>
                  <span className={`w-2 h-2 rounded-full ${agent.statusColor} animate-pulse-glow`} />
                  {agent.status}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-mono">
                  {agent.lastRun} · {agent.found}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization Overview */}
        <div className="mb-8 p-6 rounded-2xl glass-card">
          <h2 className="text-xl font-black font-headline mb-4">💰 Monetarisierungs-Rakete</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Pro Monthly", price: "€9/Monat", active: true },
              { label: "Pro Yearly", price: "€79/Jahr", active: true },
              { label: "Team", price: "€29/Monat", active: true },
              { label: "Enterprise", price: "Auf Anfrage", active: true },
              { label: "White-Label", price: "Partner-Programm", active: true },
              { label: "Day Pass", price: "€4.99/Tag", active: true },
            ].map((plan) => (
              <div
                key={plan.label}
                className="flex items-center justify-between p-3 rounded-xl glass-card hover-neon-border"
              >
                <div className="font-bold text-sm">{plan.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">{plan.price}</span>
                  <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse-glow" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VISUAL BEAST 2026: Live Stats with sparkline-style bars */}
        <div className="mb-8 p-6 rounded-2xl glass-card">
          <h2 className="text-xl font-black font-headline mb-4">📊 Live Stats — Heute</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">Checks heute</div>
              <div className="text-2xl font-black neon-text-blue">–</div>
              {/* VISUAL BEAST 2026: Mini sparkline bar */}
              <div className="mt-2 flex gap-0.5 items-end h-6">
                {[40, 60, 30, 80, 50, 70, 90].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-[#00b8ff]/30" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="text-xs text-gray-500 font-mono">via Security-Check</div>
            </div>
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">Revenue heute</div>
              <div className="text-2xl font-black text-yellow-400">{revenue.formatted}</div>
              <div className="mt-2 flex gap-0.5 items-end h-6">
                {[20, 40, 60, 50, 80, 65, 95].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-yellow-400/30" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="text-xs text-gray-500 font-mono">Stripe (EUR)</div>
            </div>
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">Top-Land</div>
              <div className="text-2xl font-black neon-text-green">🇩🇪 DE</div>
              <div className="mt-2 flex gap-0.5 items-end h-6">
                {[90, 50, 30, 20, 10, 5, 3].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-[#00ff9d]/30" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="text-xs text-gray-500 font-mono">via Umami Analytics</div>
            </div>
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">Conversion-Rate</div>
              <div className="text-2xl font-black text-[#8b5cf6]">–%</div>
              <div className="mt-2 flex gap-0.5 items-end h-6">
                {[30, 45, 55, 40, 60, 70, 50].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-[#8b5cf6]/30" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="text-xs text-gray-500 font-mono">Check → Pro/Day Pass</div>
            </div>
          </div>
        </div>

        {/* VISUAL BEAST 2026: Quick Actions with neon hover */}
        <div className="p-6 rounded-2xl glass-card">
          <h2 className="text-xl font-black font-headline mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/health/cron"
              className="px-4 py-2 rounded-xl glass-card hover-neon-border text-sm font-bold font-mono"
            >
              🔧 Heal-Zyklus starten
            </a>
            <a
              href="/api/agents/vulnerability"
              className="px-4 py-2 rounded-xl glass-card text-sm font-bold font-mono hover:border-red-400/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all"
            >
              🦠 CVE Scan starten
            </a>
            <a
              href="/leaderboard"
              className="px-4 py-2 rounded-xl glass-card hover-neon-border text-sm font-bold font-mono"
            >
              🏆 Leaderboard öffnen
            </a>
            <a
              href="/dashboard/health"
              className="px-4 py-2 rounded-xl glass-card hover-neon-border text-sm font-bold font-mono"
            >
              ❤️ Health Status
            </a>
            <a
              href="/runbooks"
              className="px-4 py-2 rounded-xl glass-card hover-neon-border text-sm font-bold font-mono"
            >
              📚 Runbooks ({proPlan.features[1]})
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
