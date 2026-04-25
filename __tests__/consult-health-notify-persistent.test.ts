jest.mock("@/lib/db", () => ({
  dbQuery: jest.fn(),
}))

import { dbQuery } from "@/lib/db"
import {
  consultHealthNotifyTelemetrySnapshotPersistent,
  resetConsultHealthNotifyStateForTests,
} from "@/lib/consult-health-notify"

describe("consult health notify persistent snapshot", () => {
  beforeEach(() => {
    resetConsultHealthNotifyStateForTests()
    ;(dbQuery as jest.Mock).mockReset()
  })

  afterEach(() => {
    delete process.env.DATABASE_URL
  })

  it("returns DB telemetry counters when DATABASE_URL is configured", async () => {
    process.env.DATABASE_URL = "postgres://example"
    ;(dbQuery as jest.Mock)
      .mockResolvedValueOnce({ rows: [] }) // ensure table
      .mockResolvedValueOnce({
        rows: [
          {
            attempted_24h: "5",
            sent_24h: "4",
            failed_24h: "1",
            skipped_info_24h: "2",
            skipped_no_webhook_24h: "3",
            skipped_cooldown_24h: "6",
            attempted_7d: "30",
            sent_7d: "24",
            failed_7d: "6",
            skipped_info_7d: "5",
            skipped_no_webhook_7d: "7",
            skipped_cooldown_7d: "8",
            attempted_30d: "80",
            sent_30d: "70",
            failed_30d: "10",
            skipped_info_30d: "9",
            skipped_no_webhook_30d: "11",
            skipped_cooldown_30d: "12",
          },
        ],
      })

    const snapshot = await consultHealthNotifyTelemetrySnapshotPersistent()

    expect(snapshot).toEqual({
      attempted: 5,
      sent: 4,
      failed: 1,
      skippedInfo: 2,
      skippedNoWebhook: 3,
      skippedCooldown: 6,
      successRatePct: 80,
      failureRatePct: 20,
      windows: {
        h24: {
          attempted: 5,
          sent: 4,
          failed: 1,
          skippedInfo: 2,
          skippedNoWebhook: 3,
          skippedCooldown: 6,
          successRatePct: 80,
          failureRatePct: 20,
        },
        d7: {
          attempted: 30,
          sent: 24,
          failed: 6,
          skippedInfo: 5,
          skippedNoWebhook: 7,
          skippedCooldown: 8,
          successRatePct: 80,
          failureRatePct: 20,
        },
        d30: {
          attempted: 80,
          sent: 70,
          failed: 10,
          skippedInfo: 9,
          skippedNoWebhook: 11,
          skippedCooldown: 12,
          successRatePct: 87.5,
          failureRatePct: 12.5,
        },
      },
      trend: {
        successRateDelta7dVs24hPct: 0,
        failureRateDelta7dVs24hPct: 0,
      },
    })
  })

  it("falls back to in-memory telemetry when DB query fails", async () => {
    process.env.DATABASE_URL = "postgres://example"
    ;(dbQuery as jest.Mock).mockRejectedValue(new Error("db down"))

    const snapshot = await consultHealthNotifyTelemetrySnapshotPersistent()

    expect(snapshot).toEqual({
      attempted: 0,
      sent: 0,
      failed: 0,
      skippedInfo: 0,
      skippedNoWebhook: 0,
      skippedCooldown: 0,
      successRatePct: 0,
      failureRatePct: 0,
      windows: expect.any(Object),
      trend: expect.any(Object),
    })
  })
})
