// lib/consult-health-notify.ts
// Optional outbound alerts when consult health routing is warn/page.
// Uses env webhooks + in-memory cooldown to avoid spamming on frequent admin polls.

import { dbQuery } from "@/lib/db"

export type ConsultHealthForNotify = {
  score: number
  level: string
  alertFlags: string[]
  routing: {
    severity: "info" | "warn" | "page"
    action: string
    reason: string
  }
  reasons: string[]
}

const lastSentMs = new Map<string, number>()
const notifyStats = {
  attempted: 0,
  sent: 0,
  failed: 0,
  skippedInfo: 0,
  skippedNoWebhook: 0,
  skippedCooldown: 0,
}
let notifyTableReady = false

type NotifyCounters = {
  attempted: number
  sent: number
  failed: number
  skippedInfo: number
  skippedNoWebhook: number
  skippedCooldown: number
}

function pct(num: number, den: number) {
  return den > 0 ? Math.round((num / den) * 1000) / 10 : 0
}

function buildWindow(c: NotifyCounters) {
  return {
    ...c,
    successRatePct: pct(c.sent, c.attempted),
    failureRatePct: pct(c.failed, c.attempted),
  }
}

function buildTelemetryShape(h24: NotifyCounters, d7: NotifyCounters, d30: NotifyCounters) {
  const h24Window = buildWindow(h24)
  const d7Window = buildWindow(d7)
  const d30Window = buildWindow(d30)
  return {
    ...h24Window,
    windows: {
      h24: h24Window,
      d7: d7Window,
      d30: d30Window,
    },
    trend: {
      successRateDelta7dVs24hPct: Math.round((h24Window.successRatePct - d7Window.successRatePct) * 10) / 10,
      failureRateDelta7dVs24hPct: Math.round((h24Window.failureRatePct - d7Window.failureRatePct) * 10) / 10,
    },
  }
}

function cooldownMs() {
  const raw = process.env.CONSULT_HEALTH_ALERT_COOLDOWN_MS
  const n = raw ? Number(raw) : NaN
  return Number.isFinite(n) && n >= 60_000 ? n : 3_600_000
}

function fingerprint(health: ConsultHealthForNotify) {
  const flags = [...health.alertFlags].sort().join(",")
  return `${health.routing.severity}:${flags}:${Math.round(health.score)}`
}

function resolveWebhookUrl(severity: "warn" | "page") {
  if (severity === "page") {
    return (
      process.env.CONSULT_HEALTH_PAGE_WEBHOOK_URL?.trim() ||
      process.env.CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL?.trim() ||
      ""
    )
  }
  return (
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL?.trim() ||
    process.env.CONSULT_HEALTH_SLACK_WEBHOOK_URL?.trim() ||
    ""
  )
}

function buildText(health: ConsultHealthForNotify, ctx: { generatedAt: string }) {
  const flags = health.alertFlags.length > 0 ? health.alertFlags.join(", ") : "none"
  const reasons = health.reasons.join(" | ")
  return (
    `*ClawGuru consult health (${health.routing.severity.toUpperCase()})*\n` +
    `Time: ${ctx.generatedAt}\n` +
    `Score: ${health.score} · Level: ${health.level}\n` +
    `Flags: ${flags}\n` +
    `Reason: ${health.routing.reason}\n` +
    `Details: ${reasons}`
  )
}

async function postJson(url: string, body: Record<string, unknown>) {
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

type NotifyEventType =
  | "attempted"
  | "sent"
  | "failed"
  | "skipped_info"
  | "skipped_no_webhook"
  | "skipped_cooldown"

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL)
}

async function ensureNotifyTable() {
  if (!hasDatabase() || notifyTableReady) return
  await dbQuery(
    `CREATE TABLE IF NOT EXISTS consult_health_notify_events (
       id BIGSERIAL PRIMARY KEY,
       event TEXT NOT NULL,
       severity TEXT NOT NULL,
       meta_json JSONB NOT NULL DEFAULT '{}'::jsonb,
       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
     )`
  )
  notifyTableReady = true
}

function recordPersistent(event: NotifyEventType, severity: "info" | "warn" | "page", meta?: Record<string, unknown>) {
  if (!hasDatabase()) return
  void (async () => {
    try {
      await ensureNotifyTable()
      await dbQuery(
        `INSERT INTO consult_health_notify_events (event, severity, meta_json)
         VALUES ($1, $2, $3::jsonb)`,
        [event, severity, JSON.stringify(meta ?? {})]
      )
    } catch {
      // Non-blocking telemetry path.
    }
  })()
}

/** Test helper: clears cooldown memory between Jest cases. */
export function resetConsultHealthNotifyStateForTests() {
  lastSentMs.clear()
  notifyStats.attempted = 0
  notifyStats.sent = 0
  notifyStats.failed = 0
  notifyStats.skippedInfo = 0
  notifyStats.skippedNoWebhook = 0
  notifyStats.skippedCooldown = 0
  notifyTableReady = false
}

/**
 * Fire-and-forget: if routing is warn/page and a matching webhook URL is set,
 * POST once per cooldown window per alert fingerprint.
 */
export function maybeNotifyConsultHealthAlerts(
  health: ConsultHealthForNotify,
  ctx: { generatedAt: string }
): void {
  if (health.routing.severity === "info") {
    notifyStats.skippedInfo += 1
    recordPersistent("skipped_info", "info", { score: health.score, generatedAt: ctx.generatedAt })
    return
  }
  const severity = health.routing.severity
  const url = resolveWebhookUrl(severity)
  if (!url) {
    notifyStats.skippedNoWebhook += 1
    recordPersistent("skipped_no_webhook", severity, { score: health.score, generatedAt: ctx.generatedAt })
    return
  }

  const key = fingerprint(health)
  const now = Date.now()
  const prev = lastSentMs.get(key) ?? 0
  if (now - prev < cooldownMs()) {
    notifyStats.skippedCooldown += 1
    recordPersistent("skipped_cooldown", severity, { score: health.score, generatedAt: ctx.generatedAt })
    return
  }
  lastSentMs.set(key, now)
  notifyStats.attempted += 1
  recordPersistent("attempted", severity, { score: health.score, generatedAt: ctx.generatedAt })

  const text = buildText(health, ctx)
  const isSlackHost = url.includes("hooks.slack.com")

  void (async () => {
    try {
      if (isSlackHost) {
        await postJson(url, { text })
      } else {
        await postJson(url, {
          source: "clawguru-consult-health",
          severity,
          alert: text,
          score: health.score,
          level: health.level,
          flags: health.alertFlags,
          routingReason: health.routing.reason,
          generatedAt: ctx.generatedAt,
        })
      }
      notifyStats.sent += 1
      recordPersistent("sent", severity, { score: health.score, generatedAt: ctx.generatedAt })
    } catch {
      // Non-blocking: never break admin analytics on notify failures.
      notifyStats.failed += 1
      recordPersistent("failed", severity, { score: health.score, generatedAt: ctx.generatedAt })
    }
  })()
}

export function consultHealthWebhookEnvSnapshot() {
  return {
    warnWebhookConfigured: Boolean(resolveWebhookUrl("warn")),
    pageWebhookConfigured: Boolean(resolveWebhookUrl("page")),
  }
}

export function consultHealthNotifyTelemetrySnapshot() {
  const counters: NotifyCounters = { ...notifyStats }
  return buildTelemetryShape(counters, counters, counters)
}

export async function consultHealthNotifyTelemetrySnapshotPersistent() {
  if (!hasDatabase()) return consultHealthNotifyTelemetrySnapshot()
  try {
    await ensureNotifyTable()
    const res = await dbQuery<{
      attempted_24h: string
      sent_24h: string
      failed_24h: string
      skipped_info_24h: string
      skipped_no_webhook_24h: string
      skipped_cooldown_24h: string
      attempted_7d: string
      sent_7d: string
      failed_7d: string
      skipped_info_7d: string
      skipped_no_webhook_7d: string
      skipped_cooldown_7d: string
      attempted_30d: string
      sent_30d: string
      failed_30d: string
      skipped_info_30d: string
      skipped_no_webhook_30d: string
      skipped_cooldown_30d: string
    }>(
      `SELECT
         COUNT(*) FILTER (WHERE event = 'attempted' AND created_at >= NOW() - INTERVAL '24 hours')::text AS attempted_24h,
         COUNT(*) FILTER (WHERE event = 'sent' AND created_at >= NOW() - INTERVAL '24 hours')::text AS sent_24h,
         COUNT(*) FILTER (WHERE event = 'failed' AND created_at >= NOW() - INTERVAL '24 hours')::text AS failed_24h,
         COUNT(*) FILTER (WHERE event = 'skipped_info' AND created_at >= NOW() - INTERVAL '24 hours')::text AS skipped_info_24h,
         COUNT(*) FILTER (WHERE event = 'skipped_no_webhook' AND created_at >= NOW() - INTERVAL '24 hours')::text AS skipped_no_webhook_24h,
         COUNT(*) FILTER (WHERE event = 'skipped_cooldown' AND created_at >= NOW() - INTERVAL '24 hours')::text AS skipped_cooldown_24h,
         COUNT(*) FILTER (WHERE event = 'attempted' AND created_at >= NOW() - INTERVAL '7 days')::text AS attempted_7d,
         COUNT(*) FILTER (WHERE event = 'sent' AND created_at >= NOW() - INTERVAL '7 days')::text AS sent_7d,
         COUNT(*) FILTER (WHERE event = 'failed' AND created_at >= NOW() - INTERVAL '7 days')::text AS failed_7d,
         COUNT(*) FILTER (WHERE event = 'skipped_info' AND created_at >= NOW() - INTERVAL '7 days')::text AS skipped_info_7d,
         COUNT(*) FILTER (WHERE event = 'skipped_no_webhook' AND created_at >= NOW() - INTERVAL '7 days')::text AS skipped_no_webhook_7d,
         COUNT(*) FILTER (WHERE event = 'skipped_cooldown' AND created_at >= NOW() - INTERVAL '7 days')::text AS skipped_cooldown_7d,
         COUNT(*) FILTER (WHERE event = 'attempted' AND created_at >= NOW() - INTERVAL '30 days')::text AS attempted_30d,
         COUNT(*) FILTER (WHERE event = 'sent' AND created_at >= NOW() - INTERVAL '30 days')::text AS sent_30d,
         COUNT(*) FILTER (WHERE event = 'failed' AND created_at >= NOW() - INTERVAL '30 days')::text AS failed_30d,
         COUNT(*) FILTER (WHERE event = 'skipped_info' AND created_at >= NOW() - INTERVAL '30 days')::text AS skipped_info_30d,
         COUNT(*) FILTER (WHERE event = 'skipped_no_webhook' AND created_at >= NOW() - INTERVAL '30 days')::text AS skipped_no_webhook_30d,
         COUNT(*) FILTER (WHERE event = 'skipped_cooldown' AND created_at >= NOW() - INTERVAL '30 days')::text AS skipped_cooldown_30d
       FROM consult_health_notify_events
       WHERE created_at >= NOW() - INTERVAL '30 days'`
    )
    const row = res.rows[0]
    const h24: NotifyCounters = {
      attempted: Number(row?.attempted_24h || 0),
      sent: Number(row?.sent_24h || 0),
      failed: Number(row?.failed_24h || 0),
      skippedInfo: Number(row?.skipped_info_24h || 0),
      skippedNoWebhook: Number(row?.skipped_no_webhook_24h || 0),
      skippedCooldown: Number(row?.skipped_cooldown_24h || 0),
    }
    const d7: NotifyCounters = {
      attempted: Number(row?.attempted_7d || 0),
      sent: Number(row?.sent_7d || 0),
      failed: Number(row?.failed_7d || 0),
      skippedInfo: Number(row?.skipped_info_7d || 0),
      skippedNoWebhook: Number(row?.skipped_no_webhook_7d || 0),
      skippedCooldown: Number(row?.skipped_cooldown_7d || 0),
    }
    const d30: NotifyCounters = {
      attempted: Number(row?.attempted_30d || 0),
      sent: Number(row?.sent_30d || 0),
      failed: Number(row?.failed_30d || 0),
      skippedInfo: Number(row?.skipped_info_30d || 0),
      skippedNoWebhook: Number(row?.skipped_no_webhook_30d || 0),
      skippedCooldown: Number(row?.skipped_cooldown_30d || 0),
    }
    return buildTelemetryShape(h24, d7, d30)
  } catch {
    return consultHealthNotifyTelemetrySnapshot()
  }
}
