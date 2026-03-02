import { NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-key-auth"

export const dynamic = "force-dynamic"

type Severity = "low" | "medium" | "high"
type Category = "exposure" | "websocket" | "secrets" | "supply-chain" | "ops"

type IntelItem = {
  id: string
  title: string
  severity: Severity
  category: Category
  when: string
  summary: string
  actions: string[]
  tags: string[]
}

// ISO-8601 timestamp of the most recent feed update.
// Update this whenever new FEED entries are added or existing ones are changed.
const FEED_UPDATED_AT = "2026-02-20T00:00:00Z"

const FEED: IntelItem[] = [
  {
    id: "inc-001",
    title: "Exposed Gateway (public) → Token Leakage",
    severity: "high",
    category: "exposure",
    when: "2026-02-20T00:00:00Z",
    summary:
      "Public gateway endpoints without private networking and weak auth repeatedly lead to key/token leaks.",
    actions: [
      "Move to private subnet/VPN",
      "Firewall deny-by-default",
      "Rotate all exposed keys",
      "Set auth-failure alerts",
    ],
    tags: ["gateway", "token", "firewall"],
  },
  {
    id: "inc-002",
    title: "WebSocket Origin wildcard → Remote Control Vector",
    severity: "high",
    category: "websocket",
    when: "2026-02-19T00:00:00Z",
    summary:
      "Unbound origin + long token TTL: attacks via foreign origins are possible depending on setup.",
    actions: [
      "Restrict to origin allowlist",
      "Shorten token TTL and narrow scope",
      "Enforce rate limits",
      "Bind CSRF/session tokens",
    ],
    tags: ["websocket", "csrf", "origin"],
  },
  {
    id: "inc-003",
    title: "Secrets committed in repo (env/config)",
    severity: "high",
    category: "secrets",
    when: "2026-01-18T00:00:00Z",
    summary:
      "Plaintext keys in .env/config/compose files leak via forks, logs, and backups.",
    actions: [
      "Remove secrets from version control",
      "Rotate all exposed credentials",
      "Enable secret scanning",
      "Apply least-privilege IAM",
    ],
    tags: ["secrets", "git", "rotation"],
  },
  {
    id: "inc-004",
    title: "Debug endpoints left on in production",
    severity: "medium",
    category: "ops",
    when: "2026-01-11T00:00:00Z",
    summary:
      "Open debug/metrics endpoints cause information leakage and aid attackers.",
    actions: [
      "Disable debug mode in production",
      "Require auth before metrics",
      "Apply IP allowlists",
      "Route monitoring over private links",
    ],
    tags: ["debug", "metrics", "ops"],
  },
  {
    id: "inc-005",
    title: "Supply-chain drift (dependencies) in skills",
    severity: "medium",
    category: "supply-chain",
    when: "2025-12-07T00:00:00Z",
    summary:
      "Unpinned dependency update in skill repo causes unexpected behavior, potentially risky.",
    actions: [
      "Pin all dependencies via lockfiles",
      "Review dependency changes on update",
      "Generate SBOM",
      "Enforce minimal permissions",
    ],
    tags: ["supply-chain", "dependencies", "sbom"],
  },
]

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json(
      { error: "Unauthorized. Provide a valid API key via Authorization: Bearer <key> or X-API-Key header." },
      {
        status: 401,
        headers: { "WWW-Authenticate": 'Bearer realm="ClawGuru Intel Feed API"' },
      }
    )
  }

  const { searchParams } = req.nextUrl
  const categoryParam = searchParams.get("category") as Category | "all" | null
  const severityParam = searchParams.get("severity") as Severity | "all" | null
  const limitParam = searchParams.get("limit")
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 100, 1), 100) : 100

  let items = FEED.slice()

  if (categoryParam && categoryParam !== "all") {
    items = items.filter((i) => i.category === categoryParam)
  }

  if (severityParam && severityParam !== "all") {
    items = items.filter((i) => i.severity === severityParam)
  }

  items = items.slice(0, limit)

  return NextResponse.json(
    {
      object: "list",
      total: items.length,
      updatedAt: FEED_UPDATED_AT,
      items,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Feed-Version": "1",
      },
    }
  )
}
