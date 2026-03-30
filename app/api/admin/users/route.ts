import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'

const MOCK_USERS = [
  {
    id: '1',
    email: 'user1@example.com',
    tier: 'pro',
    created_at: '2024-01-15T10:00:00Z',
    last_active: new Date().toISOString()
  },
  {
    id: '2',
    email: 'user2@example.com',
    tier: 'enterprise',
    created_at: '2024-02-20T14:30:00Z',
    last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    email: 'user3@example.com',
    tier: 'daypass',
    created_at: '2024-03-10T09:15:00Z',
    last_active: null
  }
]

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(MOCK_USERS)
  }

  try {
    const result = await dbQuery<{
      id: string
      email: string
      tier: string | null
      created_at: string
      last_active: string | null
    }>(`
      SELECT
        u.id,
        u.email,
        ut.tier,
        u.created_at,
        um.last_active
      FROM users u
      LEFT JOIN user_tier ut ON ut.user_id = u.id
      LEFT JOIN user_metrics um ON um.user_id = u.id
      ORDER BY u.created_at DESC
      LIMIT 50
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(MOCK_USERS)
  }
}
