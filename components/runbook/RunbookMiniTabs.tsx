"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"

type TabKey = "overview" | "steps" | "timeline" | "versions"

const tabs: Array<{ key: TabKey; label: string; href: `#${TabKey}` }> = [
  { key: "overview", label: "Overview", href: "#overview" },
  { key: "steps", label: "Steps", href: "#steps" },
  { key: "timeline", label: "Timeline", href: "#timeline" },
  { key: "versions", label: "Versions", href: "#versions" },
]

export default function RunbookMiniTabs() {
  const [active, setActive] = useState<TabKey>("overview")
  const [progress, setProgress] = useState(0)
  const prefersReduced = useReducedMotion()
  const ticking = useRef(false)

  useEffect(() => {
    const secs = tabs.map((t) => document.querySelector(t.href)) as Array<HTMLElement | null>
    if (secs.every((n) => !n)) return
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (vis[0]) {
          const id = (vis[0].target as HTMLElement).id as TabKey
          setActive(id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    secs.forEach((n) => n && obs.observe(n))
    return () => obs.disconnect()
  }, [])

  const onScroll = useCallback(() => {
    if (ticking.current) return
    ticking.current = true
    requestAnimationFrame(() => {
      const el = document.documentElement
      const top = el.scrollTop
      const h = el.scrollHeight - el.clientHeight
      const p = h > 0 ? Math.min(100, Math.max(0, (top / h) * 100)) : 0
      setProgress(p)
      ticking.current = false
    })
  }, [])

  useEffect(() => {
    if (prefersReduced) return
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [onScroll, prefersReduced])

  return (
    <div className="sticky top-16 z-30 mb-4">
      <div
        className="relative flex items-center gap-1 px-2 py-2 rounded-2xl border backdrop-blur"
        style={{
          background: "rgba(10,10,10,0.65)",
          borderColor: "rgba(212,175,55,0.12)",
          boxShadow: "0 0 22px rgba(212,175,55,0.06), 0 0 0 1px rgba(212,175,55,0.06) inset",
        }}
      >
        {tabs.map((t) => {
          const isActive = t.key === active
          return (
            <a
              key={t.key}
              href={t.href}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
              style={{ transform: isActive && !prefersReduced ? "scale(1.05)" : undefined }}
            >
              {t.label}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-1 right-1 -bottom-0.5 h-[2px] rounded-full"
                  style={{
                    background: "linear-gradient(90deg, rgba(0,184,255,0.85), rgba(0,255,157,0.7))",
                    boxShadow: "0 0 14px rgba(0,184,255,0.45)",
                  }}
                />)
              }
            </a>
          )
        })}
        {!prefersReduced && (
          <motion.div
            className="absolute left-1 right-1 -bottom-1 h-[2px] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            style={{
              background: "linear-gradient(90deg, rgba(212,175,55,0.6), rgba(0,184,255,0.5))",
              boxShadow: "0 0 12px rgba(212,175,55,0.5)",
            }}
          />
        )}
      </div>
    </div>
  )
}
