import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// R2-backed incremental cache so ISR/on-demand revalidation works on Workers.
// Public pages are served from this cache — never from the database.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
