"use client"

import { useEffect, useState } from "react"

export default function NeuroPanel() {
  const [stack, setStack] = useState("aws,nginx,postgres")
  const [limit, setLimit] = useState(6)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)

  async function run() {
    setBusy(true)
    setErr(null)
    setData(null)
    try {
      const u = new URL("/api/neuro", window.location.origin)
      u.searchParams.set("stack", stack)
      u.searchParams.set("limit", String(limit))
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
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Stack (z.B. aws,nginx,postgres)" className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500" />
        <input type="number" min={1} max={20} value={limit} onChange={(e) => setLimit(parseInt(e.target.value || '6', 10) || 6)} className="w-24 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white" />
        <button onClick={run} disabled={busy} className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold disabled:opacity-50">Empfehlen</button>
      </div>
      {busy && <div className="animate-pulse text-sm text-gray-400">Berechne Empfehlungen…</div>}
      {err && <div className="text-sm text-red-400">{err}</div>}
      {data && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Plan: <span className="font-bold text-gray-200">{data.execution_plan}</span> · Zeit: {data.estimated_time}</div>
          <div className="grid gap-2">
            {(data.recommended_runbooks || []).map((r: any) => (
              <a key={r.slug} href={`/runbook/${r.slug}`} className="p-3 rounded-xl border border-white/10 bg-black/40 hover:bg-black/50">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-100">{r.title}</div>
                  <div className="text-xs text-fuchsia-300">{r.relevance}%</div>
                </div>
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
