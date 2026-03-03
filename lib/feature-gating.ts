/**
 * Feature Gating – Tier capabilities for Daypass / Pro / Enterprise.
 *
 * All feature checks should go through this file so that limits are
 * defined in a single place and are easy to update.
 */

import type { AccessPlan } from "@/lib/access-token"

// ── Tier hierarchy ────────────────────────────────────────────────────────────

export type TierName = "free" | "daypass" | "pro" | "enterprise"

/** Ordered from lowest to highest access level. */
const TIER_RANK: Record<TierName, number> = {
  free: 0,
  daypass: 1,
  pro: 2,
  enterprise: 3,
}

/** Map an AccessPlan (from access-token.ts) to a TierName. */
export function planToTier(plan: AccessPlan | undefined | null): TierName {
  if (plan === "pro" || plan === "team") return "pro"
  if (plan === "daypass") return "daypass"
  return "free"
}

/** Returns true when `tier` meets or exceeds `required`. */
export function hasAccess(tier: TierName, required: TierName): boolean {
  return TIER_RANK[tier] >= TIER_RANK[required]
}

// ── Per-tier limits ───────────────────────────────────────────────────────────

export type TierLimits = {
  /** Maximum number of saved security checks. -1 = unlimited. */
  maxSavedChecks: number
  /** Private fork / private node creation. */
  privateNodes: boolean
  /** Darwinian Feed (personalized intel feed). */
  darwinianFeed: boolean
  /** Voice Copilot usage: "limited" = capped, "unlimited" = no cap. */
  voiceCopilot: "none" | "limited" | "unlimited"
  /** SSO / SAML integration (Enterprise only). */
  sso: boolean
  /** Team sharing & shared dashboards. */
  teamSharing: boolean
  /** Custom Runbooks / runbook builder. */
  customRunbooks: boolean
}

export const TIER_LIMITS: Record<TierName, TierLimits> = {
  free: {
    maxSavedChecks: 0,
    privateNodes: false,
    darwinianFeed: false,
    voiceCopilot: "none",
    sso: false,
    teamSharing: false,
    customRunbooks: false,
  },
  daypass: {
    maxSavedChecks: 5,
    privateNodes: false,
    darwinianFeed: false,
    voiceCopilot: "limited",
    sso: false,
    teamSharing: false,
    customRunbooks: false,
  },
  pro: {
    maxSavedChecks: -1,
    privateNodes: true,
    darwinianFeed: true,
    voiceCopilot: "unlimited",
    sso: false,
    teamSharing: false,
    customRunbooks: false,
  },
  enterprise: {
    maxSavedChecks: -1,
    privateNodes: true,
    darwinianFeed: true,
    voiceCopilot: "unlimited",
    sso: true,
    teamSharing: true,
    customRunbooks: true,
  },
}

/** Convenience: get limits for a given plan. */
export function getLimits(plan: AccessPlan | undefined | null): TierLimits {
  return TIER_LIMITS[planToTier(plan)]
}

// ── Feature gate check ────────────────────────────────────────────────────────

export type GatedFeature = keyof TierLimits

/** Minimum tier required per feature. */
export const FEATURE_MIN_TIER: Record<GatedFeature, TierName> = {
  maxSavedChecks: "daypass",
  privateNodes: "pro",
  darwinianFeed: "pro",
  voiceCopilot: "daypass",
  sso: "enterprise",
  teamSharing: "enterprise",
  customRunbooks: "enterprise",
}

/** Returns true when the current plan can use the given feature. */
export function canUseFeature(
  plan: AccessPlan | undefined | null,
  feature: GatedFeature,
): boolean {
  const tier = planToTier(plan)
  const required = FEATURE_MIN_TIER[feature]
  return hasAccess(tier, required)
}
