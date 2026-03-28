/**
 * PHASE 2b: Human Review Queue API
 * 
 * GET /api/ai/human-review-queue — List items for review
 * POST /api/ai/human-review/:id/approve — Approve item
 * POST /api/ai/human-review/:id/reject — Reject item
 * PUT /api/ai/human-review/:id/approve-with-edits — Approve with changes
 */

import { NextRequest, NextResponse } from "next/server"
import { redisAvailable, redisLPushJSON, redisLRangeJSON, redisLLen } from "@/lib/kv/redis"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

// In-memory review queue
// TODO: Replace with PostgreSQL in production
const reviewQueue = new Map<
  string,
  {
    contentId: string
    batchId?: string
    title: string
    contentType: string
    confidence: number
    tier: "bronze" | "review-required"
    reason: string
    eeatScore: number
    aboScore: number
    content: any
    createdAt: number
    status: "pending" | "approved" | "rejected" | "approved_with_edits"
    reviewedBy?: string
    reviewedAt?: number
    notes?: string
  }
>()

/**
 * GET /api/ai/human-review-queue
 * 
 * List items pending human review
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tier = searchParams.get("tier") || "all" // bronze | review-required | all
  const batchId = searchParams.get("batchId")
  const limit = parseInt(searchParams.get("limit") || "50")
  const sort = searchParams.get("sort") || "created" // confidence-asc | confidence-desc | eeat-asc | created

  // Load items (Redis first, then in-memory fallback)
  let items: any[] = []
  if (redisAvailable()) {
    const all = await redisLRangeJSON<any>("review:items", 0, -1)
    items = all.filter((item) => {
      if (item.status !== "pending") return false
      if (tier !== "all" && item.tier !== tier) return false
      if (batchId && item.batchId !== batchId) return false
      return true
    })
  } else {
    items = Array.from(reviewQueue.values()).filter((item) => {
      if (item.status !== "pending") return false
      if (tier !== "all" && item.tier !== tier) return false
      if (batchId && item.batchId !== batchId) return false
      return true
    })
  }

  // Sort
  switch (sort) {
    case "confidence-asc":
      items.sort((a, b) => a.confidence - b.confidence)
      break
    case "confidence-desc":
      items.sort((a, b) => b.confidence - a.confidence)
      break
    case "eeat-asc":
      items.sort((a, b) => a.eeatScore - b.eeatScore)
      break
    case "created":
      items.sort((a, b) => a.createdAt - b.createdAt)
      break
  }

  // Paginate
  const total = items.length
  items = items.slice(0, limit)

  return NextResponse.json(
    {
      total_queued: redisAvailable() ? await redisLLen("review:items") : reviewQueue.size,
      pending: items.length,
      showing: items.length,
      filters: { tier, batchId, limit, sort },
      items: items.map((item) => ({
        contentId: item.contentId,
        batchId: item.batchId,
        title: item.title,
        contentType: item.contentType,
        confidence: item.confidence,
        tier: item.tier,
        reason: item.reason,
        eeat: item.eeatScore,
        aboRelevance: item.aboScore,
        createdAt: new Date(item.createdAt).toISOString(),
        preview: {
          title: item.content?.title || item.title,
          summary: item.content?.summary || "N/A",
        },
        actions: {
          approve: `POST /api/ai/human-review/${item.contentId}/approve`,
          reject: `POST /api/ai/human-review/${item.contentId}/reject`,
          approveWithEdits: `PUT /api/ai/human-review/${item.contentId}/approve-with-edits`,
        },
      })),
    },
    { status: 200 }
  )
}

/**
 * POST /api/ai/human-review/:id/approve
 * 
 * Approve content for publishing
 */
export async function POST(
  request: NextRequest,
  context: { params: { id?: string } }
) {
  const { id } = context.params || {}

  if (!id) {
    return NextResponse.json({ error: "Missing content ID" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { reviewer, notes } = body

    if (!reviewer) {
      return NextResponse.json({ error: "Missing reviewer" }, { status: 400 })
    }

    const item = reviewQueue.get(id)
    if (!item) {
      return NextResponse.json({ error: "Content not found in review queue" }, { status: 404 })
    }

    // Update review status
    item.status = "approved"
    item.reviewedBy = reviewer
    item.reviewedAt = Date.now()
    item.notes = notes

    return NextResponse.json(
      {
        status: "approved",
        contentId: item.contentId,
        message: "Content approved for publishing",
        reviewedAt: new Date(item.reviewedAt).toISOString(),
        nextStep: `Save to database: POST /api/content/publish/${item.contentId}`,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/ai/human-review/:id/approve-with-edits
 * 
 * Approve content with inline edits
 */
export async function PUT(
  request: NextRequest,
  context: { params: { id?: string } }
) {
  const { id } = context.params || {}

  if (!id) {
    return NextResponse.json({ error: "Missing content ID" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { reviewer, edits, notes } = body

    if (!reviewer) {
      return NextResponse.json({ error: "Missing reviewer" }, { status: 400 })
    }

    if (!edits || typeof edits !== "object") {
      return NextResponse.json({ error: "Missing edits object" }, { status: 400 })
    }

    const item = reviewQueue.get(id)
    if (!item) {
      return NextResponse.json({ error: "Content not found in review queue" }, { status: 404 })
    }

    // Apply edits
    const originalContent = JSON.stringify(item.content)
    item.content = { ...item.content, ...edits }
    const editedContent = JSON.stringify(item.content)

    // Update review status
    item.status = "approved_with_edits"
    item.reviewedBy = reviewer
    item.reviewedAt = Date.now()
    item.notes = notes

    return NextResponse.json(
      {
        status: "approved_with_edits",
        contentId: item.contentId,
        message: "Content approved with edits",
        editsApplied: Object.keys(edits),
        reviewedAt: new Date(item.reviewedAt).toISOString(),
        content: item.content,
        nextStep: `Save to database: POST /api/content/publish/${item.contentId}`,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE or POST for reject
 * POST /api/ai/human-review/:id/reject
 */
export async function DELETE(
  request: NextRequest,
  context: { params: { id?: string } }
) {
  const { id } = context.params || {}

  if (!id) {
    return NextResponse.json({ error: "Missing content ID" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { reviewer, reason, reshuffle } = body

    if (!reviewer) {
      return NextResponse.json({ error: "Missing reviewer" }, { status: 400 })
    }

    const item = reviewQueue.get(id)
    if (!item) {
      return NextResponse.json({ error: "Content not found in review queue" }, { status: 404 })
    }

    // Update review status
    item.status = "rejected"
    item.reviewedBy = reviewer
    item.reviewedAt = Date.now()
    item.notes = reason

    return NextResponse.json(
      {
        status: "rejected",
        contentId: item.contentId,
        message: "Content rejected",
        reason: reason || "No reason provided",
        reshuffle: reshuffle ? "Content will be re-queued for regeneration" : "Content discarded",
        reviewedAt: new Date(item.reviewedAt).toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    )
  }
}

/**
 * Helper: Add item to review queue
 * (Called by content validator when validation completes)
 */
export function addToReviewQueue(item: {
  contentId: string
  batchId?: string
  title: string
  contentType: string
  confidence: number
  tier: "bronze" | "review-required"
  reason: string
  eeatScore: number
  aboScore: number
  content: any
}): void {
  const enriched = { ...item, createdAt: Date.now(), status: "pending" as const }
  if (redisAvailable()) {
    // Push to Redis list (acts like queue). Consumers can filter/sort client-side.
    redisLPushJSON("review:items", enriched).catch(() => {})
    return
  }
  reviewQueue.set(item.contentId, enriched)
}

/**
 * Helper: Get review queue stats
 */
export function getReviewQueueStats(): {
  total: number
  pending: number
  approved: number
  rejected: number
  bronze: number
  reviewRequired: number
} {
  const items = Array.from(reviewQueue.values())
  return {
    total: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved" || i.status === "approved_with_edits").length,
    rejected: items.filter((i) => i.status === "rejected").length,
    bronze: items.filter((i) => i.tier === "bronze").length,
    reviewRequired: items.filter((i) => i.tier === "review-required").length,
  }
}
