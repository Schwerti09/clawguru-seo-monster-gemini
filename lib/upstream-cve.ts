// lib/upstream-cve.ts
// Fetches real CVE data from upstream sources:
//   - NVD (National Vulnerability Database) API v2
//   - GitHub Advisory Database REST API
// Used by the Vulnerability Hunter agent to ground Gemini enrichment in real data.

export type UpstreamCVE = {
  id: string
  description: string
  severity: string
  publishedDate: string
  affectedProducts: string[]
  source: "nvd" | "github"
}

// ---------------------------------------------------------------------------
// NVD (National Vulnerability Database) API v2
// Docs: https://nvd.nist.gov/developers/vulnerabilities
// ---------------------------------------------------------------------------

type NvdCveItem = {
  cve: {
    id: string
    published: string
    descriptions: { lang: string; value: string }[]
    metrics?: {
      cvssMetricV31?: { cvssData: { baseSeverity: string } }[]
      cvssMetricV30?: { cvssData: { baseSeverity: string } }[]
      cvssMetricV2?: { baseSeverity: string }[]
    }
    configurations?: {
      nodes?: { cpeMatch?: { criteria: string; vulnerable: boolean }[] }[]
    }[]
  }
}

type NvdResponse = {
  vulnerabilities?: NvdCveItem[]
}

/**
 * Fetches CVEs published in the last `daysBack` days from the NVD API.
 * Requires no API key for low-volume use; set NVD_API_KEY env var to raise rate limits.
 */
export async function fetchNvdRecent(daysBack = 2, perPage = 10): Promise<UpstreamCVE[]> {
  try {
    const now = new Date()
    const start = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000)
    // NVD requires ISO 8601 with milliseconds: 2026-01-01T00:00:00.000
    const toNvdDateParam = (d: Date) => d.toISOString().replace(/\.\d+Z$/, ".000")

    const params = new URLSearchParams({
      pubStartDate: toNvdDateParam(start),
      pubEndDate: toNvdDateParam(now),
      resultsPerPage: String(perPage),
    })

    const headers: Record<string, string> = { Accept: "application/json" }
    const nvdKey = process.env.NVD_API_KEY
    if (nvdKey) headers["apiKey"] = nvdKey

    const res = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?${params}`,
      { headers, signal: AbortSignal.timeout(20_000) }
    )
    if (!res.ok) return []

    const data: NvdResponse = await res.json()
    const items = data.vulnerabilities ?? []

    return items.map((item): UpstreamCVE => {
      const cve = item.cve
      const desc =
        cve.descriptions.find((d) => d.lang === "en")?.value ??
        cve.descriptions[0]?.value ??
        ""
      const metrics = cve.metrics
      const severity =
        metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity ??
        metrics?.cvssMetricV30?.[0]?.cvssData?.baseSeverity ??
        metrics?.cvssMetricV2?.[0]?.baseSeverity ??
        "UNKNOWN"
      const products = extractNvdProducts(cve.configurations)
      return {
        id: cve.id,
        // Truncated to 300 chars to keep Gemini prompt size manageable
        description: desc.slice(0, 300),
        severity: severity.toLowerCase(),
        publishedDate: cve.published.slice(0, 10),
        affectedProducts: products,
        source: "nvd",
      }
    })
  } catch {
    return []
  }
}

function extractNvdProducts(
  configs?: NvdCveItem["cve"]["configurations"]
): string[] {
  if (!configs) return []
  const products = new Set<string>()
  for (const config of configs) {
    for (const node of config.nodes ?? []) {
      for (const match of node.cpeMatch ?? []) {
        if (!match.vulnerable) continue
        // CPE format: cpe:2.3:a:vendor:product:version:...
        const parts = match.criteria.split(":")
        if (parts.length >= 5) products.add(`${parts[3]}/${parts[4]}`)
      }
    }
  }
  return Array.from(products).slice(0, 5)
}

// ---------------------------------------------------------------------------
// GitHub Advisory Database REST API
// Docs: https://docs.github.com/en/rest/security-advisories/global-advisories
// ---------------------------------------------------------------------------

type GitHubAdvisory = {
  ghsa_id: string
  cve_id: string | null
  summary: string
  severity: string
  published_at: string
  vulnerabilities?: { package?: { name?: string; ecosystem?: string } }[]
}

/**
 * Fetches recent security advisories from the GitHub Advisory Database.
 * Uses GITHUB_TOKEN env var if set (higher rate limits; also works without it).
 */
export async function fetchGitHubAdvisories(perPage = 10): Promise<UpstreamCVE[]> {
  try {
    const params = new URLSearchParams({
      type: "reviewed",
      per_page: String(perPage),
      sort: "published",
      direction: "desc",
    })

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    const token = process.env.GITHUB_TOKEN
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(
      `https://api.github.com/advisories?${params}`,
      { headers, signal: AbortSignal.timeout(20_000) }
    )
    if (!res.ok) return []

    const advisories: GitHubAdvisory[] = await res.json()

    return advisories.map((a): UpstreamCVE => {
      const products = (a.vulnerabilities ?? [])
        .map((v) =>
          v.package?.name
            ? `${v.package.ecosystem ?? ""}/${v.package.name}`.replace(/^\//, "")
            : null
        )
        .filter((p): p is string => p !== null)
        .slice(0, 5)

      return {
        id: a.cve_id ?? a.ghsa_id,
        // Truncated to 300 chars to keep Gemini prompt size manageable
        description: (a.summary ?? "").slice(0, 300),
        severity: (a.severity ?? "unknown").toLowerCase(),
        publishedDate: (a.published_at ?? "").slice(0, 10),
        affectedProducts: products,
        source: "github",
      }
    })
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Unified entry point
// ---------------------------------------------------------------------------

/**
 * Fetches recent CVEs from both NVD and GitHub Advisory Database.
 * Returns up to 20 entries, deduped by CVE ID, sorted by date descending.
 */
export async function fetchUpstreamCVEs(): Promise<UpstreamCVE[]> {
  const [nvd, gh] = await Promise.all([
    fetchNvdRecent(2, 10),
    fetchGitHubAdvisories(10),
  ])

  const seen = new Set<string>()
  const merged: UpstreamCVE[] = []

  for (const item of [...nvd, ...gh]) {
    if (!seen.has(item.id)) {
      seen.add(item.id)
      merged.push(item)
    }
  }

  return merged
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate))
    .slice(0, 20)
}
