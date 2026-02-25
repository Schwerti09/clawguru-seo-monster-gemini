// WORLD BEAST UPGRADE: app/bounties/page.tsx
// Community Bounty System – security researchers earn rewards for finding and
// documenting vulnerabilities. Stripe payout integration.

import type { Metadata } from "next"
import Container from "@/components/shared/Container"
import BountiesClient from "./BountiesClient"
import { BOUNTIES } from "@/lib/bounties"

export const metadata: Metadata = {
  title: "Security Bounties | ClawGuru 2026",
  description:
    "Finde Schwachstellen, dokumentiere sie als Runbook, und verdiene Bounties. Community-driven security intelligence.",
  alternates: { canonical: "/bounties" },
}

export const revalidate = 300

export default function BountiesPage() {
  const totalPool = BOUNTIES.filter(b => b.status === "open").reduce((s, b) => s + b.rewardEur, 0)
  const openCount = BOUNTIES.filter(b => b.status === "open").length

  return (
    <Container>
      <div className="py-12 max-w-5xl mx-auto">
        {/* WORLD BEAST UPGRADE: Header */}
        <div className="mb-2 text-xs uppercase tracking-widest" style={{ color: "#ffcc00" }}>
          ▸ Community Bounty Program · WorldBeast 2026
        </div>
        <h1 className="text-4xl font-black font-heading mb-3">
          💰 Security Bounties
        </h1>
        <p className="text-gray-400 mb-8 max-w-2xl">
          Finde Schwachstellen, erstelle Runbooks, und verdiene Bounties. Payouts via Stripe direkt auf dein Konto.
        </p>

        {/* WORLD BEAST UPGRADE: Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bounty Pool", value: `€${totalPool.toLocaleString()}`, color: "#ffcc00" },
            { label: "Offene Bounties", value: String(openCount), color: "#00ff9d" },
            { label: "Schwierigkeitsstufen", value: "Easy → Hard", color: "#00b8ff" },
            { label: "Payout via", value: "Stripe", color: "#ff3b5c" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl glass-card">
              <div className="text-xl font-black font-heading" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* WORLD BEAST UPGRADE: Bounty list + submission form (client component) */}
        <BountiesClient bounties={BOUNTIES} />

        {/* WORLD BEAST UPGRADE: How it works */}
        <div className="mt-10 p-6 rounded-2xl glass-panel">
          <h2 className="text-xl font-black font-heading mb-4">🔍 So funktioniert es</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              ["1. Finden", "Entdecke eine Schwachstelle in der Bounty-Liste"],
              ["2. Dokumentieren", "Erstelle ein detailliertes Runbook mit Reproduktionsschritten"],
              ["3. Einreichen", "Submit via Formular – Review innerhalb von 72h"],
              ["4. Verdienen", "Bei Akzeptanz: Stripe Payout direkt auf dein Konto"],
            ].map(([title, desc]) => (
              <div key={title} className="p-4 rounded-xl glass-card">
                <div className="font-black text-sm mb-1">{title}</div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WORLD BEAST UPGRADE: Rules */}
        <div className="mt-6 p-5 rounded-2xl border border-white/5 bg-black/20">
          <h3 className="font-black mb-3">📋 Regeln</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex gap-2"><span className="text-gray-600">•</span> Nur originäre Findings. Keine duplizierten CVEs.</li>
            <li className="flex gap-2"><span className="text-gray-600">•</span> Verantwortungsvolle Offenlegung: Kein aktiver Exploit ohne Review.</li>
            <li className="flex gap-2"><span className="text-gray-600">•</span> Das Runbook muss reproduzierbar und dokumentiert sein.</li>
            <li className="flex gap-2"><span className="text-gray-600">•</span> Payout nach Editor-Review und Verifikation (max. 72h).</li>
            <li className="flex gap-2"><span className="text-gray-600">•</span> Mit der Einreichung überträgst du ClawGuru das nicht-exklusive Recht zur Veröffentlichung.</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}
