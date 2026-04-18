/**
 * AI Recommendation Engine for Roast Next Steps
 * Suggests what to roast next based on current stack and history
 */

export interface Recommendation {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  category: "security" | "compliance" | "performance" | "learning"
  estimatedImpact: number // Score points
  timeRequired: string
  icon: string
}

// Recommendation database
const recommendations: Recommendation[] = [
  {
    id: "secrets-rotation",
    title: "Secrets Rotation",
    description: "Rotate all API keys and credentials exposed in logs",
    priority: "high",
    category: "security",
    estimatedImpact: 15,
    timeRequired: "30 min",
    icon: "🔐",
  },
  {
    id: "egress-control",
    title: "Egress Control",
    description: "Implement allowlist for outbound connections",
    priority: "high",
    category: "security",
    estimatedImpact: 12,
    timeRequired: "45 min",
    icon: "🚪",
  },
  {
    id: "mtls-enable",
    title: "Enable mTLS",
    description: "Add mutual TLS for service-to-service communication",
    priority: "medium",
    category: "security",
    estimatedImpact: 8,
    timeRequired: "1 hour",
    icon: "🔒",
  },
  {
    id: "rbac-minimal",
    title: "RBAC Minimal",
    description: "Reduce permissions to least privilege principle",
    priority: "high",
    category: "security",
    estimatedImpact: 10,
    timeRequired: "40 min",
    icon: "🛡️",
  },
  {
    id: "audit-logging",
    title: "Audit Logging",
    description: "Enable comprehensive audit trails for all actions",
    priority: "medium",
    category: "compliance",
    estimatedImpact: 6,
    timeRequired: "1 hour",
    icon: "📋",
  },
  {
    id: "rate-limiting",
    title: "Rate Limiting",
    description: "Add rate limiting to all API endpoints",
    priority: "medium",
    category: "performance",
    estimatedImpact: 5,
    timeRequired: "30 min",
    icon: "⚡",
  },
  {
    id: "container-scan",
    title: "Container Scan",
    description: "Scan all containers for vulnerabilities",
    priority: "medium",
    category: "security",
    estimatedImpact: 7,
    timeRequired: "20 min",
    icon: "🐳",
  },
  {
    id: "cve-track",
    title: "CVE Tracking",
    description: "Set up automated CVE monitoring for dependencies",
    priority: "low",
    category: "learning",
    estimatedImpact: 4,
    timeRequired: "15 min",
    icon: "📊",
  },
]

export function getRecommendations(currentScore: number, recentFindings: string[] = []): Recommendation[] {
  // Filter based on score
  let relevant = recommendations
  
  if (currentScore < 50) {
    // Critical: only high priority
    relevant = recommendations.filter(r => r.priority === "high")
  } else if (currentScore < 70) {
    // Medium: high and medium priority
    relevant = recommendations.filter(r => r.priority !== "low")
  }

  // Sort by estimated impact (descending)
  return relevant.sort((a, b) => b.estimatedImpact - a.estimatedImpact)
}

export function getNextRoastRecommendation(previousRoasts: string[]): Recommendation | null {
  // Suggest something not roasted yet
  const roasted = new Set(previousRoasts)
  const notRoasted = recommendations.filter(r => !roasted.has(r.id))
  
  if (notRoasted.length === 0) {
    // All roasted, suggest a rematch of the lowest score
    return recommendations[0]
  }
  
  // Return highest priority not yet roasted
  return notRoasted.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })[0]
}

export function getQuickWins(currentScore: number): Recommendation[] {
  // Recommendations with high impact and low time
  return recommendations
    .filter(r => r.estimatedImpact >= 8 && r.timeRequired.includes("min"))
    .sort((a, b) => b.estimatedImpact - a.estimatedImpact)
    .slice(0, 3)
}

export function getLearningPath(currentScore: number): Recommendation[] {
  // Ordered path from current to 80+
  const targetScore = 80
  const needed = targetScore - currentScore
  
  let accumulated = 0
  const path: Recommendation[] = []
  
  for (const rec of recommendations.sort((a, b) => b.estimatedImpact - a.estimatedImpact)) {
    if (accumulated >= needed) break
    path.push(rec)
    accumulated += rec.estimatedImpact
  }
  
  return path
}

export function formatRecommendation(rec: Recommendation, locale = "de"): string {
  if (locale === "de") {
    return `${rec.icon} ${rec.title} (+${rec.estimatedImpact} Punkte, ${rec.timeRequired})`
  }
  return `${rec.icon} ${rec.title} (+${rec.estimatedImpact} points, ${rec.timeRequired})`
}
