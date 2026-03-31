import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const result = await dbQuery<{
      id: string
      runbook_name: string | null
      user_email: string | null
      status: string
      duration: string | null
      success_rate: number | null
      output: string | null
      created_at: string
    }>(`
      SELECT
        e.id,
        r.name AS runbook_name,
        u.email AS user_email,
        e.status,
        e.duration,
        e.success_rate,
        e.output,
        e.created_at
      FROM runbook_executions e
      LEFT JOIN runbooks r ON r.id = e.runbook_id
      LEFT JOIN users u ON u.id = e.user_id
      ORDER BY e.created_at DESC
      LIMIT 50
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Executions API error:', error)
    return NextResponse.json({ error: 'Failed to fetch execution data' }, { status: 500 })
  }
}
