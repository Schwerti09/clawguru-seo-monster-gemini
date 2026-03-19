import { NextResponse } from 'next/server'
import { warmup, isReady } from '@/lib/runbooks-index'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const info = await warmup()
    const res = NextResponse.json({ ok: true, ...info, ready: isReady() })
    // Warmup results are ephemeral per runtime instance; avoid caching
    res.headers.set('Cache-Control', 'no-store')
    return res
  } catch (e) {
    console.error('runbooks/warmup error', e)
    return NextResponse.json({ ok: false, error: 'warmup_failed' }, { status: 500 })
  }
}
