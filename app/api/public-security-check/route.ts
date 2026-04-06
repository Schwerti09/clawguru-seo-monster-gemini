import { NextRequest, NextResponse } from 'next/server'
import { runSecurityHeaderCheck } from '@/lib/security-check-core'

export async function POST(req: NextRequest) {
  try {
    const { target } = (await req.json().catch(() => ({}))) as { target?: string }
    const t = (target || '').trim()
    if (!t) return NextResponse.json({ error: 'Missing target' }, { status: 400 })

    const result = await runSecurityHeaderCheck(t)
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=0, no-store' }
    })
  } catch (error) {
    console.error('Public security check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
