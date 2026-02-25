'use client'
// WORLD BEAST UPGRADE: app/bounties/BountiesClient.tsx
// Interactive bounty cards with submission form and Stripe integration.

import { useState } from "react"
import type { Bounty } from "@/lib/bounties"

interface Props {
  bounties: Bounty[]
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#00ff9d",
  medium: "#ffcc00",
  hard: "#ff3b5c",
}

const STATUS_COLORS: Record<string, string> = {
  open: "#00ff9d",
  "in-review": "#ffcc00",
  closed: "#888",
}

// WORLD BEAST UPGRADE: Individual bounty card
function BountyCard({ bounty, onSubmit }: { bounty: Bounty; onSubmit: (b: Bounty) => void }) {
  const diffColor = DIFFICULTY_COLORS[bounty.difficulty] ?? "#888"
  const statusColor = STATUS_COLORS[bounty.status] ?? "#888"

  return (
    <div
      className="p-5 rounded-2xl glass-card glass-card-hover flex flex-col gap-3"
      style={{ borderColor: bounty.status === "open" ? "rgba(255, 204, 0, 0.1)" : undefined }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-black text-base leading-snug">{bounty.title}</div>
          <div className="text-xs text-gray-500 mt-0.5 font-mono">{bounty.id}</div>
        </div>
        <div
          className="text-lg font-black whitespace-nowrap"
          style={{ color: "#ffcc00", textShadow: "0 0 15px rgba(255, 204, 0, 0.3)" }}
        >
          €{bounty.rewardEur}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 leading-relaxed">{bounty.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {bounty.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full font-mono"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span
            className="font-bold px-2 py-0.5 rounded-full capitalize"
            style={{ color: diffColor, background: `${diffColor}15`, border: `1px solid ${diffColor}30` }}
          >
            {bounty.difficulty}
          </span>
          <span
            className="font-bold capitalize"
            style={{ color: statusColor }}
          >
            ● {bounty.status}
          </span>
        </div>
        <span className="text-gray-600">{bounty.submissions} submissions</span>
      </div>

      {/* CTA */}
      {bounty.status === "open" && (
        <button
          onClick={() => onSubmit(bounty)}
          className="w-full px-4 py-2.5 rounded-xl font-black text-sm transition-all duration-200"
          style={{
            background: "rgba(255, 204, 0, 0.1)",
            border: "1px solid rgba(255, 204, 0, 0.3)",
            color: "#ffcc00",
          }}
        >
          🎯 Bounty einreichen
        </button>
      )}
      {bounty.status === "in-review" && (
        <div
          className="w-full px-4 py-2.5 rounded-xl font-black text-sm text-center"
          style={{ background: "rgba(255,204,0,0.05)", border: "1px solid rgba(255,204,0,0.15)", color: "#666" }}
        >
          ⏳ In Review
        </div>
      )}
    </div>
  )
}

// WORLD BEAST UPGRADE: Submission modal
function SubmissionModal({ bounty, onClose }: { bounty: Bounty; onClose: () => void }) {
  const [step, setStep] = useState<"form" | "submitting" | "success" | "error">("form")
  const [email, setEmail] = useState("")
  const [runbookUrl, setRunbookUrl] = useState("")
  const [description, setDescription] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep("submitting")

    try {
      const res = await fetch("/api/bounties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bountyId: bounty.id,
          email,
          runbookUrl,
          description,
        }),
      })
      setStep(res.ok ? "success" : "error")
    } catch {
      setStep("error")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-lg rounded-2xl glass-panel p-6">
        {step === "form" && (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Bounty Submission</div>
                <h3 className="font-black text-lg">{bounty.title}</h3>
                <div className="text-sm font-black mt-1" style={{ color: "#ffcc00" }}>€{bounty.rewardEur}</div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl font-bold">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">E-Mail (für Payout)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-yellow-400/40"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Runbook / Write-up URL</label>
                <input
                  type="url"
                  required
                  value={runbookUrl}
                  onChange={e => setRunbookUrl(e.target.value)}
                  placeholder="https://your-writeup.example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-yellow-400/40"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Kurze Beschreibung</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Beschreibe deinen Finding in 2-3 Sätzen..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-gray-200 focus:outline-none focus:border-yellow-400/40 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl font-black text-sm"
                  style={{ background: "linear-gradient(135deg, #ffcc00, #ff6b35)", color: "#000" }}
                >
                  🎯 Einreichen →
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-gray-400 hover:text-gray-200"
                >
                  Abbrechen
                </button>
              </div>
              <p className="text-xs text-gray-600">
                Payout nach Review und Verifikation via Stripe. Maximal 72h.
              </p>
            </form>
          </>
        )}

        {step === "submitting" && (
          <div className="py-12 text-center">
            <div className="text-4xl mb-4 animate-pulse">⏳</div>
            <div className="font-black">Submitting...</div>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <div className="font-black text-xl mb-2">Submission eingegangen!</div>
            <p className="text-gray-400 text-sm mb-6">
              Wir reviewen deinen Finding und melden uns innerhalb von 72h per E-Mail.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold text-sm border border-white/10 text-gray-200"
            >
              Schließen
            </button>
          </div>
        )}

        {step === "error" && (
          <div className="py-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <div className="font-black text-xl mb-2">Fehler bei der Einreichung</div>
            <p className="text-gray-400 text-sm mb-6">Bitte versuche es erneut oder kontaktiere uns.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep("form")} className="px-6 py-2.5 rounded-xl font-bold text-sm border border-white/10 text-gray-200">
                Erneut versuchen
              </button>
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500">
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BountiesClient({ bounties }: Props) {
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null)
  const [filter, setFilter] = useState<"all" | "easy" | "medium" | "hard">("all")

  const filtered = filter === "all" ? bounties : bounties.filter(b => b.difficulty === filter)

  return (
    <div>
      {/* WORLD BEAST UPGRADE: Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "easy", "medium", "hard"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 capitalize"
            style={{
              background: filter === f ? "rgba(255, 204, 0, 0.1)" : "rgba(255,255,255,0.04)",
              border: filter === f ? "1px solid rgba(255, 204, 0, 0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: filter === f ? "#ffcc00" : "#888",
            }}
          >
            {f === "all" ? `Alle (${bounties.length})` : f}
          </button>
        ))}
      </div>

      {/* WORLD BEAST UPGRADE: Bounty grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((bounty) => (
          <BountyCard key={bounty.id} bounty={bounty} onSubmit={setSelectedBounty} />
        ))}
      </div>

      {/* WORLD BEAST UPGRADE: Submission modal */}
      {selectedBounty && (
        <SubmissionModal bounty={selectedBounty} onClose={() => setSelectedBounty(null)} />
      )}
    </div>
  )
}
