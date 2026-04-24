import {
  AUTOPILOT_THRESHOLDS,
  buildUpgradeSignalsFromUsage,
} from "@/lib/autopilot-thresholds"

describe("autopilot thresholds", () => {
  it("keeps canonical pro/scale threshold anchors", () => {
    expect(AUTOPILOT_THRESHOLDS.pro.minWorkspaces).toBe(2)
    expect(AUTOPILOT_THRESHOLDS.scale.minWorkspaces).toBe(6)
    expect(AUTOPILOT_THRESHOLDS.scale.needsPolicyControls).toBe(true)
  })

  it("maps usage snapshots to normalized upgrade signals", () => {
    const signals = buildUpgradeSignalsFromUsage({
      workspaces: 0,
      apiExportsRequested: true,
      policyControlsRequested: false,
    })

    expect(signals).toEqual({
      workspaces: 1,
      needsApiExports: true,
      needsPolicyControls: false,
    })
  })
})
