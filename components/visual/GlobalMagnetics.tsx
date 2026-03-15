"use client"

import { useEffect, useMemo } from "react"

function isReducedMotion() {
  if (typeof window === "undefined") return true
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export default function GlobalMagnetics() {
  const reduced = useMemo(() => isReducedMotion(), [])

  useEffect(() => {
    if (reduced) return

    const selectors = [
      'header[role="banner"] a',
      'header[role="banner"] button',
      'a.rounded-xl',
      'button.rounded-xl',
      'a.rounded-2xl',
      'button.rounded-2xl',
      'a.group',
    ]

    const strength = 8
    const scale = 1.03

    const bound = new WeakSet<Element>()

    const apply = (el: HTMLElement) => {
      if (bound.has(el)) return
      const onMove = (e: Event) => {
        const ev = e as MouseEvent
        const rect = el.getBoundingClientRect()
        const mx = ev.clientX - rect.left
        const my = ev.clientY - rect.top
        const dx = ((mx - rect.width / 2) / rect.width) * (strength * 2)
        const dy = ((my - rect.height / 2) / rect.height) * (strength * 1.6)
        el.style.willChange = "transform, box-shadow"
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`
        el.style.transition = "transform 120ms cubic-bezier(0.16,1,0.3,1)"
        if (!el.dataset._mgHasShadow) {
          el.style.boxShadow = el.style.boxShadow || "0 10px 24px rgba(0,184,255,0.18), 0 0 0 1px rgba(0,184,255,0.18) inset"
        }
      }
      const onLeave = () => {
        el.style.transform = "translate3d(0,0,0) scale(1)"
        el.style.transition = "transform 180ms cubic-bezier(0.16,1,0.3,1)"
      }
      el.addEventListener("mousemove", onMove)
      el.addEventListener("mouseleave", onLeave)
      ;(el as any)._mgMove = onMove
      ;(el as any)._mgLeave = onLeave
      bound.add(el)
    }

    const scan = () => {
      const nodes = document.querySelectorAll(selectors.join(","))
      nodes.forEach((n) => {
        if (n instanceof HTMLElement) apply(n)
      })
    }

    scan()

    const mo = new MutationObserver(() => scan())
    mo.observe(document.documentElement, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      const nodes = document.querySelectorAll(selectors.join(","))
      nodes.forEach((n) => {
        const el = n as any as HTMLElement & { _mgMove?: any; _mgLeave?: any }
        if (el._mgMove) el.removeEventListener("mousemove", el._mgMove)
        if (el._mgLeave) el.removeEventListener("mouseleave", el._mgLeave)
      })
    }
  }, [reduced])

  return null
}
