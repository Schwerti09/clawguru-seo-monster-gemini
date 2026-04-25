import {
  AUTOPILOT_PLANS,
  annualPriceWithDiscount,
  formatAutopilotPlanMonthlyPrice,
  mapAutopilotPlanToCheckoutProduct,
  suggestAutopilotPlan,
} from "@/lib/autopilot-offering"

describe("autopilot offering", () => {
  it("keeps expected monthly anchor prices", () => {
    expect(AUTOPILOT_PLANS.starter.monthlyPriceEur).toBe(29)
    expect(AUTOPILOT_PLANS.pro.monthlyPriceEur).toBe(99)
    expect(AUTOPILOT_PLANS.scale.monthlyPriceEur).toBe(249)
  })

  it("suggests starter for simple single-workspace usage", () => {
    const plan = suggestAutopilotPlan({
      workspaces: 1,
      needsApiExports: false,
      needsPolicyControls: false,
    })
    expect(plan).toBe("starter")
  })

  it("suggests pro when api exports are needed", () => {
    const plan = suggestAutopilotPlan({
      workspaces: 2,
      needsApiExports: true,
      needsPolicyControls: false,
    })
    expect(plan).toBe("pro")
  })

  it("suggests scale for governance/policy requirements", () => {
    const plan = suggestAutopilotPlan({
      workspaces: 2,
      needsApiExports: true,
      needsPolicyControls: true,
    })
    expect(plan).toBe("scale")
  })

  it("calculates annual discounted prices correctly", () => {
    expect(annualPriceWithDiscount(99)).toBe(950)
    expect(annualPriceWithDiscount(249)).toBe(2390)
  })

  it("maps autopilot plans to checkout products", () => {
    expect(mapAutopilotPlanToCheckoutProduct("starter")).toBe("daypass")
    expect(mapAutopilotPlanToCheckoutProduct("pro")).toBe("pro")
    expect(mapAutopilotPlanToCheckoutProduct("scale")).toBe("team")
  })

  it("formats monthly prices locale-aware", () => {
    expect(formatAutopilotPlanMonthlyPrice("starter", "de")).toBe("29€")
    expect(formatAutopilotPlanMonthlyPrice("pro", "en")).toBe("€99")
  })
})
