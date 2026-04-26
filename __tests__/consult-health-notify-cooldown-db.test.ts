// __tests__/consult-health-notify-cooldown-db.test.ts
//
// Step 4 regression test: ensures the consult-health alert cooldown is
// persisted in consult_health_notify_events so a fresh worker (cold start
// after redeploy / new Railway cron service tick) does not re-fire alerts
// already sent within the cooldown window.
//
// Pre-step-4 behaviour: cooldown lived only in a Node-process Map, which was
// emptied on every cold start, so the first cron tick after a redeploy could
// re-trigger an alert that was sent 5 minutes earlier by the previous worker.
//
// Post-step-4 behaviour:
//   1. Fast path: in-process Map blocks repeat calls in the same Node process.
//   2. Slow path: SELECT max(created_at) FROM consult_health_notify_events
//      WHERE event = 'sent' AND meta_json->>'fingerprint' = $1 — blocks repeats
//      across processes / cold starts.
//   3. DB error → fall through to send (defensive: prefer maybe-double-alert
//      over silenced alerts during DB outages).

jest.mock("@/lib/db", () => ({ dbQuery: jest.fn() }))

import { dbQuery } from "@/lib/db"
import {
  consultHealthNotifyTelemetrySnapshot,
  maybeNotifyConsultHealthAlerts,
  resetConsultHealthNotifyStateForTests,
} from "@/lib/consult-health-notify"

const ctx = { generatedAt: "2026-04-26T12:00:00.000Z" }
const baseHealth = {
  score: 55,
  level: "watch" as const,
  alertFlags: ["checkout_error_pressure"],
  routing: { severity: "warn" as const, action: "slack", reason: "watch" },
  reasons: ["elevated checkout error rate"],
}

const SAVED_DATABASE_URL = process.env.DATABASE_URL

beforeEach(() => {
  resetConsultHealthNotifyStateForTests()
  ;(dbQuery as jest.Mock).mockReset()
  delete process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL
  delete process.env.CONSULT_HEALTH_SLACK_WEBHOOK_URL
  delete process.env.CONSULT_HEALTH_PAGE_WEBHOOK_URL
  delete process.env.CONSULT_HEALTH_PAGERDUTY_WEBHOOK_URL
  delete process.env.CONSULT_HEALTH_ALERT_COOLDOWN_MS
  global.fetch = jest.fn(() => Promise.resolve({ ok: true } as Response))
})

afterEach(() => {
  delete process.env.DATABASE_URL
})

afterAll(() => {
  if (SAVED_DATABASE_URL === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = SAVED_DATABASE_URL
})

function findInsertedEvents(): Array<{ event: string; severity: string; meta: Record<string, unknown> }> {
  return (dbQuery as jest.Mock).mock.calls
    .filter((c) => typeof c[0] === "string" && c[0].includes("INSERT INTO consult_health_notify_events"))
    .map((c) => ({
      event: c[1][0] as string,
      severity: c[1][1] as string,
      meta: JSON.parse(c[1][2] as string),
    }))
}

describe("consult health notify — DB-persistent cooldown (step 4)", () => {
  it("blocks notify when DB shows a recent 'sent' for the same fingerprint", async () => {
    process.env.DATABASE_URL = "postgres://example"
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"

    const recentMs = Date.now() - 10 * 60 * 1000 // 10 min ago, within default 1h cooldown
    ;(dbQuery as jest.Mock).mockImplementation((sql: string) => {
      if (sql.includes("CREATE TABLE IF NOT EXISTS consult_health_notify_events")) {
        return Promise.resolve({ rows: [] })
      }
      if (sql.includes("EXTRACT(EPOCH FROM MAX(created_at))")) {
        return Promise.resolve({ rows: [{ last_sent_ms: String(recentMs) }] })
      }
      // INSERT into events table
      return Promise.resolve({ rows: [] })
    })

    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 50))

    expect(global.fetch).not.toHaveBeenCalled()
    expect(consultHealthNotifyTelemetrySnapshot().attempted).toBe(0)
    expect(consultHealthNotifyTelemetrySnapshot().sent).toBe(0)
    expect(consultHealthNotifyTelemetrySnapshot().skippedCooldown).toBeGreaterThanOrEqual(1)

    const cooldownSelect = (dbQuery as jest.Mock).mock.calls.find(
      (c) => typeof c[0] === "string" && c[0].includes("EXTRACT(EPOCH FROM MAX(created_at))")
    )
    expect(cooldownSelect).toBeDefined()
    expect(cooldownSelect![1][0]).toContain("warn") // fingerprint includes severity

    const inserts = findInsertedEvents()
    const skippedDb = inserts.find((e) => e.event === "skipped_cooldown" && e.meta.cooldownSource === "db")
    expect(skippedDb).toBeDefined()
    expect(skippedDb!.meta.fingerprint).toContain("warn")
  })

  it("allows notify when DB shows no recent 'sent'", async () => {
    process.env.DATABASE_URL = "postgres://example"
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"

    ;(dbQuery as jest.Mock).mockImplementation((sql: string) => {
      if (sql.includes("EXTRACT(EPOCH FROM MAX(created_at))")) {
        return Promise.resolve({ rows: [{ last_sent_ms: null }] })
      }
      return Promise.resolve({ rows: [] })
    })

    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 50))

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(consultHealthNotifyTelemetrySnapshot().attempted).toBe(1)
    expect(consultHealthNotifyTelemetrySnapshot().sent).toBe(1)
    expect(consultHealthNotifyTelemetrySnapshot().skippedCooldown).toBe(0)
  })

  it("allows notify when DB shows 'sent' OUTSIDE the cooldown window", async () => {
    process.env.DATABASE_URL = "postgres://example"
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"

    const oldMs = Date.now() - 2 * 60 * 60 * 1000 // 2h ago, outside default 1h cooldown
    ;(dbQuery as jest.Mock).mockImplementation((sql: string) => {
      if (sql.includes("EXTRACT(EPOCH FROM MAX(created_at))")) {
        return Promise.resolve({ rows: [{ last_sent_ms: String(oldMs) }] })
      }
      return Promise.resolve({ rows: [] })
    })

    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 50))

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(consultHealthNotifyTelemetrySnapshot().attempted).toBe(1)
  })

  it("falls through to notify when the DB cooldown query throws (defensive)", async () => {
    process.env.DATABASE_URL = "postgres://example"
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"

    ;(dbQuery as jest.Mock).mockImplementation((sql: string) => {
      if (sql.includes("EXTRACT(EPOCH FROM MAX(created_at))")) {
        return Promise.reject(new Error("connection terminated"))
      }
      return Promise.resolve({ rows: [] })
    })

    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 50))

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(consultHealthNotifyTelemetrySnapshot().attempted).toBe(1)
  })

  it("uses in-memory cooldown only when DATABASE_URL is not set", async () => {
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"
    // no DATABASE_URL

    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 25))
    maybeNotifyConsultHealthAlerts(baseHealth, ctx) // blocked by in-memory cooldown
    await new Promise((r) => setTimeout(r, 25))

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(consultHealthNotifyTelemetrySnapshot().skippedCooldown).toBe(1)
    expect(dbQuery as jest.Mock).not.toHaveBeenCalled()
  })

  it("hydrates in-memory cache from DB cooldown hit so subsequent polls skip the DB roundtrip", async () => {
    process.env.DATABASE_URL = "postgres://example"
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"

    const recentMs = Date.now() - 10 * 60 * 1000
    ;(dbQuery as jest.Mock).mockImplementation((sql: string) => {
      if (sql.includes("EXTRACT(EPOCH FROM MAX(created_at))")) {
        return Promise.resolve({ rows: [{ last_sent_ms: String(recentMs) }] })
      }
      return Promise.resolve({ rows: [] })
    })

    // First call — DB cooldown lookup happens, hydrates memory cache.
    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 50))
    const cooldownSelectsAfterFirst = (dbQuery as jest.Mock).mock.calls.filter((c) =>
      typeof c[0] === "string" && c[0].includes("EXTRACT(EPOCH FROM MAX(created_at))")
    ).length

    // Second call — should hit the in-memory cache (memPrev is the hydrated dbLastSent),
    // no new SELECT against the cooldown table.
    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 50))
    const cooldownSelectsAfterSecond = (dbQuery as jest.Mock).mock.calls.filter((c) =>
      typeof c[0] === "string" && c[0].includes("EXTRACT(EPOCH FROM MAX(created_at))")
    ).length

    expect(cooldownSelectsAfterFirst).toBe(1)
    expect(cooldownSelectsAfterSecond).toBe(1) // unchanged → second call short-circuited via memory
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it("writes the fingerprint into meta_json on attempted/sent/skipped events", async () => {
    process.env.DATABASE_URL = "postgres://example"
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"

    ;(dbQuery as jest.Mock).mockImplementation((sql: string) => {
      if (sql.includes("EXTRACT(EPOCH FROM MAX(created_at))")) {
        return Promise.resolve({ rows: [{ last_sent_ms: null }] })
      }
      return Promise.resolve({ rows: [] })
    })

    maybeNotifyConsultHealthAlerts(baseHealth, ctx)
    await new Promise((r) => setTimeout(r, 50))

    const inserts = findInsertedEvents()
    const attempted = inserts.find((e) => e.event === "attempted")
    const sent = inserts.find((e) => e.event === "sent")

    expect(attempted).toBeDefined()
    expect(attempted!.meta.fingerprint).toEqual(expect.stringContaining("warn"))
    expect(sent).toBeDefined()
    expect(sent!.meta.fingerprint).toEqual(attempted!.meta.fingerprint)
  })

  it("blocks parallel same-process calls before the DB lookup completes", async () => {
    process.env.DATABASE_URL = "postgres://example"
    process.env.CONSULT_HEALTH_WARN_WEBHOOK_URL = "https://hooks.slack.com/services/T/X/Y"

    // Slow DB so the second sync call lands while the first is still awaiting.
    ;(dbQuery as jest.Mock).mockImplementation((sql: string) => {
      if (sql.includes("EXTRACT(EPOCH FROM MAX(created_at))")) {
        return new Promise((resolve) =>
          setTimeout(() => resolve({ rows: [{ last_sent_ms: null }] }), 30)
        )
      }
      return Promise.resolve({ rows: [] })
    })

    maybeNotifyConsultHealthAlerts(baseHealth, ctx) // call 1 — sync mark, IIFE pending DB
    maybeNotifyConsultHealthAlerts(baseHealth, ctx) // call 2 — must hit memory branch
    await new Promise((r) => setTimeout(r, 100))

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(consultHealthNotifyTelemetrySnapshot().skippedCooldown).toBeGreaterThanOrEqual(1)
  })
})
