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
  const {
    count100kSlugs,
    allProviders100k,
    allServices100k,
    allIssues100k,
    allYears100k,
  } = await import("@/lib/pseo")

  return NextResponse.json(
    {
      materializedRunbooksCount: Number(process.env.PSEO_RUNBOOK_COUNT || 500),
      count100kSlugs: count100kSlugs(),
      providerCount: allProviders100k().length,
      serviceCount: allServices100k().length,
      issueCount: allIssues100k().length,
      yearCount: allYears100k().length,
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
