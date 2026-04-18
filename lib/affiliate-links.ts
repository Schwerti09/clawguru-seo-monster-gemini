/**
 * Affiliate Link System for Roast Recommendations
 * Monetization through tool recommendations
 */

export interface AffiliateLink {
  tool: string
  category: string
  url: string
  description: string
  relevance: number // 0-100 score based on finding
}

// Affiliate link database
export const affiliateLinks: AffiliateLink[] = [
  {
    tool: "ClawGuru Pro",
    category: "Security Platform",
    url: "https://clawguru.org/pricing?ref=moltbot",
    description: "Automated security checks and runbooks",
    relevance: 95,
  },
  {
    tool: "Vercel",
    category: "Hosting",
    url: "https://vercel.com/?utm_source=clawguru",
    description: "Serverless deployment with security best practices",
    relevance: 80,
  },
  {
    tool: "GitHub Advanced Security",
    category: "Code Security",
    url: "https://github.com/features/security",
    description: "Secret scanning, dependency analysis, and code scanning",
    relevance: 85,
  },
  {
    tool: "Datadog",
    category: "Monitoring",
    url: "https://www.datadoghq.com/?utm_source=clawguru",
    description: "Infrastructure monitoring and security analytics",
    relevance: 75,
  },
  {
    tool: "Snyk",
    category: "Vulnerability Scanning",
    url: "https://snyk.io/?utm_source=clawguru",
    description: "Developer-first security for dependencies and code",
    relevance: 88,
  },
  {
    tool: "Cloudflare",
    category: "Security",
    url: "https://www.cloudflare.com/?utm_source=clawguru",
    description: "WAF, DDoS protection, and edge security",
    relevance: 82,
  },
  {
    tool: "1Password",
    category: "Secrets Management",
    url: "https://1password.com/?utm_source=clawguru",
    description: "Secure password and secrets management",
    relevance: 90,
  },
]

export function getAffiliateLinksForFinding(finding: string): AffiliateLink[] {
  const findingLower = finding.toLowerCase()

  return affiliateLinks
    .map(link => {
      let relevance = link.relevance

      // Boost relevance based on finding keywords
      if (findingLower.includes("secret") || findingLower.includes("api key")) {
        if (link.tool === "1Password") relevance += 15
      }
      if (findingLower.includes("dependency") || findingLower.includes("vulnerability")) {
        if (link.tool === "Snyk") relevance += 15
        if (link.tool === "GitHub Advanced Security") relevance += 10
      }
      if (findingLower.includes("monitoring") || findingLower.includes("logging")) {
        if (link.tool === "Datadog") relevance += 15
      }
      if (findingLower.includes("ddos") || findingLower.includes("waf")) {
        if (link.tool === "Cloudflare") relevance += 15
      }

      return { ...link, relevance: Math.min(100, relevance) }
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3) // Top 3 most relevant
}

export function getAffiliateLinksForStack(stackType: string): AffiliateLink[] {
  const stackLower = stackType.toLowerCase()

  return affiliateLinks
    .map(link => {
      let relevance = link.relevance

      // Boost relevance based on stack type
      if (stackLower.includes("serverless") || stackLower.includes("vercel")) {
        if (link.tool === "Vercel") relevance += 20
      }
      if (stackLower.includes("github") || stackLower.includes("git")) {
        if (link.tool === "GitHub Advanced Security") relevance += 20
      }
      if (stackLower.includes("cloud") || stackLower.includes("aws")) {
        if (link.tool === "Datadog") relevance += 10
        if (link.tool === "Cloudflare") relevance += 10
      }

      return { ...link, relevance: Math.min(100, relevance) }
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 2) // Top 2 for stack-level
}

export function formatAffiliateLink(link: AffiliateLink, locale = "en"): string {
  const prefix = locale === "de" ? "Fix das mit" : "Fix with"
  return `${prefix} ${link.tool}: ${link.description}`
}

export function trackAffiliateClick(linkId: string, roastId: string): void {
  // TODO: Send analytics event
  console.log(`Affiliate click: ${linkId} for roast ${roastId}`)
}
