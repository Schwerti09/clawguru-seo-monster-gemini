import type { UpgradeSignals } from "@/lib/autopilot-offering"

export const AUTOPILOT_THRESHOLDS = {
  pro: {
    minWorkspaces: 2,
    needsApiExports: true,
    needsPolicyControls: false,
  },
  scale: {
    minWorkspaces: 6,
    needsApiExports: true,
    needsPolicyControls: true,
  },
} as const

export type UsageSnapshot = {
  workspaces: number
  apiExportsRequested: boolean
  policyControlsRequested: boolean
}

export function buildUpgradeSignalsFromUsage(usage: UsageSnapshot): UpgradeSignals {
  const workspaces = Math.max(1, Math.min(999, Math.floor(usage.workspaces)))
  return {
    workspaces,
    needsApiExports: usage.apiExportsRequested,
    needsPolicyControls: usage.policyControlsRequested,
  }
}
