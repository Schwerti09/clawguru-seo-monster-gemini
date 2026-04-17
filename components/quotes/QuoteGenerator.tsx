import { Quote, Share2, RefreshCw } from "lucide-react"

/**
 * Phase 4 Schritt 76 — Roast Quotes — Tweetable Snippets
 * Quote Generator for shareable roast snippets
 * No mock data - real quotes from roast_results
 */

export interface Quote {
  id: string
  text: string
  author: string
  score: number
  stackSummary: string
  createdAt: string
}

interface QuoteGeneratorProps {
  quotes: Quote[]
  locale?: string
  onRefresh?: () => void
}

export default function QuoteGenerator({ quotes, locale = "de", onRefresh }: QuoteGeneratorProps) {
  const isDE = locale === "de"

  const getRandomQuote = () => {
    if (!quotes || quotes.length === 0) return null
    const randomIndex = Math.floor(Math.random() * quotes.length)
    return quotes[randomIndex]
  }

  const currentQuote = getRandomQuote()

  const handleShare = (quote: Quote) => {
    const shareText = `"${quote.text}" — ${quote.author} (Score: ${quote.score}) #ClawGuru #Security`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, "_blank")
  }

  if (!currentQuote) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          {isDE ? "Keine Quotes verfügbar." : "No quotes available."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 relative">
      <div className="flex items-center gap-2 mb-4">
        <Quote className="w-5 h-5 text-cyan-400" />
        <h3 className="font-bold text-gray-100">
          {isDE ? "Roast Quote" : "Roast Quote"}
        </h3>
      </div>

      <blockquote className="mb-4">
        <p className="text-lg text-gray-100 italic mb-3">"{currentQuote.text}"</p>
        <footer className="text-sm text-gray-400">
          <span className="font-semibold text-cyan-400">{currentQuote.author}</span>
          {isDE ? " • " : " • "}
          {isDE ? "Score" : "Score"}: {currentQuote.score}
        </footer>
      </blockquote>

      <div className="bg-gray-900 p-3 rounded-lg mb-4">
        <p className="text-xs text-gray-400 mb-1">
          {isDE ? "Stack" : "Stack"}
        </p>
        <p className="text-sm text-gray-300">{currentQuote.stackSummary}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleShare(currentQuote)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold text-white text-sm transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {isDE ? "Teilen" : "Share"}
        </button>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-100 text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Component for displaying multiple quotes
interface QuotesListProps {
  quotes: Quote[]
  locale?: string
}

export function QuotesList({ quotes, locale = "de" }: QuotesListProps) {
  const isDE = locale === "de"

  if (!quotes || quotes.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          {isDE ? "Keine Quotes verfügbar." : "No quotes available."}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="bg-gray-800 p-6 rounded-lg border border-gray-700"
        >
          <blockquote className="mb-3">
            <p className="text-lg text-gray-100 italic mb-2">"{quote.text}"</p>
            <footer className="text-sm text-gray-400">
              <span className="font-semibold text-cyan-400">{quote.author}</span>
              {isDE ? " • " : " • "}
              {isDE ? "Score" : "Score"}: {quote.score}
            </footer>
          </blockquote>
          <div className="flex items-center justify-between">
            <div className="bg-gray-900 px-3 py-1 rounded-lg">
              <p className="text-xs text-gray-400">{quote.stackSummary}</p>
            </div>
            <button
              onClick={() => {
                const shareText = `"${quote.text}" — ${quote.author} (Score: ${quote.score}) #ClawGuru #Security`
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
                window.open(twitterUrl, "_blank")
              }}
              className="flex items-center gap-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-xs transition-colors"
            >
              <Share2 className="w-3 h-3" />
              {isDE ? "Teilen" : "Share"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
