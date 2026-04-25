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
  return { ...notifyStats }
}

export async function consultHealthNotifyTelemetrySnapshotPersistent() {
  if (!hasDatabase()) return consultHealthNotifyTelemetrySnapshot()
  try {
    await ensureNotifyTable()
    const res = await dbQuery<{
      attempted: string
      sent: string
      failed: string
      skipped_info: string
      skipped_no_webhook: string
      skipped_cooldown: string
    }>(
      `SELECT
         COUNT(*) FILTER (WHERE event = 'attempted')::text AS attempted,
         COUNT(*) FILTER (WHERE event = 'sent')::text AS sent,
         COUNT(*) FILTER (WHERE event = 'failed')::text AS failed,
         COUNT(*) FILTER (WHERE event = 'skipped_info')::text AS skipped_info,
         COUNT(*) FILTER (WHERE event = 'skipped_no_webhook')::text AS skipped_no_webhook,
         COUNT(*) FILTER (WHERE event = 'skipped_cooldown')::text AS skipped_cooldown
       FROM consult_health_notify_events
       WHERE created_at >= NOW() - INTERVAL '24 hours'`
    )
    const row = res.rows[0]
    return {
      attempted: Number(row?.attempted || 0),
      sent: Number(row?.sent || 0),
      failed: Number(row?.failed || 0),
      skippedInfo: Number(row?.skipped_info || 0),
      skippedNoWebhook: Number(row?.skipped_no_webhook || 0),
      skippedCooldown: Number(row?.skipped_cooldown || 0),
    }
  } catch {
    return consultHealthNotifyTelemetrySnapshot()
  }
}
