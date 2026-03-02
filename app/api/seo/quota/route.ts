import { NextResponse } from "next/server"
import { DAILY_INDEXING_QUOTA, getIndexingQuota } from "@/lib/google-indexer"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const quota = await getIndexingQuota()
  return NextResponse.json({
    used: quota.used,
    limit: DAILY_INDEXING_QUOTA,
    remaining: Math.max(0, DAILY_INDEXING_QUOTA - quota.used),
    generatedAt: new Date().toISOString(),
  })
}
