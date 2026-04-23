export type AutopilotPlanId = "starter" | "pro" | "scale"

export type AutopilotPlan = {
  id: AutopilotPlanId
  monthlyPriceEur: number
  recommendedFor: string
  maxWorkspaces: number
  includesApiExports: boolean
  includesPolicyControls: boolean
}

export const AUTOPILOT_PLANS: Record<AutopilotPlanId, AutopilotPlan> = {
  starter: {
    id: "starter",
    monthlyPriceEur: 29,
    recommendedFor: "solo founders and small setups",
    maxWorkspaces: 1,
    includesApiExports: false,
    includesPolicyControls: false,
  },
  pro: {
    id: "pro",
    monthlyPriceEur: 99,
    recommendedFor: "production stacks with frequent changes",
    maxWorkspaces: 3,
    includesApiExports: true,
    includesPolicyControls: false,
  },
  scale: {
    id: "scale",
    monthlyPriceEur: 249,
    recommendedFor: "multi-workspace teams with governance needs",
    maxWorkspaces: 25,
    includesApiExports: true,
    includesPolicyControls: true,
  },
}

export type UpgradeSignals = {
  workspaces: number
  needsApiExports: boolean
  needsPolicyControls: boolean
}

export function suggestAutopilotPlan(signal: UpgradeSignals): AutopilotPlanId {
  if (signal.needsPolicyControls) return "scale"
  if (signal.workspaces > AUTOPILOT_PLANS.pro.maxWorkspaces) return "scale"
  if (signal.needsApiExports) return "pro"
  if (signal.workspaces > AUTOPILOT_PLANS.starter.maxWorkspaces) return "pro"
  return "starter"
}

export function annualPriceWithDiscount(monthlyPriceEur: number, discountPercent = 20): number {
  const discountedMonthly = monthlyPriceEur * (1 - discountPercent / 100)
  return Math.round(discountedMonthly * 12)
}
