import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

// DB access happens only in admin server actions and at build/revalidation
// time — never on public page requests.
//
// A fresh client per call because Workers forbid sharing sockets across
// requests. `prepare: false` + the Supabase transaction pooler (port 6543)
// are required on workerd.
// ponytail: connection-per-call; pool/cache per-request if admin traffic
// ever makes this noticeable.
export function getDb() {
  const client = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
  });
  return drizzle(client, { schema });
}
