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
  const since24h = now() - 24 * 60 * 60 * 1000
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

