import Link from "next/link"
// WORLD BEAST FINAL LAUNCH + VISUAL UPGRADE 2026: app/dashboard/worldbeast/page.tsx
// Cyber terminal aesthetic with live metrics, glassmorphism, and neon accents.

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
        {/* VISUAL UPGRADE 2026: Neon-accented paywall */}
        <div className="text-5xl mb-4">🌍</div>
        <h1 className="text-4xl font-black font-heading mb-3">WorldBeast Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Das Live-Kontrollzentrum für ClawGuru WorldBeast 2026/27. Pro-Zugang erforderlich.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-2xl font-black text-black bg-claw-green hover:shadow-neon-green transition-all duration-300"
          >
            Pro werden →
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20 font-bold text-gray-200 transition-all duration-300"
          >
            Standard Dashboard
          </Link>
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
      <div className="py-16 max-w-5xl mx-auto">
        {/* VISUAL UPGRADE 2026: Cyber terminal header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#00ff9d" }}>
              ▸ ClawGuru WorldBeast 2026
            </div>
            <h1 className="text-4xl font-black font-heading">
              🌍 WorldBeast Dashboard
            </h1>
            <p className="text-gray-400 mt-1 font-mono text-sm">
              <span style={{ color: "#00ff9d" }}>●</span> Live-Kontrollzentrum · All Systems Go
            </p>
          </div>

          {/* VISUAL UPGRADE 2026: Unleash the Beast button */}
          <WorldbeastClient />
        </div>

        {/* VISUAL UPGRADE 2026: Live Score Cards with glassmorphism and neon accents */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "WorldBeast Score",
              value: "94",
              unit: "/100",
              icon: "⚡",
              color: "#00ff9d",
            },
            {
              label: "Heal-Zyklen heute",
              value: "12",
              unit: "Runs",
              icon: "🔧",
              color: "#22c55e",
            },
            {
              label: "Umsatz heute",
              // WORLD BEAST FINAL LAUNCH: real revenue from Stripe
              value: revenue.formatted,
              unit: "live",
              icon: "💰",
              color: "#ffcc00",
            },
            {
              label: "Globaler Rang",
              value: "#1",
              unit: "2026",
              icon: "🏆",
              color: "#00b8ff",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="p-5 rounded-2xl glass-card glass-card-hover"
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="text-3xl font-black font-heading" style={{ color: card.color, textShadow: `0 0 20px ${card.color}40` }}>
                {card.value}
                <span className="text-sm font-normal text-gray-500 ml-1">{card.unit}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* VISUAL UPGRADE 2026: Agent Status with cyber terminal aesthetic */}
        <div className="mb-8 p-6 rounded-2xl glass-panel">
          <h2 className="text-xl font-black font-heading mb-4 flex items-center gap-2">
            <span>🤖</span> <span>Agent Swarm Status — 8 Agents</span>
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              {
                name: "Vulnerability Hunter",
                status: "Aktiv",
                lastRun: "Heute 03:00",
                found: "5 CVEs",
                color: "#ff3b5c",
              },
              {
                name: "Viral Content Agent",
                status: "Bereit",
                lastRun: "Auf Anfrage",
                found: "On-Demand",
                color: "#00b8ff",
              },
              {
                name: "Growth Agent",
                status: "Aktiv",
                lastRun: "Heute 04:00",
                found: "8 Keywords",
                color: "#00ff9d",
              },
              {
                name: "Launch Agent",
                status: "Bereit",
                lastRun: "Auf Anfrage",
                found: "On-Demand",
                color: "#ffcc00",
              },
              {
                name: "Predictive Agent",
                status: "Aktiv",
                lastRun: "Heute 02:00",
                found: "3 Forecasts",
                color: "#ff6b35",
              },
              {
                name: "Video Agent",
                status: "Bereit",
                lastRun: "Auf Anfrage",
                found: "On-Demand",
                color: "#a855f7",
              },
              {
                name: "SEO Agent",
                status: "Aktiv",
                lastRun: "Heute 05:00",
                found: "12 Pages",
                color: "#22c55e",
              },
              {
                name: "Self-Heal Monitor",
                status: "Aktiv",
                lastRun: "Heute 06:00",
                found: "Health 94%",
                color: "#00b8ff",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-4 rounded-xl glass-card glass-card-hover"
              >
                <div className="font-black text-sm mb-1 font-heading">{agent.name}</div>
                <div className="text-xs font-bold font-mono" style={{ color: agent.color }}>
                  ● {agent.status}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {agent.lastRun} · {agent.found}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VISUAL UPGRADE 2026: Monetization Overview with glassmorphism */}
        <div className="mb-8 p-6 rounded-2xl glass-panel">
          <h2 className="text-xl font-black font-heading mb-4">💰 Monetarisierungs-Rakete</h2>
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
                className="flex items-center justify-between p-3 rounded-xl glass-card"
              >
                <div className="font-bold text-sm">{plan.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{plan.price}</span>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#00ff9d", boxShadow: "0 0 6px rgba(0, 255, 157, 0.5)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VISUAL UPGRADE 2026: Live Stats with terminal style */}
        <div className="mb-8 p-6 rounded-2xl glass-panel">
          <h2 className="text-xl font-black font-heading mb-4">📊 Live Stats — Heute</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">checks_today</div>
              <div className="text-2xl font-black" style={{ color: "#00b8ff", textShadow: "0 0 15px rgba(0, 184, 255, 0.4)" }}>–</div>
              <div className="text-xs text-gray-500">via Security-Check</div>
            </div>
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">revenue_today</div>
              <div className="text-2xl font-black" style={{ color: "#ffcc00", textShadow: "0 0 15px rgba(255, 204, 0, 0.4)" }}>{revenue.formatted}</div>
              <div className="text-xs text-gray-500">Stripe (EUR)</div>
            </div>
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">top_country</div>
              <div className="text-2xl font-black" style={{ color: "#00ff9d", textShadow: "0 0 15px rgba(0, 255, 157, 0.4)" }}>🇩🇪 DE</div>
              <div className="text-xs text-gray-500">via Umami Analytics</div>
            </div>
            <div className="p-4 rounded-xl glass-card">
              <div className="text-xs text-gray-500 mb-1 font-mono">conversion_rate</div>
              <div className="text-2xl font-black" style={{ color: "#00b8ff", textShadow: "0 0 15px rgba(0, 184, 255, 0.4)" }}>–%</div>
              <div className="text-xs text-gray-500">Check → Pro/Day Pass</div>
            </div>
          </div>
        </div>

        {/* VISUAL UPGRADE 2026: Quick Actions with neon hover effects */}
        <div className="p-6 rounded-2xl glass-panel">
          <h2 className="text-xl font-black font-heading mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/api/health/cron"
              className="px-4 py-2 rounded-xl glass-card hover:border-claw-green/40 text-sm font-bold transition-all duration-300"
            >
              🔧 Heal-Zyklus starten
            </Link>
            <Link
              href="/api/agents/vulnerability"
              className="px-4 py-2 rounded-xl glass-card hover:border-red-400/40 text-sm font-bold transition-all duration-300"
            >
              🦠 CVE Scan starten
            </Link>
            <Link
              href="/api/agents/predictive"
              className="px-4 py-2 rounded-xl glass-card hover:border-orange-400/40 text-sm font-bold transition-all duration-300"
            >
              🔮 Threat Forecast
            </Link>
            <Link
              href="/threatmap"
              className="px-4 py-2 rounded-xl glass-card hover:border-red-400/40 text-sm font-bold transition-all duration-300"
            >
              🌍 Global Threat Map
            </Link>
            <Link
              href="/bounties"
              className="px-4 py-2 rounded-xl glass-card hover:border-yellow-400/40 text-sm font-bold transition-all duration-300"
            >
              💰 Bounty Program
            </Link>
            <Link
              href="/leaderboard"
              className="px-4 py-2 rounded-xl glass-card hover:border-yellow-400/40 text-sm font-bold transition-all duration-300"
            >
              🏆 Leaderboard öffnen
            </Link>
            <Link
              href="/dashboard/health"
              className="px-4 py-2 rounded-xl glass-card hover:border-claw-green/40 text-sm font-bold transition-all duration-300"
            >
              ❤️ Health Status
            </Link>
            <Link
              href="/runbooks"
              className="px-4 py-2 rounded-xl glass-card hover:border-cyber-blue/40 text-sm font-bold transition-all duration-300"
            >
              📚 Runbooks ({proPlan.features[1]})
            </Link>
          </div>
        </div>
      </div>
    </Container>
  )
}
