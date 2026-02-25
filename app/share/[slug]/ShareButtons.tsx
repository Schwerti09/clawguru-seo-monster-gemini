'use client'
// WORLD BEAST FINAL LAUNCH + VISUAL UPGRADE 2026: app/share/[slug]/ShareButtons.tsx
// Social buttons with glow and scale effects. Mobile-first.

import { useState } from "react"
import { motion } from "framer-motion"
import { trackEvent } from "@/lib/analytics"

type Props = {
  twitterThread: string
  linkedinPost: string
  redditPost: string
  runbookUrl: string
  slug: string
  title: string
}

function CopyCard({
  label,
  icon,
  content,
  shareUrl,
  slug,
  accentColor = "#00ff9d",
}: {
  label: string
  icon: string
  content: string
  shareUrl?: string
  slug: string
  accentColor?: string
}) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
    // WORLD BEAST FINAL LAUNCH: track share button click
    trackEvent("share_button_clicked", { platform: label, slug })
  }

  return (
    // VISUAL UPGRADE 2026: Card with glassmorphism and hover glow
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="p-5 rounded-2xl glass-card glass-card-hover"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-black text-sm flex items-center gap-2 font-heading">
          <span>{icon}</span> {label}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300"
            style={{
              background: copied ? "rgba(0, 255, 157, 0.15)" : "rgba(255, 255, 255, 0.05)",
              border: copied ? "1px solid rgba(0, 255, 157, 0.3)" : "1px solid rgba(255, 255, 255, 0.10)",
              color: copied ? "#00ff9d" : "#f0f0f0",
            }}
          >
            {copied ? "✓ Kopiert!" : "Kopieren"}
          </button>
          {shareUrl && (
            // VISUAL UPGRADE 2026: Social open button with glow on hover
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 hover:shadow-neon-green"
              style={{
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
                color: accentColor,
              }}
            >
              Öffnen ↗
            </a>
          )}
        </div>
      </div>
      <pre className="whitespace-pre-wrap text-xs text-gray-300 rounded-xl p-3 max-h-48 overflow-y-auto" style={{ background: "rgba(0, 0, 0, 0.3)" }}>
        {content}
      </pre>
    </motion.div>
  )
}

export function ShareButtons({
  twitterThread,
  linkedinPost,
  redditPost,
  runbookUrl,
  slug,
  title,
}: Props) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterThread.slice(0, 280))}`
  const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(runbookUrl)}&title=${encodeURIComponent(title)}`
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(runbookUrl)}&title=${encodeURIComponent(title)}`

  // WORLD BEAST FINAL LAUNCH: native share for mobile
  function nativeShare() {
    if (navigator.share) {
      navigator.share({ title, url: runbookUrl }).catch(() => {})
      trackEvent("share_button_clicked", { platform: "native", slug })
    }
  }

  // VISUAL UPGRADE 2026: Staggered animation for cards
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {/* WORLD BEAST FINAL LAUNCH: mobile-first native share button */}
      {typeof navigator !== "undefined" && (
        <motion.button
          variants={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={nativeShare}
          className="w-full sm:hidden px-5 py-3 rounded-2xl font-black text-black transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #00ff9d, #00b8ff)",
            boxShadow: "0 0 20px rgba(0, 255, 157, 0.2)",
          }}
        >
          📱 Teilen (Native Share)
        </motion.button>
      )}

      <motion.div variants={item}>
        <CopyCard
          label="Twitter / X Thread"
          icon="🐦"
          content={twitterThread}
          shareUrl={twitterUrl}
          slug={slug}
          accentColor="#1da1f2"
        />
      </motion.div>
      <motion.div variants={item}>
        <CopyCard
          label="LinkedIn Post"
          icon="💼"
          content={linkedinPost}
          shareUrl={linkedinUrl}
          slug={slug}
          accentColor="#0077b5"
        />
      </motion.div>
      <motion.div variants={item}>
        <CopyCard
          label="Reddit Thread"
          icon="🤖"
          content={redditPost}
          shareUrl={redditUrl}
          slug={slug}
          accentColor="#ff4500"
        />
      </motion.div>

      {/* VISUAL UPGRADE 2026: AI thread suggestion with glassmorphism */}
      <motion.div variants={item} className="p-4 rounded-2xl glass-card text-sm text-gray-400">
        💡 <strong>Noch besserer Thread?</strong> Nutze den{" "}
        <a
          href={`/api/agents/viral`}
          style={{ color: "#00ff9d" }}
          className="hover:underline"
        >
          Viral Content Agent
        </a>{" "}
        für KI-generierte Threads mit Hashtag-Analyse (POST mit{" "}
        <code className="px-1 rounded text-xs" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
          {`{"slug":"${slug}",...}`}
        </code>
        ).
      </motion.div>
    </motion.div>
  )
}
