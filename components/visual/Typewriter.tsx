"use client"

import { useEffect, useMemo, useRef, useState } from "react"

interface TypewriterProps {
  text: string
  speed?: number
  cursor?: boolean
  className?: string
}

export default function Typewriter({ text, speed = 30, cursor = false, className }: TypewriterProps) {
  const [idx, setIdx] = useState(0)
  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  )

  useEffect(() => {
    if (prefersReduced) {
      setIdx(text.length)
      return
    }
    let raf = 0
    let last = performance.now()

    const step = (now: number) => {
      const delta = now - last
      if (delta >= speed) {
        setIdx((i) => (i < text.length ? i + 1 : i))
        last = now
      }
      if (idx < text.length) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, prefersReduced])

  const shown = text.slice(0, idx)

  return (
    <span aria-label={text} className={className}>
      {shown}
      {cursor && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.6ch",
            marginLeft: 2,
            background: "currentColor",
            height: "1em",
            verticalAlign: "-0.15em",
            opacity: prefersReduced ? 1 : undefined,
            animation: prefersReduced ? undefined : "tw-caret 1s steps(1,end) infinite",
          }}
        />
      )}
      {!prefersReduced && (
        <style>{`
          @keyframes tw-caret { 50% { opacity: 0; } }
        `}</style>
      )}
    </span>
  )
}
