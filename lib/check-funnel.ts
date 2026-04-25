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
  | "checkout_start"
  | "checkout_redirect"
  | "checkout_error"
  | "booking_click"
  | "retention_nudge_impression"
  | "retention_nudge_click"
  | "retention_nudge_dismiss"

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
  const since7d = now() - 7 * SNAPSHOT_WINDOW_MS
  return {
    pageViews24h: countSince("check_page_view", since24h),
    checkStarts24h: countSince("check_start", since24h),
    checkResults24h: countSince("check_result", since24h),
    pricingClicks24h: countSince("pricing_click", since24h),
    checkoutStarts24h: countSince("checkout_start", since24h),
    checkoutRedirects24h: countSince("checkout_redirect", since24h),
    checkoutErrors24h: countSince("checkout_error", since24h),
    bookingClicks24h: countSince("booking_click", since24h),
    consultingBookingClicks24h: countSince("booking_click", since24h),
    retentionNudgeImpressions24h: countSince("retention_nudge_impression", since24h),
    retentionNudgeClicks24h: countSince("retention_nudge_click", since24h),
    retentionNudgeDismisses24h: countSince("retention_nudge_dismiss", since24h),
    shareClicks24h: countSince("share_click", since24h),
    methodikClicks24h: countSince("methodik_click", since24h),
    hardeningClicks24h: countSince("hardening_link_click", since24h),
    pricingClicks7d: countSince("pricing_click", since7d),
    checkoutStarts7d: countSince("checkout_start", since7d),
    checkoutErrors7d: countSince("checkout_error", since7d),
    bookingClicks7d: countSince("booking_click", since7d),
    consultingBookingClicks7d: countSince("booking_click", since7d),
    bookingSources24h: [] as BookingSourceRow[],
  }
}

type CheckMeta = Record<string, string | number | boolean | null>
type BookingSourceRow = { source: string; count: number }

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
      checkout_starts: string
      checkout_redirects: string
      checkout_errors: string
      booking_clicks: string
      consulting_booking_clicks: string
      retention_nudge_impressions: string
      retention_nudge_clicks: string
      retention_nudge_dismisses: string
      share_clicks: string
      methodik_clicks: string
      hardening_clicks: string
      pricing_clicks_7d: string
      checkout_starts_7d: string
      checkout_errors_7d: string
      booking_clicks_7d: string
      consulting_booking_clicks_7d: string
    }>(
      `SELECT
         COUNT(*) FILTER (WHERE event = 'check_page_view')::text AS page_views,
         COUNT(*) FILTER (WHERE event = 'check_start')::text AS check_starts,
         COUNT(*) FILTER (WHERE event = 'check_result')::text AS check_results,
         COUNT(*) FILTER (WHERE event = 'pricing_click')::text AS pricing_clicks,
         COUNT(*) FILTER (WHERE event = 'checkout_start')::text AS checkout_starts,
         COUNT(*) FILTER (WHERE event = 'checkout_redirect')::text AS checkout_redirects,
         COUNT(*) FILTER (WHERE event = 'checkout_error')::text AS checkout_errors,
         COUNT(*) FILTER (WHERE event = 'booking_click')::text AS booking_clicks,
         COUNT(*) FILTER (
           WHERE event = 'booking_click'
             AND (
               meta_json ->> 'source' LIKE 'consulting_%'
               OR meta_json ->> 'source' = 'enterprise_api_cta'
             )
         )::text AS consulting_booking_clicks,
         COUNT(*) FILTER (WHERE event = 'retention_nudge_impression')::text AS retention_nudge_impressions,
         COUNT(*) FILTER (WHERE event = 'retention_nudge_click')::text AS retention_nudge_clicks,
         COUNT(*) FILTER (WHERE event = 'retention_nudge_dismiss')::text AS retention_nudge_dismisses,
         COUNT(*) FILTER (WHERE event = 'share_click')::text AS share_clicks,
         COUNT(*) FILTER (WHERE event = 'methodik_click')::text AS methodik_clicks,
         COUNT(*) FILTER (WHERE event = 'hardening_link_click')::text AS hardening_clicks,
         COUNT(*) FILTER (WHERE event = 'pricing_click' AND created_at >= NOW() - INTERVAL '7 days')::text AS pricing_clicks_7d,
         COUNT(*) FILTER (WHERE event = 'checkout_start' AND created_at >= NOW() - INTERVAL '7 days')::text AS checkout_starts_7d,
         COUNT(*) FILTER (WHERE event = 'checkout_error' AND created_at >= NOW() - INTERVAL '7 days')::text AS checkout_errors_7d,
         COUNT(*) FILTER (WHERE event = 'booking_click' AND created_at >= NOW() - INTERVAL '7 days')::text AS booking_clicks_7d,
         COUNT(*) FILTER (
           WHERE event = 'booking_click'
             AND created_at >= NOW() - INTERVAL '7 days'
             AND (
               meta_json ->> 'source' LIKE 'consulting_%'
               OR meta_json ->> 'source' = 'enterprise_api_cta'
             )
         )::text AS consulting_booking_clicks_7d
       FROM check_funnel_events
       WHERE created_at >= NOW() - INTERVAL '7 days'`
    )

    const row = res.rows[0]
    const sourcesRes = await dbQuery<{ source: string | null; cnt: string }>(
      `SELECT
         NULLIF(meta_json ->> 'source', '') AS source,
         COUNT(*)::text AS cnt
       FROM check_funnel_events
       WHERE
         event = 'booking_click'
         AND created_at >= NOW() - INTERVAL '24 hours'
       GROUP BY 1
       ORDER BY COUNT(*) DESC
       LIMIT 8`
    )
    const bookingSources24h: BookingSourceRow[] = sourcesRes.rows.map((r) => ({
      source: r.source ?? "unknown",
      count: Number(r.cnt || 0),
    }))

    return {
      pageViews24h: Number(row?.page_views || 0),
      checkStarts24h: Number(row?.check_starts || 0),
      checkResults24h: Number(row?.check_results || 0),
      pricingClicks24h: Number(row?.pricing_clicks || 0),
      checkoutStarts24h: Number(row?.checkout_starts || 0),
      checkoutRedirects24h: Number(row?.checkout_redirects || 0),
      checkoutErrors24h: Number(row?.checkout_errors || 0),
      bookingClicks24h: Number(row?.booking_clicks || 0),
      consultingBookingClicks24h: Number(row?.consulting_booking_clicks || 0),
      retentionNudgeImpressions24h: Number(row?.retention_nudge_impressions || 0),
      retentionNudgeClicks24h: Number(row?.retention_nudge_clicks || 0),
      retentionNudgeDismisses24h: Number(row?.retention_nudge_dismisses || 0),
      shareClicks24h: Number(row?.share_clicks || 0),
      methodikClicks24h: Number(row?.methodik_clicks || 0),
      hardeningClicks24h: Number(row?.hardening_clicks || 0),
      pricingClicks7d: Number(row?.pricing_clicks_7d || 0),
      checkoutStarts7d: Number(row?.checkout_starts_7d || 0),
      checkoutErrors7d: Number(row?.checkout_errors_7d || 0),
      bookingClicks7d: Number(row?.booking_clicks_7d || 0),
      consultingBookingClicks7d: Number(row?.consulting_booking_clicks_7d || 0),
      bookingSources24h,
    }
  } catch {
    return getCheckFunnelSnapshot()
  }
}

