"use client"

import { useEffect, useMemo, useState } from "react"
import Skeleton from "@/components/ui/Skeleton"

const SCOPES = [
  { id: "", label: "Alle" },
  { id: "aws", label: "AWS" },
  { id: "gcp", label: "GCP" },
  { id: "azure", label: "Azure" },
]

type Props = {
  onData: (data: any | null) => void
  onScope?: (s: string) => void
  value?: string
  onChange?: (s: string) => void
}

export default function ScopeSelector({ onData, onScope, value, onChange }: Props) {
  const isControlled = typeof value === 'string' && typeof onChange === 'function'
  const [internal, setInternal] = useState<string>(SCOPES[0].id)
  const selected = isControlled ? (value as string) : internal
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    onScope?.(selected)
    setLoading(true)
    setError(null)
    fetch(`/api/oracle?scope=${encodeURIComponent(selected)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`${r.status}`))))
      .then((d) => onData(d))
      .catch(() => { setError("Fehler beim Laden."); onData(null) })
      .finally(() => setLoading(false))
  }, [selected])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Scope</label>
        <div className="flex flex-wrap gap-2">
          {SCOPES.map((s) => (
            <button
              key={s.id || "all"}
              onClick={() => (isControlled ? onChange!(s.id) : setInternal(s.id))}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                selected === s.id
                  ? 'bg-cyan-500 text-black font-medium shadow-lg shadow-cyan-500/30'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {error && !loading && (
        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{error}</div>
      )}
    </div>
  )
}
