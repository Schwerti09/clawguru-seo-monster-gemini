type SeoMutationInput = {
  title: string
  trendKeywords?: string[]
  now?: Date
}

const DAY_PREFIXES = [
  "Sunday Signal:",
  "Monday Momentum:",
  "Tuesday Ops Brief:",
  "Wednesday Alert:",
  "Thursday Fix:",
  "Friday Deploy:",
  "Weekend Watch:"
]

const CVE_PATTERN = /cve-\d{4}-\d+/i

function clampTitle(title: string, max = 70) {
  if (title.length <= max) return title
  return `${title.slice(0, Math.max(0, max - 3)).trimEnd()}...`
}

function firstTrend(trends?: string[]) {
  if (!Array.isArray(trends)) return ""
  return trends.map((t) => t.trim()).find(Boolean) || ""
}

export function mutateSeoTitle({ title, trendKeywords, now = new Date() }: SeoMutationInput) {
  const base = title.trim()
  if (!base) return base

  const trend = firstTrend(trendKeywords)
  if (trend && !base.toLowerCase().includes(trend.toLowerCase())) {
    return clampTitle(`${trend}: ${base}`)
  }

  if (CVE_PATTERN.test(base) && !base.toUpperCase().includes("URGENT:")) {
    return clampTitle(`URGENT: ${base}`)
  }

  const prefix = DAY_PREFIXES[now.getDay()] || ""
  if (prefix && !base.startsWith(prefix)) {
    return clampTitle(`${prefix} ${base}`)
  }

  return clampTitle(base)
}
