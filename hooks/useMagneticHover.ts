"use client"

import { useMemo, useRef, useCallback } from "react"

type Options = {
  strength?: number // pixels offset at edges
  scale?: number // scale on hover
}

export default function useMagneticHover(opts: Options = {}) {
  const strength = opts.strength ?? 10
  const scale = opts.scale ?? 1.02
  const frame = useRef<number | null>(null)
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  )

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReduced) return
    const el = e.currentTarget as HTMLElement
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const dx = ((mx - rect.width / 2) / rect.width) * (strength * 2)
      const dy = ((my - rect.height / 2) / rect.height) * (strength * 1.6)
      el.style.willChange = "transform, box-shadow"
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`
      el.style.transition = "transform 120ms cubic-bezier(0.16,1,0.3,1)"
      // soft glow
      const glow = "0 10px 24px rgba(0,184,255,0.18), 0 0 0 1px rgba(0,184,255,0.18) inset"
      el.style.boxShadow = el.style.boxShadow?.length ? el.style.boxShadow : glow
    })
  }, [prefersReduced, scale, strength])

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement
    if (frame.current) cancelAnimationFrame(frame.current)
    el.style.transform = "translate3d(0,0,0) scale(1)"
    el.style.transition = "transform 180ms cubic-bezier(0.16,1,0.3,1)"
    // keep box-shadow if originally set by classes; do not forcibly clear
  }, [])

  return { onMouseMove, onMouseLeave }
}
