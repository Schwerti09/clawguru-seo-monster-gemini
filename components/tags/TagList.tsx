"use client"

import useMagneticHover from "@/hooks/useMagneticHover"

export default function TagList({ tags }: { tags: string[] }) {
  const mag = useMagneticHover({ strength: 8, scale: 1.03 })
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {tags.map((t) => (
        <a
          key={t}
          href={`/tag/${encodeURIComponent(t)}`}
          onMouseMove={mag.onMouseMove}
          onMouseLeave={mag.onMouseLeave}
          className="px-3 py-2 rounded-xl border border-gray-800 bg-black/25 hover:bg-black/35 text-sm text-gray-200 transition-all will-change-transform"
        >
          {t}
        </a>
      ))}
    </div>
  )
}
