"use client"

import { useEffect, useState } from "react"

export default function SummonPanel() {
  const [q, setQ] = useState("ssh")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)

  async function run() {
    setBusy(true)
    setErr(null)
    setData(null)
    try {
      const u = new URL("/api/summon", window.location.origin)
      u.searchParams.set("q", q)
      u.searchParams.set("limit", "5")
      const res = await fetch(u.toString(), { cache: "no-store" })
      if (!res.ok) throw new Error(String(res.status))
      const j = await res.json()
      setData(j)
    } catch (e: any) {
      setErr(e?.message || "Fehler")
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-4 rounded-2xl border border-white/10 bg-black/30">
      <div className="flex items-center gap-2 mb-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Frage / Problem…" className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500" />
        <button onClick={run} disabled={busy} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold disabled:opacity-50">Suchen</button>
      </div>
      {busy && (
        <div className="animate-pulse text-sm text-gray-400">Lade Runbooks…</div>
      )}
      {err && (
        <div className="text-sm text-red-400">{err}</div>
      )}
      {data && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Confidence: <span className="font-bold text-gray-200">{data.confidence}</span> · Services: {data.affected_services?.join(", ") || "—"}</div>
          <div className="grid gap-2">
            {(data.relevant_runbooks || []).map((r: any) => (
              <a key={r.slug} href={`/runbook/${r.slug}`} className="p-3 rounded-xl border border-white/10 bg-black/40 hover:bg-black/50">
                <div className="font-bold text-gray-100">{r.title}</div>
                <div className="text-xs text-gray-400">Score {r.clawScore}</div>
                <div className="text-sm text-gray-300 line-clamp-2">{r.summary}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
