import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal OpenNext config for Cloudflare Workers (nodejs_compat_v2).
// Uses dummy cache/queue overrides — switch to r2-incremental-cache / KV
// when R2 / KV bindings are configured in the Cloudflare Dashboard.
export default defineCloudflareConfig({
  incrementalCache: "dummy",
  tagCache: "dummy",
  queue: "dummy",
});
