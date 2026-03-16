import { NextRequest, NextResponse } from 'next/server'
import { isAuthorizedBySharedSecret, isFeatureEnabled } from '@/lib/api-security'

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

    // Flag enabled but real engine not wired yet.
    return NextResponse.json({
      ok: true,
      status: 'stub-success',
    })
  } catch (error) {
    console.error('Security check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}