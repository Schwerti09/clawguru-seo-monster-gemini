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
      user_email: string | null
      tier: string | null
      amount: number
      status: string
      created_at: string
    }>(`
      SELECT
        p.id,
        u.email AS user_email,
        s.tier,
        p.amount,
        p.status,
        p.created_at
      FROM payments p
      LEFT JOIN users u ON u.id = p.user_id
      LEFT JOIN subscriptions s ON s.user_id = p.user_id
      ORDER BY p.created_at DESC
      LIMIT 50
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Revenue API error:', error)
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 })
  }
}
