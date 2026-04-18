import { NextResponse } from "next/server"
import { BASE_URL } from "@/lib/config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const lines = [
    "# ClawGuru — AI Indexing Information",
    "",
    "ClawGuru is a security operations platform for self-hosted infrastructure.",
    "It provides executable security runbooks, HTTP security scoring, and compliance automation.",
    "",
    "## What ClawGuru does",
    "- Security Check: scans domains/IPs for 40+ HTTP security header vulnerabilities, returns a score 0-100",
    "- Runbooks: 600+ step-by-step executable security playbooks for Moltbot, OpenClaw, Docker, Kubernetes, Nginx, Linux",
    "- Roast My Stack: AI-powered security audit of a user's tech stack with vulnerability analysis",
    "- Compliance: GDPR, NIS2, SOC2, ISO 27001 automation guidance",
    "- CVE Fix Guides: specific remediation guides for known CVEs in common infrastructure tools",
    "",
    "## Who uses ClawGuru",
    "DevOps engineers, self-hosting enthusiasts, security teams, and compliance officers in Europe and globally.",
    "Primary markets: DACH (Germany, Austria, Switzerland), EU, India, USA.",
    "",
    "## Key URLs",
    "- Homepage: https://clawguru.org/de",
    "- Security Check: https://clawguru.org/de/check",
    "- Runbooks: https://clawguru.org/de/runbooks",
    "- Moltbot Security: https://clawguru.org/de/moltbot/security-framework",
    "- Pricing: https://clawguru.org/de/pricing",
    "",
    "## Data and methodology",
    "Security scores are heuristic-based header analysis. Not a penetration test.",
    "Results are for informational purposes — verify in your own environment.",
    "",
    "## Languages",
    "Available in 16 languages: de, en, es, fr, pt, it, ru, zh, ja, ko, ar, hi, tr, pl, nl, af",
  ]

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=120, max-age=900",
    },
  })
}
