"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

export type GuidedTourStep = {
  id: string
  targetId: string
  title: string
  value: string
  hint?: string
}

type GuidedSpotlightTourProps = {
  open: boolean
  steps: GuidedTourStep[]
  onClose: () => void
  onComplete: () => void
  labels?: {
    close?: string
    back?: string
    next?: string
    finish?: string
    skip?: string
  }
}

type Rect = { top: number; left: number; width: number; height: number } | null

export default function GuidedSpotlightTour({
  open,
  steps,
  onClose,
  onComplete,
  labels,
}: GuidedSpotlightTourProps) {
  const reduceMotion = useReducedMotion()
  const [stepIndex, setStepIndex] = useState(0)
  const [rect, setRect] = useState<Rect>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const headingId = "guided-tour-title"
  const descId = "guided-tour-desc"

  const safeSteps = useMemo(() => steps.filter((s) => s?.targetId && s?.title), [steps])
  const current = safeSteps[Math.min(stepIndex, Math.max(0, safeSteps.length - 1))]
  const isLast = stepIndex >= safeSteps.length - 1

  const updateRect = useCallback(() => {
    if (!open || !current?.targetId) {
      setRect(null)
      return
    }
    const node = document.querySelector(`[data-tour-id="${current.targetId}"]`) as HTMLElement | null
    if (!node) {
      setRect(null)
      return
    }
    const r = node.getBoundingClientRect()
    const padding = 10
    setRect({
      top: Math.max(8, r.top - padding),
      left: Math.max(8, r.left - padding),
      width: Math.max(40, r.width + padding * 2),
      height: Math.max(40, r.height + padding * 2),
    })
  }, [open, current?.targetId])

  useEffect(() => {
    if (!open) return
    setStepIndex(0)
  }, [open])

  useEffect(() => {
    if (!open || !current?.targetId) return
    const node = document.querySelector(`[data-tour-id="${current.targetId}"]`) as HTMLElement | null
    if (node) {
      node.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center", inline: "nearest" })
    }
    updateRect()
  }, [open, current?.targetId, reduceMotion, updateRect])

  useEffect(() => {
    if (!open) return
    const onLayout = () => updateRect()
    window.addEventListener("resize", onLayout)
    window.addEventListener("scroll", onLayout, { passive: true })
    const t = window.setTimeout(() => updateRect(), 160)
    return () => {
      window.removeEventListener("resize", onLayout)
      window.removeEventListener("scroll", onLayout)
      window.clearTimeout(t)
    }
  }, [open, updateRect])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") onClose()
      if (ev.key === "ArrowRight" && safeSteps.length > 0) {
        ev.preventDefault()
        setStepIndex((s) => Math.min(s + 1, safeSteps.length - 1))
      }
      if (ev.key === "ArrowLeft" && safeSteps.length > 0) {
        ev.preventDefault()
        setStepIndex((s) => Math.max(s - 1, 0))
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onClose, safeSteps.length])

  useEffect(() => {
    if (!open) return
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')
    focusables?.[0]?.focus()
  }, [open, stepIndex])

  if (!open || safeSteps.length === 0 || !current) return null

  const closeLabel = labels?.close ?? "Close tour"
  const backLabel = labels?.back ?? "Back"
  const nextLabel = labels?.next ?? "Next"
  const finishLabel = labels?.finish ?? "Finish"
  const skipLabel = labels?.skip ?? "Skip"

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
        aria-labelledby={headingId}
        aria-describedby={descId}
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />

        {rect ? (
          <>
            <div className="absolute bg-black/70" style={{ top: 0, left: 0, right: 0, height: rect.top }} />
            <div
              className="absolute bg-black/70"
              style={{ top: rect.top, left: 0, width: rect.left, height: rect.height }}
            />
            <div
              className="absolute bg-black/70"
              style={{
                top: rect.top,
                left: rect.left + rect.width,
                right: 0,
                height: rect.height,
              }}
            />
            <div
              className="absolute bg-black/70"
              style={{ top: rect.top + rect.height, left: 0, right: 0, bottom: 0 }}
            />
            <div
              className="absolute rounded-2xl border border-cyan-300/80 shadow-[0_0_0_2px_rgba(34,211,238,0.20),0_16px_40px_-20px_rgba(34,211,238,0.45)] pointer-events-none"
              style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
            />
          </>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 sm:bottom-6 flex justify-center px-4">
          <motion.div
            ref={panelRef}
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 18, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
            className="w-full max-w-2xl rounded-2xl border border-white/15 bg-zinc-950/95 backdrop-blur p-4 sm:p-5 text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-cyan-200/90">
                  {stepIndex + 1}/{safeSteps.length}
                </p>
                <h3 id={headingId} className="text-lg sm:text-xl font-black mt-1">
                  {current.title}
                </h3>
                <p id={descId} className="text-sm text-zinc-200 mt-2">
                  {current.value}
                </p>
                {current.hint ? <p className="text-xs text-zinc-400 mt-2">{current.hint}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-zinc-200 hover:bg-white/10"
              >
                X
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-white/15 text-zinc-300 hover:bg-white/10"
              >
                {skipLabel}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStepIndex((s) => Math.max(s - 1, 0))}
                  disabled={stepIndex === 0}
                  className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-white/15 text-zinc-200 hover:bg-white/10 disabled:opacity-40"
                >
                  {backLabel}
                </button>
                {!isLast ? (
                  <button
                    type="button"
                    onClick={() => setStepIndex((s) => Math.min(s + 1, safeSteps.length - 1))}
                    className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-300/40 text-cyan-100 hover:bg-cyan-500/30"
                  >
                    {nextLabel}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onComplete}
                    className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-300/40 text-emerald-100 hover:bg-emerald-500/30"
                  >
                    {finishLabel}
                  </button>
                )}
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              Step {stepIndex + 1} of {safeSteps.length}: {current.title}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
