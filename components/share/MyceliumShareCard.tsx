type Props = {
  title?: string
  pageUrl?: string
  answer?: string
  locale?: string
  className?: string
}

export default function MyceliumShareCard({ title, pageUrl, className }: Props) {
  const shareUrl = typeof window !== "undefined" ? window.location.origin + (pageUrl ?? "") : pageUrl ?? ""
  const text = title ?? "ClawGuru"

  return (
    <div className={`p-4 bg-zinc-900 rounded-xl border border-zinc-700 ${className ?? ""}`}>
      <div className="text-sm font-bold text-gray-200 mb-2">🔗 Teilen</div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-900/40 border border-sky-700/40 text-sky-300 hover:bg-sky-800/50 transition-colors"
        >
          𝕏 Twitter
        </a>
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-900/40 border border-blue-700/40 text-blue-300 hover:bg-blue-800/50 transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </div>
  )
}
