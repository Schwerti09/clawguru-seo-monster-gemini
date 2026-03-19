import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  try {
    if (process.env.RUNBOOKS_WARMUP_ENABLED !== '1') {
      const res = NextResponse.json({ ok: true, skipped: true })
      res.headers.set('Cache-Control', 'no-store')
      return res
    }
    const { warmup, isReady } = await import('@/lib/runbooks-index')
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
