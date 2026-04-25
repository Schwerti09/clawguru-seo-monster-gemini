import {
  consultHealthNotifyTelemetrySnapshot,
  maybeNotifyConsultHealthAlerts,
  resetConsultHealthNotifyStateForTests,
} from "@/lib/consult-health-notify"

describe("consult health notify", () => {
  const ctx = { generatedAt: "2026-04-25T12:00:00.000Z" }

  beforeEach(() => {
    resetConsultHealthNotifyStateForTests()
    delete process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL
    delete process.env.CONSULT_HEALTH_SLACK_WEBHOOK_URL
    delete process.env.CONSULT_HEALTH_PAGE_WEBHOOK_URL
    delete process.env.CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL
    delete process.env.CONSULT_HEALTH_ALERT_COOLDOWN_MS
    global.fetch = jest.fn(() => Promise.resolve({ ok: true } as Response))
  })

  it("does not call webhooks for info severity", async () => {
    maybeNotifyConsultHealthAlerts(
      {
        score: 80,
        level: "healthy",
        alertFlags: [],
        routing: { severity: "info", action: "none", reason: "ok" },
        reasons: ["stable consult funnel signals"],
      },
      ctx
    )
    await new Promise((r) => setTimeout(r, 15))
    expect(global.fetch).not.toHaveBeenCalled()
    expect(consultHealthNotifyTelemetrySnapshot().skippedInfo).toBe(1)
  })

  it("posts Slack payload once and respects cooldown fingerprint", async () => {
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/TEST/WEBHOOK/URL"
    const health = {
      score: 55,
      level: "watch" as const,
      alertFlags: ["checkout_error_pressure"],
      routing: { severity: "warn" as const, action: "slack", reason: "watch" },
      reasons: ["elevated checkout error rate"],
    }
    maybeNotifyConsultHealthAlerts(health, ctx)
    maybeNotifyConsultHealthAlerts(health, ctx)
    await new Promise((r) => setTimeout(r, 25))
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(consultHealthNotifyTelemetrySnapshot().attempted).toBe(1)
    expect(consultHealthNotifyTelemetrySnapshot().sent).toBe(1)
    expect(consultHealthNotifyTelemetrySnapshot().skippedCooldown).toBe(1)
    const call = (global.fetch as jest.Mock).mock.calls[0]
    expect(call[0]).toContain("hooks.slack.com")
    expect(JSON.parse(call[1].body as string).text).toContain("ClawGuru consult health")
  })

  it("posts generic JSON for non-Slack warn URLs", async () => {
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://example.com/hooks/consult"
    const health = {
      score: 55,
      level: "watch" as const,
      alertFlags: ["checkout_error_pressure"],
      routing: { severity: "warn" as const, action: "slack", reason: "watch" },
      reasons: ["elevated checkout error rate"],
    }
    maybeNotifyConsultHealthAlerts(health, ctx)
    await new Promise((r) => setTimeout(r, 25))
    const body = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body as string)
    expect(body.source).toBe("clawguru-consult-health")
    expect(body.severity).toBe("warn")
  })

  it("tracks failures in telemetry counters", async () => {
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://example.com/hooks/consult"
    global.fetch = jest.fn(() => Promise.reject(new Error("network fail")))
    maybeNotifyConsultHealthAlerts(
      {
        score: 55,
        level: "watch",
        alertFlags: ["checkout_error_pressure"],
        routing: { severity: "warn", action: "slack", reason: "watch" },
        reasons: ["elevated checkout error rate"],
      },
      ctx
    )
    await new Promise((r) => setTimeout(r, 25))
    expect(consultHealthNotifyTelemetrySnapshot().attempted).toBe(1)
    expect(consultHealthNotifyTelemetrySnapshot().failed).toBe(1)
  })

  it("allows a second notify after cooldown reset", async () => {
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/TEST/WEBHOOK/URL"
    const health = {
      score: 55,
      level: "watch" as const,
      alertFlags: ["checkout_error_pressure"],
      routing: { severity: "warn" as const, action: "slack", reason: "watch" },
      reasons: ["elevated checkout error rate"],
    }
    maybeNotifyConsultHealthAlerts(health, ctx)
    await new Promise((r) => setTimeout(r, 25))
    resetConsultHealthNotifyStateForTests()
    maybeNotifyConsultHealthAlerts(health, ctx)
    await new Promise((r) => setTimeout(r, 25))
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })
})
