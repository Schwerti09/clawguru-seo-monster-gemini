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
    const result = await dbQuery<{
      customer_id: string
      plan: string
      valid_until: string
      execution_count: string
      last_execution: string | null
      updated_at: string
    }>(`
      SELECT
        ce.customer_id,
        ce.plan,
        ce.valid_until,
        COUNT(re.id)::text AS execution_count,
        MAX(re.created_at)::text AS last_execution,
        ce.updated_at
      FROM customer_entitlements ce
      LEFT JOIN runbook_executions re ON re.customer_id = ce.customer_id
      GROUP BY ce.customer_id, ce.plan, ce.valid_until, ce.updated_at
      ORDER BY ce.updated_at DESC
      LIMIT 100
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
}
