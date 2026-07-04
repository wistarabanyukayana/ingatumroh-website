import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

// Shared result shape for all admin server actions (useActionState).
export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
} | null;

// Invariant 4a: every admin mutation verifies the Supabase Auth session.
// Throws on unauthenticated calls — actions are only reachable from /admin,
// so this is a backstop, not a UX path.
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function fieldErrorsFrom(error: z.ZodError): ActionState {
  const flat = z.flattenError(error);
  const fieldErrors: Record<string, string[]> = {};
  const formErrors: string[] = [];

  for (const issue of error.issues) {
    const key = issue.path.join(".");

    if (!key) {
      formErrors.push(issue.message);
      continue;
    }

    fieldErrors[key] ??= [];
    fieldErrors[key].push(issue.message);
  }

  const firstIssue = error.issues[0];
  const firstPath = firstIssue?.path.join(".");
  const firstMessage = firstIssue
    ? [firstPath, firstIssue.message].filter(Boolean).join(": ")
    : null;

  return {
    ok: false,
    message: firstMessage
      ? `Periksa kembali isian: ${firstMessage}`
      : formErrors[0]
        ? `Periksa kembali isian: ${formErrors[0]}`
      : "Periksa kembali isian yang ditandai.",
    fieldErrors: {
      ...(flat.fieldErrors as Record<string, string[]>),
      ...fieldErrors,
    },
  };
}

// --- FormData coercion helpers (HTML forms are stringly-typed) ---

export const str = (fd: FormData, key: string) =>
  String(fd.get(key) ?? "").trim();

export const strOrNull = (fd: FormData, key: string) => {
  const v = str(fd, key);
  return v === "" ? null : v;
};

export const num = (fd: FormData, key: string) => Number(str(fd, key));

export const numOrNull = (fd: FormData, key: string) => {
  const v = str(fd, key);
  return v === "" ? null : Number(v);
};

export const bool = (fd: FormData, key: string) => fd.get(key) === "on";

// Textarea "one item per line" → string[].
export const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

// Textarea "day | title | description" per line → itinerary shape.
// Zod (itineraryDaySchema) does the real validation.
export const itineraryLines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const [day, title, ...rest] = line.split("|").map((s) => s.trim());
      return {
        day: Number(day),
        title: title ?? "",
        description: rest.join(" | "),
      };
    });
