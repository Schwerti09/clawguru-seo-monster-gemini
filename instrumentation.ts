// ============================================================================
// Next.js Instrumentation Hook — Runtime Environment Defaults
// ============================================================================
// Runs once per server / serverless-function cold-start, BEFORE any request
// handling code executes.  Patches process.env with non-secret defaults from
// lib/env-defaults.ts so the app works even when those env vars are not set
// on the platform (critical for Netlify's 4 KB function env limit).
// ============================================================================

export async function register() {
  const { applyEnvDefaults } = await import("@/lib/env-defaults")
  applyEnvDefaults()
}
