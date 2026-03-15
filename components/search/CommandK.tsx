"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"

type LivePayload = {
  trending: { slug: string; title: string; summary: string; tags: string[] }[]
}

function score(q: string, item: { title: string; summary: string; tags: string[] }) {
  const s = q.toLowerCase()
  let sc = 0
  const t = item.title.toLowerCase()
  const m = item.summary.toLowerCase()
  if (t === s) sc += 10
  if (t.startsWith(s)) sc += 8
  if (t.includes(s)) sc += 6
  if (m.includes(s)) sc += 4
  if (item.tags.some((x) => x.toLowerCase().includes(s))) sc += 3
  sc += Math.min(2, Math.floor(s.length / 6))
  return sc
}

export default function CommandK() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [data, setData] = useState<LivePayload | null>(null)
  const prefersReduced = useReducedMotion()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/live-wall", { cache: "no-store" })
      const json = (await res.json()) as Partial<LivePayload>
      setData({ trending: Array.isArray(json.trending) ? json.trending : [] })
    } catch {
      setData({ trending: [] })
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    fetchData()
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    return () => clearTimeout(t)
  }, [open, fetchData])

  const results = useMemo(() => {
    if (!data || !data.trending) return [] as LivePayload["trending"]
    const s = q.trim()
    if (!s) return data.trending.slice(0, 12)
    return [...data.trending]
      .map((it) => ({ it, sc: score(s, it) }))
      .filter((x) => x.sc > 0)
      .sort((a, b) => b.sc - a.sc)
      .slice(0, 12)
      .map((x) => x.it)
  }, [data, q])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            className="absolute left-1/2 top-24 -translate-x-1/2 w-[92vw] max-w-2xl rounded-2xl border border-gray-800 bg-[#0a0a0a]/95 shadow-2xl"
            initial={prefersReduced ? false : { y: -10, opacity: 0 }}
            animate={prefersReduced ? undefined : { y: 0, opacity: 1 }}
            exit={prefersReduced ? undefined : { y: -10, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 p-3 border-b border-gray-800">
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Command‑K: Suche Runbooks, z.B. webhook, 502, docker secrets…"
                className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
              />
              <button onClick={() => setOpen(false)} className="px-3 py-2 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300">Esc</button>
            </div>
            <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.map((t) => (
                <a
                  key={t.slug}
                  href={`/runbook/${t.slug}`}
                  className="block p-3 rounded-xl border border-gray-800 bg-black/20 hover:bg-black/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)_inset,0_10px_24px_-12px_rgba(34,211,238,0.35)]"
                  onClick={() => setOpen(false)}
                >
                  <div className="font-bold text-gray-100">{t.title}</div>
                  <div className="mt-1 text-xs text-gray-400">{t.summary}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.tags.slice(0, 4).map((x) => (
                      <span key={x} className="px-2 py-0.5 rounded-lg border border-gray-800 bg-black/30 text-[10px] text-gray-300">{x}</span>
                    ))}
                  </div>
                </a>
              ))}
              {results.length === 0 && (
                <div className="text-sm text-gray-500 p-4">Keine Treffer. Tippe allgemeiner oder drücke Enter.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
