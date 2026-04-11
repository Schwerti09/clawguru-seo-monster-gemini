import type { OpenNextConfig } from "@opennextjs/cloudflare";

// Minimal OpenNext config for Cloudflare Workers.
// Uses the default cloudflare-node wrapper which supports
// `export const runtime = "nodejs"` routes via nodejs_compat_v2.
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      // Disable ISR/cache features not supported on CF Workers free tier.
      // Switch to "r2-incremental-cache" when using R2 bucket binding.
      tagCache: "dummy",
      queue: "dummy",
      incrementalCache: "dummy",
    },
  },
};

export default config;
