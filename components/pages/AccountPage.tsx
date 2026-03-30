"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Container from "@/components/shared/Container"
import { useI18n } from "@/components/i18n/I18nProvider"

type SavedCheck = { url: string; score: number; savedAt: string }
type RunbookEntry = { title: string; slug: string; visitedAt: string }

const MAX_DAYPASS_CHECKS = 5

export default function AccountPage({ email }: { email: string }) {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const [savedChecks, setSavedChecks] = useState<SavedCheck[]>([])
  const [runbookHistory, setRunbookHistory] = useState<RunbookEntry[]>([])

  useEffect(() => {
    try {
      setSavedChecks(JSON.parse(localStorage.getItem("cg_saved_checks") || "[]"))
      setRunbookHistory(JSON.parse(localStorage.getItem("cg_runbook_history") || "[]"))
    } catch {
      /* ignore parse errors */
    }
  }, [])

  function exportData() {
    const data = {
      email,
      exportedAt: new Date().toISOString(),
      savedChecks,
      runbookHistory,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `clawguru-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const atSavedCheckLimit = savedChecks.length >= MAX_DAYPASS_CHECKS

  return (
    <Container>
      <div className="py-16 max-w-3xl mx-auto">
        {/* Enter Dashboard CTA */}
        <div className="mb-8">
          <Link
            href={`${prefix}/dashboard`}
            className="flex items-center justify-between p-5 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/5 hover:border-[#c9a84c]/60 hover:bg-[#c9a84c]/10 transition-all group"
          >
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-[#c9a84c] mb-1">
                Command Cockpit
              </div>
              <div className="text-lg font-black text-white group-hover:text-[#c9a84c] transition-colors">
                → Dashboard öffnen
              </div>
              <p className="mt-1 text-sm text-gray-400">Overview, Mycelium-Graph, Tools, Executions, Billing</p>
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}
            >
              <span className="text-[#c9a84c] text-lg font-bold">→</span>
            </div>
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#c9a84c] mb-1">
              Account
            </div>
            <h1 className="text-3xl font-black break-all">{email}</h1>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={exportData}
              className="px-4 py-2 rounded-xl border border-gray-700 text-sm text-gray-300
                         hover:border-gray-500 transition-colors"
            >
              Export Data
            </button>
            <a
              href="/api/auth/logout"
              className="px-4 py-2 rounded-xl border border-red-900 text-sm text-red-400
                         hover:border-red-700 transition-colors"
            >
              Logout
            </a>
          </div>
        </div>

        {/* Saved Checks */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-xl font-black">Saved Checks</h2>
            {/* Day-pass limit indicator */}
            {savedChecks.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{savedChecks.length}&thinsp;/&thinsp;{MAX_DAYPASS_CHECKS}</span>
                <span className="hidden sm:inline">gespeichert (Day Pass Limit)</span>
              </div>
            )}
          </div>

          {/* Upgrade nudge when at limit */}
          {atSavedCheckLimit && (
            <div className="mb-4 flex items-center justify-between gap-4 px-4 py-3 rounded-xl border"
              style={{ borderColor: "rgba(139,92,246,0.4)", background: "rgba(139,92,246,0.07)" }}>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span aria-hidden>🔒</span>
                <span>Du hast das Limit von <strong className="text-white">{MAX_DAYPASS_CHECKS} Saved Checks</strong> erreicht (Day Pass).</span>
              </div>
              <a
                href={`${prefix}/pricing#pro`}
                className="shrink-0 px-4 py-1.5 rounded-xl font-black text-xs text-black transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg,#a78bfa 0%,#00ff9d 100%)" }}
              >
                Upgrade to Pro →
              </a>
            </div>
          )}

          {savedChecks.length === 0 ? (
            <div className="p-6 rounded-2xl border border-gray-800 bg-black/30 text-gray-500 text-sm text-center">
              Noch keine gespeicherten Checks. Führe einen Check durch und klick
              &ldquo;Save&rdquo;.
            </div>
          ) : (
            <div className="space-y-3">
              {savedChecks.map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-800 bg-black/30 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="font-mono text-sm truncate">{c.url}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Date(c.savedAt).toLocaleString("de-DE")}
                    </div>
                  </div>
                  <div
                    className="text-2xl font-black shrink-0"
                    style={{
                      color:
                        c.score >= 80
                          ? "#22c55e"
                          : c.score >= 50
                          ? "#eab308"
                          : "#ef4444",
                    }}
                  >
                    {c.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pro feature callouts */}
        <section className="mb-10">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Private Nodes */}
            <div className="p-5 rounded-2xl border flex items-start gap-3"
              style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.05)" }}>
              <span className="text-xl mt-0.5" aria-hidden>🔒</span>
              <div className="min-w-0">
                <div className="font-black text-sm text-white mb-0.5">Private Nodes</div>
                <div className="text-xs text-gray-400 mb-3">Erstelle private Runbook-Forks, die nur du siehst.</div>
                <a href={`${prefix}/pricing#pro`} className="text-xs font-bold text-[#a78bfa] hover:underline underline-offset-2">
                  Upgrade to Pro →
                </a>
              </div>
            </div>

            {/* Darwinian Feed */}
            <div className="p-5 rounded-2xl border flex items-start gap-3"
              style={{ borderColor: "rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.05)" }}>
              <span className="text-xl mt-0.5" aria-hidden>🧬</span>
              <div className="min-w-0">
                <div className="font-black text-sm text-white mb-0.5">Darwinian Feed</div>
                <div className="text-xs text-gray-400 mb-3">Dein personalisierter Security-Intelligence-Feed.</div>
                <a href={`${prefix}/pricing#pro`} className="text-xs font-bold text-[#a78bfa] hover:underline underline-offset-2">
                  Upgrade to Pro →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Runbook History */}
        <section>
          <h2 className="text-xl font-black mb-4">Runbook History</h2>
          {runbookHistory.length === 0 ? (
            <div className="p-6 rounded-2xl border border-gray-800 bg-black/30 text-gray-500 text-sm text-center">
              Noch keine besuchten Runbooks.
            </div>
          ) : (
            <div className="space-y-2">
              {runbookHistory.slice(0, 20).map((r, i) => (
                <a
                  key={i}
                  href={`${prefix}/runbook/${r.slug}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-800
                             bg-black/30 hover:border-gray-600 transition-colors"
                >
                  <span className="text-sm truncate">{r.title}</span>
                  <span className="text-xs text-gray-500 shrink-0 ml-4">
                    {new Date(r.visitedAt).toLocaleString("de-DE")}
                  </span>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </Container>
  )
}
