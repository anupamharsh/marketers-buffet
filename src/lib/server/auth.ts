import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Reads the signed-in user from the "Authorization: Bearer <token>" header.
 * The token is verified with Supabase Auth on every call.
 */
export async function getUser(req: Request): Promise<{ id: string; email: string | null } | null> {
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!token || !url || !anon) return null;
  const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}
