'use client'
// WORLD BEAST + VISUAL BEAST 2026: app/share/[slug]/ShareButtons.tsx
// Client component for clipboard + native share buttons with hover glow + icon scale.

import { useState } from "react"
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
}: {
  label: string
  icon: string
  content: string
  shareUrl?: string
  slug: string
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
    // VISUAL BEAST 2026: Glass card with hover glow
    <div className="p-5 rounded-2xl glass-card hover-neon-border transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="font-black text-sm flex items-center gap-2 font-headline">
          {/* VISUAL BEAST 2026: Icon scale on parent hover */}
          <span className="text-lg transition-transform duration-300 group-hover:scale-125">{icon}</span> {label}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="px-3 py-1 rounded-lg glass-card hover:shadow-neon-green text-xs font-bold transition-all"
          >
            {copied ? "✓ Kopiert!" : "Kopieren"}
          </button>
          {shareUrl && (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg glass-card border-[#00ff9d]/30 hover:shadow-neon-green text-xs font-bold neon-text-green transition-all hover:scale-105"
            >
              Öffnen ↗
            </a>
          )}
        </div>
      </div>
      <pre className="whitespace-pre-wrap text-xs text-gray-300 bg-black/40 rounded-xl p-3 max-h-48 overflow-y-auto font-mono">
        {content}
      </pre>
    </div>
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

  return (
    <div className="space-y-4">
      {/* VISUAL BEAST 2026: Mobile native share with neon styling */}
      {typeof navigator !== "undefined" && (
        <button
          onClick={nativeShare}
          className="w-full sm:hidden px-5 py-3 rounded-2xl font-black bg-gradient-to-r from-[#00ff9d] to-[#00b8ff] text-black hover:opacity-90 shadow-neon-green"
        >
          📱 Teilen (Native Share)
        </button>
      )}

      <CopyCard
        label="Twitter / X Thread"
        icon="🐦"
        content={twitterThread}
        shareUrl={twitterUrl}
        slug={slug}
      />
      <CopyCard
        label="LinkedIn Post"
        icon="💼"
        content={linkedinPost}
        shareUrl={linkedinUrl}
        slug={slug}
      />
      <CopyCard
        label="Reddit Thread"
        icon="🤖"
        content={redditPost}
        shareUrl={redditUrl}
        slug={slug}
      />

      {/* AI-Generated Thread option */}
      <div className="p-4 rounded-2xl glass-card text-sm text-gray-400">
        💡 <strong>Noch besserer Thread?</strong> Nutze den{" "}
        <a
          href={`/api/agents/viral`}
          className="neon-text-green hover:underline"
        >
          Viral Content Agent
        </a>{" "}
        für KI-generierte Threads mit Hashtag-Analyse (POST mit{" "}
        <code className="bg-black/40 px-1 rounded text-xs font-mono">
          {`{"slug":"${slug}",...}`}
        </code>
        ).
      </div>
    </div>
  )
}
