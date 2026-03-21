"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import StackPicker from "./StackPicker"
import RecommendationList from "./RecommendationList"
import ExampleStacks from "./ExampleStacks"

function useLocalePrefix() {
  const pathname = usePathname()
  return useMemo(() => {
    if (!pathname) return ""
    const seg = pathname.split("/").filter(Boolean)[0]
    if (!seg) return ""
    if (seg.length <= 5) return `/${seg}`
    return ""
  }, [pathname])
}

export default function NeuroPageClient() {
  const prefix = useLocalePrefix()
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any | null>(null)

  useEffect(() => {
    if (!selected.length) {
      setData(null)
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('neuro:selected', { detail: { selected: 0 } })) } catch {}
      return
    }
    const t = setTimeout(() => {
      setLoading(true)
      setError(null)
      try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('neuro:selected', { detail: { selected: selected.length } })) } catch {}
      const qs = encodeURIComponent(selected.join(","))
      fetch(`/api/neuro?stack=${qs}&limit=5`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
        .then((d) => {
          setData(d)
          try {
            const found = Array.isArray(d?.recommended_runbooks) ? d.recommended_runbooks.length : 0
            if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('neuro:found', { detail: { found } }))
          } catch {}
        })
        .catch(() => setError("Fehler beim Laden."))
        .finally(() => setLoading(false))
    }, 500)
    return () => clearTimeout(t)
  }, [selected])

  function toggle(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }
  function addFreeform(tag: string) {
    setSelected((prev) => (prev.includes(tag) ? prev : [...prev, tag]))
  }
  function setExample(arr: string[]) {
    const uniq = Array.from(new Set(arr.map((t) => t.toLowerCase())))
    setSelected(uniq)
  }

  return (
    <div className="space-y-8">
      <StackPicker
        selected={selected}
        onToggle={toggle}
        onAddFreeform={addFreeform}
        recommendations={data}
        loading={loading}
        error={error}
      />

      {!loading && !data && selected.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          Wähle oben einen oder mehrere Technologie‑Tags, um personalisierte Runbook‑Empfehlungen zu erhalten.
        </div>
      )}

      {data && <RecommendationList data={data} prefix={prefix} />}

      <ExampleStacks onSelect={setExample} />
    </div>
  )
}
