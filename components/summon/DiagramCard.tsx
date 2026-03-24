"use client"

export default function DiagramCard({ steps, reduce }: { steps: string[]; reduce: boolean }) {
  const values = steps.map((s) => Math.max(10, Math.min(100, s.length)))
  const max = Math.max(1, ...values)
  const n = Math.min(values.length, 16)
  const slice = values.slice(0, n)
  const points = slice
    .map((v, i) => {
      const x = (i / Math.max(1, n - 1)) * 100
      const y = 100 - (v / max) * 80 - 10
      return `${x},${y}`
    })
    .join(" ")
  return (
    <div className="h-16 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {points && (
          <>
            <polyline
              points={points}
              fill="none"
              stroke="#06b6d4"
              strokeWidth={reduce ? 0.8 : 1.2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <polygon points={`${points} 100,100 0,100`} fill="url(#dg)" opacity={0.5} />
            {slice.map((v, i) => {
              const x = (i / Math.max(1, n - 1)) * 100
              const y = 100 - (v / max) * 80 - 10
              return <circle key={i} cx={x} cy={y} r={reduce ? 0.8 : 1.4} fill="#22d3ee" />
            })}
          </>
        )}
      </svg>
    </div>
  )
}
