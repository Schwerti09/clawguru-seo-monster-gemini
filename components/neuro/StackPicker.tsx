"use client"

import { useEffect, useMemo, useState } from "react"
import Skeleton from "@/components/ui/Skeleton"

const DEFAULT_TAGS = ['aws', 'nginx', 'postgres', 'kubernetes', 'docker', 'ssh', 'terraform', 'gcp', 'azure', 'redis']

type Props = {
  selected: string[]
  onToggle: (tag: string) => void
  onAddFreeform?: (tag: string) => void
  recommendations?: any | null
  loading: boolean
  error?: string | null
}

function TagChip({ tag, selected, onClick }: { tag: string; selected: boolean; onClick: (t: string) => void }) {
  return (
    <button
      onClick={() => onClick(tag)}
      className={`px-3 py-1 rounded-full text-sm transition-all ${
        selected
          ? 'bg-cyan-500 text-black font-medium shadow-lg shadow-cyan-500/30'
          : 'bg-white/10 text-gray-300 hover:bg-white/20'
      }`}
    >
      {tag}
    </button>
  )
}

export default function StackPicker({ selected, onToggle, onAddFreeform, recommendations, loading, error }: Props) {
  const [input, setInput] = useState("")
  const allTags = DEFAULT_TAGS

  function addInputTag() {
    const t = input.trim().toLowerCase()
    if (!t) return
    onAddFreeform?.(t)
    setInput("")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Dein Stack</label>
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addInputTag() }}
            placeholder="Tags hinzufügen (Enter) – z.B. aws, nginx"
            className="flex-1 p-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <button
            onClick={addInputTag}
            className="px-4 py-2 rounded-2xl border border-white/10 hover:border-white/20 text-gray-200"
          >
            Hinzufügen
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <TagChip key={tag} tag={tag} selected={selected.includes(tag)} onClick={onToggle} />
        ))}
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
