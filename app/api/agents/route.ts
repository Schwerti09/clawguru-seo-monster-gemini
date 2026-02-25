// WORLD BEAST: app/api/agents/route.ts
// Unified API endpoint for all three AI agents.
// Secured by CRON_SECRET to prevent unauthorized access.

import { NextRequest, NextResponse } from "next/server"
import {
  runVulnerabilityHunterAgent,
  runViralContentAgent,
  runGrowthAgent,
} from "@/lib/agents"
import { RUNBOOKS } from "@/lib/pseo"

export const runtime = "nodejs"
export const maxDuration = 60

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const authHeader = req.headers.get("authorization")
  if (authHeader === `Bearer ${secret}`) return true
  const url = new URL(req.url)
  return url.searchParams.get("secret") === secret
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized()

  let body: { agent?: string; slug?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { agent } = body

  // WORLD BEAST: route to the requested agent
  if (agent === "vulnerability-hunter") {
    const result = await runVulnerabilityHunterAgent()
    return NextResponse.json({ ok: true, agent, result })
  }

  if (agent === "viral-content") {
    const { slug } = body
    if (!slug) return NextResponse.json({ error: "slug required for viral-content agent" }, { status: 400 })
    const runbook = RUNBOOKS.find((r) => r.slug === slug)
    if (!runbook) return NextResponse.json({ error: "runbook not found" }, { status: 404 })
    const result = await runViralContentAgent({
      slug: runbook.slug,
      title: runbook.title,
      summary: runbook.summary,
      tags: runbook.tags,
    })
    return NextResponse.json({ ok: true, agent, result })
  }

  if (agent === "growth") {
    const existingTags = [...new Set(RUNBOOKS.flatMap((r) => r.tags))]
    const topSlugs = RUNBOOKS.slice(0, 50).map((r) => r.slug)
    const result = await runGrowthAgent({ existingTags, topSlugs })
    return NextResponse.json({ ok: true, agent, result })
  }

  return NextResponse.json(
    { error: `Unknown agent. Valid values: vulnerability-hunter, viral-content, growth` },
    { status: 400 }
  )
}

// WORLD BEAST: GET endpoint for quick status / available agents list
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized()
  return NextResponse.json({
    ok: true,
    agents: ["vulnerability-hunter", "viral-content", "growth"],
    description: "POST with { agent: '<name>' } to run an agent. viral-content also requires { slug: '<runbook-slug>' }.",
  })
}
