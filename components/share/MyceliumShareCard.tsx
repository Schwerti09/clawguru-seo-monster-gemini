// MYCELIUM VIRAL SHARE CARDS – Auto-Generated Prophecy Images for X & LinkedIn
// Canvas-rendered luxury share image with Mycelium graph + Oracle answer + Gold branding.
// Supports Web Share API, X Intent, LinkedIn Intent. i18n: de/en/fr + all 10 locales.
// Share counter persisted in localStorage.

"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { t, type Locale } from "@/lib/i18n"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SHARE_COUNT_KEY = "cg_mycelium_share_count"
const CARD_WIDTH = 1200
const CARD_HEIGHT = 630

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------

/** Draw a minimal Mycelium-style force graph onto the canvas background */
function drawMyceliumGraph(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Seed-deterministic pseudo-random for consistent, reproducible node positions
  const rng = (() => {
    let s = 42
    return () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      return (s >>> 0) / 0xffffffff
    }
  })()

  const NODE_COUNT = 48
  const nodes: { x: number; y: number; r: number; color: string }[] = []
  const colors = ["#00ff9d", "#00b8ff", "#b464ff", "#ffc800", "#ff4646"]

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: rng() * w,
      y: rng() * h,
      r: 2 + rng() * 4,
      color: colors[Math.floor(rng() * colors.length)],
    })
  }

  // Draw edges (thin cyan lines)
  ctx.save()
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 220) {
        const alpha = (1 - dist / 220) * 0.35
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.strokeStyle = `rgba(0,184,255,${alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
    }
  }

  // Draw nodes
  for (const node of nodes) {
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
    ctx.fillStyle = node.color + "cc"
    ctx.fill()
    // Glow
    const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 3)
    grd.addColorStop(0, node.color + "44")
    grd.addColorStop(1, "transparent")
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.r * 3, 0, Math.PI * 2)
    ctx.fillStyle = grd
    ctx.fill()
  }
  ctx.restore()
}

/** Wrap text into lines that fit within maxWidth */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
      if (lines.length >= maxLines - 1) {
        // last allowed line — append remaining words truncated
        const rest = words.slice(i).join(" ")
        const truncated =
          ctx.measureText(rest).width > maxWidth
            ? rest.slice(0, Math.floor(rest.length * (maxWidth / ctx.measureText(rest).width))) + "…"
            : rest
        lines.push(truncated)
        return lines
      }
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Generate the share image as a PNG Blob using HTML Canvas */
async function generateShareImage(opts: {
  answer: string
  title: string
  ctaText: string
  pageUrl: string
}): Promise<Blob> {
  const { answer, title, ctaText, pageUrl } = opts

  const canvas = document.createElement("canvas")
  canvas.width = CARD_WIDTH
  canvas.height = CARD_HEIGHT
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not available")

  // ── Background gradient (dark vault) ──────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, CARD_WIDTH, CARD_HEIGHT)
  bg.addColorStop(0, "#030712")
  bg.addColorStop(0.5, "#0a0e1a")
  bg.addColorStop(1, "#030712")
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // ── Mycelium graph background ──────────────────────────────────────────────
  drawMyceliumGraph(ctx, CARD_WIDTH, CARD_HEIGHT)

  // ── Dark overlay for text readability ─────────────────────────────────────
  const overlay = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  overlay.addColorStop(0, "rgba(3,7,18,0.35)")
  overlay.addColorStop(1, "rgba(3,7,18,0.75)")
  ctx.fillStyle = overlay
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // ── Gold border ───────────────────────────────────────────────────────────
  const borderInset = 20
  ctx.strokeStyle = "#ffc800"
  ctx.lineWidth = 2.5
  ctx.strokeRect(
    borderInset,
    borderInset,
    CARD_WIDTH - borderInset * 2,
    CARD_HEIGHT - borderInset * 2
  )
  // Inner subtle glow border
  ctx.strokeStyle = "rgba(255,200,0,0.25)"
  ctx.lineWidth = 8
  ctx.strokeRect(
    borderInset + 4,
    borderInset + 4,
    CARD_WIDTH - (borderInset + 4) * 2,
    CARD_HEIGHT - (borderInset + 4) * 2
  )

  // ── Glassmorphism content panel ────────────────────────────────────────────
  const panelX = 60
  const panelY = 60
  const panelW = CARD_WIDTH - 120
  const panelH = CARD_HEIGHT - 120
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(panelX, panelY, panelW, panelH, 18)
  ctx.fillStyle = "rgba(10,14,26,0.72)"
  ctx.fill()
  ctx.strokeStyle = "rgba(255,200,0,0.18)"
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.restore()

  // ── Logo / brand area (top-left) ──────────────────────────────────────────
  ctx.font = "bold 20px 'Arial', sans-serif"
  ctx.fillStyle = "#00ff9d"
  ctx.fillText("CLAWGURU", panelX + 36, panelY + 46)

  // Separator line
  ctx.beginPath()
  ctx.moveTo(panelX + 36, panelY + 56)
  ctx.lineTo(panelX + 190, panelY + 56)
  ctx.strokeStyle = "rgba(255,200,0,0.4)"
  ctx.lineWidth = 1
  ctx.stroke()

  // Mushroom emoji / mycelium icon
  ctx.font = "32px serif"
  ctx.fillText("🍄", CARD_WIDTH - panelX - 72, panelY + 48)

  // ── CTA headline: "The Mycelium has spoken" ───────────────────────────────
  ctx.font = "bold 38px 'Arial', sans-serif"
  ctx.fillStyle = "#ffc800"
  ctx.shadowColor = "rgba(255,200,0,0.6)"
  ctx.shadowBlur = 18
  const ctaLines = wrapText(ctx, ctaText, panelW - 72, 2)
  let ctaY = panelY + 100
  for (const line of ctaLines) {
    ctx.fillText(line, panelX + 36, ctaY)
    ctaY += 50
  }
  ctx.shadowBlur = 0

  // ── Page title (smaller, cyan) ────────────────────────────────────────────
  if (title) {
    ctx.font = "600 20px 'Arial', sans-serif"
    ctx.fillStyle = "#00b8ff"
    const titleLines = wrapText(ctx, title, panelW - 72, 2)
    for (const line of titleLines) {
      ctx.fillText(line, panelX + 36, ctaY + 10)
      ctaY += 28
    }
  }

  ctaY += 16

  // ── Oracle / answer text ──────────────────────────────────────────────────
  if (answer) {
    ctx.font = "18px 'Arial', sans-serif"
    ctx.fillStyle = "rgba(229,231,235,0.92)"
    const maxAnswerLines = 4
    const answerLines = wrapText(ctx, answer, panelW - 72, maxAnswerLines)
    for (const line of answerLines) {
      if (ctaY + 26 > panelY + panelH - 70) break
      ctx.fillText(line, panelX + 36, ctaY)
      ctaY += 26
    }
  }

  // ── URL watermark (bottom) ─────────────────────────────────────────────────
  ctx.font = "14px 'Arial', sans-serif"
  ctx.fillStyle = "rgba(156,163,175,0.7)"
  ctx.fillText(pageUrl, panelX + 36, panelY + panelH - 28)

  // ── Bottom-right badge ─────────────────────────────────────────────────────
  ctx.font = "bold 14px 'Arial', sans-serif"
  ctx.fillStyle = "#ffc800"
  ctx.textAlign = "right"
  ctx.fillText("clawguru.org · AI Ops Intelligence", panelX + panelW - 36, panelY + panelH - 28)
  ctx.textAlign = "left"

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to generate PNG blob"))
      },
      "image/png",
      0.92
    )
  })
}

// ---------------------------------------------------------------------------
// Share helpers
// ---------------------------------------------------------------------------

function buildXIntent(text: string, url: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
}

function buildLinkedinIntent(url: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface MyceliumShareCardProps {
  /** Oracle / Neuro answer or any contextual text to embed in the image */
  answer?: string
  /** Page-specific title shown in the image and post suggestion */
  title?: string
  /** Current locale for i18n labels */
  locale?: Locale
  /** Page URL to embed in share link (defaults to window.location.href) */
  pageUrl?: string
  /** Additional CSS classes for the wrapper */
  className?: string
}

export default function MyceliumShareCard({
  answer = "",
  title = "",
  locale = "de",
  pageUrl,
  className = "",
}: MyceliumShareCardProps) {
  const [shareCount, setShareCount] = useState<number>(0)
  const [busy, setBusy] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const blobRef = useRef<Blob | null>(null)

  // Hydrate share count from localStorage on mount
  useEffect(() => {
    setShareCount(getShareCount())
  }, [])

  const resolvedUrl =
    pageUrl ?? (typeof window !== "undefined" ? window.location.href : "https://clawguru.org")

  const ctaText = t(locale, "shareMyceliumCta")
  const postText = t(locale, "shareMyceliumPost")
  const xIntent = buildXIntent(postText, resolvedUrl)
  const linkedinIntent = buildLinkedinIntent(resolvedUrl)

  const countLabel = t(locale, "shareMyceliumCount").replace(
    "{count}",
    (1247 + shareCount).toLocaleString()
  )

  /** Ensure the share image blob is generated (cached in ref) */
  const ensureBlob = useCallback(async (): Promise<Blob> => {
    if (blobRef.current) return blobRef.current
    const blob = await generateShareImage({ answer, title, ctaText, pageUrl: resolvedUrl })
    blobRef.current = blob
    return blob
  }, [answer, title, ctaText, resolvedUrl])

  const showHint = useCallback((msg: string) => {
    setHint(msg)
    setTimeout(() => setHint(null), 1800)
  }, [])

  /** Native share (includes file if supported) */
  const handleShare = useCallback(async () => {
    setBusy(true)
    try {
      const blob = await ensureBlob()
      const file = new File([blob], "mycelium-prophecy.png", { type: "image/png" })
      const shareData: ShareData = {
        title: ctaText,
        text: postText,
        url: resolvedUrl,
        ...(navigator.canShare?.({ files: [file] }) ? { files: [file] } : {}),
      }
      if (navigator.share) {
        await navigator.share(shareData)
        const next = incrementShareCount()
        setShareCount(next)
      } else {
        // Fallback: open X intent
        window.open(xIntent, "_blank", "noopener,noreferrer")
        const next = incrementShareCount()
        setShareCount(next)
      }
    } catch {
      // User cancelled or share not supported — silent
    } finally {
      setBusy(false)
    }
  }, [ensureBlob, ctaText, postText, resolvedUrl, xIntent])

  /** Share image download */
  const handleDownload = useCallback(async () => {
    setBusy(true)
    try {
      const blob = await ensureBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "mycelium-prophecy.png"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      const next = incrementShareCount()
      setShareCount(next)
    } catch {
      showHint("Download failed")
    } finally {
      setBusy(false)
    }
  }, [ensureBlob, showHint])

  /** Copy share URL to clipboard */
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl)
      showHint(t(locale, "shareMyceliumCopied"))
    } catch {
      showHint("Copy failed")
    }
  }, [resolvedUrl, locale, showHint])

  /** Record share count when opening X/LinkedIn intent links */
  const handleIntentClick = useCallback(() => {
    const next = incrementShareCount()
    setShareCount(next)
  }, [])

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-gradient-to-br from-gray-950/90 via-[#0a0e1a]/90 to-gray-950/90 backdrop-blur-md p-4 ${className}`}
      style={{ boxShadow: "0 0 40px rgba(255,200,0,0.08), inset 0 0 0 1px rgba(255,200,0,0.12)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>🍄</span>
          <span
            className="text-xs font-mono font-bold tracking-widest uppercase"
            style={{ color: "#ffc800" }}
          >
            {t(locale, "shareMyceliumCta")}
          </span>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono tracking-wide"
          aria-expanded={expanded}
          aria-label={t(locale, "shareMyceliumBtn")}
        >
          {expanded ? "▲ collapse" : t(locale, "shareMyceliumBtn") + " ▼"}
        </button>
      </div>

      {/* Share count badge */}
      <div className="text-xs text-gray-500 font-mono mb-3">{countLabel}</div>

      {/* Expandable panel */}
      {expanded && (
        <div className="space-y-3 pt-2 border-t border-white/5">
          {/* Post text suggestion */}
          <div
            className="rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-gray-400 font-mono leading-relaxed"
          >
            {postText}
            {answer ? ` — "${answer.slice(0, 120)}${answer.length > 120 ? "…" : ""}"` : ""}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Primary: native share / generate */}
            <button
              onClick={handleShare}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm text-black transition-all disabled:opacity-60"
              style={{
                background: busy
                  ? "rgba(255,200,0,0.5)"
                  : "linear-gradient(135deg, #ffc800 0%, #ffaa00 100%)",
                boxShadow: busy ? "none" : "0 0 16px rgba(255,200,0,0.4)",
              }}
            >
              {busy ? (
                <>
                  <span className="animate-spin text-base">⏳</span>
                  {t(locale, "shareMyceliumGenerating")}
                </>
              ) : (
                <>
                  <span>🚀</span>
                  {t(locale, "shareMyceliumBtn")}
                </>
              )}
            </button>

            {/* X Intent */}
            <a
              href={xIntent}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleIntentClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-white/40 transition-all"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.735-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
              </svg>
              {t(locale, "shareMyceliumXBtn")}
            </a>

            {/* LinkedIn Intent */}
            <a
              href={linkedinIntent}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleIntentClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm text-white border border-white/20 hover:border-white/40 transition-all"
              style={{ background: "rgba(0,119,181,0.25)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {t(locale, "shareMyceliumLinkedinBtn")}
            </a>

            {/* Download PNG */}
            <button
              onClick={handleDownload}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-gray-300 border border-white/15 hover:border-white/30 transition-all disabled:opacity-60"
              style={{ background: "rgba(255,255,255,0.04)" }}
              title="Download PNG"
            >
              <span>⬇</span> PNG
            </button>

            {/* Copy link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm text-gray-300 border border-white/15 hover:border-white/30 transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span>🔗</span>
            </button>
          </div>

          {/* Hint / status */}
          {hint && (
            <div className="text-xs text-[#00ff9d] font-mono">{hint}</div>
          )}
        </div>
      )}
    </div>
  )
}
