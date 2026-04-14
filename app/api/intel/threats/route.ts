// INTEL THREAT API v1.0 — Active Threat Campaigns & Predictive Correlation
// Sources: CISA KEV, Mandiant, Recorded Future (simulated)
// For: ClawGuru Neuro Predictive Threat Correlation

import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ── TYPES ───────────────────────────────────────────────────────────────────
type ThreatActor = {
  id: string
  name: string
  aliases: string[]
  origin: string
  motivation: "financial" | "espionage" | "destructive" | "hacktivism"
  sophistication: "low" | "medium" | "high" | "critical"
}

type ThreatCampaign = {
  id: string
  name: string
  actor: ThreatActor
  activeSince: string
  targets: string[] // e.g., ["kubernetes", "aws", "docker"]
  tactics: string[] // MITRE ATT&CK tactics
  affectedRegions: string[]
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  description: string
  indicators: string[] // IOCs
  cves: string[] // Related CVEs
  firstSeen: string
  lastSeen: string
}

type CorrelationResult = {
  campaign: ThreatCampaign
  matchingStackComponents: string[]
  riskScore: number // 0-100
  predictedImpact: "critical" | "high" | "medium" | "low"
  recommendedActions: string[]
}

// ── ACTIVE THREAT CAMPAIGNS (Simulated real-time intel) ──────────────────────
const ACTIVE_CAMPAIGNS: ThreatCampaign[] = [
  {
    id: "CAMP-2024-001",
    name: "Siloscape Resurgence",
    actor: {
      id: "TA-001",
      name: "TeamTNT",
      aliases: ["TeamTNT", "Hildegard"],
      origin: "Eastern Europe",
      motivation: "financial",
      sophistication: "high"
    },
    activeSince: "2024-01-15",
    targets: ["kubernetes", "k8s", "container", "docker"],
    tactics: ["Initial Access", "Execution", "Persistence", "Defense Evasion"],
    affectedRegions: ["US", "EU", "APAC"],
    severity: "CRITICAL",
    description: "TeamTNT is actively targeting Kubernetes clusters with exposed API servers. They deploy cryptocurrency miners and exfiltrate cloud credentials.",
    indicators: ["siloscape.exe", "/tmp/.xxxxx", "185.220.101.x"],
    cves: ["CVE-2024-10295", "CVE-2024-9486"],
    firstSeen: "2024-01-15",
    lastSeen: "2024-04-10"
  },
  {
    id: "CAMP-2024-002",
    name: "RedisWraith Operation",
    actor: {
      id: "TA-002",
      name: "Unknown ( financially motivated)",
      aliases: ["RedisWraith"],
      origin: "Unknown",
      motivation: "financial",
      sophistication: "medium"
    },
    activeSince: "2024-02-20",
    targets: ["redis", "database", "elasticsearch", "mongodb"],
    tactics: ["Initial Access", "Execution", "Impact"],
    affectedRegions: ["US", "APAC"],
    severity: "HIGH",
    description: "Campaign targeting exposed Redis and NoSQL databases. Encrypts data for ransom via the 'RedisWraith' malware.",
    indicators: ["red2.so", "backup.db", "45.142.212.x"],
    cves: ["CVE-2024-31449"],
    firstSeen: "2024-02-20",
    lastSeen: "2024-04-12"
  },
  {
    id: "CAMP-2024-003",
    name: "CloudSnooper AWS Infiltration",
    actor: {
      id: "TA-003",
      name: "APT29",
      aliases: ["Cozy Bear", "The Dukes"],
      origin: "Russia",
      motivation: "espionage",
      sophistication: "critical"
    },
    activeSince: "2024-03-01",
    targets: ["aws", "cloud", "iam", "s3", "ec2"],
    tactics: ["Initial Access", "Persistence", "Credential Access", "Exfiltration"],
    affectedRegions: ["US", "EU"],
    severity: "CRITICAL",
    description: "APT29 is conducting espionage operations against government and critical infrastructure cloud environments. Uses sophisticated IAM policy manipulation.",
    indicators: ["CloudTrail evasion", "IAM role assumption", "VPC Flow Log gaps"],
    cves: ["CVE-2024-28085"],
    firstSeen: "2024-03-01",
    lastSeen: "2024-04-13"
  },
  {
    id: "CAMP-2024-004",
    name: "WebShell Supply Chain",
    actor: {
      id: "TA-004",
      name: "Lazarus Group",
      aliases: ["Hidden Cobra", "APT38"],
      origin: "North Korea",
      motivation: "financial",
      sophistication: "critical"
    },
    activeSince: "2024-03-15",
    targets: ["nginx", "apache", "nodejs", "web", "api"],
    tactics: ["Initial Access", "Persistence", "Defense Evasion", "Command and Control"],
    affectedRegions: ["Global"],
    severity: "HIGH",
    description: "Supply chain attack targeting web servers through compromised npm packages and nginx modules. Establishes persistent web shells.",
    indicators: ["http-service.js", "ngx_http_module.so", "update-check.net"],
    cves: ["CVE-2024-24989", "CVE-2024-27983"],
    firstSeen: "2024-03-15",
    lastSeen: "2024-04-11"
  }
]

// ── HELPERS ──────────────────────────────────────────────────────────────────
function parseStack(stack: string | null): string[] {
  if (!stack) return []
  return stack
    .toLowerCase()
    .split(/[,;|]+/)
    .map(s => s.trim())
    .filter(Boolean)
}

function calculateCorrelation(
  campaign: ThreatCampaign,
  stackTerms: string[]
): CorrelationResult | null {
  const matchingComponents = campaign.targets.filter(target =>
    stackTerms.some(term => target.includes(term) || term.includes(target))
  )

  if (matchingComponents.length === 0) return null

  // Calculate risk score
  const baseScore = campaign.severity === "CRITICAL" ? 90 :
                    campaign.severity === "HIGH" ? 70 :
                    campaign.severity === "MEDIUM" ? 50 : 30

  const actorMultiplier = campaign.actor.sophistication === "critical" ? 1.2 :
                         campaign.actor.sophistication === "high" ? 1.1 : 1.0

  const recencyBoost = (new Date().getTime() - new Date(campaign.lastSeen).getTime()) < 7 * 24 * 60 * 60 * 1000 ? 10 : 0

  const riskScore = Math.min(100, Math.round(baseScore * actorMultiplier + recencyBoost))

  const predictedImpact: "critical" | "high" | "medium" | "low" =
    riskScore >= 85 ? "critical" :
    riskScore >= 65 ? "high" :
    riskScore >= 45 ? "medium" : "low"

  const recommendedActions = [
    `Review security configuration for: ${matchingComponents.join(", ")}`,
    `Monitor for indicators: ${campaign.indicators.slice(0, 2).join(", ")}...`,
    `Patch related CVEs: ${campaign.cves.join(", ")}`,
    campaign.severity === "CRITICAL" ? "Immediate incident response preparation recommended" : "Schedule security review within 48h"
  ]

  return {
    campaign,
    matchingStackComponents: matchingComponents,
    riskScore,
    predictedImpact,
    recommendedActions
  }
}

// ── MAIN API ─────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)

    // Parse parameters
    const stackParam = url.searchParams.get("stack")
    const severityFilter = url.searchParams.get("severity")
    const includeAll = url.searchParams.get("all") === "true"
    const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get("limit") || "10", 10) || 10))

    const stackTerms = parseStack(stackParam)

    // Filter campaigns
    let campaigns = ACTIVE_CAMPAIGNS

    if (severityFilter) {
      campaigns = campaigns.filter(c => severityFilter.split(",").includes(c.severity))
    }

    // Calculate correlations if stack provided
    let correlations: CorrelationResult[] = []
    if (stackTerms.length > 0) {
      correlations = campaigns
        .map(c => calculateCorrelation(c, stackTerms))
        .filter((c): c is CorrelationResult => c !== null)
        .sort((a, b) => b.riskScore - a.riskScore)
    }

    // If not including all, only return correlated campaigns
    if (!includeAll && stackTerms.length > 0) {
      campaigns = correlations.map(c => c.campaign)
    }

    // Slice to limit
    campaigns = campaigns.slice(0, limit)
    correlations = correlations.slice(0, limit)

    // Calculate stats
    const stats = {
      totalCampaigns: ACTIVE_CAMPAIGNS.length,
      activeThisWeek: ACTIVE_CAMPAIGNS.filter(c =>
        new Date(c.lastSeen).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
      criticalThreats: ACTIVE_CAMPAIGNS.filter(c => c.severity === "CRITICAL").length,
      matchingYourStack: correlations.length,
      highestRiskScore: correlations.length > 0 ? Math.max(...correlations.map(c => c.riskScore)) : 0
    }

    const res = NextResponse.json({
      query: {
        stack: stackTerms,
        severity: severityFilter,
        limit
      },
      stats,
      updatedAt: new Date().toISOString(),
      source: "CTI-SIMULATED-v1.0",
      campaigns: campaigns.map(c => ({
        id: c.id,
        name: c.name,
        actor: {
          name: c.actor.name,
          origin: c.actor.origin,
          motivation: c.actor.motivation,
          sophistication: c.actor.sophistication
        },
        severity: c.severity,
        targets: c.targets,
        description: c.description,
        activeSince: c.activeSince,
        lastSeen: c.lastSeen,
        cves: c.cves,
        indicators: c.indicators
      })),
      correlations: correlations.length > 0 ? correlations.map(c => ({
        campaignId: c.campaign.id,
        campaignName: c.campaign.name,
        matchingComponents: c.matchingStackComponents,
        riskScore: c.riskScore,
        predictedImpact: c.predictedImpact,
        recommendedActions: c.recommendedActions
      })) : undefined
    })

    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30")
    return res

  } catch (err) {
    console.error("[Intel Threat API Error]", err)
    return NextResponse.json(
      { error: "Failed to query threat intelligence", timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
