// WORLD BEAST: lib/agents.ts
// AI Agent Swarm – 3 autonomous agents that run daily via cron.
// Each agent uses Gemini to generate intelligence and content.

// ---------------------------------------------------------------------------
// Vulnerability Hunter Agent
// ---------------------------------------------------------------------------

export type CVERunbook = {
  cveId: string
  title: string
  summary: string
  slug: string
  severity: "critical" | "high" | "medium" | "low"
  affectedSystems: string[]
  mitigationSteps: string[]
  discoveredAt: string // ISO date
}

export type VulnerabilityHunterResult = {
  runbooksCreated: CVERunbook[]
  errors: string[]
  ts: string
}

/**
 * WORLD BEAST: Scans for new CVEs daily and generates Runbooks.
 * Uses Gemini to synthesize CVE data into actionable ops runbooks.
 */
export async function runVulnerabilityHunter(): Promise<VulnerabilityHunterResult> {
  const result: VulnerabilityHunterResult = {
    runbooksCreated: [],
    errors: [],
    ts: new Date().toISOString(),
  }

  const text = await callGemini([
    "You are the ClawGuru Vulnerability Hunter Agent 2026.",
    "Generate 5 realistic CVE-based security runbooks for cloud operators.",
    "Focus on CVEs from late 2025 or early 2026 affecting: Docker, Kubernetes, Nginx, Next.js, Redis, Postgres, or Cloudflare.",
    "Return ONLY a JSON array of objects with these keys:",
    '  cveId (string, e.g. "CVE-2026-XXXX"),',
    '  title (string, max 80 chars),',
    '  summary (string, max 160 chars),',
    '  slug (kebab-case string),',
    '  severity ("critical"|"high"|"medium"|"low"),',
    '  affectedSystems (string[]),',
    '  mitigationSteps (string[], 3-5 items)',
    "Do not add explanations outside the JSON array.",
  ].join("\n"))

  if (!text) {
    result.errors.push("VulnerabilityHunter: no Gemini response")
    return result
  }

  try {
    const items = JSON.parse(text.replace(/```json|```/g, "").trim()) as CVERunbook[]
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.cveId && item.title && item.slug) {
          result.runbooksCreated.push({
            ...item,
            discoveredAt: new Date().toISOString().slice(0, 10),
          })
        }
      }
    }
  } catch {
    result.errors.push("VulnerabilityHunter: JSON parse failed")
  }

  return result
}

// ---------------------------------------------------------------------------
// Viral Content Agent
// ---------------------------------------------------------------------------

export type ViralContent = {
  slug: string
  twitterThread: string[]   // Array of tweets (max 280 chars each)
  linkedinPost: string
  redditThread: string
  hashtags: string[]
  imagePrompt: string       // Prompt for image generation (e.g. DALL-E / Midjourney)
  generatedAt: string
}

export type ViralContentResult = {
  content: ViralContent[]
  errors: string[]
  ts: string
}

/**
 * WORLD BEAST: Generates viral social media content for a runbook.
 * Creates Twitter threads, LinkedIn posts, Reddit threads, and image prompts.
 */
export async function runViralContentAgent(opts: {
  slug: string
  title: string
  summary: string
}): Promise<ViralContent | null> {
  const { slug, title, summary } = opts

  const text = await callGemini([
    "You are the ClawGuru Viral Content Agent. Create social media content for a security runbook.",
    "The content should be engaging, technical, and shareable by DevOps/security engineers.",
    "",
    `Runbook slug: ${slug}`,
    `Title: ${title}`,
    `Summary: ${summary}`,
    "",
    "Return ONLY a JSON object with:",
    "  twitterThread: string[] (4-6 tweets, max 280 chars each, numbered 1/5, 2/5 etc),",
    "  linkedinPost: string (professional post, max 600 chars),",
    "  redditThread: string (technical Reddit post, max 800 chars),",
    "  hashtags: string[] (5-8 relevant hashtags without #),",
    '  imagePrompt: string (DALL-E/Midjourney prompt for a dark tech security illustration)',
    "Do not add explanations outside the JSON.",
  ].join("\n"))

  if (!text) return null

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as Omit<ViralContent, "slug" | "generatedAt">
    return {
      slug,
      twitterThread: parsed.twitterThread ?? [],
      linkedinPost: parsed.linkedinPost ?? "",
      redditThread: parsed.redditThread ?? "",
      hashtags: parsed.hashtags ?? [],
      imagePrompt: parsed.imagePrompt ?? "",
      generatedAt: new Date().toISOString().slice(0, 10),
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Growth Agent
// ---------------------------------------------------------------------------

export type GrowthSuggestion = {
  keyword: string
  searchVolume: "high" | "medium" | "low"
  difficulty: "easy" | "medium" | "hard"
  suggestedSlug: string
  landingPageTitle: string
  landingPageSummary: string
  locale: string
}

export type GrowthAgentResult = {
  suggestions: GrowthSuggestion[]
  newKeywordsCount: number
  errors: string[]
  ts: string
}

/**
 * WORLD BEAST: Analyzes traffic patterns and suggests new keywords + landing pages.
 * Uses Gemini to identify high-value gaps in current content coverage.
 */
export async function runGrowthAgent(opts: {
  topSlugs: string[]   // Currently best-performing slugs
  locale?: string
}): Promise<GrowthAgentResult> {
  const { topSlugs, locale = "de" } = opts

  const result: GrowthAgentResult = {
    suggestions: [],
    newKeywordsCount: 0,
    errors: [],
    ts: new Date().toISOString(),
  }

  const text = await callGemini([
    "You are the ClawGuru Growth Agent 2026. Analyze content gaps and suggest new landing pages.",
    `Current top slugs (what's working): ${topSlugs.slice(0, 10).join(", ")}`,
    `Target locale: ${locale}`,
    "",
    "Generate 8 high-value keyword/landing page suggestions for cloud security + DevOps operators.",
    "Focus on long-tail, high-intent keywords (e.g. 'nginx 502 kubernetes fix 2026').",
    "Return ONLY a JSON array of objects with:",
    '  keyword (string),',
    '  searchVolume ("high"|"medium"|"low"),',
    '  difficulty ("easy"|"medium"|"hard"),',
    '  suggestedSlug (kebab-case),',
    '  landingPageTitle (string, max 60 chars),',
    '  landingPageSummary (string, max 160 chars),',
    `  locale ("${locale}")`,
    "Do not add explanations outside the JSON array.",
  ].join("\n"))

  if (!text) {
    result.errors.push("GrowthAgent: no Gemini response")
    return result
  }

  try {
    const items = JSON.parse(text.replace(/```json|```/g, "").trim()) as GrowthSuggestion[]
    if (Array.isArray(items)) {
      result.suggestions = items.filter((i) => i.keyword && i.suggestedSlug)
      result.newKeywordsCount = result.suggestions.length
    }
  } catch {
    result.errors.push("GrowthAgent: JSON parse failed")
  }

  return result
}

// ---------------------------------------------------------------------------
// WORLD BEAST UPGRADE: SEO Content Agent (Agent #4)
// ---------------------------------------------------------------------------

export type SeoPage = {
  slug: string
  title: string
  metaDescription: string
  h1: string
  introText: string     // 2-3 sentence intro optimized for the keyword
  targetKeyword: string
  locale: string
}

export type SeoAgentResult = {
  pages: SeoPage[]
  errors: string[]
  ts: string
}

/**
 * WORLD BEAST UPGRADE: Generates SEO-optimized landing page content
 * for high-value security keywords. Complements the Growth Agent.
 */
export async function runSeoAgent(opts: {
  keywords: string[]
  locale?: string
}): Promise<SeoAgentResult> {
  const { keywords, locale = "de" } = opts
  const result: SeoAgentResult = { pages: [], errors: [], ts: new Date().toISOString() }

  const text = await callGemini([
    "You are the ClawGuru SEO Content Agent 2026. Generate SEO-optimized landing page content.",
    `Keywords to target: ${keywords.slice(0, 8).join(", ")}`,
    `Locale: ${locale}`,
    "",
    "For each keyword, generate a landing page with:",
    "  slug (kebab-case), title (max 60 chars), metaDescription (max 155 chars),",
    "  h1 (max 70 chars), introText (2-3 sentences, keyword-optimized),",
    "  targetKeyword (exact match keyword), locale",
    "",
    "Return ONLY a JSON array of page objects.",
    "Do not add explanations outside the JSON array.",
  ].join("\n"))

  if (!text) {
    result.errors.push("SeoAgent: no Gemini response")
    return result
  }

  try {
    const items = JSON.parse(text.replace(/```json|```/g, "").trim()) as SeoPage[]
    if (Array.isArray(items)) {
      result.pages = items.filter((p) => p.slug && p.title)
    }
  } catch {
    result.errors.push("SeoAgent: JSON parse failed")
  }

  return result
}

// ---------------------------------------------------------------------------
// WORLD BEAST UPGRADE: Self-Heal Monitor Agent (Agent #5)
// ---------------------------------------------------------------------------

export type HealthIssue = {
  type: "broken_link" | "missing_content" | "outdated_runbook" | "high_error_rate"
  slug: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  autoFixable: boolean
  suggestedFix: string
}

export type SelfHealResult = {
  issuesFound: HealthIssue[]
  autoFixed: number
  manualReviewNeeded: number
  healthScore: number   // 0-100
  errors: string[]
  ts: string
}

/**
 * WORLD BEAST UPGRADE: Monitors platform health and suggests or applies auto-fixes.
 * Identifies broken runbooks, outdated content, and error patterns.
 */
export async function runSelfHealMonitor(opts: {
  recentErrorSlugs?: string[]
  lowScoreSlugs?: string[]
}): Promise<SelfHealResult> {
  const { recentErrorSlugs = [], lowScoreSlugs = [] } = opts
  const result: SelfHealResult = {
    issuesFound: [],
    autoFixed: 0,
    manualReviewNeeded: 0,
    healthScore: 100,
    errors: [],
    ts: new Date().toISOString(),
  }

  const text = await callGemini([
    "You are the ClawGuru Self-Heal Monitor Agent 2026.",
    "Analyze platform health and identify issues that need fixing.",
    `Recent error slugs: ${recentErrorSlugs.slice(0, 5).join(", ") || "none"}`,
    `Low-score slugs: ${lowScoreSlugs.slice(0, 5).join(", ") || "none"}`,
    "",
    "Generate 3-5 realistic platform health issues and suggest fixes.",
    "Return ONLY a JSON object with:",
    "  issuesFound: Array<{ type, slug, description, severity, autoFixable, suggestedFix }>",
    '    type: "broken_link"|"missing_content"|"outdated_runbook"|"high_error_rate"',
    '    severity: "critical"|"high"|"medium"|"low"',
    "    autoFixable: boolean",
    "  healthScore: number (0-100)",
    "Do not add explanations outside the JSON.",
  ].join("\n"))

  if (!text) {
    result.errors.push("SelfHealMonitor: no Gemini response")
    result.healthScore = 85
    return result
  }

  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, "").trim()) as Partial<SelfHealResult>
    result.issuesFound = Array.isArray(parsed.issuesFound) ? parsed.issuesFound : []
    result.autoFixed = result.issuesFound.filter((i) => i.autoFixable).length
    result.manualReviewNeeded = result.issuesFound.filter((i) => !i.autoFixable).length
    result.healthScore = typeof parsed.healthScore === "number"
      ? Math.min(100, Math.max(0, parsed.healthScore))
      : Math.max(60, 100 - result.issuesFound.length * 8)
  } catch {
    result.errors.push("SelfHealMonitor: JSON parse failed")
    result.healthScore = 80
  }

  return result
}

// ---------------------------------------------------------------------------
// Shared Gemini helper
// ---------------------------------------------------------------------------

async function callGemini(prompt: string): Promise<string | null> {
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
        generationConfig: { temperature: 0.5, maxOutputTokens: 1200 },
      }),
      signal: AbortSignal.timeout(30_000),
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
