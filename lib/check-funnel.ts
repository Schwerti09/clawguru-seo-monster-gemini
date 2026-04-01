import { dbQuery } from "@/lib/db"

type CheckEvent =
  | "check_page_view"
  | "check_start"
  | "check_result"
  | "check_error"
  | "methodik_click"
  | "share_click"
  | "pricing_click"
  | "hardening_link_click"

type EventRow = {
  event: CheckEvent
  ts: number
}

const MAX_EVENTS = 20_000
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000
const rows: EventRow[] = []
const SNAPSHOT_WINDOW_MS = 24 * 60 * 60 * 1000

function now() {
  return Date.now()
}

function prune(cutoff = now() - RETENTION_MS) {
  while (rows.length > 0 && rows[0].ts < cutoff) rows.shift()
  if (rows.length > MAX_EVENTS) rows.splice(0, rows.length - MAX_EVENTS)
}

export function recordCheckFunnelEvent(event: CheckEvent) {
  rows.push({ event, ts: now() })
  prune()
}

function countSince(event: CheckEvent, sinceMs: number): number {
  let n = 0
  for (let i = rows.length - 1; i >= 0; i--) {
    const r = rows[i]
    if (r.ts < sinceMs) break
    if (r.event === event) n++
  }
  return n
}

export function getCheckFunnelSnapshot() {
  prune()
  const since24h = now() - SNAPSHOT_WINDOW_MS
  return {
    pageViews24h: countSince("check_page_view", since24h),
    checkStarts24h: countSince("check_start", since24h),
    checkResults24h: countSince("check_result", since24h),
    pricingClicks24h: countSince("pricing_click", since24h),
    shareClicks24h: countSince("share_click", since24h),
    methodikClicks24h: countSince("methodik_click", since24h),
    hardeningClicks24h: countSince("hardening_link_click", since24h),
  }
}

type CheckMeta = Record<string, string | number | boolean | null>

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL)
}

export async function recordCheckFunnelEventPersistent(event: CheckEvent, meta?: CheckMeta) {
  recordCheckFunnelEvent(event)
  if (!hasDatabase()) return
  try {
    await dbQuery(
      `INSERT INTO check_funnel_events (event, meta_json)
       VALUES ($1, $2::jsonb)`,
      [event, JSON.stringify(meta ?? {})]
    )
  } catch {
    // Non-blocking analytics write path.
  }
}

export async function getCheckFunnelSnapshotPersistent() {
  if (!hasDatabase()) return getCheckFunnelSnapshot()
  try {
    const res = await dbQuery<{
      page_views: string
      check_starts: string
      check_results: string
      pricing_clicks: string
      share_clicks: string
      methodik_clicks: string
      hardening_clicks: string
    }>(
      `SELECT
         COUNT(*) FILTER (WHERE event = 'check_page_view')::text AS page_views,
         COUNT(*) FILTER (WHERE event = 'check_start')::text AS check_starts,
         COUNT(*) FILTER (WHERE event = 'check_result')::text AS check_results,
         COUNT(*) FILTER (WHERE event = 'pricing_click')::text AS pricing_clicks,
         COUNT(*) FILTER (WHERE event = 'share_click')::text AS share_clicks,
         COUNT(*) FILTER (WHERE event = 'methodik_click')::text AS methodik_clicks,
         COUNT(*) FILTER (WHERE event = 'hardening_link_click')::text AS hardening_clicks
       FROM check_funnel_events
       WHERE created_at >= NOW() - INTERVAL '24 hours'`
    )

    const row = res.rows[0]
    return {
      pageViews24h: Number(row?.page_views || 0),
      checkStarts24h: Number(row?.check_starts || 0),
      checkResults24h: Number(row?.check_results || 0),
      pricingClicks24h: Number(row?.pricing_clicks || 0),
      shareClicks24h: Number(row?.share_clicks || 0),
      methodikClicks24h: Number(row?.methodik_clicks || 0),
      hardeningClicks24h: Number(row?.hardening_clicks || 0),
    }
  } catch {
    return getCheckFunnelSnapshot()
  }
}

