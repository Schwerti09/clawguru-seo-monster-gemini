import {
  buildWeeklyDigest,
  createProofOfFix,
  prioritizeFindings,
  type RiskFinding,
} from "@/lib/autopilot-delivery"

describe("autopilot delivery layer", () => {
  const findings: RiskFinding[] = [
    {
      id: "f-1",
      title: "Open admin panel",
      severity: "high",
      internetExposed: true,
      knownExploit: true,
      patchAvailable: true,
    },
    {
      id: "f-2",
      title: "Missing CSP",
      severity: "medium",
      internetExposed: true,
      knownExploit: false,
      patchAvailable: true,
    },
    {
      id: "f-3",
      title: "Critical RCE",
      severity: "critical",
      internetExposed: false,
      knownExploit: true,
      patchAvailable: false,
    },
  ]

  it("prioritizes findings by risk score", () => {
    const prioritized = prioritizeFindings(findings)
    expect(prioritized[0].id).toBe("f-3")
    expect(prioritized[1].id).toBe("f-1")
    expect(prioritized[0].priorityScore).toBeGreaterThan(prioritized[1].priorityScore)
  })

  it("builds a weekly digest with severity distribution and top focus", () => {
    const digest = buildWeeklyDigest(findings)
    expect(digest.totalFindings).toBe(3)
    expect(digest.bySeverity.critical).toBe(1)
    expect(digest.bySeverity.high).toBe(1)
    expect(digest.topFocusIds).toEqual(["f-3", "f-1", "f-2"])
  })

  it("creates proof-of-fix payload", () => {
    const proof = createProofOfFix({
      beforeScore: 52,
      afterScore: 81,
      remainingHighRiskIds: ["f-2"],
    })
    expect(proof.improved).toBe(true)
    expect(proof.scoreDelta).toBe(29)
    expect(proof.residualRiskCount).toBe(1)
    expect(proof.residualRiskIds).toEqual(["f-2"])
  })
})
