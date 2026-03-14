// MYCELIUM VIRAL SHARE – Floating Share Button
// Global fixed button that opens a compact share popover on all pages.
// Gold + Glassmorphism luxury style. Supports Web Share API, X Intent, LinkedIn Intent.

"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useI18n } from "@/components/i18n/I18nProvider"

const SHARE_COUNT_KEY = "cg_mycelium_share_count"
// Baseline count representing shares before client-side tracking began
const BASELINE_SHARE_COUNT = 1247

function getShareCount(): number {
  if (typeof window === "undefined") return 0
  try {
    return parseInt(localStorage.getItem(SHARE_COUNT_KEY) ?? "0", 10) || 0
  } catch {
    return 0
  }
}

function incrementShareCount(): number {
  if (typeof window === "undefined") return 0
  try {
    const next = getShareCount() + 1
    localStorage.setItem(SHARE_COUNT_KEY, String(next))
    return next
  } catch {
    return 0
  }
}

function buildXIntent(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
}

function buildLinkedinIntent(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}

interface FloatingMyceliumShareBtnProps {
  locale?: Locale
}

export default function FloatingMyceliumShareBtn({ locale: localeProp }: FloatingMyceliumShareBtnProps) {
  const [open, setOpen] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const [shareCount, setShareCount] = useState(0)
  const i18n = useI18n()
  const dict = i18n.dict
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShareCount(getShareCount())
  }, [localeProp])

  // Close popover on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://clawguru.org"
  const postText = dict.share.myceliumPost
  const xIntent = buildXIntent(postText, currentUrl)
  const linkedinIntent = buildLinkedinIntent(currentUrl)

  const showHint = useCallback((msg: string) => {
    setHint(msg)
    setTimeout(() => setHint(null), 1800)
  }, [])

  const handleNativeShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: dict.share.myceliumCta, text: postText, url: currentUrl })
        setShareCount(incrementShareCount())
        setOpen(false)
      } else {
        window.open(xIntent, "_blank", "noopener,noreferrer")
        setShareCount(incrementShareCount())
      }
    } catch {
      // user cancelled
    }
  }, [dict.share.myceliumCta, postText, currentUrl, xIntent])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      showHint(dict.share.myceliumCopied)
      setShareCount(incrementShareCount())
    } catch {
      showHint("Copy failed")
    }
  }, [currentUrl, dict.share.myceliumCopied, showHint])

  const handleIntentClick = useCallback(() => {
    setShareCount(incrementShareCount())
    setOpen(false)
  }, [])

  return (
    <div ref={popoverRef} className="fixed bottom-20 right-4 z-50 lg:bottom-8 lg:right-6 flex flex-col items-end gap-2">
      {/* Popover */}
      {open && (
        <div
          className="mb-2 rounded-2xl border border-white/15 p-4 w-64"
          style={{
            background: "rgba(10,14,26,0.92)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 40px rgba(255,200,0,0.12), inset 0 0 0 1px rgba(255,200,0,0.14)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg" aria-hidden>🍄</span>
            <span className="text-xs font-mono font-bold tracking-widest uppercase" style={{ color: "#ffc800" }}>
              {dict.share.myceliumCta}
            </span>
          </div>

          {/* Share count */}
          <div className="text-[10px] text-gray-500 font-mono mb-3">
            {dict.share.myceliumCount.replace("{count}", (BASELINE_SHARE_COUNT + shareCount).toLocaleString())}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            {/* Native share */}
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl font-bold text-sm text-black transition-all"
              style={{
                background: "linear-gradient(135deg, #ffc800 0%, #ffaa00 100%)",
                boxShadow: "0 0 12px rgba(255,200,0,0.35)",
              }}
            >
              <span>🚀</span>
              {dict.share.myceliumBtn}
            </button>

            {/* X intent */}
            <a
              href={xIntent}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleIntentClick}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-white/40 transition-all"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.735-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              {dict.share.myceliumXBtn}
            </a>

            {/* LinkedIn intent */}
            <a
              href={linkedinIntent}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleIntentClick}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-white/40 transition-all"
              style={{ background: "rgba(0,119,181,0.2)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {dict.share.myceliumLinkedinBtn}
            </a>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl font-bold text-sm text-gray-300 border border-white/15 hover:border-white/30 transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
              aria-label="Copy link"
            >
              <span>🔗</span> Copy Link
            </button>
          </div>

          {hint && <div className="mt-2 text-xs text-[#00ff9d] font-mono">{hint}</div>}
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={dict.share.myceliumBtn}
        aria-expanded={open}
        className="flex items-center justify-center size-12 rounded-full font-bold text-black shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          background: open
            ? "linear-gradient(135deg, #ffaa00 0%, #ff8c00 100%)"
            : "linear-gradient(135deg, #ffc800 0%, #ffaa00 100%)",
          boxShadow: open
            ? "0 0 24px rgba(255,200,0,0.6)"
            : "0 0 18px rgba(255,200,0,0.4)",
        }}
      >
        <span className="text-xl" aria-hidden>🍄</span>
      </button>
    </div>
  )
}
