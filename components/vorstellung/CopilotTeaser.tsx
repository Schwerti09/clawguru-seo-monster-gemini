"use client"

import { useEffect, useMemo, useRef, useState } from "react"

export type TeaserResult = {
  risks?: number
  prediction?: string
  top?: { slug?: string; title?: string; summary?: string } | null
  results?: Array<{ slug?: string; title?: string; summary?: string; clawScore?: number }>
  runbook?: { slug?: string; title?: string; summary?: string } | null
}

export default function CopilotTeaser() {
  const [q, setQ] = useState("Zeig mir Top-Fixes für nginx")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [data, setData] = useState<TeaserResult | null>(null)
  const [visible, setVisible] = useState(false)
  const [asked, setAsked] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  async function ask() {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch("/api/summon/teaser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q }),
        cache: "no-store",
      })
      if (!res.ok) throw new Error(String(res.status))
      const j: TeaserResult = await res.json()
      setData(j)
    } catch (e: any) {
      setErr(e?.message || "Fehler")
      setData(null)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      const e = entries[0]
      if (e && e.isIntersecting) {
        setVisible(true)
        obs.disconnect()
      }
    }, { root: null, rootMargin: "200px 0px", threshold: 0 })
    obs.observe(el)
    return () => {
      try { obs.disconnect() } catch {}
    }
  }, [])

  useEffect(() => {
    if (visible && !asked) {
      const t = setTimeout(() => {
        ask().finally(() => setAsked(true))
      }, 150)
      return () => clearTimeout(t)
    }
  }, [visible, asked])

  const top = data?.top || data?.runbook || (data?.results && data.results[0]) || null
  const prefill = useMemo(() => encodeURIComponent(q), [q])

  return (
    <div ref={rootRef} className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="text-xs text-gray-300 mb-2">Copilot Live Demo</div>
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-lg bg-black/50 border border-white/10 px-3 py-2 text-sm text-gray-200"
          placeholder="Frag den ClawGuru Copilot…"
        />
        <button onClick={ask} disabled={busy} className="px-3 py-2 rounded-lg text-xs font-bold border border-cyan-500/30 bg-cyan-500/20 text-cyan-100 disabled:opacity-50">
          {busy ? "Lade…" : "Fragen"}
        </button>
        <a href={`/summon?prefill=${prefill}`} className="px-3 py-2 rounded-lg text-xs font-bold border border-white/15 bg-black/40 text-gray-200">Open</a>
      </div>
      {err && <div className="mt-2 text-xs text-red-400">{err}</div>}
      {!visible && !data && !err && (
        <div className="mt-2 text-xs text-gray-400">Scrolle, um Copilot zu laden…</div>
      )}
      {top && (
        <a href={top.slug ? `/runbook/${top.slug}` : "/summon"} className="block mt-3 p-3 rounded-xl border border-white/10 bg-black/40 hover:bg-black/50">
          <div className="text-sm font-semibold text-white">{top.title || "Empfohlenes Runbook"}</div>
          {top.summary && <div className="text-xs text-gray-400 line-clamp-2">{top.summary}</div>}
        </a>
      )}
    </div>
  )
}
