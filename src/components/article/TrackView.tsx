"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { track } from "@/lib/analytics";
import type { Kind } from "@/content/types";

/** Read event for analytics, plus Account › Recently viewed when signed in. */
export function TrackView({ kind, slug, title }: { kind: Kind; slug: string; title: string }) {
  const { session, api } = useAuth();
  useEffect(() => {
    if (kind !== "templates") track({ event: "post_read", post_title: title, kind });
  }, [kind, title]);
  useEffect(() => {
    if (!session) return;
    api("/api/me/views", { method: "POST", body: JSON.stringify({ kind, slug }) }).catch(() => {});
  }, [session, api, kind, slug]);
  return null;
}
