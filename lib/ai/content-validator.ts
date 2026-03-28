/**
 * PHASE 2b: AI Content Validator
 * 
 * Validates AI-generated content from the batch API against quality standards.
 * Scores: E-E-A-T (Expertise, Authoritativeness, Trustworthiness) + Abo-Relevance
 * 
 * Returns quality report + confidence score for human review queue targeting.
 */

import { BatchContentResult } from "./batch-prompts"

// ============================================================================
// TYPES
// ============================================================================

export type ContentValidationTier = "gold" | "silver" | "bronze" | "review-required"

export interface EEATScore {
  expertise: number // 0-100: Does it show deep technical knowledge?
  authoritativeness: number // 0-100: Does it cite sources, have dates?
  trustworthiness: number // 0-100: Does it appear neutral, balanced, well-sourced?
  overall: number // 0-100: Weighted average
}

export interface AboRelevanceScore {
  hasCTASignals: boolean // Mentions upgrade, premium, subscription?
  proposesTimelineForLimit: boolean // "requires subscription for more than 10 deployments"?
  emphasizesEffort: boolean // Emphasizes effort to save time (premium value prop)?
  hasEnterpriseContext: boolean // Multi-team, multi-stage deployment?
  featureMaturity: number // 0-100: Suggests feature is in experimental/stable/enterprise phase?
  overall: number // 0-100: Overall abo-relevance
}

export interface ContentValidationReport {
  contentId: string
  contentType: string
  title: string
  
  // Quality metrics
  hasRequiredStructure: boolean
  hasMinimumLength: boolean
  hasUniqueness: boolean // Simple check: length > 200 chars, not placeholder text
  
  // E-E-A-T scoring
  eeat: EEATScore
  
  // Abo-relevance scoring
  aboRelevance: AboRelevanceScore
  
  // Overall quality
  confidenceScore: number // 0-100: How confident are we in this content?
  tier: ContentValidationTier // gold | silver | bronze | review-required
  
  // Flags
  reviewRequired: boolean
  reviewReason?: string
  
  // Detailed violations
  violations: Array<{
    category: "structure" | "eeat" | "abo-relevance" | "content"
    severity: "error" | "warning" | "info"
    message: string
  }>
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const RUNBOOK_STRUCTURE = ["title", "summary", "steps", "verification", "keywords"]
const SECURITY_GUIDE_STRUCTURE = ["topic", "technology", "hardeningSteps", "compliance", "relevantCVEs"]
const TOOL_REVIEW_STRUCTURE = ["toolName", "keyFeatures", "pricingModel", "pros", "cons"]
const FAQ_STRUCTURE = ["topic", "faqItems"]

export const REQUIRED_STRUCTURE: Record<string, string[]> = {
  runbook: RUNBOOK_STRUCTURE,
  "security-guide": SECURITY_GUIDE_STRUCTURE,
  "tool-review": TOOL_REVIEW_STRUCTURE,
  faq: FAQ_STRUCTURE,
}

// E-E-A-T signal keywords
const EXPERTISE_SIGNALS = [
  "cve", "exploit", "vulnerability", "zero-trust", "hardening", "rbac",
  "authentication", "authorization", "encryption", "tls", "certificate",
  "jwt", "oauth", "2fa", "mfa", "pentest", "security", "compliance",
  "owasp", "cis", "nist", "sbom", "audit", "firewall", "waf", "ids", "ips",
  "intrusion detection", "incident response", "forensics",
]

const AUTHORITATIVENESS_SIGNALS = [
  "according to", "based on", "research shows", "study found", "nist", "owasp",
  "cis benchmark", "security.org", "github", "official documentation",
  "rfc", "standard", "best practice", "industry-standard", "enterprise-grade",
]

const TRUSTWORTHINESS_SIGNALS = [
  "disclaimer", "limitation", "caveat", "important", "note:", "warning",
  "deprecated", "outdated", "caution", "consider", "may", "could",
  "tested on", "verified", "confirmed", "reproducible",
]

const ABO_CTA_SIGNALS = [
  "upgrade", "premium", "subscription", "pro plan", "enterprise",
  "advanced features", "unlimited", "more", "additional",
  "team", "collaboration", "multi-user", "multi-tenant",
  "dashboard", "reporting", "analytics", "audit log", "sso", "saml",
]

const ABO_EFFORT_SIGNALS = [
  "manual", "tedious", "error-prone", "time-consuming", "repetitive",
  "automation", "automate", "streamline", "reduce", "simplify",
  "time saved", "effort saved", "scalable", "efficient",
]

// ============================================================================
// E-E-A-T SCORING
// ============================================================================

/**
 * Score expertise: Technical depth, specificity, use of recognized terminology
 */
function scoreExpertise(content: string): number {
  let score = 50 // baseline
  const lowerContent = content.toLowerCase()

  // Count expertise signals
  const signalCount = EXPERTISE_SIGNALS.filter((sig) => lowerContent.includes(sig)).length
  score += Math.min(signalCount * 3, 30) // +3 per signal, max +30

  // Bonus for code blocks or technical syntax
  if (content.includes("```") || content.includes("command") || /\$\s*[a-z]+/.test(content)) {
    score += 10
  }

  // Bonus for specific versions/dates
  if (/\b(202[0-9]|v\d+\.\d+)/g.test(content)) {
    score += 5
  }

  // Penalty for vague language
  if (
    content.toLowerCase().includes("might") &&
    content.toLowerCase().includes("maybe") &&
    content.toLowerCase().includes("could be")
  ) {
    score -= 15
  }

  return Math.min(100, Math.max(0, score))
}

/**
 * Score authoritativeness: Citations, sources, official references, dates
 */
function scoreAuthoritativeness(content: string, title: string): number {
  let score = 40 // baseline (hard to achieve without sources)
  const fullText = `${title} ${content}`.toLowerCase()

  // Count authority signals
  const authorityCount = AUTHORITATIVENESS_SIGNALS.filter((sig) => fullText.includes(sig)).length
  score += Math.min(authorityCount * 5, 35) // +5 per signal, max +35

  // Bonus for current/recent year
  if (/202[4-9]|203[0-9]/.test(content)) {
    score += 10
  }

  // Bonus for RFC/standard references
  if (/rfc\s*\d+|iso\s*\d+|cve-\d{4}-\d+/gi.test(content)) {
    score += 10
  }

  // Penalty for outdated content (pre-2022)
  if (/201[0-9]|2020|2021(?!.*202[2-9])/.test(content) && !content.toLowerCase().includes("deprecated")) {
    score -= 10
  }

  return Math.min(100, Math.max(0, score))
}

/**
 * Score trustworthiness: Balanced perspective, disclaimers, admits limitations
 */
function scoreTrustworthiness(content: string): number {
  let score = 60 // baseline (neutral is good)
  const lowerContent = content.toLowerCase()

  // Count trustworthiness signals (disclaimers, caveats, admissions)
  const trustSignalCount = TRUSTWORTHINESS_SIGNALS.filter((sig) => lowerContent.includes(sig)).length
  score += Math.min(trustSignalCount * 4, 25) // +4 per signal, max +25

  // Bonus for balanced language
  const negativeWords = ["bad", "terrible", "useless", "always", "never"]
  const absoluteCount = negativeWords.filter((word) => lowerContent.includes(word)).length
  score -= absoluteCount * 3

  // Bonus for neutral tone
  if (!lowerContent.includes("!!!") && !lowerContent.includes("???") && !lowerContent.includes("$$$")) {
    score += 5
  }

  return Math.min(100, Math.max(0, score))
}

/**
 * Calculate E-E-A-T score
 */
function calculateEEATScore(content: string, title: string): EEATScore {
  const expertise = scoreExpertise(content)
  const authoritativeness = scoreAuthoritativeness(content, title)
  const trustworthiness = scoreTrustworthiness(content)

  // Weighted average: Authoritativeness weighted higher for technical content
  const overall = Math.round(expertise * 0.3 + authoritativeness * 0.4 + trustworthiness * 0.3)

  return {
    expertise,
    authoritativeness,
    trustworthiness,
    overall,
  }
}

// ============================================================================
// ABO-RELEVANCE SCORING
// ============================================================================

/**
 * Score abo-relevance: Does content support subscription conversion?
 */
function calculateAboRelevanceScore(content: string, contentType: string): AboRelevanceScore {
  const lowerContent = content.toLowerCase()

  // CTA signals: Direct mentions of upgrade, premium, subscription
  const ctaSignals = ABO_CTA_SIGNALS.filter((sig) => lowerContent.includes(sig))
  const hasCTASignals = ctaSignals.length >= 1

  // Timeline signals: "requires subscription for X", "unlimited with pro"
  const timelineMatch = /(?:requires|need|with|on)\s+(?:a\s+)?(?:premium|pro|enterprise|subscription|upgrade|plan)/.test(lowerContent)
  const proposesTimelineForLimit = timelineMatch

  // Effort signals: Emphasizes complexity/effort that premium solves
  const effortSignals = ABO_EFFORT_SIGNALS.filter((sig) => lowerContent.includes(sig))
  const emphasizesEffort = effortSignals.length >= 2

  // Enterprise context: Multi-team, multi-stage, large-scale
  const enterpriseSignals = [
    "team", "teams", "collaboration", "multi-user", "multi-tenant",
    "enterprise", "saml", "sso", "audit log", "dashboard",
  ]
  const enterpriseCount = enterpriseSignals.filter((sig) => lowerContent.includes(sig)).length
  const hasEnterpriseContext = enterpriseCount >= 2

  // Feature maturity: Experimental vs Stable vs Enterprise
  let featureMaturity = 50 // neutral
  if (lowerContent.includes("experimental") || lowerContent.includes("beta")) featureMaturity = 30
  if (lowerContent.includes("stable") || lowerContent.includes("production-ready")) featureMaturity = 70
  if (lowerContent.includes("enterprise")) featureMaturity = 90

  // Calculate overall abo-relevance score
  let overall = 20 // baseline (most content isn't abo-relevant)
  if (hasCTASignals) overall += 20
  if (proposesTimelineForLimit) overall += 25
  if (emphasizesEffort) overall += 15
  if (hasEnterpriseContext) overall += 15
  overall += Math.round(featureMaturity / 10) // Add 0-9 points

  return {
    hasCTASignals,
    proposesTimelineForLimit,
    emphasizesEffort,
    hasEnterpriseContext,
    featureMaturity,
    overall: Math.min(100, overall),
  }
}

// ============================================================================
// CONTENT STRUCTURE VALIDATION
// ============================================================================

/**
 * Check if content has required structure for content type
 */
function validateContentStructure(content: any, contentType: string): { valid: boolean; missing: string[] } {
  const required = REQUIRED_STRUCTURE[contentType] || []
  const missing: string[] = []

  for (const field of required) {
    if (!content || !content[field]) {
      missing.push(field)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

// ============================================================================
// MAIN VALIDATOR
// ============================================================================

/**
 * Validate AI-generated content with full E-E-A-T + Abo-Relevance scoring
 */
export function validateAIContent(
  result: BatchContentResult,
  contentType: string
): ContentValidationReport {
  const violations: ContentValidationReport["violations"] = []
  let confidenceScore = 100

  // Parse content (may be JSON string)
  let contentObj: any
  try {
    contentObj = typeof result.content === "string" ? JSON.parse(result.content) : result.content
  } catch {
    violations.push({
      category: "structure",
      severity: "error",
      message: "Content is not valid JSON",
    })
    contentObj = {}
    confidenceScore -= 50
  }

  const contentString = JSON.stringify(contentObj)
  const title = result.title || ""

  // 1. Structure validation
  const { valid: structureValid, missing } = validateContentStructure(contentObj, contentType)
  if (!structureValid) {
    violations.push({
      category: "structure",
      severity: "error",
      message: `Missing required fields: ${missing.join(", ")}`,
    })
    confidenceScore -= 30
  }

  // 2. Length validation
  const contentLength = contentString.length
  const hasMinLength = contentLength > 200
  if (!hasMinLength) {
    violations.push({
      category: "content",
      severity: "error",
      message: `Content too short (${contentLength} chars < 200)`,
    })
    confidenceScore -= 20
  }

  // 3. Uniqueness check (no placeholder/stub content)
  const isPlaceholder =
    contentString.includes("Lorem ipsum") ||
    contentString.includes("[TODO]") ||
    contentString.includes("FIXME") ||
    contentString === "{}"
  if (isPlaceholder) {
    violations.push({
      category: "content",
      severity: "error",
      message: "Content appears to be placeholder/stub",
    })
    confidenceScore -= 40
  }

  // 4. E-E-A-T Scoring
  const eeat = calculateEEATScore(contentString, title)
  if (eeat.overall < 50) {
    violations.push({
      category: "eeat",
      severity: "warning",
      message: `Low E-E-A-T score (${eeat.overall}/100) – consider human review`,
    })
    confidenceScore -= 15
  } else if (eeat.overall < 70) {
    violations.push({
      category: "eeat",
      severity: "info",
      message: `Moderate E-E-A-T score (${eeat.overall}/100) – acceptable`,
    })
    confidenceScore -= 5
  }

  // 5. Abo-Relevance Scoring
  const aboRelevance = calculateAboRelevanceScore(contentString, contentType)
  if (contentType === "runbook" && aboRelevance.overall < 30) {
    violations.push({
      category: "abo-relevance",
      severity: "info",
      message: `Low abo-relevance (${aboRelevance.overall}/100) – consider adding subscription context`,
    })
    // Don't penalize heavily; not all runbooks need to be abo-focused
  }

  // 6. Determine tier and review requirement
  const tier: ContentValidationTier =
    confidenceScore >= 90
      ? "gold"
      : confidenceScore >= 70
        ? "silver"
        : confidenceScore >= 50
          ? "bronze"
          : "review-required"

  const reviewRequired =
    tier === "review-required" ||
    violations.some((v) => v.severity === "error") ||
    (contentType === "runbook" && eeat.overall < 55)

  const reviewReason = violations
    .filter((v) => v.severity === "error")
    .map((v) => v.message)
    .join("; ")

  return {
    contentId: `${contentType}_${Date.now()}`,
    contentType,
    title,
    hasRequiredStructure: structureValid,
    hasMinimumLength: hasMinLength,
    hasUniqueness: !isPlaceholder,
    eeat,
    aboRelevance,
    confidenceScore: Math.max(0, Math.min(100, confidenceScore)),
    tier,
    reviewRequired,
    reviewReason: reviewReason || undefined,
    violations,
  }
}

/**
 * Batch-validate multiple content results
 */
export function validateAIContentBatch(
  results: BatchContentResult[],
  contentType: string
): {
  reports: ContentValidationReport[]
  summary: {
    total: number
    gold: number
    silver: number
    bronze: number
    reviewRequired: number
    avgConfidence: number
    topViolations: Array<{ message: string; count: number }>
  }
} {
  const reports = results.map((result) => validateAIContent(result, contentType))

  const gold = reports.filter((r) => r.tier === "gold").length
  const silver = reports.filter((r) => r.tier === "silver").length
  const bronze = reports.filter((r) => r.tier === "bronze").length
  const reviewRequired = reports.filter((r) => r.tier === "review-required").length
  const avgConfidence = Math.round(reports.reduce((sum, r) => sum + r.confidenceScore, 0) / reports.length)

  // Top violations
  const violationCounts = new Map<string, number>()
  for (const report of reports) {
    for (const violation of report.violations) {
      const key = violation.message
      violationCounts.set(key, (violationCounts.get(key) ?? 0) + 1)
    }
  }
  const topViolations = Array.from(violationCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([message, count]) => ({ message, count }))

  return {
    reports,
    summary: {
      total: reports.length,
      gold,
      silver,
      bronze,
      reviewRequired,
      avgConfidence,
      topViolations,
    },
  }
}
