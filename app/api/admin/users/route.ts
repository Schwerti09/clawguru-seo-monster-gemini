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
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
}
