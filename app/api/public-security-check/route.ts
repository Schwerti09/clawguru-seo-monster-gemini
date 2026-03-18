import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { target } = (await req.json().catch(() => ({}))) as { target?: string }
    const t = (target || '').trim()
    if (!t) return NextResponse.json({ error: 'Missing target' }, { status: 400 })

    let url: URL
    try {
      url = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`)
    } catch {
      return NextResponse.json({ error: 'Invalid target' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let resp: Response | null = null
    try {
      resp = await fetch(url.toString(), { method: 'HEAD', redirect: 'manual', signal: controller.signal })
    } catch {
      try {
        resp = await fetch(url.toString(), { method: 'GET', redirect: 'manual', signal: controller.signal })
      } catch {
        resp = null
      }
    } finally {
      clearTimeout(timeout)
    }

    const get = (n: string) => (resp?.headers.get(n) || '').toString()
    const hsts = get('strict-transport-security')
    const csp = get('content-security-policy')
    const server = get('server')
    const xpb = get('x-powered-by')
    const via = get('via')

    let score = 100
    const details: string[] = []
    const recs: string[] = []

    if (url.protocol !== 'https:') {
      score -= 30
      details.push('Target not using HTTPS')
      recs.push('Force HTTPS and redirect HTTP → HTTPS')
    }
    if (!hsts) {
      score -= 15
      details.push('Missing Strict-Transport-Security')
      recs.push('Enable HSTS (with preload where safe)')
    }
    if (!csp) {
      score -= 10
      details.push('Missing Content-Security-Policy')
      recs.push('Add a CSP to mitigate XSS/data injection')
    }
    if (server && /\d/.test(server)) {
      score -= 5
      details.push('Server header discloses version')
      recs.push('Hide or generalize Server header')
    }
    if (xpb) {
      score -= 5
      details.push('X-Powered-By header present')
      recs.push('Remove X-Powered-By header')
    }
    if (via) {
      details.push('Behind CDN/edge (via header)')
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      target: url.hostname,
      vulnerable: score < 90,
      score: Math.max(0, Math.min(100, score)),
      message: score < 90 ? 'Findings detected' : 'Baseline checks passed',
      details,
      recommendations: recs.length ? recs : [
        'Rotate secrets & tokens regularly',
        'Harden CORS and webhook signatures',
        'Enable strict TLS and HSTS',
        'Set up monitoring & alerting',
      ],
      disclaimer: 'Heuristic HTTP header inspection. Validate configs/logs for conclusions.',
    }, {
      headers: { 'Cache-Control': 'private, max-age=0, no-store' }
    })
  } catch (error) {
    console.error('Public security check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
