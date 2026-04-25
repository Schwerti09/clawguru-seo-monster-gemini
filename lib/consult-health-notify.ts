// lib/consult-health-notify.ts
// Optional outbound alerts when consult health routing is warn/page.
// Uses env webhooks + in-memory cooldown to avoid spamming on frequent admin polls.

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

/** Test helper: clears cooldown memory between Jest cases. */
export function resetConsultHealthNotifyStateForTests() {
  lastSentMs.clear()
  notifyStats.attempted = 0
  notifyStats.sent = 0
  notifyStats.failed = 0
  notifyStats.skippedInfo = 0
  notifyStats.skippedNoWebhook = 0
  notifyStats.skippedCooldown = 0
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
    return
  }
  const severity = health.routing.severity
  const url = resolveWebhookUrl(severity)
  if (!url) {
    notifyStats.skippedNoWebhook += 1
    return
  }

  const key = fingerprint(health)
  const now = Date.now()
  const prev = lastSentMs.get(key) ?? 0
  if (now - prev < cooldownMs()) {
    notifyStats.skippedCooldown += 1
    return
  }
  lastSentMs.set(key, now)
  notifyStats.attempted += 1

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
    } catch {
      // Non-blocking: never break admin analytics on notify failures.
      notifyStats.failed += 1
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
