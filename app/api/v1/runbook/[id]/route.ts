import { NextRequest, NextResponse } from "next/server"

// Korrekter relativer Pfad für app/api/v1/runbook/[id]/route.ts
import { authenticateApiRequest } from "../../../../../lib/api-auth"
import { isFeatureEnabled } from "@/lib/api-security"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const enforceAuth =
    process.env.V1_RUNBOOK_REQUIRE_AUTH === undefined
      ? true
      : isFeatureEnabled("V1_RUNBOOK_REQUIRE_AUTH")

  if (enforceAuth) {
    const auth = authenticateApiRequest(req)

    if (!auth.ok) {
      if ("error" in auth && "status" in auth) {
        return NextResponse.json(
          { error: auth.error || "Unauthorized" },
          { status: auth.status ?? 401 }
        )
      } else {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }
    }
  }

  const { id } = params

  const realDataMode = isFeatureEnabled("V1_RUNBOOK_REAL_DATA")
  if (realDataMode) {
    const { materializedRunbooks } = await import("@/lib/pseo")
    const runbook = materializedRunbooks().find((entry) => entry.slug === id)
    if (!runbook) {
      return NextResponse.json({ error: "Runbook not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        ok: true,
        id: runbook.slug,
        dataMode: "real",
        runbook: {
          slug: runbook.slug,
          title: runbook.title,
          summary: runbook.summary,
          tags: runbook.tags,
          lastmod: runbook.lastmod,
          clawScore: runbook.clawScore,
          relatedSlugs: runbook.relatedSlugs,
          blockCount: runbook.blocks.length,
          faqCount: runbook.faq.length,
        },
      },
      { status: 200 }
    )
  }

  // Deploy-safe fallback
  return NextResponse.json({
    ok: true,
    id,
    message: "Runbook details retrieved successfully",
    authEnforced: enforceAuth,
    dataMode: "placeholder",
  })
}