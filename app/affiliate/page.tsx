"use client"

import { useState } from "react"

type Stats = {
  code: string
  sales: number
  total_revenue_cents: number
  commission_paid_cents: number
  commission_pending_cents: number
  currency: string
}

function formatMoney(cents: number, currency = "eur") {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(cents / 100)
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string | number
  sub?: string
  color?: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">{label}</div>
      <div className="text-3xl font-black" style={{ color: color || "#fff" }}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  )
}

export default function AffiliateDashboard() {
  const [code, setCode] = useState("")
  const [secret, setSecret] = useState("")
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://clawguru.org"
  const referralLink = code ? `${siteUrl}/pricing?aff=${encodeURIComponent(code)}` : ""

  async function fetchStats(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setStats(null)
    try {
      const res = await fetch(`/api/affiliate/stats?code=${encodeURIComponent(code)}`, {
        headers: { "x-aff-secret": secret },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Fehler beim Laden der Stats")
      setStats(data as Stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#05060A] text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-block text-[11px] font-mono uppercase tracking-[0.25em] px-4 py-1 rounded-full border mb-5"
            style={{ borderColor: "rgba(0,184,255,0.3)", color: "#00b8ff", background: "rgba(0,184,255,0.06)" }}>
            Affiliate · Partner Dashboard
          </div>
          <h1 className="text-4xl font-black font-heading leading-tight">
            Dein Affiliate Dashboard
          </h1>
          <p className="mt-3 text-gray-400 text-base">
            Teile deinen Link, verdiene Provisionen – vollautomatisch via Stripe.
          </p>
        </div>

        {/* Login form */}
        {!stats && (
          <form onSubmit={fetchStats} className="rounded-3xl border border-white/10 p-7 space-y-4"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                Affiliate Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.trim())}
                placeholder="z.B. PRO_DEV"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                Dashboard Secret
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Dein persönliches Dashboard-Passwort"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-black text-black transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #00b8ff 0%, #0077ff 100%)" }}
            >
              {loading ? "Laden…" : "Stats anzeigen →"}
            </button>
          </form>
        )}

        {/* Stats */}
        {stats && (
          <div className="space-y-6">
            {/* Referral Link */}
            <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-2">Dein Referral Link</div>
              <div className="flex items-center gap-3 mt-2">
                <code className="flex-1 bg-black/40 rounded-xl px-4 py-2 text-cyan-300 text-sm break-all">
                  {referralLink}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(referralLink)}
                  className="shrink-0 px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:border-white/20 transition"
                >
                  Kopieren
                </button>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <StatCard
                label="Erfolgreiche Sales"
                value={stats.sales}
                sub="Kunden, die über deinen Link gekauft haben"
                color="#00ff9d"
              />
              <StatCard
                label="Generierter Umsatz"
                value={formatMoney(stats.total_revenue_cents, stats.currency)}
                sub="Gesamt-Umsatz deiner Kunden"
              />
              <StatCard
                label="Ausstehende Provision"
                value={formatMoney(stats.commission_pending_cents, stats.currency)}
                sub="Wird nach 30-Tage-Haltefrist ausgezahlt"
                color="#facc15"
              />
              <StatCard
                label="Ausgezahlte Provision"
                value={formatMoney(stats.commission_paid_cents, stats.currency)}
                sub="Bereits an dein Stripe-Konto transferiert"
                color="#00b8ff"
              />
            </div>

            {/* Info */}
            <div className="rounded-2xl border border-white/8 p-5 space-y-3 text-sm text-gray-400"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <p>
                <span className="text-white font-semibold">Provisionen:</span>{" "}
                30 % auf Day Pass · 20 % lifetime auf Pro/Team-Abos
              </p>
              <p>
                <span className="text-white font-semibold">Auszahlung:</span>{" "}
                Automatisch via Stripe Connect, 30 Tage nach Zahlung (Chargeback-Schutz).
              </p>
              <p>
                <span className="text-white font-semibold">Self-Referral:</span>{" "}
                Käufe über deinen eigenen Link werden nicht provisioniert.
              </p>
            </div>

            <button
              onClick={() => { setStats(null); setError(null) }}
              className="text-sm text-gray-500 hover:text-gray-300 underline"
            >
              Ausloggen
            </button>
          </div>
        )}

        {/* How it works */}
        {!stats && (
          <div className="mt-10 rounded-2xl border border-white/8 p-7 text-sm text-gray-400"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-4">
              Wie funktioniert es?
            </div>
            <ol className="space-y-3 list-decimal list-inside">
              <li>Du erhältst einen persönlichen Affiliate-Code (z.B. <code className="text-cyan-300">PRO_DEV</code>).</li>
              <li>Teile deinen Link: <code className="text-cyan-300">clawguru.org/pricing?aff=PRO_DEV</code></li>
              <li>Wenn jemand darüber kauft, wird der Code 60 Tage in einem Cookie gespeichert.</li>
              <li>Bei jeder Zahlung wird automatisch eine Provision berechnet und via Stripe Connect überwiesen.</li>
              <li>Auszahlung nach 30-Tage-Haltefrist (Chargeback-Schutz).</li>
            </ol>
            <p className="mt-4">
              Interesse? Schreib uns an{" "}
              <a href="mailto:affiliate@clawguru.org" className="text-cyan-300 underline">
                affiliate@clawguru.org
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
