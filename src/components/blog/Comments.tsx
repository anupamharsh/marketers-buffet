"use client";

import { useId, useState, type FormEvent } from "react";
import { IconCheck } from "@/components/ui/Icons";

/** Comments: moderated. New comments go to a queue and appear after approval. */
export function Comments({ slug }: { slug: string }) {
  const id = useId();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<{ name?: string; text?: string; form?: string }>({});

  async function submit(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Add a name, or a nickname. Anything works.";
    if (text.trim().length < 2) errs.text = "Write a little more so others know what you mean.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: name.trim(), text: text.trim() }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
      setErrors({ form: "Something broke on our end. Try again in a moment." });
    }
  }

  return (
    <section aria-labelledby={`${id}-h`} className="card p-6 md:p-10">
      <h2 id={`${id}-h`} className="text-[clamp(1.75rem,3vw,2.4rem)] font-bold tracking-[-0.04em] text-ink">
        What do you <span className="serif serif-basil">think?</span>
      </h2>
      <p className="mt-2 text-slate">Comments are read before they go live. Be kind, be useful.</p>

      {state === "done" ? (
        <p role="status" className="mt-8 flex items-center gap-3 text-lg font-semibold tracking-[-0.02em] text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-basil text-cream">
            <IconCheck size={18} />
          </span>
          Thanks for adding your take.
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 grid gap-4">
          <div>
            <label htmlFor={`${id}-name`} className="mb-2 block text-sm font-semibold text-ink">
              Name
            </label>
            <input
              id={`${id}-name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              autoComplete="nickname"
              className="field max-w-sm"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${id}-name-err` : undefined}
            />
            {errors.name ? (
              <p id={`${id}-name-err`} className="mt-1.5 text-sm font-medium text-[#8f2d1f]">
                {errors.name}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={`${id}-text`} className="mb-2 block text-sm font-semibold text-ink">
              Your comment
            </label>
            <textarea
              id={`${id}-text`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={2000}
              placeholder="Drop your take…"
              className="field"
              aria-invalid={errors.text ? true : undefined}
              aria-describedby={errors.text ? `${id}-text-err` : undefined}
            />
            {errors.text ? (
              <p id={`${id}-text-err`} className="mt-1.5 text-sm font-medium text-[#8f2d1f]">
                {errors.text}
              </p>
            ) : null}
          </div>
          {errors.form ? (
            <p role="alert" className="text-sm font-medium text-[#8f2d1f]">
              {errors.form}
            </p>
          ) : null}
          <div>
            <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
              {state === "sending" ? "Posting…" : "Post comment"}
            </button>
          </div>
        </form>
      )}

      <p className="mt-10 border-t border-line pt-6 text-slate">No comments yet. Be the first to add your take.</p>
    </section>
  );
}
