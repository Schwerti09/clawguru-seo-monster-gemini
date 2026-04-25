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
            attempted: "5",
            sent: "4",
            failed: "1",
            skipped_info: "2",
            skipped_no_webhook: "3",
            skipped_cooldown: "6",
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
    })
  })
})
