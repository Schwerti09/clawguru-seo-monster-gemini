// WORLD BEAST: lib/agents.ts
// AI Agent Swarm – three specialist agents that run autonomously.
//   1. Vulnerability Hunter Agent – scans new CVEs daily, builds Runbooks
//   2. Viral Content Agent – generates Twitter/LinkedIn/Reddit threads per Runbook
//   3. Growth Agent – analyses traffic, suggests keywords, builds landing pages

// ---------------------------------------------------------------------------
// Shared Gemini helper
// ---------------------------------------------------------------------------

async function callGemini(prompt: string, maxTokens = 800): Promise<string | null> {
  const geminiKey = process.env.GEMINI_API_KEY
  const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash"
  const geminiBase = (
    process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta"
  ).replace(/\/$/, "")

  if (!geminiKey) return null

  try {
    const url = `${geminiBase}/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: maxTokens },
      }),
      signal: AbortSignal.timeout(25_000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const parts = data?.candidates?.[0]?.content?.parts
    if (Array.isArray(parts)) {
      return parts.map((p: { text?: string }) => p?.text ?? "").join("").trim() || null
    }
    return null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// 1. Vulnerability Hunter Agent
// ---------------------------------------------------------------------------

export type CveRunbook = {
  cveId: string
  title: string
  summary: string
  slug: string
  tags: string[]
  steps: string[]
  severity: "critical" | "high" | "medium" | "low"
}

export type VulnHunterResult = {
  runbooks: CveRunbook[]
  errors: string[]
  scannedAt: string
}

/**
 * WORLD BEAST: Vulnerability Hunter Agent
 * Asks Gemini to surface the most relevant CVEs from the last 30 days and
 * produces ready-to-publish runbook metadata for each one.
 */
export async function runVulnerabilityHunterAgent(): Promise<VulnHunterResult> {
  const result: VulnHunterResult = { runbooks: [], errors: [], scannedAt: new Date().toISOString() }

  const prompt = [
    "You are the ClawGuru Vulnerability Hunter for 2026.",
    "List the 5 most critical CVEs or security vulnerabilities announced in the last 30 days",
    "that affect cloud, Kubernetes, Linux, or web application stacks.",
    "For each CVE return ONLY a JSON array of objects with keys:",
    "  cveId (string, e.g. 'CVE-2026-1234'),",
    "  title (string, max 80 chars),",
    "  summary (string, max 160 chars),",
    "  slug (kebab-case string),",
    "  tags (string[], max 6),",
    "  steps (string[], 4-8 remediation steps),",
    "  severity ('critical'|'high'|'medium'|'low')",
    "Return ONLY the JSON array. No markdown fences, no explanation.",
  ].join("\n")

  const text = await callGemini(prompt, 1200)
  if (!text) {
    result.errors.push("vuln-hunter: no Gemini response")
    return result
  }

  try {
    const jsonStr = text.replace(/```json|```/g, "").trim()
    const items = JSON.parse(jsonStr) as CveRunbook[]
    if (Array.isArray(items)) {
      result.runbooks = items.filter(
        (i) => i.cveId && i.title && i.slug && Array.isArray(i.steps)
      )
    }
  } catch {
    result.errors.push("vuln-hunter: JSON parse failed")
  }

  return result
}

// ---------------------------------------------------------------------------
// 2. Viral Content Agent
// ---------------------------------------------------------------------------

export type ViralThreads = {
  twitter: string
  linkedin: string
  reddit: string
  imagePrompt: string
}

export type ViralContentResult = {
  slug: string
  threads: ViralThreads | null
  error?: string
}

/**
 * WORLD BEAST: Viral Content Agent
 * For a given runbook, generates ready-to-post Twitter/LinkedIn/Reddit threads
 * plus an image generation prompt (for DALL-E / Midjourney / Imagen).
 */
export async function runViralContentAgent(opts: {
  slug: string
  title: string
  summary: string
  tags: string[]
}): Promise<ViralContentResult> {
  const { slug, title, summary, tags } = opts

  const prompt = [
    "You are the ClawGuru Viral Content Agent for 2026.",
    "Create viral social media content for the following security/ops runbook.",
    "Return ONLY a JSON object with keys:",
    "  twitter (string, max 280 chars, punchy, with #hashtags and ClawGuru mention),",
    "  linkedin (string, max 600 chars, professional, with line breaks \\n, ends with CTA),",
    "  reddit (string, max 500 chars, community-style post for r/sysadmin or r/netsec),",
    "  imagePrompt (string, detailed prompt for an AI image generator showing a cyberpunk ops scene)",
    "Return ONLY the JSON. No markdown fences, no explanation.",
    "",
    `Runbook slug: ${slug}`,
    `Title: ${title}`,
    `Summary: ${summary}`,
    `Tags: ${tags.join(", ")}`,
    `URL: https://clawguru.org/runbook/${slug}`,
  ].join("\n")

  const text = await callGemini(prompt, 800)
  if (!text) {
    return { slug, threads: null, error: "viral-agent: no Gemini response" }
  }

  try {
    const jsonStr = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(jsonStr) as ViralThreads
    if (parsed.twitter && parsed.linkedin && parsed.reddit) {
      return { slug, threads: parsed }
    }
    return { slug, threads: null, error: "viral-agent: incomplete JSON keys" }
  } catch {
    return { slug, threads: null, error: "viral-agent: JSON parse failed" }
  }
}

// ---------------------------------------------------------------------------
// 3. Growth Agent
// ---------------------------------------------------------------------------

export type KeywordSuggestion = {
  keyword: string
  intent: "informational" | "transactional" | "navigational"
  estimatedVolume: "low" | "medium" | "high"
  suggestedSlug: string
  landingPageTitle: string
  landingPageDescription: string
}

export type GrowthAgentResult = {
  keywords: KeywordSuggestion[]
  topOpportunities: string[]
  errors: string[]
  analyzedAt: string
}

/**
 * WORLD BEAST: Growth Agent
 * Analyses the current runbook landscape, suggests high-value new keywords,
 * and proposes landing page titles + descriptions for each opportunity.
 */
export async function runGrowthAgent(opts: {
  existingTags: string[]
  topSlugs: string[]
}): Promise<GrowthAgentResult> {
  const { existingTags, topSlugs } = opts
  const result: GrowthAgentResult = {
    keywords: [],
    topOpportunities: [],
    errors: [],
    analyzedAt: new Date().toISOString(),
  }

  const prompt = [
    "You are the ClawGuru Growth Agent for 2026.",
    "Analyse the following existing content tags and top runbook slugs.",
    "Suggest 10 high-value keyword opportunities that are NOT yet covered.",
    "Focus on cloud security, DevOps, Kubernetes, incident response for 2025-2026.",
    "Return ONLY a JSON object with keys:",
    "  keywords: array of objects with: keyword, intent ('informational'|'transactional'|'navigational'),",
    "    estimatedVolume ('low'|'medium'|'high'), suggestedSlug, landingPageTitle, landingPageDescription (max 160 chars)",
    "  topOpportunities: string[] (top 3 single-sentence summaries)",
    "Return ONLY the JSON. No markdown fences, no explanation.",
    "",
    `Existing tags (sample): ${existingTags.slice(0, 30).join(", ")}`,
    `Top slugs (sample): ${topSlugs.slice(0, 20).join(", ")}`,
  ].join("\n")

  const text = await callGemini(prompt, 1400)
  if (!text) {
    result.errors.push("growth-agent: no Gemini response")
    return result
  }

  try {
    const jsonStr = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(jsonStr) as { keywords?: KeywordSuggestion[]; topOpportunities?: string[] }
    if (Array.isArray(parsed.keywords)) result.keywords = parsed.keywords
    if (Array.isArray(parsed.topOpportunities)) result.topOpportunities = parsed.topOpportunities
  } catch {
    result.errors.push("growth-agent: JSON parse failed")
  }

  return result
}
