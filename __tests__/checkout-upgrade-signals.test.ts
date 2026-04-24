import {
  sanitizeUpgradeSignals,
  upgradeSignalsMetadata,
} from "@/lib/checkout-upgrade-signals"

describe("checkout upgrade signals", () => {
  it("sanitizes valid signal objects", () => {
    const result = sanitizeUpgradeSignals({
      workspaces: 6,
      needsApiExports: true,
      needsPolicyControls: false,
    })

    expect(result).toEqual({
      workspaces: 6,
      needsApiExports: true,
      needsPolicyControls: false,
    })
  })

  it("normalizes out-of-range values", () => {
    const result = sanitizeUpgradeSignals({
      workspaces: -99,
      needsApiExports: "yes",
      needsPolicyControls: 1,
    })

    expect(result).toEqual({
      workspaces: 1,
      needsApiExports: false,
      needsPolicyControls: false,
    })
  })

  it("maps sanitized signals to metadata", () => {
    const metadata = upgradeSignalsMetadata({
      workspaces: 3,
      needsApiExports: true,
      needsPolicyControls: true,
    })

    expect(metadata).toEqual({
      signal_workspaces: "3",
      signal_needs_api_exports: "true",
      signal_needs_policy_controls: "true",
    })
  })
})
