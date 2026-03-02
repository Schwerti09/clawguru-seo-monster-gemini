// CLAWLINK MAGIC CONNECTOR v∞ – Overlord AI
// ClawLink: One <script> tag to bridge any external site to the living Mycelium.
// Quantum Void Elegance 2050 design.

"use client"

import { useState } from "react"

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
