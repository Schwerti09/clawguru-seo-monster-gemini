import type { UpgradeSignals } from "@/lib/autopilot-offering"

function normalizeBoolean(value: unknown): boolean {
  return value === true
}

export function sanitizeUpgradeSignals(raw: unknown): UpgradeSignals | undefined {
  if (!raw || typeof raw !== "object") return undefined

  const candidate = raw as Record<string, unknown>
  const workspacesRaw = candidate.workspaces
  const workspaces =
    typeof workspacesRaw === "number" && Number.isFinite(workspacesRaw)
      ? Math.max(1, Math.min(999, Math.floor(workspacesRaw)))
      : 1

  return {
    workspaces,
    needsApiExports: normalizeBoolean(candidate.needsApiExports),
    needsPolicyControls: normalizeBoolean(candidate.needsPolicyControls),
  }
}

export function upgradeSignalsMetadata(signals: UpgradeSignals | undefined): Record<string, string> {
  if (!signals) return {}

  return {
    signal_workspaces: String(signals.workspaces),
    signal_needs_api_exports: String(signals.needsApiExports),
    signal_needs_policy_controls: String(signals.needsPolicyControls),
  }
}
