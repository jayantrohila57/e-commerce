import { Pool } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
config({ path: ".env.local", override: true });

async function main() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL! });
  const context = await p.query("select current_user, current_schema(), current_setting('search_path') as search_path");
  console.log("context", context.rows);

  const migrationTables = await p.query(
    `select schemaname, tablename
     from pg_tables
     where tablename = '__drizzle_migrations'
     order by schemaname`,
  );
  console.log("migrationTables", migrationTables.rows);

  const tables = await p.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename");
  console.log("tables", tables.rows);
  const mig = await p
    .query("SELECT id, hash, created_at FROM drizzle.__drizzle_migrations")
    .catch(() => ({ rows: [] as unknown[] }));
  console.log("migrations", mig.rows);
  await p.end();
}

main();
