// ============================================================================
// Centralized Environment Variable Defaults
// ============================================================================
// Non-secret configuration values with sensible defaults.
// The single source of truth is config/env-defaults.json which is shared
// between next.config.js (build-time DefinePlugin inlining) and this module
// (runtime patching via instrumentation.ts).
//
// WHY: Netlify Functions have a 4 KB limit for the total size of all
// environment variables injected into a function. By providing defaults in
// code, only actual secrets (~35 vars, ~2 KB) need to be set in the Netlify
// dashboard, keeping the function env well under the limit.
//
// On Vercel there is no such limit, but this file still helps by ensuring
// the app works out of the box with fewer required env vars.
//
// IMPORTANT: Never put real secrets (API keys, passwords, tokens, DB URLs)
// in this file or the JSON. Secrets must always come from platform env vars.
// ============================================================================

import defaults from "@/config/env-defaults.json"

// Re-export for consumers that need the raw map
export const ENV_DEFAULTS: Record<string, string> = defaults as Record<string, string>

/**
 * Apply defaults to process.env for any key not already set.
 * Call this once at server startup (via instrumentation.ts).
 * Platform env vars (Vercel dashboard, Netlify dashboard) always take precedence.
 */
export function applyEnvDefaults(): void {
  for (const [key, value] of Object.entries(ENV_DEFAULTS)) {
    if (key.startsWith("_")) continue // skip JSON comments like "_comment"
    if (process.env[key] === undefined || process.env[key] === "") {
      process.env[key] = value
    }
  }
}
