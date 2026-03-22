"use client"

const EXAMPLES = ["AWS", "GCP", "Azure", "Kubernetes"]

export default function ExampleScopes({ onSelect, dict }: { onSelect: (scope: string) => void; dict?: any }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-sm text-gray-400 mb-2">{dict?.example_scopes_title || "Beispiel‑Scopes"}</div>
      <div className="flex flex-wrap gap-2">
        {(Array.isArray(dict?.example_scopes_items) ? dict.example_scopes_items : EXAMPLES).map((s: string) => (
          <button
            key={s}
            onClick={() => onSelect(s.toLowerCase())}
            className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/40 transition"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
