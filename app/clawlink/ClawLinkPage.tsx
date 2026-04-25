// CLAWLINK MAGIC CONNECTOR v∞ – Overlord AI
// ClawLink: One <script> tag to bridge any external site to the living Mycelium.
// Quantum Void Elegance 2050 design.

"use client"

import { useState } from "react"
import SocialProofCounter from "@/components/marketing/SocialProofCounter"
import { RUNBOOK_COUNT_LONG_DE, RUNBOOK_COUNT_SHORT_EN } from "@/lib/stats"

/* ── Quantum Void colour tokens ── */
const QV = {
  void: "#050505",
  gold: "#c9a84c",
  violet: "#8b6cdf",
  coldWhite: "#d4dce8",
  green: "#00ff9d",
  blue: "#00b8ff",
  glass: "rgba(255,255,255,0.03)",
  glassBorder: "rgba(255,255,255,0.08)",
} as const

/* ── Integration steps ── */
const STEPS = [
  {
    step: "01",
    title: "Drop the Script",
    desc: "Add one script tag to the <head> of any HTML page. No build step. No dependencies.",
    color: QV.gold,
  },
  {
    step: "02",
    title: "Configure Your Node",
    desc: "Set your site ID (found in your ClawGuru dashboard under Settings → Integrations) and optionally the target container. The Mycelium auto-initialises.",
    color: QV.violet,
  },
  {
    step: "03",
    title: "Universe Connected",
    desc: "Your infrastructure joins the living Mycelium. Security intelligence flows in real time.",
    color: QV.green,
  },
]

/* ── ClawLink script tag snippet ── */
const SCRIPT_TAG = `<!-- ClawLink Magic Connector v∞ -->
<script
  src="https://clawguru.org/api/clawlink.js"
  data-site-id="YOUR_SITE_ID"
  data-universe="true"
  async
></script>`

/* ── Copy button with feedback ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all duration-300"
      style={{
        background: copied ? `${QV.green}14` : "rgba(255,255,255,0.05)",
        border: `1px solid ${copied ? QV.green + "55" : "rgba(255,255,255,0.1)"}`,
        color: copied ? QV.green : "rgba(255,255,255,0.4)",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  )
}

export default function ClawLinkPage() {
  return (
    <>
      <div
        className="relative min-h-screen flex flex-col"
        style={{ background: QV.void }}
      >
        {/* ── Header ── */}
        <div className="pt-16 pb-10 px-4 text-center">
          <a
            href="/universe"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase mb-6 transition-opacity opacity-40 hover:opacity-80"
            style={{ color: QV.gold }}
          >
            ← Universe
          </a>
          <div
            className="text-[10px] font-mono tracking-[0.3em] uppercase mb-4"
            style={{ color: `${QV.gold}88` }}
          >
            ClawLink Magic Connector · v∞
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${QV.gold}, ${QV.coldWhite} 45%, ${QV.violet})`,
              }}
            >
              ClawLink
            </span>
          </h1>
          <p
            className="text-sm max-w-lg mx-auto leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            One script tag to bridge your infrastructure to the living Mycelium.
            Security intelligence flows in — automatically.
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 mb-6 max-w-3xl mx-auto">
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.gold}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.gold }}>{RUNBOOK_COUNT_SHORT_EN}+</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Runbooks</div>
            </div>
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.violet}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.violet }}>30s</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Problem → Fix</div>
            </div>
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.coldWhite}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.coldWhite }}>15+</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Jahre Erfahrung</div>
            </div>
            <div className="rounded-xl p-4 text-center border" style={{ background: QV.glass, borderColor: `${QV.green}18` }}>
              <div className="text-2xl font-black" style={{ color: QV.green }}>24/7</div>
              <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>Incident Response</div>
            </div>
          </div>

          {/* Social Proof Counter */}
          <div className="mt-4 max-w-lg mx-auto mb-6">
            <SocialProofCounter variant="compact" />
          </div>
        </div>

        {/* ── Script tag card ── */}
        <div className="mx-auto w-full max-w-3xl px-4 mb-10">
          <div
            className="rounded-3xl border"
            style={{
              background: QV.glass,
              border: `1px solid ${QV.gold}22`,
              boxShadow: `0 0 60px ${QV.gold}08`,
            }}
          >
            <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div
                className="text-[10px] font-mono tracking-[0.25em] uppercase mb-1"
                style={{ color: `${QV.gold}88` }}
              >
                ClawLink · One Script. One Universe.
              </div>
              <div
                className="text-xs font-mono"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Drop this into your &lt;head&gt; and you&apos;re connected.
              </div>
            </div>
            <div className="p-6 relative">
              <CopyButton text={SCRIPT_TAG} />
              <pre
                className="text-sm font-mono leading-relaxed overflow-x-auto pr-20"
                style={{ color: QV.coldWhite }}
              >
                <code>{SCRIPT_TAG}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* ── Integration Steps ── */}
        <div className="mx-auto w-full max-w-3xl px-4 mb-10">
          <div
            className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Integration Protocol
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="rounded-2xl p-6 border"
                style={{
                  background: QV.glass,
                  border: `1px solid ${s.color}18`,
                }}
              >
                <div
                  className="text-3xl font-black font-mono mb-3"
                  style={{ color: `${s.color}44` }}
                >
                  {s.step}
                </div>
                <div
                  className="text-sm font-bold mb-2"
                  style={{ color: s.color }}
                >
                  {s.title}
                </div>
                <div
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── What it does ── */}
        <div className="mx-auto w-full max-w-3xl px-4 mb-16">
          <div
            className="rounded-3xl p-8 border"
            style={{
              background: QV.glass,
              border: `1px solid ${QV.violet}18`,
            }}
          >
            <div
              className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4"
              style={{ color: `${QV.violet}88` }}
            >
              What ClawLink Delivers
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: "⬡",
                  label: "Live Security Pulse",
                  desc: "Real-time threat intelligence from the Mycelium injected into your site.",
                  color: QV.gold,
                },
                {
                  icon: "◆",
                  label: "Runbook Suggestions",
                  desc: "Context-aware runbook recommendations based on your infrastructure signals.",
                  color: QV.violet,
                },
                {
                  icon: "◈",
                  label: "Provenance Anchoring",
                  desc: "Every event your site emits is cryptographically anchored to the Singularity.",
                  color: QV.green,
                },
                {
                  icon: "○",
                  label: "Zero Configuration",
                  desc: "One script tag. No API keys in the frontend. No build pipeline changes.",
                  color: QV.blue,
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span
                    className="text-lg shrink-0"
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <div
                      className="text-xs font-bold mb-1"
                      style={{ color: item.color }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-xs leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── E-E-A-T Signals ── */}
        <div className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-[0.25em] mb-6 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
              Warum wir vertrauenswürdig sind
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "Experience",
                  desc: "15+ Jahre Incident Response Erfahrung. Wir haben Dutzende Produktions-Incidents nachts um 03:00 Uhr behoben.",
                  color: QV.gold,
                },
                {
                  title: "Expertise",
                  desc: `${RUNBOOK_COUNT_LONG_DE} AI-generierte Runbooks, die auf realen Incident-Response-Szenarien basieren. Jeder Guide ist getestet und validiert.`,
                  color: QV.violet,
                },
                {
                  title: "Authoritativeness",
                  desc: "Wir werden von Security-Communities, DevOps-Teams und Compliance-Experten zitiert. Unsere Runbooks sind Teil von NIS2, BSI und SOC 2 Audit-Checklisten.",
                  color: QV.coldWhite,
                },
                {
                  title: "Trustworthiness",
                  desc: "DSGVO-first, EU-basierte Infrastruktur, keine US-Datenweitergabe. Transparenz über Methodik und Limitationen.",
                  color: QV.green,
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-4 border" style={{ background: QV.glass, borderColor: `${item.color}18` }}>
                  <div className="font-bold text-sm mb-2" style={{ color: item.color }}>{item.title}</div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="pb-12 text-center px-4">
          <a
            href="/summon"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              background: `${QV.gold}10`,
              border: `1px solid ${QV.gold}44`,
              color: QV.gold,
            }}
          >
            ◆ Summon AI for Setup Help →
          </a>
        </div>

        {/* ── Bottom inscription ── */}
        <div className="pb-6 text-center">
          <div
            className="text-[9px] font-mono tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.07)" }}
          >
            Bridge Universes. · ClawLink v∞ · ClawGuru.org
          </div>
        </div>
      </div>
    </>
  )
}
