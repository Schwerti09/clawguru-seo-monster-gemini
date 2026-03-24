"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

const TagList = dynamic(() => import("@/components/tags/TagList"), { ssr: false })
const TagOrbitCloud3D = dynamic(() => import("@/components/tags/TagOrbitCloud3D"), { ssr: false })

export default function TagsClientLoader() {
  const [tags, setTags] = useState<string[] | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [avgClaw, setAvgClaw] = useState<Record<string, number>>({})
  const [q, setQ] = useState("")
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const pseo: any = await import("@/lib/pseo")
        // Prefer a large client-built sample to approximate the full tag universe
        const buildClient: undefined | ((n: number) => any[]) = pseo.buildRunbooksClient
        let list: any[] = []
        try {
          list = buildClient ? buildClient(10000) : (pseo.RUNBOOKS ?? [])
        } catch {
          list = (pseo.RUNBOOKS ?? []) as any[]
        }
        const setUniq = new Set<string>()
        const cMap = new Map<string, number>()
        const sMap = new Map<string, number>()
        for (const r of list) {
          const score = Number(r.clawScore || 0) || 0
          for (const t of r.tags || []) {
            const key = String(t)
            setUniq.add(key)
            cMap.set(key, (cMap.get(key) || 0) + 1)
            sMap.set(key, (sMap.get(key) || 0) + score)
          }
        }
        const countsObj: Record<string, number> = {}
        const avgObj: Record<string, number> = {}
        for (const t of setUniq) {
          const c = cMap.get(t) || 0
          const s = sMap.get(t) || 0
          countsObj[t] = c
          avgObj[t] = c ? Math.round((s / c) * 10) / 10 : 0
        }
        const arr = Array.from(setUniq).sort((a, b) => a.localeCompare(b))
        if (mounted) {
          setTags(arr)
          setCounts(countsObj)
          setAvgClaw(avgObj)
        }
      } catch {
        if (mounted) setTags([
          "security","nginx","aws","kubernetes","docker","cloudflare","ssh","firewall","waf","backup"
        ])
      }
    })()
    return () => { mounted = false }
  }, [])

  if (!tags) return <div className="text-sm text-gray-500 mt-6">Lade Tags…</div>

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase()
    if (!ql) return tags
    return tags.filter((t) => t.toLowerCase().includes(ql))
  }, [tags, q])

  const top10 = useMemo(() => {
    return [...(tags || [])]
      .sort((a, b) => (counts[b] || 0) - (counts[a] || 0))
      .slice(0, 10)
  }, [tags, counts])

  return (
    <div>
      <TagOrbitCloud3D tags={tags} />

      <div className="mt-6 flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tags durchsuchen…"
          className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-200"
        />
      </div>

      {top10.length > 0 && (
        <div className="mt-8">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Top Tags</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {top10.map((t) => (
              <a
                key={t}
                href={`${prefix}/tag/${encodeURIComponent(t)}`}
                className="p-4 rounded-2xl border border-white/10 bg-black/35 hover:bg-white/[0.04] transition-colors shadow-[0_0_0_1px_rgba(34,211,238,0.15)_inset]"
              >
                <div className="flex items-baseline justify-between">
                  <div className="font-bold text-gray-100">{t}</div>
                  <div className="text-xs text-gray-400">{counts[t] || 0} Runbooks</div>
                </div>
                <div className="mt-1 text-xs text-cyan-300">Ø ClawScore {avgClaw[t] ?? 0}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      <TagList tags={filtered} counts={counts} />
    </div>
  )
}
