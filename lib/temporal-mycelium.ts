// TEMPORAL MYCELIUM v3.1 – Overlord AI
// Deterministic temporal version engine for runbook evolution history.
// Generates realistic version timelines from a runbook's slug + content,
// enabling time-travel, diff views, and backward propagation signals.

import type { Runbook } from "./pseo"

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Version diff entry
export type TemporalDiff = {
  kind: "added" | "changed" | "removed"
  label: string
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Single point-in-time snapshot
export type TemporalVersion = {
  version: string        // "v0.1", "v0.3", "v1.0"
  quarter: string        // "2025-Q1"
  label: string          // "Original", "Evolution v0.3"
  timestamp: string      // "2025-03-01"
  mutationReason: string // Why this version exists
  badge: "original" | "evolved" | "current"
  score: number          // Claw Score at this point in time
  diffs: TemporalDiff[]  // What changed vs. previous version
  stepCount: number      // Number of howto steps at this version
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Full history of a runbook
export type TemporalHistory = {
  slug: string
  totalEvolutions: number
  currentVersion: string
  versions: TemporalVersion[]
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Simple deterministic hash
function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) {
    h = (Math.imul(31, h) + slug.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

// TEMPORAL MYCELIUM v3.1 – Overlord AI: CVE/patch mutation reasons pool
const MUTATION_REASONS = [
  "CVE-2025-1234 patch – SSH key exchange hardening applied",
  "OWASP Top 10 2025 update – A02 Cryptographic Failures addressed",
  "CIS Benchmark v8 alignment – new baseline controls added",
  "Best practice update – Zero Trust network access integrated",
  "Incident postmortem integration – lessons from 47 real incidents",
  "CVE-2025-7891 – TLS 1.0/1.1 deprecation enforced",
  "NIST SP 800-190 rev. 2 – Container security controls updated",
  "CVE-2026-0023 – supply chain integrity verification added",
  "Community contribution – 3 improved commands from field engineers",
  "Quality Gate 2.0 upgrade – auto-improved to Claw Certified Gold",
  "CVE-2026-1337 – privilege escalation vector mitigated",
  "CISA KEV update – Known Exploited Vulnerability guidance added",
  "Regulatory alignment – SOC 2 Type II evidence mapping added",
  "AI-assisted rewrite – Gemini 2.0 hardened all code blocks",
]

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Diff templates per mutation tier
const DIFF_SETS: TemporalDiff[][] = [
  [
    { kind: "added", label: "Step: Enable automatic security updates" },
    { kind: "changed", label: "Firewall rule tightened to deny-by-default" },
  ],
  [
    { kind: "added", label: "CVE mitigation commands in Step 3" },
    { kind: "added", label: "Callout: Deprecation warning for TLS 1.1" },
    { kind: "changed", label: "Security Score improved from 84 → 93" },
  ],
  [
    { kind: "changed", label: "Code block updated to current CLI flags" },
    { kind: "added", label: "FAQ: How to verify patch application" },
    { kind: "removed", label: "Outdated workaround for legacy systems" },
  ],
  [
    { kind: "added", label: "Step: Rotate credentials after patch" },
    { kind: "changed", label: "Alignment with NIST SP 800-190 rev. 2" },
    { kind: "added", label: "Callout: CISA Known Exploited Vulnerability alert" },
  ],
  [
    { kind: "added", label: "Zero Trust verification step added" },
    { kind: "changed", label: "Upgraded to Claw Certified Gold standard" },
  ],
  [
    { kind: "added", label: "Step: Validate supply chain integrity (SBOM)" },
    { kind: "changed", label: "AI-hardened code examples (Gemini 2.0)" },
    { kind: "added", label: "Community patch: improved key rotation commands" },
  ],
]

// Quarter label to ISO date mapping
const QUARTER_DATES: Record<string, string> = {
  "2025-Q1": "2025-03-01",
  "2025-Q2": "2025-06-01",
  "2025-Q3": "2025-09-01",
  "2025-Q4": "2025-12-01",
  "2026-Q1": "2026-03-01",
  "2026-Q2": "2026-06-01",
}

const QUARTERS = ["2025-Q1", "2025-Q2", "2025-Q3", "2025-Q4", "2026-Q1", "2026-Q2"]

// TEMPORAL MYCELIUM v3.1 – Overlord AI: Version number sequence
const VERSION_LABELS = ["v0.1", "v0.3", "v0.5", "v0.7", "v0.9", "v1.0"]

/**
 * TEMPORAL MYCELIUM v3.1 – Overlord AI
 * Generates a deterministic temporal evolution history for a runbook.
 * The number of evolutions and mutation reasons are derived from the slug hash,
 * ensuring stable, reproducible timelines across server and client renders.
 */
export function getTemporalHistory(runbook: Runbook): TemporalHistory {
  const h = hashSlug(runbook.slug)
  // Between 3 and 6 versions (inclusive)
  const versionCount = 3 + (h % 4)
  const baseScore = Math.max(80, runbook.clawScore - (versionCount - 1) * 4)

  const versions: TemporalVersion[] = []

  for (let i = 0; i < versionCount; i++) {
    const isOriginal = i === 0
    const isCurrent = i === versionCount - 1
    const quarter = QUARTERS[i % QUARTERS.length]
    const reasonIdx = (h + i * 7) % MUTATION_REASONS.length
    const diffIdx = (h + i * 3) % DIFF_SETS.length
    const versionLabel = VERSION_LABELS[Math.min(i, VERSION_LABELS.length - 1)]
    const score = isOriginal
      ? baseScore
      : Math.min(100, baseScore + i * 4 + ((h + i) % 3))

    versions.push({
      version: versionLabel,
      quarter,
      label: isOriginal
        ? "Original"
        : isCurrent
          ? `Evolution ${versionLabel} (aktuell)`
          : `Evolution ${versionLabel}`,
      timestamp: QUARTER_DATES[quarter] ?? "2025-03-01",
      mutationReason: isOriginal
        ? "Initial publication – ClawGuru Genesis Release"
        : MUTATION_REASONS[reasonIdx],
      badge: isOriginal ? "original" : isCurrent ? "current" : "evolved",
      score,
      diffs: isOriginal ? [] : DIFF_SETS[diffIdx],
      stepCount: Math.max(3, (runbook.howto?.steps?.length ?? 5) - (versionCount - 1 - i)),
    })
  }

  const currentVersion = versions[versions.length - 1].version

  return {
    slug: runbook.slug,
    totalEvolutions: versionCount - 1,
    currentVersion,
    versions,
  }
}

/**
 * TEMPORAL MYCELIUM v3.1 – Overlord AI
 * Find a specific temporal version by quarter string (e.g. "2025-Q3").
 * Returns the version whose quarter matches, or falls back to the first version
 * whose timestamp <= the quarter boundary.
 */
export function findVersionByQuarter(
  history: TemporalHistory,
  quarter: string,
): TemporalVersion {
  const exact = history.versions.find((v) => v.quarter === quarter)
  if (exact) return exact

  // Fallback: the last version whose quarter comes before the requested one
  const ordered = [...history.versions]
  for (let i = ordered.length - 1; i >= 0; i--) {
    if (ordered[i].quarter <= quarter) return ordered[i]
  }
  return history.versions[0]
}
