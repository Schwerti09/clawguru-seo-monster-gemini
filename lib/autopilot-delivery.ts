export type FindingSeverity = "critical" | "high" | "medium" | "low"

export type RiskFinding = {
  id: string
  title: string
  severity: FindingSeverity
  internetExposed: boolean
  knownExploit: boolean
  patchAvailable: boolean
}

export type PrioritizedFinding = RiskFinding & {
  priorityScore: number
}

const SEVERITY_BASE: Record<FindingSeverity, number> = {
  critical: 100,
  high: 70,
  medium: 40,
  low: 15,
}

export function prioritizeFindings(findings: RiskFinding[]): PrioritizedFinding[] {
  return findings
    .map((finding) => ({
      ...finding,
      priorityScore:
        SEVERITY_BASE[finding.severity] +
        (finding.knownExploit ? 30 : 0) +
        (finding.internetExposed ? 20 : 0) +
        (finding.patchAvailable ? 5 : 0),
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
}

export type WeeklyDigest = {
  totalFindings: number
  bySeverity: Record<FindingSeverity, number>
  topFocusIds: string[]
  unresolvedCritical: number
}

export function buildWeeklyDigest(findings: RiskFinding[]): WeeklyDigest {
  const bySeverity: Record<FindingSeverity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }

  for (const finding of findings) {
    bySeverity[finding.severity] += 1
  }

  const prioritized = prioritizeFindings(findings)

  return {
    totalFindings: findings.length,
    bySeverity,
    topFocusIds: prioritized.slice(0, 3).map((f) => f.id),
    unresolvedCritical: bySeverity.critical,
  }
}

export type ProofOfFixInput = {
  beforeScore: number
  afterScore: number
  remainingHighRiskIds: string[]
}

export type ProofOfFix = {
  improved: boolean
  scoreDelta: number
  residualRiskCount: number
  residualRiskIds: string[]
}

export function createProofOfFix(input: ProofOfFixInput): ProofOfFix {
  const scoreDelta = input.afterScore - input.beforeScore

  return {
    improved: scoreDelta > 0,
    scoreDelta,
    residualRiskCount: input.remainingHighRiskIds.length,
    residualRiskIds: input.remainingHighRiskIds,
  }
}
