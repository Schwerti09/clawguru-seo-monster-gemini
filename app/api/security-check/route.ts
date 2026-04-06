import { NextRequest, NextResponse } from 'next/server'
import { isAuthorizedBySharedSecret, isFeatureEnabled } from '@/lib/api-security'
import { runSecurityHeaderCheck } from '@/lib/security-check-core'

export async function POST(req: NextRequest) {
  const enforceRealMode = isFeatureEnabled('SECURITY_CHECK_REAL_ENABLED')
  if (
    enforceRealMode &&
    !isAuthorizedBySharedSecret(req, 'SECURITY_CHECK_SECRET') &&
    !isAuthorizedBySharedSecret(req, 'CRON_SECRET')
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (!enforceRealMode) {
      // Deploy-safe default: keep legacy bypass while flag is disabled.
      return NextResponse.json({
        ok: true,
        message: 'Security check bypassed for deployment',
        status: 'safe',
        enforcementEnabled: false,
      })
    }

    const { target } = (await req.json().catch(() => ({}))) as { target?: string }
    const t = (target || '').trim()
    if (!t) return NextResponse.json({ error: 'Missing target' }, { status: 400 })

    const result = await runSecurityHeaderCheck(t)
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=0, no-store' }
    })
  } catch (error) {
    console.error('Security check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}