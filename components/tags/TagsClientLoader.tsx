"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const TagList = dynamic(() => import("@/components/tags/TagList"), { ssr: false })
const TagOrbitCloud3D = dynamic(() => import("@/components/tags/TagOrbitCloud3D"), { ssr: false })

export default function TagsClientLoader() {
  const [tags, setTags] = useState<string[] | null>(null)

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
        for (const r of list) for (const t of r.tags || []) setUniq.add(String(t))
        const arr = Array.from(setUniq).sort((a, b) => a.localeCompare(b))
        if (mounted) setTags(arr)
      } catch {
        if (mounted) setTags([
          "security","nginx","aws","kubernetes","docker","cloudflare","ssh","firewall","waf","backup"
        ])
      }
    })()
    return () => { mounted = false }
  }, [])

  if (!tags) return <div className="text-sm text-gray-500 mt-6">Lade Tags…</div>

  return (
    <div>
      <TagOrbitCloud3D tags={tags} />
      <TagList tags={tags} />
    </div>
  )
}
