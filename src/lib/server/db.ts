import "server-only";
import { Pool, type QueryResultRow } from "pg";

/*
 * One small connection pool per server instance, through Supabase's
 * transaction pooler (port 6543). Serverless functions are short-lived, so
 * the pooler keeps them from exhausting database connections.
 */
const g = globalThis as unknown as { __mbPool?: Pool };

function pool() {
  if (!g.__mbPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    g.__mbPool = new Pool({ connectionString, max: 3, idleTimeoutMillis: 10_000, ssl: { rejectUnauthorized: false } });
  }
  return g.__mbPool;
}

/** Parameterised query. Never interpolate values into the SQL string. */
export async function q<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []) {
  const res = await pool().query<T>(text, params);
  return res.rows;
}

export const dbConfigured = () => Boolean(process.env.DATABASE_URL);
