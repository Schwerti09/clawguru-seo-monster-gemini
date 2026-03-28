/**
 * PHASE 2: Batch Content Generator Prompts
 * 
 * Template-basierte Prompts für AI-Content-Generierung
 * Optimiert für Deepseek/OpenAI/Gemini mit JSON-Output
 */

export type ContentType = "runbook" | "tool-review" | "comparison" | "security-guide" | "faq" | "case-study"

export interface BatchContentRequest {
  contentType: ContentType
  context: Record<string, string>
  variant?: string // e.g., "bash", "powershell", "terraform"
  targetLocale?: string // e.g., "de", "en"
  tone?: "professional" | "casual" | "urgent"
}

export interface BatchContentResult {
  title: string
  summary: string
  content: string // Markdown
  keywords: string[]
  estimatedReadTime: number // minutes
  codeBlocks?: Array<{ lang: string; code: string }>
  faqItems?: Array<{ q: string; a: string }>
  metadata: {
    generatedAt: string
    contentType: ContentType
    variant?: string
    confidence: number // 0-1
  }
}

/**
 * RUNBOOK GENERATION PROMPT
 * 
 * Generiert vollständige, copy-paste-ready Runbooks
 * für Incident-Response, Hardening, Troubleshooting
 */
export function promptRunbook(ctx: {
  provider: string
  service: string
  issue: string
  year: string
  tone?: "professional" | "casual" | "urgent"
}): string {
  const tone = ctx.tone || "professional"
  const urgencyHint = tone === "urgent" ? "This is a CRITICAL issue that needs immediate action." : ""
  
  return `You are an expert DevOps/SRE engineer with 15+ years of production incident experience.
Generate a CRITICAL, copy-paste-ready runbook for this issue:

**Context:**
- Provider: ${ctx.provider}
- Service: ${ctx.service}
- Issue: ${ctx.issue}
- Year: ${ctx.year} (use current best practices)
${urgencyHint}

**Task:** Generate a complete JSON-structured runbook with:
1. Clear title (max 80 chars)
2. One-line summary (max 160 chars)
3. Triage checklist (5-8 items, max 100 chars each)
4. Root cause analysis (explain likely causes)
5. Step-by-step fix (5-12 copy-paste-ready bash/config snippets)
6. Verification steps (how to confirm the fix worked)
7. Prevention tips (guardrails for long-term)
8. Common mistakes (what NOT to do)
9. Relevant keywords for SEO (5-10)

**Output format (valid JSON, no markdown):**
\`\`\`json
{
  "title": "....",
  "summary": "....",
  "triage": ["step1", "step2", ...],
  "rootCause": "....",
  "steps": [
    {"step": 1, "description": "...", "command": "...", "lang": "bash"},
    ...
  ],
  "verification": ["check1", "check2", ...],
  "prevention": ["tip1", "tip2", ...],
  "commonMistakes": ["mistake1", "mistake2", ...],
  "keywords": ["keyword1", "keyword2", ...]
}
\`\`\`

**Rules:**
- Be specific to ${ctx.provider} and ${ctx.service}
- Commands must be ${ctx.provider}-compatible
- Assume reader is intermediate SRE (not beginner)
- Optimize for copy-paste (no placeholders like <YOUR_VALUE>)
- Include actual examples from ${ctx.year} best practices
- Runbook should take 5-30 minutes to execute
- Return ONLY the JSON, no additional text`
}

/**
 * TOOL REVIEW GENERATION PROMPT
 */
export function promptToolReview(ctx: {
  toolName: string
  category: string // e.g., "Monitoring", "CI/CD", "Security"
  competitors?: string[] // e.g., ["Prometheus", "Grafana"]
  year: string
}): string {
  return `You are a senior technical writer and tool expert.
Generate a comprehensive tool review for ${ctx.toolName}.

**Context:**
- Tool: ${ctx.toolName}
- Category: ${ctx.category}
- Year: ${ctx.year}
${ctx.competitors ? `- Main competitors: ${ctx.competitors.join(", ")}` : ""}

**Task:** Generate a JSON-structured review covering:
1. What is ${ctx.toolName}? (2-3 sentences)
2. Key features (top 8)
3. Pricing model (free, freemium, enterprise)
4. Pros (5-8, with examples)
5. Cons (3-5, fair & balanced)
6. When to use it (ideal use cases)
7. When NOT to use it (limitations)
8. Integration ecosystem (most important integrations)
9. Learning curve (estimate hours to get productive)
10. Alternatives & comparison (${ctx.competitors?.length || 3} tools)
11. Real-world example (brief case: "We use it for...")

**Output format (valid JSON):**
\`\`\`json
{
  "toolName": "${ctx.toolName}",
  "category": "${ctx.category}",
  "tagline": "One-line description",
  "whatIs": "2-3 sentence explanation",
  "keyFeatures": ["feature1", "feature2", ...],
  "pricingModel": "free|freemium|paid|enterprise",
  "pros": [{"title": "...", "description": "...", "example": "..."}],
  "cons": [{"title": "...", "description": "..."}],
  "useCases": ["case1", "case2", ...],
  "notFor": ["limitation1", "limitation2", ...],
  "integrations": ["integration1", "integration2", ...],
  "learningCurve": {"hours": 8, "difficulty": "moderate"},
  "alternatives": [
    {"tool": "X", "advantage": "...", "disadvantage": "..."},
    ...
  ],
  "realWorldExample": "We use it for .... because ...."
}
\`\`\`

**Rules:**
- Be honest & balanced (not a sales pitch)
- Use ${ctx.year} data & trends
- Include real-world context, not marketing speak
- Compare fairly to competitors
- Return ONLY the JSON`
}

/**
 * SECURITY GUIDE GENERATION PROMPT
 */
export function promptSecurityGuide(ctx: {
  topic: string
  technology: string
  severity: "P1-Critical" | "P2-High" | "P3-Medium"
  year: string
}): string {
  return `You are a cybersecurity expert and AWS Solutions Architect.
Generate a security hardening guide for ${ctx.technology}: ${ctx.topic}

**Context:**
- Topic: ${ctx.topic}
- Technology: ${ctx.technology}
- Severity: ${ctx.severity}
- Year: ${ctx.year} (latest standards & CVEs)

**Task:** Generate a JSON guide with:
1. Executive Summary (why this matters)
2. Risk assessment (what goes wrong if you ignore this)
3. Compliance implications (GDPR/SOC2/PCI-DSS/ISO27001)
4. Current CVEs (if applicable)
5. Step-by-step hardening (5-10 copy-paste commands/configs)
6. Verification checklist (how to prove it's secure)
7. Monitoring & alerting (what to watch for)
8. Common mistakes (what security pros get wrong)
9. Industry best practices (CIS Benchmarks, NIST, etc.)
10. Rollback plan (how to undo if something breaks)

**Output format (valid JSON):**
\`\`\`json
{
  "topic": "${ctx.topic}",
  "technology": "${ctx.technology}",
  "severity": "${ctx.severity}",
  "executiveSummary": "...",
  "riskAssessment": "...",
  "compliance": {
    "gdpr": "...",
    "soc2": "...",
    "pci_dss": "...",
    "iso27001": "..."
  },
  "relevantCVEs": ["CVE-XXXX-XXXXX", ...],
  "hardeningSteps": [
    {"step": 1, "description": "...", "command": "...", "lang": "bash"}
  ],
  "verification": ["check1", "check2", ...],
  "monitoring": ["metric1", "metric2", ...],
  "commonMistakes": ["mistake1", "mistake2", ...],
  "bestPractices": ["NIST ...", "CIS ...", ...],
  "rollbackPlan": "..."
}
\`\`\`

**Rules:**
- Be practical, not theoretical
- Include real CVE references & dates
- Optimize for operational security teams
- Focus on ${ctx.year} threats & mitigations
- Return ONLY the JSON`
}

/**
 * FAQ GENERATION PROMPT
 */
export function promptFAQ(ctx: {
  topic: string
  answerLength?: "short" | "medium" | "long" // default: medium
}): string {
  const length = ctx.answerLength || "medium"
  const lengthGuide = {
    short: "1-2 sentences",
    medium: "3-4 sentences",
    long: "full paragraph (150+ words)"
  }

  return `You are a technical writer specializing in Q&A content.
Generate 8-12 FAQ items for: ${ctx.topic}

**Task:** Create FAQs that answer real questions operators ask.

**Output format (valid JSON):**
\`\`\`json
{
  "topic": "${ctx.topic}",
  "faqItems": [
    {
      "question": "What is ...?",
      "answer": "Full ${length} answer",
      "difficulty": "beginner|intermediate|advanced"
    },
    ...
  ]
}
\`\`\`

**Rules:**
- Questions should be realistic & specific
- Answers should be ${lengthGuide[length]}
- Cover beginner → advanced levels
- Include "gotchas" & common mistakes
- Return ONLY the JSON`
}

/**
 * CONTENT VALIDATION SCHEMA
 * Use this to validate AI-generated content matches expected structure
 */
export const validationRules = {
  runbook: {
    minTitleLength: 10,
    maxTitleLength: 80,
    minSummaryLength: 20,
    maxSummaryLength: 160,
    minSteps: 3,
    maxSteps: 15,
    minKeywords: 3,
    maxKeywords: 10,
  },
  "tool-review": {
    minFeatures: 5,
    maxFeatures: 12,
    minPros: 3,
    maxPros: 8,
    minCons: 1,
    maxCons: 5,
  },
  "security-guide": {
    minSteps: 4,
    maxSteps: 12,
    minVerification: 3,
    maxVerification: 10,
    requireCVEs: true,
  },
}
