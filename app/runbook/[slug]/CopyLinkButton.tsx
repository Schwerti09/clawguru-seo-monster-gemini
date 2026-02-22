"use client"
// File: app/runbook/[slug]/CopyLinkButton.tsx
import { useState } from "react"

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-xl border bg-black/30 text-xs transition-colors cursor-pointer ${
        copied
          ? "border-emerald-500/60 text-emerald-400"
          : "border-gray-700 text-gray-300 hover:border-gray-500"
      }`}
      aria-label="Link kopieren"
      type="button"
    >
      {copied ? "✅ Kopiert!" : "🔗 Link kopieren"}
    </button>
  )
}
