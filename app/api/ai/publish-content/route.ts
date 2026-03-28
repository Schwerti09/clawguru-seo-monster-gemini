/**
 * PHASE 3: Content Publishing Pipeline
 * 
 * POST /api/ai/publish-content
 * - Accepts validated content items
 * - Stores in PostgreSQL
 * - Tracks approval status (draft → approved → published)
 * - Returns publishing confirmation
 */

import { NextRequest, NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface PublishRequest {
  items: Array<{
    title: string
    summary: string
    content: string
    contentType: "runbook" | "security-guide" | "tool-review" | "faq"
    keywords?: string[]
    metadata?: {
      generatedAt?: string
      provider?: string
      confidence?: number
    }
  }>
  batchId?: string
  autoApprove?: boolean // true = skip review, publish directly if silver+
}

interface PublishResponse {
  status: "pending" | "published" | "draft"
  total: number
  published: number
  pending_review: number
  errors: Array<{ index: number; error: string }>
  items: Array<{
    id: string
    title: string
    status: "draft" | "approved" | "published"
    url?: string
    publishedAt?: string
  }>
}

export async function POST(request: NextRequest): Promise<NextResponse<PublishResponse>> {
  try {
    const body: PublishRequest = await request.json()

    if (!body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { error: "Provide items[]" } as any,
        { status: 400 }
      )
    }

    const published: any[] = []
    const pending: any[] = []
    const errors: any[] = []

    const batchId = body.batchId || `batch-${new Date().toISOString().slice(0, 10)}`

    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i]
      try {
        const confidenceRaw = item.metadata?.confidence ?? 0
        const confidence = typeof confidenceRaw === "number" ? confidenceRaw : Number(confidenceRaw) || 0
        const tier = confidence >= 90 ? "gold" : confidence >= 70 ? "silver" : confidence >= 50 ? "bronze" : "review-required"
        const status: "approved" | "draft" = body.autoApprove && confidence >= 70 ? "approved" : "draft"

        let contentJson: any
        try {
          contentJson = typeof item.content === "string" ? JSON.parse(item.content) : item.content
        } catch {
          contentJson = { raw: item.content }
        }

        const generatedBy = item.metadata?.provider || process.env.AI_PROVIDER || "unknown"
        const seoSlugBase = item.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
        const seoSlug = status === "approved" ? seoSlugBase : null
        const publishedUrl = status === "approved" ? `/content/${seoSlugBase}` : null

        const res = await dbQuery<{ id: string; status: string; seo_slug: string | null; published_url: string | null }>(
          `INSERT INTO content_items (
            batch_id, title, summary, content, content_type, keywords,
            generated_by, confidence_score, status, confidence_tier,
            seo_slug, published_url
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
          ON CONFLICT (batch_id, title) DO UPDATE SET
            summary = EXCLUDED.summary,
            content = EXCLUDED.content,
            content_type = EXCLUDED.content_type,
            keywords = EXCLUDED.keywords,
            generated_by = EXCLUDED.generated_by,
            confidence_score = EXCLUDED.confidence_score,
            status = EXCLUDED.status,
            confidence_tier = EXCLUDED.confidence_tier,
            seo_slug = COALESCE(EXCLUDED.seo_slug, content_items.seo_slug),
            published_url = COALESCE(EXCLUDED.published_url, content_items.published_url)
          RETURNING id, status, seo_slug, published_url` as any,
          [
            batchId,
            item.title,
            item.summary ?? null,
            JSON.stringify(contentJson),
            item.contentType,
            (item.keywords && item.keywords.length ? item.keywords : null) as any,
            generatedBy,
            confidence,
            status,
            tier,
            seoSlug,
            publishedUrl,
          ]
        )

        const row = res.rows[0]
        const out = {
          id: row.id,
          title: item.title,
          status: row.status as "draft" | "approved" | "published",
          url: row.published_url ?? undefined,
          publishedAt: row.published_url ? new Date().toISOString() : undefined,
        }
        published.push(out)

        if (status === "draft") {
          pending.push({ id: row.id, title: item.title, reason: `Confidence ${confidence} below auto-approve threshold (70)` })
        }
      } catch (e) {
        errors.push({ index: i, error: e instanceof Error ? e.message : String(e) })
      }
    }

    return NextResponse.json({
      status: pending.length > 0 ? "pending" : "published",
      total: body.items.length,
      published: published.length,
      pending_review: pending.length,
      errors,
      items: published,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) } as any,
      { status: 500 }
    )
  }
}
