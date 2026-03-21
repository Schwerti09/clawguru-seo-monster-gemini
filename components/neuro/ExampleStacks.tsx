"use client"

const EXAMPLES: string[][] = [
  ["aws", "nginx", "postgres"],
  ["kubernetes", "docker", "prometheus"],
  ["ssh", "terraform", "azure"],
]

export default function ExampleStacks({ onSelect }: { onSelect: (tags: string[]) => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-sm text-gray-400 mb-2">Beispiel‑Stacks</div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((arr, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(arr)}
            className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/40 transition"
          >
            {arr.join(" + ")}
          </button>
        ))}
      </div>
    </div>
  )
}
