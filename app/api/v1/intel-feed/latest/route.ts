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
import { authenticateApiRequest, reportUsage } from "../../../../lib/api-auth"

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
  // ... (deine 10 Items bleiben gleich – ich kürze hier, kopiere den Rest aus deiner Datei)
]

const VALID_SEVERITIES: Severity[] = ["high", "medium", "low"]
const VALID_CATEGORIES: Category[] = ["exposure", "websocket", "secrets", "supply-chain", "ops"]

export async function GET(req: NextRequest) {
  const auth = authenticateApiRequest(req)

  // Typ-Narrowing + non-null assertion für auth.error
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error! }, // ! sagt TS: "hier ist error garantiert da"
      { status: auth.status }
    )
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

  await reportUsage(auth.info)

  return NextResponse.json({
    items,
    total: items.length,
    updatedAt: new Date().toISOString(),
  })
}