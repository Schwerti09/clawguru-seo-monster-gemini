import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'

const MOCK_REVENUE = [
  {
    id: '1',
    user_email: 'user1@example.com',
    tier: 'pro',
    amount: 49.00,
    status: 'completed',
    created_at: '2024-03-29T10:30:00Z'
  },
  {
    id: '2',
    user_email: 'user2@example.com',
    tier: 'enterprise',
    amount: 199.00,
    status: 'completed',
    created_at: '2024-03-29T09:15:00Z'
  },
  {
    id: '3',
    user_email: 'user3@example.com',
    tier: 'daypass',
    amount: 9.00,
    status: 'pending',
    created_at: '2024-03-29T08:45:00Z'
  }
]

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(MOCK_REVENUE)
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
    return NextResponse.json(MOCK_REVENUE)
  }
}
