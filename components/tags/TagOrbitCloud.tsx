"use client"

import { useEffect, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"

export default function TagOrbitCloud({ tags }: { tags: string[] }) {
  const pathname = usePathname()
  const prefix = useMemo(() => {
    const first = (pathname || "").split("/")[1] || ""
    const isLang = /^[a-z]{2}(-[A-Z]{2})?$/.test(first)
    return isLang ? `/${first}` : ""
  }, [pathname])
  const prefersReduced = useReducedMotion()
  const items = useMemo(() => tags.slice(0, 60), [tags])

  // Precompute polar positions across 3 rings
  const positioned = useMemo(() => {
    const center = { x: 0, y: 0 }
    const rings = [64, 96, 132] // radii in px
    return items.map((t, i) => {
      const ring = rings[i % rings.length]!
      const angle = (i * (360 / Math.min(items.length, 24))) % 360
      const rad = (angle * Math.PI) / 180
      const x = Math.cos(rad) * ring
      const y = Math.sin(rad) * ring
      return { t, x, y, ring, angle }
    })
  }, [items])

  return (
    <div className="relative mx-auto my-10 h-[420px] max-w-4xl">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative"
          initial={prefersReduced ? false : { rotate: 0 }}
          animate={prefersReduced ? undefined : { rotate: 360 }}
          transition={prefersReduced ? undefined : { duration: 44, repeat: Infinity, ease: "linear" }}
          style={{ width: 0, height: 0 }}
        >
          {positioned.map(({ t, x, y }, idx) => (
            <motion.a
              key={t + idx}
              href={`${prefix}/tag/${encodeURIComponent(t)}`}
              className="absolute px-3 py-1.5 rounded-xl border border-gray-800 bg-black/30 text-sm text-gray-200 will-change-transform hover:shadow-[0_0_0_1px_rgba(34,211,238,0.35)_inset,0_10px_24px_-12px_rgba(34,211,238,0.35)]"
              style={{ left: x, top: y }}
              whileHover={prefersReduced ? undefined : { scale: 1.08, x: x * 0.05, y: y * 0.05 }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.18 }}
            >
              {t}
            </motion.a>
          ))}
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[36px] border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-transparent" />
    </div>
  )
}
