import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminCookieName, verifyAdminToken } from '@/lib/admin-auth'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const token = (await cookies()).get(adminCookieName())?.value ?? ''
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const [entitlements, execStats] = await Promise.all([
      dbQuery<{ customer_id: string; plan: string; valid_until: string; updated_at: string }>(`
        SELECT customer_id, plan, valid_until, updated_at
        FROM customer_entitlements
        ORDER BY updated_at DESC
        LIMIT 100
      `),
      dbQuery<{ plan: string; cnt: string }>(`
        SELECT ce.plan, COUNT(re.id)::text AS cnt
        FROM customer_entitlements ce
        LEFT JOIN runbook_executions re ON re.customer_id = ce.customer_id
        GROUP BY ce.plan
        ORDER BY cnt DESC
      `)
    ])

    return NextResponse.json({
      entitlements: entitlements.rows,
      executionsByPlan: execStats.rows,
    })
  } catch (error) {
    console.error('Revenue API error:', error)
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 })
  }
}
