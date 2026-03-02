"use client"
import Link from "next/link"
// FULL PASSIVE WELTMACHT: app/dashboard/health/PassiveModePanel.tsx
// Client component: activates full passive mode + shows live revenue stats.

import { useState } from "react"
import type { AccessPlan } from "@/lib/access-token"

type Props = {
  canActivate: boolean
  plan: AccessPlan
}

export default function PassiveModePanel({ canActivate, plan }: Props) {
  // FULL PASSIVE WELTMACHT: local activation state (persists via cron env flag server-side)
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [revenueEur, setRevenueEur] = useState<string | null>(null)
  const [minutesWorked] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // FULL PASSIVE WELTMACHT: activate by calling a dedicated server-side activate endpoint
  // (never sends CRON_SECRET from the client – that stays server-only)
  async function activate() {
    if (!canActivate) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/health/activate-passive", { method: "POST" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string })?.error || "Aktivierung fehlgeschlagen.")
        return
      }
      const data = await res.json()
      setActive(true)
      // FULL PASSIVE WELTMACHT: show today's revenue from the activation report
      if (data?.daily?.revenue?.formatted) {
        setRevenueEur(data.daily.revenue.formatted)
      }
    } catch {
      setError("Verbindungsfehler – bitte erneut versuchen.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 space-y-6">
      {/* FULL PASSIVE WELTMACHT: live stats banner */}
      {active && (
        <div className="p-6 rounded-3xl border border-green-700 bg-green-950/30 flex flex-wrap items-center gap-4">
          <div className="text-4xl">🛋️</div>
          <div>
            <div className="text-2xl font-black text-green-400">
              Du hast heute{" "}
              <span className="text-white">{minutesWorked} Minuten</span> gearbeitet
              {revenueEur && (
                <>
                  {" "}und{" "}
                  <span className="text-green-300">{revenueEur}</span> verdient
                </>
              )}
            </div>
            <div className="text-green-500 text-sm mt-1 font-semibold">
              FULL PASSIVE MODE AKTIV ✅
            </div>
          </div>
        </div>
      )}

      {/* FULL PASSIVE WELTMACHT: main activation card */}
      <div className="p-8 rounded-3xl border border-gray-800 bg-black/30">
        <div className="text-xs uppercase tracking-widest text-gray-400 mb-2">
          {plan === "team" ? "Team Pro" : "Pro"} Feature
        </div>
        <h2 className="text-2xl font-black mb-3">Full Passive Mode</h2>
        <p className="text-gray-300 text-sm mb-6 max-w-xl">
          Ein Klick – ClawGuru erledigt den Rest. Runbooks werden täglich geheilt und neu
          generiert, Sitemaps aktualisiert, und du bekommst deinen täglichen Kassenbericht
          per E-Mail. Füße hochlegen.
        </p>

        {canActivate ? (
          <button
            onClick={activate}
            disabled={loading || active}
            className={[
              "px-8 py-4 rounded-2xl font-black text-lg transition-all",
              active
                ? "bg-green-700 text-white cursor-default"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-black",
              loading ? "opacity-60 cursor-wait" : "",
            ].join(" ")}
          >
            {loading
              ? "⏳ Aktiviere..."
              : active
              ? "✅ FULL PASSIVE MODE AKTIV"
              : "🚀 ACTIVATE FULL PASSIVE MODE"}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="text-gray-500 text-sm">
              Day-Pass-Inhaber können den Status einsehen, aber den automatischen Modus nicht
              aktivieren. Upgrade auf Pro oder Team.
            </div>
            <Link
              href="/pricing"
              className="inline-flex px-6 py-3 rounded-2xl font-black bg-gradient-to-r from-brand-cyan to-brand-violet hover:opacity-90"
            >
              Auf Pro upgraden →
            </Link>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-400 text-sm">{error}</p>
        )}
      </div>

      {/* FULL PASSIVE WELTMACHT: what happens automatically */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          ["🔧", "Auto-Heal", "Stale Runbooks werden täglich via Gemini neu geschrieben – bessere Titel, frische 2026-Daten."],
          ["✨", "Auto-Generate", "5–10 neue Runbooks pro Tag: neue Cloud-Provider, aktuelle CVEs, neue Angriffsmuster."],
          ["📬", "Täglicher Report", "Morgens landet dein Kassenbericht in der Inbox: Health Score, Einnahmen, nächster Schritt."],
        ].map(([icon, title, desc]) => (
          <div key={title} className="p-6 rounded-3xl border border-gray-800 bg-black/30">
            <div className="text-3xl mb-3">{icon}</div>
            <div className="font-black text-lg mb-2">{title}</div>
            <div className="text-gray-400 text-sm">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
