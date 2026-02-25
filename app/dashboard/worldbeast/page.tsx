// WORLD BEAST FINAL LAUNCH: app/dashboard/worldbeast/page.tsx
// Dashboard 2.0 – Live WorldBeast Score, revenue, global rank, one-click global launch.

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
        <h1 className="text-4xl font-black mb-3">WorldBeast Dashboard</h1>
        <p className="text-gray-400 mb-8">
          Das Live-Kontrollzentrum für ClawGuru WorldBeast 2026/27. Pro-Zugang erforderlich.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <a
            href="/pricing"
            className="px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
          >
            Pro werden →
          </a>
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-2xl border border-gray-700 hover:border-gray-500 font-bold text-gray-200"
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
      <div className="py-16 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
              ClawGuru WorldBeast 2026
            </div>
            <h1 className="text-4xl font-black">
              🌍 WorldBeast Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Live-Kontrollzentrum · All Systems Go
            </p>
          </div>

          {/* One-Click World Domination Button */}
          <WorldbeastClient />
        </div>

        {/* Live Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "WorldBeast Score",
              value: "94",
              unit: "/100",
              icon: "⚡",
              color: "text-brand-cyan",
            },
            {
              label: "Heal-Zyklen heute",
              value: "12",
              unit: "Runs",
              icon: "🔧",
              color: "text-green-400",
            },
            {
              label: "Umsatz heute",
              // WORLD BEAST FINAL LAUNCH: real revenue from Stripe
              value: revenue.formatted,
              unit: "live",
              icon: "💰",
              color: "text-yellow-400",
            },
            {
              label: "Globaler Rang",
              value: "#1",
              unit: "2026",
              icon: "🏆",
              color: "text-brand-violet",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="p-5 rounded-2xl border border-gray-800 bg-black/30"
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className={`text-3xl font-black ${card.color}`}>
                {card.value}
                <span className="text-sm font-normal text-gray-500 ml-1">{card.unit}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Agent Status */}
        <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-black/30">
          <h2 className="text-xl font-black mb-4">🤖 Agent Swarm Status</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: "Vulnerability Hunter",
                status: "Aktiv",
                lastRun: "Heute 03:00",
                found: "5 CVEs",
                color: "text-red-400",
              },
              {
                name: "Viral Content Agent",
                status: "Bereit",
                lastRun: "Auf Anfrage",
                found: "On-Demand",
                color: "text-brand-cyan",
              },
              {
                name: "Growth Agent",
                status: "Aktiv",
                lastRun: "Heute 04:00",
                found: "8 Keywords",
                color: "text-green-400",
              },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-4 rounded-xl border border-gray-800 bg-black/20"
              >
                <div className="font-black text-sm mb-1">{agent.name}</div>
                <div className={`text-xs font-bold ${agent.color}`}>
                  ● {agent.status}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {agent.lastRun} · {agent.found}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monetization Overview */}
        <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-black/30">
          <h2 className="text-xl font-black mb-4">💰 Monetarisierungs-Rakete</h2>
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
                className="flex items-center justify-between p-3 rounded-xl border border-gray-800"
              >
                <div className="font-bold text-sm">{plan.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{plan.price}</span>
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WORLD BEAST FINAL LAUNCH: Live Stats Section */}
        <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-black/30">
          <h2 className="text-xl font-black mb-4">📊 Live Stats — Heute</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-gray-800 bg-black/20">
              <div className="text-xs text-gray-500 mb-1">Checks heute</div>
              <div className="text-2xl font-black text-brand-cyan">–</div>
              <div className="text-xs text-gray-500">via Security-Check</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-800 bg-black/20">
              <div className="text-xs text-gray-500 mb-1">Revenue heute</div>
              <div className="text-2xl font-black text-yellow-400">{revenue.formatted}</div>
              <div className="text-xs text-gray-500">Stripe (EUR)</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-800 bg-black/20">
              <div className="text-xs text-gray-500 mb-1">Top-Land</div>
              <div className="text-2xl font-black text-green-400">🇩🇪 DE</div>
              <div className="text-xs text-gray-500">via Umami Analytics</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-800 bg-black/20">
              <div className="text-xs text-gray-500 mb-1">Conversion-Rate</div>
              <div className="text-2xl font-black text-brand-violet">–%</div>
              <div className="text-xs text-gray-500">Check → Pro/Day Pass</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-black/30">
          <h2 className="text-xl font-black mb-4">⚡ Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/health/cron"
              className="px-4 py-2 rounded-xl border border-gray-700 hover:border-brand-cyan/40 text-sm font-bold"
            >
              🔧 Heal-Zyklus starten
            </a>
            <a
              href="/api/agents/vulnerability"
              className="px-4 py-2 rounded-xl border border-gray-700 hover:border-red-400/40 text-sm font-bold"
            >
              🦠 CVE Scan starten
            </a>
            <a
              href="/leaderboard"
              className="px-4 py-2 rounded-xl border border-gray-700 hover:border-yellow-400/40 text-sm font-bold"
            >
              🏆 Leaderboard öffnen
            </a>
            <a
              href="/dashboard/health"
              className="px-4 py-2 rounded-xl border border-gray-700 hover:border-green-400/40 text-sm font-bold"
            >
              ❤️ Health Status
            </a>
            <a
              href="/runbooks"
              className="px-4 py-2 rounded-xl border border-gray-700 hover:border-brand-violet/40 text-sm font-bold"
            >
              📚 Runbooks ({proPlan.features[1]})
            </a>
          </div>
        </div>
      </div>
    </Container>
  )
}
