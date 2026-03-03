"use client"

import { useState, useEffect } from "react"
import Container from "@/components/shared/Container"

type SavedCheck = { url: string; score: number; savedAt: string }
type RunbookEntry = { title: string; slug: string; visitedAt: string }

export default function AccountPage({ email }: { email: string }) {
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

  return (
    <Container>
      <div className="py-16 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-[#c9a84c] mb-1">
              Account
            </div>
            <h1 className="text-3xl font-black break-all">{email}</h1>
          </div>
          <div className="flex gap-3">
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
          <h2 className="text-xl font-black mb-4">Saved Checks</h2>
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
                  href={`/de/runbook/${r.slug}`}
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
