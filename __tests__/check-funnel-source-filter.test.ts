// __tests__/check-funnel-source-filter.test.ts
//
// Regression test for the in-memory consultingBookingClicks24h/7d counters.
//
// Bug history (fixed 2026-04-26): the in-memory snapshot counted EVERY
// booking_click as a consulting click, while the SQL variant correctly
// filtered for source LIKE 'consulting_%' OR source = 'enterprise_api_cta'.
// When DATABASE_URL was unavailable the in-memory fallback inflated the
// profit-funnel health score and suppressed legitimate alerts.
//
// These tests pin the in-memory path to the same filter contract.

type CheckFunnelModule = typeof import("@/lib/check-funnel")

function loadCheckFunnel(): CheckFunnelModule {
  // Force the in-memory path even on machines that have DATABASE_URL set.
  delete process.env.DATABASE_URL
  delete process.env.DATABASE_URL_2
  jest.resetModules()
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("@/lib/check-funnel")
}

const SAVED_DATABASE_URL = process.env.DATABASE_URL
const SAVED_DATABASE_URL_2 = process.env.DATABASE_URL_2

afterAll(() => {
  if (SAVED_DATABASE_URL === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = SAVED_DATABASE_URL
  if (SAVED_DATABASE_URL_2 === undefined) delete process.env.DATABASE_URL_2
  else process.env.DATABASE_URL_2 = SAVED_DATABASE_URL_2
})

describe("check-funnel in-memory source filter", () => {
  describe("recordCheckFunnelEvent + getCheckFunnelSnapshot", () => {
    it("counts every booking_click toward bookingClicks24h regardless of source", () => {
      const cf = loadCheckFunnel()
      cf.recordCheckFunnelEvent("booking_click", "consulting_starter")
      cf.recordCheckFunnelEvent("booking_click", "enterprise_api_cta")
      cf.recordCheckFunnelEvent("booking_click", "random_blog_link")
      cf.recordCheckFunnelEvent("booking_click")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.bookingClicks24h).toBe(4)
      expect(snap.bookingClicks7d).toBe(4)
    })

    it("only counts consulting_* and enterprise_api_cta toward consultingBookingClicks24h", () => {
      const cf = loadCheckFunnel()
      cf.recordCheckFunnelEvent("booking_click", "consulting_starter")
      cf.recordCheckFunnelEvent("booking_click", "consulting_pro")
      cf.recordCheckFunnelEvent("booking_click", "enterprise_api_cta")
      cf.recordCheckFunnelEvent("booking_click", "random_blog_link")
      cf.recordCheckFunnelEvent("booking_click")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.bookingClicks24h).toBe(5)
      expect(snap.consultingBookingClicks24h).toBe(3)
    })

    it("does not count consulting (without underscore) as consulting source", () => {
      const cf = loadCheckFunnel()
      cf.recordCheckFunnelEvent("booking_click", "consulting")
      cf.recordCheckFunnelEvent("booking_click", "consultingstarter")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.bookingClicks24h).toBe(2)
      expect(snap.consultingBookingClicks24h).toBe(0)
    })

    it("treats whitespace-only source as no source", () => {
      const cf = loadCheckFunnel()
      cf.recordCheckFunnelEvent("booking_click", "   ")
      cf.recordCheckFunnelEvent("booking_click", "")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.bookingClicks24h).toBe(2)
      expect(snap.consultingBookingClicks24h).toBe(0)
    })

    it("does not affect non-booking events when source is provided", () => {
      const cf = loadCheckFunnel()
      cf.recordCheckFunnelEvent("pricing_click", "consulting_starter")
      cf.recordCheckFunnelEvent("checkout_start", "consulting_pro")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.pricingClicks24h).toBe(1)
      expect(snap.checkoutStarts24h).toBe(1)
      expect(snap.bookingClicks24h).toBe(0)
      expect(snap.consultingBookingClicks24h).toBe(0)
    })

    it("preserves the legacy single-arg signature for non-booking callers", () => {
      const cf = loadCheckFunnel()
      cf.recordCheckFunnelEvent("pricing_click")
      cf.recordCheckFunnelEvent("share_click")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.pricingClicks24h).toBe(1)
      expect(snap.shareClicks24h).toBe(1)
    })
  })

  describe("recordCheckFunnelEventPersistent extracts source from meta", () => {
    it("forwards meta.source into the in-memory row", async () => {
      const cf = loadCheckFunnel()
      await cf.recordCheckFunnelEventPersistent("booking_click", { source: "consulting_starter" })
      await cf.recordCheckFunnelEventPersistent("booking_click", { source: "random_link" })
      await cf.recordCheckFunnelEventPersistent("booking_click", {})
      await cf.recordCheckFunnelEventPersistent("booking_click")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.bookingClicks24h).toBe(4)
      expect(snap.consultingBookingClicks24h).toBe(1)
    })

    it("ignores non-string meta.source values", async () => {
      const cf = loadCheckFunnel()
      await cf.recordCheckFunnelEventPersistent("booking_click", {
        source: 42 as unknown as string,
      })
      await cf.recordCheckFunnelEventPersistent("booking_click", {
        source: null as unknown as string,
      })

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.bookingClicks24h).toBe(2)
      expect(snap.consultingBookingClicks24h).toBe(0)
    })
  })

  describe("7-day window", () => {
    it("tracks consultingBookingClicks7d separately from 24h window", () => {
      const cf = loadCheckFunnel()
      cf.recordCheckFunnelEvent("booking_click", "consulting_starter")
      cf.recordCheckFunnelEvent("booking_click", "enterprise_api_cta")
      cf.recordCheckFunnelEvent("booking_click", "random_link")

      const snap = cf.getCheckFunnelSnapshot()
      expect(snap.consultingBookingClicks24h).toBe(2)
      expect(snap.consultingBookingClicks7d).toBe(2)
      expect(snap.bookingClicks24h).toBe(3)
      expect(snap.bookingClicks7d).toBe(3)
    })
  })
})
