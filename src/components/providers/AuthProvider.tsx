"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-browser";
import type { Kind } from "@/content/types";

type Ctx = {
  session: Session | null;
  ready: boolean;
  email: string | null;
  isSaved: (kind: Kind, slug: string) => boolean;
  toggleSave: (kind: Kind, slug: string) => Promise<"saved" | "removed" | "signin">;
  api: (path: string, init?: RequestInit) => Promise<Response>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);
export const useAuth = () => useContext(AuthCtx)!;

/** Random per-browser id used as the "device" half of the rate limit. */
function ensureDeviceId() {
  if (document.cookie.includes("mb_did=")) return;
  const id = crypto.randomUUID();
  document.cookie = `mb_did=${id}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    ensureDeviceId();
    const sb = supabase();
    if (!sb) {
      setReady(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const api = useCallback(
    (path: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      if (!headers.has("content-type") && init.body) headers.set("content-type", "application/json");
      if (session?.access_token) headers.set("authorization", `Bearer ${session.access_token}`);
      return fetch(path, { ...init, headers });
    },
    [session],
  );

  // Load saved items once signed in.
  useEffect(() => {
    if (!session) {
      setSaved(new Set());
      return;
    }
    api("/api/me/bookmarks")
      .then((r) => (r.ok ? r.json() : { bookmarks: [] }))
      .then((d: { bookmarks: { kind: string; slug: string }[] }) => setSaved(new Set(d.bookmarks.map((b) => `${b.kind}:${b.slug}`))))
      .catch(() => {});
  }, [session, api]);

  const value = useMemo<Ctx>(
    () => ({
      session,
      ready,
      email: session?.user.email ?? null,
      isSaved: (k, s) => saved.has(`${k}:${s}`),
      toggleSave: async (kind, slug) => {
        if (!session) return "signin";
        const key = `${kind}:${slug}`;
        const was = saved.has(key);
        const next = new Set(saved);
        if (was) next.delete(key);
        else next.add(key);
        setSaved(next);
        const r = await api("/api/me/bookmarks", { method: was ? "DELETE" : "POST", body: JSON.stringify({ kind, slug }) });
        if (!r.ok) setSaved(saved);
        return was ? "removed" : "saved";
      },
      api,
      signOut: async () => {
        await supabase()?.auth.signOut();
        setSession(null);
      },
    }),
    [session, ready, saved, api],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
