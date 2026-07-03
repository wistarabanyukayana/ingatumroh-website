"use client";

import { useFormStatus } from "react-dom";

// Small form kit shared by all admin forms — one visual language.

export const inputClass =
  "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink focus:outline-2 focus:outline-offset-1 focus:outline-brand-blue disabled:opacity-50";

export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-ink/60"
    >
      {children}
    </label>
  );
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function Field({
  label,
  name,
  errors,
  hint,
  children,
}: {
  label: string;
  name: string;
  errors?: string[];
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
      <FieldError errors={errors} />
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
    >
      {pending ? "Menyimpan…" : children}
    </button>
  );
}

export function StatusMessage({
  state,
}: {
  state: { ok: boolean; message: string } | null;
}) {
  if (!state?.message) return null;
  return (
    <p
      className={`rounded-lg px-4 py-2.5 text-sm font-medium ${
        state.ok
          ? "bg-brand-emerald/10 text-brand-emerald"
          : "bg-red-50 text-red-700"
      }`}
    >
      {state.message}
    </p>
  );
}

// Delete with a native confirm — used inside a server-action <form>.
export function ConfirmSubmit({
  children,
  confirmText,
  className,
}: {
  children: React.ReactNode;
  confirmText: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className={
        className ??
        "text-sm font-semibold text-red-600 hover:underline"
      }
    >
      {children}
    </button>
  );
}
