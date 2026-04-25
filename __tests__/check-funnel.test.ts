import { getCheckFunnelSnapshot, recordCheckFunnelEvent } from "@/lib/check-funnel"

describe("check funnel snapshot", () => {
  it("tracks booking clicks for consult funnel visibility", () => {
    recordCheckFunnelEvent("booking_click")
    recordCheckFunnelEvent("booking_click")

    const snapshot = getCheckFunnelSnapshot()

    expect(snapshot.bookingClicks24h).toBeGreaterThanOrEqual(2)
    expect(snapshot.consultingBookingClicks24h).toBeGreaterThanOrEqual(2)
    expect(snapshot.bookingClicks7d).toBeGreaterThanOrEqual(2)
    expect(snapshot.consultingBookingClicks7d).toBeGreaterThanOrEqual(2)
  })
})
