"use client"

import { useCallback, useMemo, useRef, useState } from "react"

interface MagicCTAButtonProps {
  href: string
  label: string
  className?: string
}

export default function MagicCTAButton({ href, label, className }: MagicCTAButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  )

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReduced) return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const dx = (mx - rect.width / 2) / rect.width
    const dy = (my - rect.height / 2) / rect.height
    el.style.transform = `translate3d(${dx * 10}px, ${dy * 8}px, 0) scale(1.02)`
    el.style.boxShadow = "0 8px 30px rgba(212,175,55,0.25), 0 0 0 1px rgba(212,175,55,0.25) inset"
  }, [prefersReduced])

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    el.style.transform = "translate3d(0,0,0) scale(1)"
    el.style.boxShadow = "0 0 0 1px rgba(212,175,55,0.18) inset"
  }, [])

  const onClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((r) => [...r, { id, x, y }])
    setTimeout(() => setRipples((r) => r.filter((it) => it.id !== id)), 600)
  }, [prefersReduced])

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={
        "relative inline-flex items-center justify-center px-8 py-4 rounded-2xl text-sm font-black tracking-wide select-none will-change-transform transition-all duration-200 " +
        (className ?? "")
      }
      style={{
        background: "linear-gradient(135deg, rgba(212,175,55,0.18), rgba(0,184,255,0.14))",
        color: "#f0f9ff",
        border: "1px solid rgba(212,175,55,0.22)",
        textShadow: "0 0 20px rgba(212,175,55,0.5)",
      }}
    >
      <span className="relative z-10">{label}</span>

      {/* Shine */}
      {!prefersReduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        >
          <span
            className="absolute -inset-1 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(120px 120px at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.15), transparent 60%)",
            }}
          />
        </span>
      )}

      {/* Ripples */}
      {!prefersReduced && ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 10,
            height: 10,
            transform: "translate(-50%, -50%)",
            background: "rgba(212,175,55,0.35)",
            boxShadow: "0 0 30px rgba(212,175,55,0.35)",
            animation: "magic-ripple 600ms ease-out forwards",
            border: "1px solid rgba(212,175,55,0.6)",
          }}
        />
      ))}

      {!prefersReduced && (
        <style>{`
          @keyframes magic-ripple {
            0% { opacity: 0.9; width: 10px; height: 10px; }
            100% { opacity: 0; width: 220px; height: 220px; }
          }
        `}</style>
      )}
    </a>
  )
}
