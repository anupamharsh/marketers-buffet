"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "./Toaster";
import { Icon } from "./Icon";
import type { Kind } from "@/content/types";

/** Bookmark on every card. Saving needs sign-in; saved items show in Account › Saved. */
export function BookmarkButton({ kind, slug, title }: { kind: Kind; slug: string; title: string }) {
  const { isSaved, toggleSave } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const on = isSaved(kind, slug);

  return (
    <button
      type="button"
      className="icon-btn !h-9 !w-9"
      aria-pressed={on}
      aria-label={on ? `Remove "${title}" from saved` : `Save "${title}"`}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const r = await toggleSave(kind, slug);
        if (r === "signin") router.push(`/signin?next=${encodeURIComponent(path)}`);
        else toast(r === "saved" ? "Saved. Find it in your account." : "Removed from saved.");
      }}
    >
      <Icon name="bookmark" size={16} />
    </button>
  );
}
