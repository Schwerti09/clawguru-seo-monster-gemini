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
      customer_id: string
      runbook_id: string
      status: string
      started_at: string | null
      completed_at: string | null
      created_at: string
    }>(`
      SELECT
        id,
        customer_id,
        runbook_id,
        status,
        started_at,
        completed_at,
        created_at
      FROM runbook_executions
      ORDER BY created_at DESC
      LIMIT 100
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Executions API error:', error)
    return NextResponse.json({ error: 'Failed to fetch execution data' }, { status: 500 })
  }
}
