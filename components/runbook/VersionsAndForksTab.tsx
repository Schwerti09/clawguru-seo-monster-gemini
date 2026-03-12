"use client"
/**
 * Runbook Versioning + Community Fork – Mycelium Core
 *
 * Tab component embedded in /runbook/[slug] and /[lang]/runbook/[slug].
 * Shows:
 *   • Versions History  – all canonical + fork versions with diff-view
 *   • Community Forks   – user-created forks with "Fork & Evolve" CTA
 *   • Merge Requests    – submit / view merge requests (requires login)
 */

import { useState, useEffect, useCallback } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"
import type { RunbookVersion, MergeRequest } from "@/lib/runbook-versions"

// ── Diff helpers ─────────────────────────────────────────────────────────────

function diffColor(kind: "added" | "changed" | "removed") {
  if (kind === "added") return "text-emerald-400"
  if (kind === "removed") return "text-red-400"
  return "text-yellow-400"
}

function diffIcon(kind: "added" | "changed" | "removed") {
  if (kind === "added") return "+"
  if (kind === "removed") return "−"
  return "~"
}

function sourceBadge(source: RunbookVersion["source"]) {
  switch (source) {
    case "genesis":
      return "border-gray-600/60 bg-gray-700/20 text-gray-400"
    case "evolution":
      return "border-violet-500/50 bg-violet-500/10 text-violet-300"
    case "darwinian":
      return "border-amber-500/60 bg-amber-500/10 text-amber-300"
    case "fork":
      return "border-cyan-500/50 bg-cyan-500/10 text-cyan-300"
  }
}

function sourceLabel(source: RunbookVersion["source"]) {
  switch (source) {
    case "genesis":    return "⏱ Genesis"
    case "evolution":  return "⚗ Evolution"
    case "darwinian":  return "🧬 Darwinian"
    case "fork":       return "🌿 Fork"
  }
}

// ── Version card ─────────────────────────────────────────────────────────────

function VersionCard({ v, onFork }: { v: RunbookVersion; onFork?: () => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-black ${sourceBadge(v.source)}`}>
          {sourceLabel(v.source)}
        </span>
        <span className="text-xs font-mono text-gray-500">{v.version}</span>
        <span className="text-xs text-gray-600">{v.timestamp}</span>
        <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 text-xs font-bold text-cyan-300">
          ⚡ {v.score}
        </span>
      </div>
      <div className="text-sm font-bold text-gray-200">{v.label}</div>
      <div className="mt-1 text-xs text-gray-400">{v.changes}</div>
      {v.forkedBy && (
        <div className="mt-1 text-xs text-gray-600">by {v.forkedBy}</div>
      )}

      {v.diffs.length > 0 && (
        <button
          className="mt-3 text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "▲ Diff ausblenden" : "▼ Diff anzeigen"}
        </button>
      )}

      {open && v.diffs.length > 0 && (
        <div className="mt-3 rounded-xl border border-gray-800 bg-black/40 p-3 font-mono text-xs space-y-1">
          {v.diffs.map((d, i) => (
            <div key={i} className={`flex gap-2 ${diffColor(d.kind)}`}>
              <span className="shrink-0 w-3 font-black">{diffIcon(d.kind)}</span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      )}

      {onFork && (
        <button
          onClick={onFork}
          className="mt-4 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/8 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
        >
          🌿 Fork this version
        </button>
      )}
    </div>
  )
}

// ── Merge request card ────────────────────────────────────────────────────────

function MrCard({ mr }: { mr: MergeRequest }) {
  const statusColor =
    mr.status === "approved"
      ? "text-emerald-400 border-emerald-500/40"
      : mr.status === "rejected"
        ? "text-red-400 border-red-500/40"
        : "text-yellow-400 border-yellow-500/40"
  return (
    <div className="rounded-2xl border border-gray-800 bg-black/20 p-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold ${statusColor}`}>
          {mr.status === "approved" ? "✓ Approved" : mr.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
        </span>
        <span className="text-xs text-gray-600">{mr.createdAt}</span>
      </div>
      <div className="text-sm font-bold text-gray-200">{mr.title}</div>
      {mr.description && <div className="mt-1 text-xs text-gray-400">{mr.description}</div>}
      <div className="mt-1 text-xs text-gray-600">from {mr.userEmail}</div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  slug: string
}

type Tab = "versions" | "forks" | "merge-requests"

export default function VersionsAndForksTab({ slug }: Props) {
  const { locale } = useI18n()
  const prefix = `/${locale}`
  const [tab, setTab] = useState<Tab>("versions")
  const [versions, setVersions] = useState<RunbookVersion[]>([])
  const [mrs, setMrs] = useState<MergeRequest[]>([])
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [forkLoading, setForkLoading] = useState(false)
  const [forkMsg, setForkMsg] = useState<string | null>(null)
  const [mrForm, setMrForm] = useState({ versionId: "", title: "", description: "" })
  const [mrMsg, setMrMsg] = useState<string | null>(null)
  const [mrLoading, setMrLoading] = useState(false)

  // Fetch session
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) setUserEmail(d.email) })
      .catch(() => {})
  }, [])

  // Fetch versions
  const loadVersions = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/runbook/${slug}/versions`)
      const data = await r.json()
      setVersions(data.versions ?? [])
    } finally {
      setLoading(false)
    }
  }, [slug])

  // Fetch merge requests
  const loadMrs = useCallback(async () => {
    if (!userEmail) return
    try {
      const r = await fetch(`/api/runbook/${slug}/merge-request`)
      const data = await r.json()
      setMrs(data.mergeRequests ?? [])
    } catch {}
  }, [slug, userEmail])

  useEffect(() => {
    loadVersions()
  }, [loadVersions])

  useEffect(() => {
    if (tab === "merge-requests") loadMrs()
  }, [tab, loadMrs])

  // Fork & Evolve action
  async function handleForkEvolve(evolve: boolean, sourceVersion?: RunbookVersion) {
    if (!userEmail) {
      setForkMsg("⚠ Bitte einloggen, um zu forken.")
      return
    }
    setForkLoading(true)
    setForkMsg(null)
    try {
      const r = await fetch(`/api/runbook/${slug}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evolve,
          title: evolve
            ? `Darwinian Fork von ${userEmail.split("@")[0]}`
            : `Fork von ${userEmail.split("@")[0]}`,
          changes: sourceVersion ? `Basiert auf ${sourceVersion.version}` : undefined,
        }),
      })
      if (r.ok) {
        setForkMsg(evolve ? "🧬 Darwinian Evolution erfolgreich gespeichert!" : "🌿 Fork erstellt!")
        await loadVersions()
        setTab("forks")
      } else {
        const d = await r.json()
        setForkMsg(`Fehler: ${d.error}`)
      }
    } finally {
      setForkLoading(false)
    }
  }

  // Submit merge request
  async function handleMrSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userEmail) return
    setMrLoading(true)
    setMrMsg(null)
    try {
      const r = await fetch(`/api/runbook/${slug}/merge-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mrForm),
      })
      if (r.ok) {
        setMrMsg("✓ Merge Request erfolgreich eingereicht!")
        setMrForm({ versionId: "", title: "", description: "" })
        await loadMrs()
      } else {
        const d = await r.json()
        setMrMsg(`Fehler: ${d.error}`)
      }
    } finally {
      setMrLoading(false)
    }
  }

  const canonicalVersions = versions.filter((v) => v.source !== "fork" && v.source !== "darwinian")
  const forkVersions = versions.filter((v) => v.source === "fork" || v.source === "darwinian")

  return (
    <section className="mt-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
        <span className="text-cyan-400 text-lg shrink-0">🌿</span>
        <p className="text-xs text-cyan-300/80">
          <span className="font-black text-cyan-300">Mycelium Versioning.</span>{" "}
          Jede Version dieses Runbooks ist nachvollziehbar – fork it, evolve it, merge it.
        </p>
        <div className="ml-auto flex gap-2 shrink-0">
          <button
            onClick={() => handleForkEvolve(false)}
            disabled={forkLoading}
            className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
          >
            🌿 Fork &amp; Evolve
          </button>
          <button
            onClick={() => handleForkEvolve(true)}
            disabled={forkLoading}
            className="px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
          >
            🧬 Evolve Now
          </button>
        </div>
      </div>

      {forkMsg && (
        <div className="mb-4 px-4 py-2 rounded-xl border border-gray-700 bg-black/30 text-xs text-gray-300">
          {forkMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-800 pb-0">
        {(["versions", "forks", "merge-requests"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-bold rounded-t-xl transition-colors ${
              tab === t
                ? "bg-black/40 border border-b-0 border-gray-700 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t === "versions" ? "📋 Versions History" : t === "forks" ? "🌿 Community Forks" : "🔀 Merge Requests"}
            {t === "versions" && canonicalVersions.length > 0 && (
              <span className="ml-2 text-xs text-gray-500">({canonicalVersions.length})</span>
            )}
            {t === "forks" && forkVersions.length > 0 && (
              <span className="ml-2 text-xs text-gray-500">({forkVersions.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-sm text-gray-500 py-6 text-center">Lade Versionen…</div>
      ) : (
        <>
          {tab === "versions" && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-100 mb-4">Versions History</h2>
              {canonicalVersions.length === 0 ? (
                <div className="text-sm text-gray-500">Keine Versionen gefunden.</div>
              ) : (
                canonicalVersions.map((v) => (
                  <VersionCard
                    key={v.id}
                    v={v}
                    onFork={() => handleForkEvolve(false, v)}
                  />
                ))
              )}
            </div>
          )}

          {tab === "forks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-gray-100">Community Forks</h2>
                {!userEmail && (
                  <a href={`${prefix}/account`} className="text-xs text-cyan-400 hover:text-cyan-200 underline underline-offset-2">
                    Login, um zu forken →
                  </a>
                )}
              </div>
              {forkVersions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-4">Noch keine Community Forks.</p>
                  <button
                    onClick={() => handleForkEvolve(true)}
                    disabled={forkLoading}
                    className="px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 text-sm font-bold text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                  >
                    🧬 Sei der Erste – Evolve Now
                  </button>
                </div>
              ) : (
                forkVersions.map((v) => (
                  <VersionCard key={v.id} v={v} />
                ))
              )}
            </div>
          )}

          {tab === "merge-requests" && (
            <div className="space-y-4">
              <h2 className="text-lg font-black text-gray-100 mb-4">Merge Requests</h2>

              {!userEmail ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-3">Login erforderlich, um Merge Requests zu sehen oder einzureichen.</p>
                  <a href={`${prefix}/account`} className="text-xs text-cyan-400 hover:text-cyan-200 underline underline-offset-2">
                    Einloggen →
                  </a>
                </div>
              ) : (
                <>
                  {/* Submit form */}
                  <form
                    onSubmit={handleMrSubmit}
                    className="rounded-2xl border border-gray-800 bg-black/20 p-4 space-y-3"
                  >
                    <div className="text-sm font-bold text-gray-200 mb-2">Neuen Merge Request einreichen</div>
                    <select
                      className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/60"
                      value={mrForm.versionId}
                      onChange={(e) => setMrForm((f) => ({ ...f, versionId: e.target.value }))}
                      required
                    >
                      <option value="">Version auswählen…</option>
                      {forkVersions.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.version} – {v.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/60"
                      placeholder="Titel des Merge Requests"
                      value={mrForm.title}
                      onChange={(e) => setMrForm((f) => ({ ...f, title: e.target.value }))}
                      required
                    />
                    <textarea
                      className="w-full bg-black/40 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-cyan-500/60 resize-none"
                      placeholder="Beschreibung (optional)"
                      rows={3}
                      value={mrForm.description}
                      onChange={(e) => setMrForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    <button
                      type="submit"
                      disabled={mrLoading}
                      className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-sm font-bold text-cyan-300 hover:bg-cyan-500/25 transition-colors disabled:opacity-50"
                    >
                      {mrLoading ? "Einreichen…" : "🔀 Merge Request einreichen"}
                    </button>
                    {mrMsg && <div className="text-xs text-gray-400">{mrMsg}</div>}
                  </form>

                  {/* List */}
                  {mrs.length > 0 ? (
                    <div className="space-y-3">
                      {mrs.map((mr) => <MrCard key={mr.id} mr={mr} />)}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">Noch keine Merge Requests.</div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}
