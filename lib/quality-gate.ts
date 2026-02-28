// File: lib/quality-gate.ts
// ClawGuru 2026 Quality Gate – Kein Thin Content, kein Duplicate, kein Schrott.
// Every runbook must pass this gate before it is served or indexed.

import type { Runbook } from "./pseo"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QualityViolation {
  field: string
  message: string
  severity: "error" | "warning"
}

export interface QualityReport {
  slug: string
  pass: boolean
  score: number // 0–100
  violations: QualityViolation[]
}

export interface QualityThresholds {
  minSummaryLength: number
  minStepCount: number
  minBlockCount: number
  minFaqCount: number
  minTagCount: number
  minTitleLength: number
  maxTitleLength: number
  /** Minimum overall score (0–100) required to pass */
  minPassScore: number
}

// ---------------------------------------------------------------------------
// Default thresholds (ClawGuru 2026 Standard)
// ---------------------------------------------------------------------------

export const DEFAULT_THRESHOLDS: QualityThresholds = {
  minSummaryLength: 60,
  minStepCount: 3,
  minBlockCount: 4,
  minFaqCount: 2,
  minTagCount: 2,
  minTitleLength: 8,
  maxTitleLength: 110,
  minPassScore: 60,
}

// ---------------------------------------------------------------------------
// Core validator
// ---------------------------------------------------------------------------

/**
 * Validate a single runbook against quality thresholds.
 * Returns a structured QualityReport. A runbook passes if:
 *  - No "error" severity violations exist, AND
 *  - Computed score >= thresholds.minPassScore
 */
export function validateRunbook(
  runbook: Runbook,
  thresholds: QualityThresholds = DEFAULT_THRESHOLDS
): QualityReport {
  const violations: QualityViolation[] = []
  let score = 100

  // 1. Title length
  if (runbook.title.length < thresholds.minTitleLength) {
    violations.push({ field: "title", severity: "error", message: `Title too short (${runbook.title.length} < ${thresholds.minTitleLength} chars)` })
    score -= 25
  } else if (runbook.title.length > thresholds.maxTitleLength) {
    violations.push({ field: "title", severity: "warning", message: `Title too long (${runbook.title.length} > ${thresholds.maxTitleLength} chars)` })
    score -= 5
  }

  // 2. Summary / meta-description quality
  if (!runbook.summary || runbook.summary.trim().length < thresholds.minSummaryLength) {
    violations.push({ field: "summary", severity: "error", message: `Summary too short (${runbook.summary?.trim().length ?? 0} < ${thresholds.minSummaryLength} chars)` })
    score -= 20
  }

  // 3. HowTo steps
  const stepCount = runbook.howto?.steps?.length ?? 0
  if (stepCount < thresholds.minStepCount) {
    violations.push({ field: "howto.steps", severity: "error", message: `Too few steps (${stepCount} < ${thresholds.minStepCount})` })
    score -= 20
  }

  // 4. Rich content blocks
  const blockCount = runbook.blocks?.length ?? 0
  if (blockCount < thresholds.minBlockCount) {
    violations.push({ field: "blocks", severity: "warning", message: `Low block count (${blockCount} < ${thresholds.minBlockCount})` })
    score -= 10
  }

  // 5. FAQ entries
  const faqCount = runbook.faq?.length ?? 0
  if (faqCount < thresholds.minFaqCount) {
    violations.push({ field: "faq", severity: "warning", message: `Too few FAQ entries (${faqCount} < ${thresholds.minFaqCount})` })
    score -= 10
  }

  // 6. Tags
  const tagCount = runbook.tags?.length ?? 0
  if (tagCount < thresholds.minTagCount) {
    violations.push({ field: "tags", severity: "warning", message: `Too few tags (${tagCount} < ${thresholds.minTagCount})` })
    score -= 5
  }

  // 7. Slug format sanity check (no double hyphens, no leading/trailing hyphens, non-empty)
  if (!runbook.slug || /--/.test(runbook.slug) || /^-|-$/.test(runbook.slug)) {
    violations.push({ field: "slug", severity: "error", message: `Invalid slug format: "${runbook.slug}"` })
    score -= 30
  }

  // 8. Duplicate-content signal: title == summary (copy-paste error)
  if (runbook.title && runbook.summary && runbook.title.trim() === runbook.summary.trim()) {
    violations.push({ field: "summary", severity: "error", message: "Title and summary are identical (duplicate content)" })
    score -= 20
  }

  // 9. Author present
  if (!runbook.author?.name) {
    violations.push({ field: "author", severity: "warning", message: "Missing author name (E-E-A-T signal)" })
    score -= 5
  }

  // 10. lastmod present and plausible (YYYY-MM-DD)
  if (!runbook.lastmod || !/^\d{4}-\d{2}-\d{2}$/.test(runbook.lastmod)) {
    violations.push({ field: "lastmod", severity: "warning", message: `Missing or invalid lastmod: "${runbook.lastmod}"` })
    score -= 5
  }

  const finalScore = Math.max(0, score)
  const hasErrors = violations.some((v) => v.severity === "error")

  return {
    slug: runbook.slug,
    pass: !hasErrors && finalScore >= thresholds.minPassScore,
    score: finalScore,
    violations,
  }
}

// ---------------------------------------------------------------------------
// Batch helpers
// ---------------------------------------------------------------------------

/** Return only runbooks that pass the quality gate. */
export function filterQualityRunbooks(
  runbooks: Runbook[],
  thresholds: QualityThresholds = DEFAULT_THRESHOLDS
): Runbook[] {
  return runbooks.filter((r) => validateRunbook(r, thresholds).pass)
}

export interface QualityStats {
  total: number
  passed: number
  failed: number
  avgScore: number
  passRate: number
  topViolations: Array<{ field: string; count: number }>
}

/** Compute aggregate quality statistics for a batch of runbooks. */
export function computeQualityStats(
  runbooks: Runbook[],
  thresholds: QualityThresholds = DEFAULT_THRESHOLDS
): QualityStats {
  if (runbooks.length === 0) {
    return { total: 0, passed: 0, failed: 0, avgScore: 0, passRate: 0, topViolations: [] }
  }

  const reports = runbooks.map((r) => validateRunbook(r, thresholds))
  const passed = reports.filter((r) => r.pass).length
  const totalScore = reports.reduce((sum, r) => sum + r.score, 0)

  // Aggregate violation field frequency
  const fieldCount = new Map<string, number>()
  for (const report of reports) {
    for (const v of report.violations) {
      fieldCount.set(v.field, (fieldCount.get(v.field) ?? 0) + 1)
    }
  }
  const topViolations = Array.from(fieldCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([field, count]) => ({ field, count }))

  return {
    total: runbooks.length,
    passed,
    failed: runbooks.length - passed,
    avgScore: Math.round(totalScore / runbooks.length),
    passRate: Math.round((passed / runbooks.length) * 100),
    topViolations,
  }
}

// ---------------------------------------------------------------------------
// Content-aware ISR revalidation helper
// ---------------------------------------------------------------------------

/**
 * Return the ISR revalidation interval (in seconds) for a given runbook.
 * High-quality incident/error pages are revalidated more frequently.
 * Low-priority static config pages can wait longer.
 */
export function revalidateSeconds(runbook: Runbook): number {
  const report = validateRunbook(runbook)

  // Fail early: low quality → long TTL (don't waste revalidation budget)
  if (!report.pass || report.score < 70) return 60 * 60 * 48 // 48 h

  const tags = runbook.tags ?? []
  const isIncident = tags.includes("incident")
  const isError = tags.some((t) => t.startsWith("error:"))
  const isConfig = tags.includes("config")
  const isHighScore = (runbook.clawScore ?? 0) >= 85

  if (isIncident || isError) return isHighScore ? 60 * 60 * 4 : 60 * 60 * 12 // 4 h or 12 h
  if (isConfig) return 60 * 60 * 24 * 7 // 7 days
  return 60 * 60 * 24 // 24 h default
}
