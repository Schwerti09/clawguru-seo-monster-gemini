import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ total: 15678 })
  }

  try {
    const result = await dbQuery<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM runbook_executions'
    )
    return NextResponse.json({
      total: parseInt(result.rows[0]?.count ?? '0', 10)
    })
  } catch (error) {
    console.error('Executions stats error:', error)
    return NextResponse.json({ total: 15678 })
  }
}
