// __tests__/booking-url.test.ts
//
// Step 5 regression tests for the booking-URL validation helper.
// Pinning what counts as a "valid" Cal.com / Calendly URL so:
//   - BookingButton uses Cal-URL only when safe, mailto fallback otherwise.
//   - env-check route flags malformed Cal-URLs as missing instead of OK.

import { isValidBookingUrl, resolveBookingUrl } from "@/lib/booking-url"

describe("isValidBookingUrl", () => {
  describe("accepts valid HTTPS Cal.com / Calendly URLs", () => {
    it.each([
      "https://cal.com/clawguru/demo",
      "https://cal.com/clawguru/enterprise-demo",
      "https://cal.com/clawguru/strategy",
      "https://cal.com/clawguru/audit",
      "https://app.cal.com/clawguru/demo",
      "https://www.cal.com/clawguru/demo",
      "https://calendly.com/clawguru/30min",
      "https://calendly.com/d/abc-def/discovery",
      "https://www.calendly.com/clawguru/demo",
    ])("accepts %s", (url) => {
      expect(isValidBookingUrl(url)).toBe(true)
    })

    it("trims surrounding whitespace before validating", () => {
      expect(isValidBookingUrl("   https://cal.com/clawguru/demo   ")).toBe(true)
    })

    it("accepts URLs with query strings (Cal.com supports prefill via ?)", () => {
      expect(isValidBookingUrl("https://cal.com/clawguru/demo?email=a@b.c")).toBe(true)
    })
  })

  describe("rejects empty / malformed input", () => {
    it.each([
      [undefined, "undefined"],
      [null, "null"],
      ["", "empty string"],
      ["   ", "whitespace only"],
      ["TODO", "placeholder text"],
      ["cal.com/clawguru/demo", "missing scheme"],
      ["clawguru/demo", "no host at all"],
      ["not a url", "free-form text"],
    ])("rejects %s (%s)", (input) => {
      expect(isValidBookingUrl(input as string | undefined | null)).toBe(false)
    })

    it("rejects non-string types", () => {
      expect(isValidBookingUrl(42 as unknown as string)).toBe(false)
      expect(isValidBookingUrl({} as unknown as string)).toBe(false)
      expect(isValidBookingUrl([] as unknown as string)).toBe(false)
    })
  })

  describe("rejects unsafe schemes", () => {
    it.each([
      "http://cal.com/clawguru/demo",
      "javascript:alert(1)",
      "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
      "mailto:enterprise@clawguru.org",
      "ftp://cal.com/clawguru/demo",
      "file:///etc/passwd",
    ])("rejects %s", (url) => {
      expect(isValidBookingUrl(url)).toBe(false)
    })
  })

  describe("rejects disallowed hosts", () => {
    it.each([
      "https://example.com/clawguru/demo",
      "https://evil.com/cal.com/clawguru",
      "https://cal-com.attacker.io/x",
      "https://cal.com.attacker.io/x",
      "https://fakecalcom/x",
      "https://calendly.fake.com/x",
    ])("rejects %s", (url) => {
      expect(isValidBookingUrl(url)).toBe(false)
    })

    it("rejects empty host even with https scheme", () => {
      expect(isValidBookingUrl("https:///path")).toBe(false)
    })
  })

  describe("hostname matching is case-insensitive", () => {
    it.each([
      "https://CAL.COM/clawguru/demo",
      "https://Cal.Com/clawguru/demo",
      "https://CALENDLY.com/clawguru/30min",
    ])("accepts %s", (url) => {
      expect(isValidBookingUrl(url)).toBe(true)
    })
  })
})

describe("resolveBookingUrl", () => {
  it("returns the trimmed URL string when valid", () => {
    expect(resolveBookingUrl("https://cal.com/clawguru/demo")).toBe("https://cal.com/clawguru/demo")
    expect(resolveBookingUrl("   https://cal.com/clawguru/demo   ")).toBe("https://cal.com/clawguru/demo")
  })

  it("returns null for invalid / empty / non-string inputs", () => {
    expect(resolveBookingUrl(undefined)).toBeNull()
    expect(resolveBookingUrl(null)).toBeNull()
    expect(resolveBookingUrl("")).toBeNull()
    expect(resolveBookingUrl("TODO")).toBeNull()
    expect(resolveBookingUrl("https://example.com/x")).toBeNull()
    expect(resolveBookingUrl("javascript:alert(1)")).toBeNull()
  })

  it("matches isValidBookingUrl on every input the test suite covers", () => {
    const inputs = [
      "https://cal.com/clawguru/demo",
      "https://calendly.com/clawguru/30min",
      "https://app.cal.com/clawguru/demo",
      "http://cal.com/x",
      "mailto:x@y.z",
      "TODO",
      "",
      "   ",
      "https://example.com/x",
      undefined,
      null,
    ]
    for (const input of inputs) {
      const expected = isValidBookingUrl(input as string | undefined | null)
        ? (input as string).trim()
        : null
      expect(resolveBookingUrl(input as string | undefined | null)).toBe(expected)
    }
  })
})
