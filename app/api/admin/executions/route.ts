import { NextResponse } from 'next/server'
import { dbQuery } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const MOCK_EXECUTIONS = [
  {
    id: '1',
    runbook_name: 'SSH Hardening 2026',
    user_email: 'user1@example.com',
    status: 'completed',
    duration: '2m 34s',
    success_rate: 95,
    output: 'SSH configuration updated successfully',
    created_at: '2024-03-29T10:30:00Z'
  },
  {
    id: '2',
    runbook_name: 'Docker Security Scan',
    user_email: 'user2@example.com',
    status: 'running',
    duration: null,
    success_rate: 0,
    output: 'Scanning Docker containers...',
    created_at: '2024-03-29T09:15:00Z'
  },
  {
    id: '3',
    runbook_name: 'Nginx CSP Configuration',
    user_email: 'user3@example.com',
    status: 'failed',
    duration: '1m 12s',
    success_rate: 45,
    output: 'Failed to apply CSP headers',
    created_at: '2024-03-29T08:45:00Z'
  }
]

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(MOCK_EXECUTIONS)
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
    return NextResponse.json(MOCK_EXECUTIONS)
  }
}
