import { NextRequest, NextResponse } from "next/server"
import { SUPPORTED_LOCALES } from "@/lib/i18n"
import { isAuthorizedBySharedSecret } from "@/lib/api-security"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const isAuthorized = isAuthorizedBySharedSecret(req, "INTERNAL_PSEO_STATS_SECRET")
  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    )
  }
  const PROVIDER_100K_COUNT = 50
  const SERVICE_100K_COUNT = 80
  const ISSUE_100K_COUNT = 122
  const YEAR_100K_COUNT = 7
  const COUNT_100K_SLUGS =
    PROVIDER_100K_COUNT * SERVICE_100K_COUNT * ISSUE_100K_COUNT * YEAR_100K_COUNT

  return NextResponse.json(
    {
      materializedRunbooksCount: Number(process.env.PSEO_RUNBOOK_COUNT || 500),
      count100kSlugs: COUNT_100K_SLUGS,
      providerCount: PROVIDER_100K_COUNT,
      serviceCount: SERVICE_100K_COUNT,
      issueCount: ISSUE_100K_COUNT,
      yearCount: YEAR_100K_COUNT,
      localeCount: SUPPORTED_LOCALES.length,
      generatedAt: new Date().toISOString(),
      env: {
        PSEO_RUNBOOK_COUNT: process.env.PSEO_RUNBOOK_COUNT ?? null,
        NODE_ENV: process.env.NODE_ENV ?? null,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  )
}
