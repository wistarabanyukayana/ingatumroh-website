import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import kvTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";

// R2-backed incremental cache so ISR/on-demand revalidation works on Workers.
// Public pages are served from this cache — never from the database.
// KV-backed tag cache: without this, revalidatePath()/revalidateTag() calls
// (see src/actions/*.ts) have nothing durable to record invalidation in, so
// they silently no-op and the R2 cache above is served stale forever.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  tagCache: kvTagCache,
});
