'use client'
// WORLD BEAST: app/share/[slug]/ShareButtons.tsx
// Client component for clipboard + native share buttons.

import { useState } from "react"

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
}: {
  label: string
  icon: string
  content: string
  shareUrl?: string
}) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="p-5 rounded-2xl border border-gray-800 bg-black/30">
      <div className="flex items-center justify-between mb-3">
        <div className="font-black text-sm flex items-center gap-2">
          <span>{icon}</span> {label}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold"
          >
            {copied ? "✓ Kopiert!" : "Kopieren"}
          </button>
          {shareUrl && (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 hover:bg-brand-cyan/25 text-xs font-bold text-brand-cyan"
            >
              Öffnen ↗
            </a>
          )}
        </div>
      </div>
      <pre className="whitespace-pre-wrap text-xs text-gray-300 bg-black/40 rounded-xl p-3 max-h-48 overflow-y-auto">
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

  return (
    <div className="space-y-4">
      <CopyCard
        label="Twitter / X Thread"
        icon="🐦"
        content={twitterThread}
        shareUrl={twitterUrl}
      />
      <CopyCard
        label="LinkedIn Post"
        icon="💼"
        content={linkedinPost}
        shareUrl={linkedinUrl}
      />
      <CopyCard
        label="Reddit Thread"
        icon="🤖"
        content={redditPost}
        shareUrl={redditUrl}
      />

      {/* AI-Generated Thread option */}
      <div className="p-4 rounded-2xl border border-gray-800 bg-black/20 text-sm text-gray-400">
        💡 <strong>Noch besserer Thread?</strong> Nutze den{" "}
        <a
          href={`/api/agents/viral`}
          className="text-brand-cyan hover:underline"
        >
          Viral Content Agent
        </a>{" "}
        für KI-generierte Threads mit Hashtag-Analyse (POST mit{" "}
        <code className="bg-gray-800 px-1 rounded text-xs">
          {`{"slug":"${slug}",...}`}
        </code>
        ).
      </div>
    </div>
  )
}
