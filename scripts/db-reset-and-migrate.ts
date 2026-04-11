/**
 * Drops and recreates `public` (all data lost), then runs drizzle-kit migrate.
 * Use when migration history and the live schema are out of sync.
 */
import { execSync } from "node:child_process";
import { config } from "dotenv";
import { Pool } from "@neondatabase/serverless";

config({ path: ".env" });
config({ path: ".env.local", override: true });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not set (.env or .env.local).");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: url });
  try {
    console.warn("Resetting public and drizzle schemas (all data will be deleted)...");
    await pool.query("DROP SCHEMA IF EXISTS drizzle CASCADE");
    await pool.query("DROP SCHEMA IF EXISTS public CASCADE");
    await pool.query("CREATE SCHEMA public");
    await pool.query("GRANT ALL ON SCHEMA public TO public");
    console.warn("Running migrations…");
  } finally {
    await pool.end();
  }

  execSync("pnpm run db:migrate", { stdio: "inherit", cwd: process.cwd() });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
