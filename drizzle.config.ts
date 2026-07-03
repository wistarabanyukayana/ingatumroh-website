import { defineConfig } from "drizzle-kit";

// Node 21+ native .env loader; .env may not exist yet (e.g. `db:generate`
// works offline).
try {
  process.loadEnvFile(".env");
} catch {
  // no .env — fine for offline commands
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
