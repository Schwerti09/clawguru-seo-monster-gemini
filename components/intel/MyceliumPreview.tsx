"use client"

import React, { useEffect, useState } from "react"
import MyceliumClientLoader from "@/components/visual/MyceliumClientLoader"

type Mapping = Record<string, { slug: string; title: string; clawScore: number; services?: string[] }>

type Props = { ui?: "full" | "embed" }

export default function MyceliumPreview({ ui = "embed" }: Props) {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    let stop = false
    async function load() {
      try {
        const res = await fetch('/api/intel/mapping', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const j = await res.json().catch(() => null)
        const mapping: Mapping = (j?.mapping || {}) as Mapping
        const uniq = Array.from(new Set(Object.values(mapping).map((m) => m.slug))).slice(0, 50)
        if (!stop) setSlugs(uniq)
      } catch {
        // stay empty
      }
    }
    load()
    return () => { stop = true }
  }, [])

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 aspect-[16/10] overflow-hidden">
      <MyceliumClientLoader ui={ui} filterSlugs={slugs} />
    </div>
  )
}
