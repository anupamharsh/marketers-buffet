"use client";

import { IconSearch, IconClose } from "./Icons";

export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
      {options.map((o) => (
        <button key={o.id} type="button" className="chip shrink-0" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
          {typeof o.count === "number" ? <span className="ml-1.5 text-xs opacity-60">{o.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  id,
  value,
  onChange,
  placeholder,
  label,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <IconSearch size={19} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field !min-h-[56px] rounded-full !pl-13 !pr-12 text-[1.02rem] font-medium shadow-[var(--shadow-card)]"
        style={{ paddingLeft: "3.25rem" }}
        autoComplete="off"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-slate hover:bg-ink/5"
          aria-label="Clear search"
        >
          <IconClose size={18} />
        </button>
      ) : null}
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field !min-h-11 w-auto cursor-pointer rounded-full !py-0 pr-9 text-[0.95rem] font-medium"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="card col-span-full grid place-items-center gap-4 px-6 py-20 text-center">
      <p className="text-2xl font-bold tracking-[-0.03em] text-ink">Nothing here yet.</p>
      <p className="text-slate">Try another word, or browse everything.</p>
      <button type="button" onClick={onReset} className="btn btn-ghost btn-sm">
        Browse everything
      </button>
    </div>
  );
}
