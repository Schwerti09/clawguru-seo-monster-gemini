/**
 * GET /api/v1/runbook/{id}
 *
 * Enterprise API: Returns a full runbook by slug/ID.
 * Useful for programmatic integration into SIEM/SOAR playbooks.
 *
 * Authentication: X-Api-Key header (or Authorization: Bearer <key>)
 * Billing: Each call increments the Stripe metered usage record.
 *
 * Path parameter:
 *   id – Runbook slug (e.g. "ssh-hardening-ubuntu", "incident-response-0-60")
 *
 * Response (200):
 *   {
 *     "id": string,
 *     "title": string,
 *     "summary": string,
 *     "tags": string[],
 *     "clawScore": number,
 *     "steps": string[],
 *     "faq": { q: string; a: string }[],
 *     "relatedIds": string[],
 *     "updatedAt": string
 *   }
 *
 * Response (404):
 *   { "error": "Runbook not found" }
 */

import { NextRequest, NextResponse } from "next/server"
import { authenticateApiRequest, reportUsage } from "@/lib/api-auth"
import { RUNBOOKS } from "@/lib/pseo"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = authenticateApiRequest(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = params
  if (!id) {
    return NextResponse.json({ error: "Missing runbook id" }, { status: 400 })
  }

  const runbook = RUNBOOKS.find((r) => r.slug === id)
  if (!runbook) {
    return NextResponse.json({ error: "Runbook not found" }, { status: 404 })
  }

  // Report usage to Stripe (fire-and-forget)
  await reportUsage(auth.info)

  return NextResponse.json({
    id: runbook.slug,
    title: runbook.title,
    summary: runbook.summary,
    tags: runbook.tags,
    clawScore: runbook.clawScore,
    steps: runbook.howto?.steps ?? [],
    faq: runbook.faq ?? [],
    relatedIds: runbook.relatedSlugs ?? [],
    updatedAt: runbook.lastmod,
  })
}
