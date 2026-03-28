/**
 * PHASE 3: Simple Approval Workflow
 * 
 * GET /api/ai/approval-status?batchId=...
 * - Returns: items pending approval from last batch
 * 
 * POST /api/ai/approve-for-publishing
 * - Approve item → mark for publishing
 * - Auto-generate URL slug + metadata
 */

import { NextRequest, NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const batchId = request.nextUrl.searchParams.get("batchId") || undefined
  const tier = request.nextUrl.searchParams.get("tier") || undefined // filter by confidence_tier

  const params: any[] = []
  const where: string[] = ["status = 'draft'"]
  if (batchId) {
    params.push(batchId)
    where.push(`batch_id = $${params.length}`)
  }
  if (tier) {
    params.push(tier)
    where.push(`confidence_tier = $${params.length}`)
  }

  const q = `SELECT id, title, summary, confidence_score, confidence_tier, generated_at, content_type
             FROM content_items
             WHERE ${where.join(" AND ")}
             ORDER BY confidence_score ASC NULLS LAST, generated_at DESC
             LIMIT 100`

  const res = await dbQuery(q, params)
  const items = res.rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    summary: r.summary,
    tier: r.confidence_tier,
    confidence: r.confidence_score,
    reason: r.review_reason || undefined,
    enqueued_at: r.generated_at,
    contentType: r.content_type,
  }))

  return NextResponse.json({ batch_id: batchId ?? null, total_pending: items.length, items })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { itemId, approve, rejection_reason, seo_slug } = body as {
    itemId?: string
    approve?: boolean
    rejection_reason?: string
    seo_slug?: string
  }

  if (!itemId) {
    return NextResponse.json({ error: "Provide itemId" }, { status: 400 })
  }

  const found = await dbQuery<any>("SELECT id, title, content_type FROM content_items WHERE id = $1", [itemId])
  if (found.rowCount === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }
  const item = found.rows[0]

  if (approve) {
    const baseSlug = (seo_slug || item.title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
    const publishedUrl = `/content/${baseSlug}`

    const upd = await dbQuery(
      `UPDATE content_items
       SET status='approved', reviewed_at=NOW(), seo_slug=$2, published_url=$3
       WHERE id=$1
       RETURNING id, seo_slug, published_url, status, reviewed_at`,
      [itemId, baseSlug, publishedUrl]
    )

    const row = upd.rows[0]
    return NextResponse.json({
      status: row.status,
      item_id: row.id,
      published_url: row.published_url,
      approved_at: row.reviewed_at,
    })
  } else {
    const upd = await dbQuery(
      `UPDATE content_items
       SET status='rejected', reviewed_at=NOW(), review_reason=$2
       WHERE id=$1
       RETURNING id, status, reviewed_at`,
      [itemId, rejection_reason || null]
    )
    const row = upd.rows[0]
    return NextResponse.json({ status: row.status, item_id: row.id, reason: rejection_reason || null, rejected_at: row.reviewed_at })
  }
}

// NOTE: enqueueForApproval will be implemented after content-validator integration to insert into review_queue
