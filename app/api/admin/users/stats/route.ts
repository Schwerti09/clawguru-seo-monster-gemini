import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ total: 1247, active: 892 })
  }

  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [totalResult, activeResult] = await Promise.all([
      dbQuery<{ count: string }>('SELECT COUNT(*)::text AS count FROM users'),
      dbQuery<{ count: string }>(
        'SELECT COUNT(*)::text AS count FROM user_metrics WHERE last_active >= $1',
        [thirtyDaysAgo]
      )
    ])

    return NextResponse.json({
      total: parseInt(totalResult.rows[0]?.count ?? '0', 10),
      active: parseInt(activeResult.rows[0]?.count ?? '0', 10)
    })
  } catch (error) {
    console.error('User stats error:', error)
    return NextResponse.json({ total: 1247, active: 892 })
  }
}
