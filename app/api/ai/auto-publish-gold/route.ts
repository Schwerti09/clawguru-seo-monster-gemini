import { NextRequest, NextResponse } from "next/server"
import { dbQuery } from "@/lib/db"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET() {
  const res = await dbQuery<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM content_items WHERE confidence_tier='gold' AND COALESCE(status,'draft') <> 'published'`
  )
  return NextResponse.json({ pending_gold: Number(res.rows[0]?.count || 0) })
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { dryRun?: boolean }
  const dryRun = !!body?.dryRun

  const toPublish = await dbQuery<any>(
    `SELECT id, title, seo_slug, published_url, status
     FROM content_items
     WHERE confidence_tier='gold' AND COALESCE(status,'draft') <> 'published'`
  )

  if (dryRun) {
    return NextResponse.json({ would_publish: toPublish.rows.length, items: toPublish.rows.map((r: any) => r.id) })
  }

  const updates = [] as string[]
  for (const row of toPublish.rows) {
    const baseSlug = (row.seo_slug || row.title)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
    const url = row.published_url || `/content/${baseSlug}`
    const u = await dbQuery(
      `UPDATE content_items
       SET status='published', seo_slug=$2, published_url=$3, published_at=NOW()
       WHERE id=$1
       RETURNING id`,
      [row.id, baseSlug, url]
    )
    updates.push(u.rows[0].id)
  }

  return NextResponse.json({ published: updates.length, items: updates })
}
