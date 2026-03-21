"use client"

export default function ExampleQueries({ onSelect }: { onSelect: (q: string) => void }) {
  const items = [
    "AWS S3 Public Bucket",
    "PostgreSQL Connection Pooling",
    "Kubernetes RBAC",
    "SSH Hardening",
    "Nginx TLS 1.3"
  ]
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-sm text-gray-400 mb-2">Beispiel‑Anfragen</div>
      <div className="flex flex-wrap gap-2">
        {items.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/40 transition"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
