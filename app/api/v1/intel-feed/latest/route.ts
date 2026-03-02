/**
 * GET /api/v1/intel-feed/latest
 *
 * Enterprise API: Returns the latest curated security intelligence feed.
 * Optionally filtered by severity and category.
 *
 * Authentication: X-Api-Key header (or Authorization: Bearer <key>)
 * Billing: Each call increments the Stripe metered usage record.
 *
 * Query parameters:
 *   severity  – "high" | "medium" | "low"  (optional, default: all)
 *   category  – "exposure" | "websocket" | "secrets" | "supply-chain" | "ops"  (optional)
 *   limit     – 1-50 (optional, default: 20)
 *
 * Response (200):
 *   {
 *     "items": IntelItem[],
 *     "total": number,
 *     "updatedAt": "ISO-8601"
 *   }
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateApiRequest, reportUsage } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

type Severity = "high" | "medium" | "low"
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

const FEED_ITEMS: IntelItem[] = [
  {
    id: "ioc-001",
    title: "Exposed Gateway (public) → Token Leakage",
    severity: "high",
    category: "exposure",
    when: "2026-02-25T12:00:00Z",
    summary: "Public gateway endpoints without private networking + weak auth repeatedly lead to key/token leaks.",
    actions: ["Enforce private subnet/VPN", "Firewall deny-by-default", "Rotate all keys", "Enable auth-fail alerts"],
    tags: ["gateway", "token", "exposure", "critical-infrastructure"],
  },
  {
    id: "ioc-002",
    title: "WebSocket Origin Wildcard → Remote Control Vector",
    severity: "high",
    category: "websocket",
    when: "2026-02-24T08:00:00Z",
    summary: "Unbound origin + long token TTL enables attacks via foreign origins depending on setup.",
    actions: ["Enforce origin allowlist", "Short TTL tokens", "Rate limiting", "CSRF/session binding"],
    tags: ["websocket", "origin", "csrf", "session"],
  },
  {
    id: "ioc-003",
    title: "Secrets Committed in Repo (env/config files)",
    severity: "high",
    category: "secrets",
    when: "2026-02-20T10:00:00Z",
    summary: "Cleartext keys in .env/config/compose → leaks via forks, logs, and backups.",
    actions: ["Remove secrets from repo history", "Immediate key rotation", "Enable secret scanning CI", "Apply least privilege"],
    tags: ["secrets", "git", "env", "rotation"],
  },
  {
    id: "ioc-004",
    title: "Debug Endpoints Left Open in Production",
    severity: "medium",
    category: "ops",
    when: "2026-02-15T14:00:00Z",
    summary: "Debug/metrics endpoints exposed → information leakage and attacker reconnaissance.",
    actions: ["Disable debug mode", "Auth-gate metrics endpoints", "IP allowlists", "Private monitoring links"],
    tags: ["debug", "metrics", "ops", "info-leak"],
  },
  {
    id: "ioc-005",
    title: "Supply-Chain Drift (unpinned dependencies)",
    severity: "medium",
    category: "supply-chain",
    when: "2026-02-10T09:00:00Z",
    summary: "Unpinned dependency updates in skill repos → unexpected behavior and potential risk.",
    actions: ["Pin all dependency versions with lockfiles", "Review changelogs before updates", "Generate SBOM", "Minimal permissions per package"],
    tags: ["supply-chain", "dependencies", "lockfile", "sbom"],
  },
  {
    id: "ioc-006",
    title: "Unvalidated Redirect in OAuth Callback",
    severity: "high",
    category: "exposure",
    when: "2026-02-08T16:00:00Z",
    summary: "Open redirect in OAuth callback URLs enables phishing and token theft.",
    actions: ["Allowlist redirect URIs strictly", "Validate state parameter", "Monitor for redirect abuse"],
    tags: ["oauth", "redirect", "phishing", "auth"],
  },
  {
    id: "ioc-007",
    title: "Container Running as Root",
    severity: "medium",
    category: "ops",
    when: "2026-02-05T11:00:00Z",
    summary: "Containers running as root with host path mounts create privilege escalation risk.",
    actions: ["Run containers as non-root user", "Drop unnecessary capabilities", "Use read-only root filesystems", "Apply seccomp profiles"],
    tags: ["container", "docker", "privilege-escalation", "hardening"],
  },
  {
    id: "ioc-008",
    title: "Missing Rate Limiting on Authentication Endpoints",
    severity: "medium",
    category: "exposure",
    when: "2026-02-01T10:00:00Z",
    summary: "Auth endpoints without rate limiting are vulnerable to credential stuffing and brute force.",
    actions: ["Implement rate limiting (token bucket / leaky bucket)", "Add CAPTCHA after N failures", "IP-based blocking after threshold", "Alert on burst auth attempts"],
    tags: ["auth", "rate-limiting", "brute-force", "credential-stuffing"],
  },
  {
    id: "ioc-009",
    title: "Webhook Signature Verification Bypass",
    severity: "low",
    category: "websocket",
    when: "2026-01-28T13:00:00Z",
    summary: "Webhook endpoints that skip HMAC signature verification allow injection of fake events.",
    actions: ["Always verify webhook signatures", "Use timing-safe comparison", "Log all unverified attempts", "Rotate webhook secrets quarterly"],
    tags: ["webhook", "hmac", "signature", "injection"],
  },
  {
    id: "ioc-010",
    title: "Stale SSH Keys in Authorized_keys",
    severity: "low",
    category: "ops",
    when: "2026-01-20T08:00:00Z",
    summary: "Old/forgotten SSH keys for ex-employees or decommissioned services remain active.",
    actions: ["Audit authorized_keys on all servers", "Remove all stale/unknown keys", "Enforce key expiry policy", "Use certificate-based SSH"],
    tags: ["ssh", "access", "key-management", "offboarding"],
  },
]

const VALID_SEVERITIES: Severity[] = ["high", "medium", "low"]
const VALID_CATEGORIES: Category[] = ["exposure", "websocket", "secrets", "supply-chain", "ops"]

export async function GET(req: NextRequest) {
  const auth = authenticateApiRequest(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = req.nextUrl
  const severityParam = searchParams.get("severity") as Severity | null
  const categoryParam = searchParams.get("category") as Category | null
  const limitParam = parseInt(searchParams.get("limit") ?? "20", 10)
  const limit = isNaN(limitParam) ? 20 : Math.min(50, Math.max(1, limitParam))

  let items = [...FEED_ITEMS]

  if (severityParam && VALID_SEVERITIES.includes(severityParam)) {
    items = items.filter((i) => i.severity === severityParam)
  }
  if (categoryParam && VALID_CATEGORIES.includes(categoryParam)) {
    items = items.filter((i) => i.category === categoryParam)
  }

  items = items.slice(0, limit)

  // Report usage to Stripe (fire-and-forget)
  await reportUsage(auth.info)

  return NextResponse.json({
    items,
    total: items.length,
    updatedAt: new Date().toISOString(),
  })
}
