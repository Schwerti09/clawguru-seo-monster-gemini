"use client"

import useMagneticHover from "@/hooks/useMagneticHover"
import { useMemo } from "react"
import { usePathname } from "next/navigation"

export default function TagList({ tags }: { tags: string[] }) {
  const mag = useMagneticHover({ strength: 8, scale: 1.03 })
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {tags.map((t) => (
        <a
          key={t}
          href={`${prefix}/tag/${encodeURIComponent(t)}`}
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
