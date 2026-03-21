"use client"

const EXAMPLES = ["AWS", "GCP", "Azure", "Kubernetes"]

export default function ExampleScopes({ onSelect }: { onSelect: (scope: string) => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-sm text-gray-400 mb-2">Beispiel‑Scopes</div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((s) => (
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
