"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

export default function OraclePanel() {
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  const [scope, setScope] = useState("aws")
  const [days, setDays] = useState(7)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)

  async function run() {
    setBusy(true)
    setErr(null)
    setData(null)
    try {
      const u = new URL("/api/oracle", window.location.origin)
      if (scope) u.searchParams.set("scope", scope)
      u.searchParams.set("days", String(days))
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
        <input value={scope} onChange={(e) => setScope(e.target.value)} placeholder="Scope (z.B. aws, nginx)" className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500" />
        <input type="number" min={1} max={30} value={days} onChange={(e) => setDays(parseInt(e.target.value || '7', 10) || 7)} className="w-24 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white" />
        <button onClick={run} disabled={busy} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">Vorhersagen</button>
      </div>
      {busy && <div className="animate-pulse text-sm text-gray-400">Analysiere CVEs…</div>}
      {err && <div className="text-sm text-red-400">{err}</div>}
      {data && (
        <div className="space-y-3">
          <div className="text-sm text-gray-400">Timeline: <span className="font-bold text-gray-200">{data.timeline}</span></div>
          <div className="grid gap-2">
            {(data.critical_risk || []).map((x: any) => (
              <div key={x.cve_id} className="p-3 rounded-xl border border-white/10 bg-black/40">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-100">{x.cve_id} · {x.title}</div>
                  <div className="text-xs text-emerald-300">{x.probability}%</div>
                </div>
                {x.recommended_runbook ? (
                  <a href={`${prefix}/solutions/fix-${x.cve_id}`} className="text-xs text-cyan-300 underline">Fix ansehen →</a>
                ) : null}
                <div className="text-xs text-gray-400 mt-1">Services: {x.services?.join(", ") || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
