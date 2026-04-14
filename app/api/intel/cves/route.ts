import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ── TYPES ───────────────────────────────────────────────────────────────────
type CVEEntry = {
  id: string
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  cvssScore: number
  title: string
  affected: string
  fixedIn?: string
  description: string
  published: string
  updated: string
  references: string[]
  tags: string[] // e.g., ["kubernetes", "aws", "nginx"]
  exploitAvailable: boolean
  cwe?: string
}

// ── MOCK CVE DATABASE (Real data would come from NVD API) ─────────────────────
// In production, this would be fetched from NVD API and cached
const MOCK_CVE_DB: CVEEntry[] = [
  // Kubernetes CVEs
  {
    id: "CVE-2024-10295",
    severity: "CRITICAL",
    cvssScore: 9.8,
    title: "Kubernetes kube-apiserver privilege escalation",
    affected: "Kubernetes <= 1.28.4, 1.29.0-1.29.1",
    fixedIn: "1.28.5, 1.29.2",
    description: "A security issue was discovered in Kubernetes where a user with create pod permission can escalate privileges to cluster-admin by creating pods with specially crafted service account tokens.",
    published: "2024-03-15",
    updated: "2024-03-20",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-10295"],
    tags: ["kubernetes", "k8s", "privilege-escalation", "container"],
    exploitAvailable: true,
    cwe: "CWE-269"
  },
  {
    id: "CVE-2024-9486",
    severity: "HIGH",
    cvssScore: 7.8,
    title: "Kubernetes container escape via cgroups",
    affected: "Kubernetes <= 1.27.8, 1.28.4",
    fixedIn: "1.27.9, 1.28.5",
    description: "A container escape vulnerability exists in Kubernetes where a malicious container can break out to the host filesystem through improper cgroup handling.",
    published: "2024-02-10",
    updated: "2024-02-15",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-9486"],
    tags: ["kubernetes", "k8s", "container-escape", "cgroup"],
    exploitAvailable: false,
    cwe: "CWE-552"
  },
  // Docker CVEs
  {
    id: "CVE-2024-41110",
    severity: "CRITICAL",
    cvssScore: 9.1,
    title: "Docker Engine authorization bypass",
    affected: "Docker Engine <= 24.0.7, 25.0.0-25.0.2",
    fixedIn: "24.0.8, 25.0.3",
    description: "A vulnerability in Docker Engine allows an attacker to bypass authorization plugins (AuthZ) and gain unauthorized access to Docker daemon functionality.",
    published: "2024-04-05",
    updated: "2024-04-10",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-41110"],
    tags: ["docker", "container", "authz-bypass"],
    exploitAvailable: true,
    cwe: "CWE-863"
  },
  // PostgreSQL CVEs
  {
    id: "CVE-2024-4317",
    severity: "HIGH",
    cvssScore: 7.5,
    title: "PostgreSQL memory disclosure in aggregate functions",
    affected: "PostgreSQL 12.x - 16.x",
    fixedIn: "12.19, 13.15, 14.12, 15.7, 16.3",
    description: "PostgreSQL discloses memory contents when handling certain aggregate function queries with unknown-type arguments.",
    published: "2024-05-09",
    updated: "2024-05-12",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-4317"],
    tags: ["postgresql", "postgres", "database", "memory-disclosure"],
    exploitAvailable: false,
    cwe: "CWE-200"
  },
  {
    id: "CVE-2024-10979",
    severity: "MEDIUM",
    cvssScore: 6.5,
    title: "PostgreSQL timing attack in password authentication",
    affected: "PostgreSQL <= 16.2, 15.6, 14.11",
    fixedIn: "16.3, 15.7, 14.12",
    description: "A timing side-channel vulnerability in PostgreSQL's password authentication could allow an attacker to determine valid usernames through response timing analysis.",
    published: "2024-06-01",
    updated: "2024-06-05",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-10979"],
    tags: ["postgresql", "postgres", "database", "timing-attack"],
    exploitAvailable: false,
    cwe: "CWE-208"
  },
  // Nginx CVEs
  {
    id: "CVE-2024-24989",
    severity: "HIGH",
    cvssScore: 7.5,
    title: "Nginx HTTP/2 rapid reset DoS",
    affected: "nginx 1.25.0 - 1.25.3",
    fixedIn: "1.25.4, 1.24.1",
    description: "Nginx HTTP/2 implementation is vulnerable to rapid reset attacks, allowing remote attackers to cause denial of service through excessive stream resets.",
    published: "2024-01-25",
    updated: "2024-02-01",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-24989"],
    tags: ["nginx", "web", "http2", "dos"],
    exploitAvailable: true,
    cwe: "CWE-770"
  },
  // AWS-related CVEs
  {
    id: "CVE-2024-28085",
    severity: "HIGH",
    cvssScore: 8.2,
    title: "AWS IAM policy privilege escalation",
    affected: "AWS IAM policies with wildcard permissions",
    fixedIn: "Policy review required",
    description: "Improperly configured AWS IAM policies with wildcard (*) permissions can lead to privilege escalation when combined with certain service-specific conditions.",
    published: "2024-03-10",
    updated: "2024-03-15",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-28085"],
    tags: ["aws", "cloud", "iam", "privilege-escalation"],
    exploitAvailable: false,
    cwe: "CWE-269"
  },
  // Redis CVEs
  {
    id: "CVE-2024-31449",
    severity: "CRITICAL",
    cvssScore: 9.1,
    title: "Redis Lua sandbox escape",
    affected: "Redis 7.0.0 - 7.2.4, 6.2.0 - 6.2.14",
    fixedIn: "7.2.5, 6.2.15",
    description: "A vulnerability in Redis Lua scripting engine allows sandbox escape through specially crafted Lua scripts, potentially leading to remote code execution.",
    published: "2024-04-20",
    updated: "2024-04-25",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-31449"],
    tags: ["redis", "database", "lua", "sandbox-escape"],
    exploitAvailable: true,
    cwe: "CWE-94"
  },
  // Node.js CVEs
  {
    id: "CVE-2024-27983",
    severity: "HIGH",
    cvssScore: 7.5,
    title: "Node.js permission model bypass",
    affected: "Node.js 20.x, 21.x",
    fixedIn: "20.12.0, 21.7.2",
    description: "A vulnerability in Node.js permission model allows bypass of filesystem restrictions through symbolic link manipulation.",
    published: "2024-03-08",
    updated: "2024-03-12",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-27983"],
    tags: ["nodejs", "node", "web", "permission-bypass"],
    exploitAvailable: false,
    cwe: "CWE-59"
  },
  // MySQL CVEs
  {
    id: "CVE-2024-21096",
    severity: "MEDIUM",
    cvssScore: 6.5,
    title: "MySQL Server DoS via crafted query",
    affected: "MySQL 8.0.35, 8.1.0, 8.2.0",
    fixedIn: "8.0.36, 8.3.0",
    description: "MySQL Server is vulnerable to denial of service through specially crafted SQL queries that cause excessive resource consumption.",
    published: "2024-05-15",
    updated: "2024-05-20",
    references: ["https://nvd.nist.gov/vuln/detail/CVE-2024-21096"],
    tags: ["mysql", "database", "dos"],
    exploitAvailable: false,
    cwe: "CWE-770"
  }
]

// ── HELPERS ──────────────────────────────────────────────────────────────────
function parseStackParam(stack: string | null): string[] {
  if (!stack) return []
  return stack
    .toLowerCase()
    .split(/[,;|]+/)
    .map(s => s.trim())
    .filter(Boolean)
}

function matchesStack(cve: CVEEntry, stackTerms: string[]): boolean {
  if (stackTerms.length === 0) return true
  const searchText = [...cve.tags, cve.affected.toLowerCase(), cve.title.toLowerCase()].join(" ")
  return stackTerms.some(term => searchText.includes(term.toLowerCase()))
}

// ── MAIN API ─────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    
    // Parse parameters
    const stackParam = url.searchParams.get("stack")
    const severityFilter = url.searchParams.get("severity")
    const limit = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10) || 20))
    const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10) || 0)
    const exploitOnly = url.searchParams.get("exploit") === "true"
    
    // Parse stack terms
    const stackTerms = parseStackParam(stackParam)
    
    // Filter CVEs
    let filtered = MOCK_CVE_DB.filter(cve => {
      // Stack matching
      if (stackTerms.length > 0 && !matchesStack(cve, stackTerms)) {
        return false
      }
      
      // Severity filter
      if (severityFilter && !severityFilter.split(",").includes(cve.severity)) {
        return false
      }
      
      // Exploit availability
      if (exploitOnly && !cve.exploitAvailable) {
        return false
      }
      
      return true
    })
    
    // Sort: Critical first, then by CVSS score
    filtered.sort((a, b) => {
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      return b.cvssScore - a.cvssScore
    })
    
    // Pagination
    const total = filtered.length
    const items = filtered.slice(offset, offset + limit)
    
    // Calculate statistics
    const stats = {
      total,
      critical: filtered.filter(c => c.severity === "CRITICAL").length,
      high: filtered.filter(c => c.severity === "HIGH").length,
      medium: filtered.filter(c => c.severity === "MEDIUM").length,
      low: filtered.filter(c => c.severity === "LOW").length,
      withExploit: filtered.filter(c => c.exploitAvailable).length,
      avgCvss: filtered.length > 0 
        ? (filtered.reduce((sum, c) => sum + c.cvssScore, 0) / filtered.length).toFixed(1)
        : "0.0"
    }
    
    // Response
    const res = NextResponse.json({
      query: {
        stack: stackTerms,
        severity: severityFilter,
        limit,
        offset
      },
      stats,
      updatedAt: new Date().toISOString(),
      source: "NVD-SIMULATED-v2.0",
      items: items.map(cve => ({
        id: cve.id,
        severity: cve.severity,
        cvssScore: cve.cvssScore,
        title: cve.title,
        affected: cve.affected,
        fixedIn: cve.fixedIn,
        description: cve.description,
        published: cve.published,
        exploitAvailable: cve.exploitAvailable,
        cwe: cve.cwe,
        nvdUrl: `https://nvd.nist.gov/vuln/detail/${cve.id}`
      }))
    })
    
    res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=60")
    return res
    
  } catch (err) {
    console.error("[Intel CVE API Error]", err)
    return NextResponse.json(
      { error: "Failed to query CVE database", timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
