// Creates or updates the database tables. Run: npm run db:migrate
// Uses DATABASE_URL_MIGRATE (session pooler) from .env.local.
import fs from "node:fs";
import pg from "pg";

const url = process.env.DATABASE_URL_MIGRATE;
if (!url) {
  console.error("DATABASE_URL_MIGRATE is missing. Add it to .env.local.");
  process.exit(1);
}
const sql = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  await client.query(sql);
  const { rows } = await client.query("select table_name from information_schema.tables where table_schema = 'mb' order by 1");
  console.log("Schema up to date. Tables:", rows.map((r) => r.table_name).join(", "));
} finally {
  await client.end();
}
