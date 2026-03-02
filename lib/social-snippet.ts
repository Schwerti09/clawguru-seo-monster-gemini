type SocialSnippetInput = {
  title: string
  summary: string
  maxLength?: number
}

function clampText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  const slice = text.slice(0, maxLength).trimEnd()
  const lastSpace = slice.lastIndexOf(" ")
  const safeCut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice
  return `${safeCut.trimEnd()}…`
}

export function buildSocialTitle(title: string, maxLength = 70) {
  return clampText(title, maxLength)
}

export function buildSocialSnippet({ title, summary, maxLength = 200 }: SocialSnippetInput) {
  const combined = `${title.trim()}: ${summary.trim()}`.trim()
  const base = combined.length <= maxLength ? combined : summary.trim()
  const suffix = " - ClawGuru Runbook"
  const withSuffix = base.length + suffix.length <= maxLength ? `${base}${suffix}` : base
  return clampText(withSuffix, maxLength)
}
