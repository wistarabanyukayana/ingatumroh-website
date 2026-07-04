"use server";

import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, message: "Email atau kata sandi salah." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// Server Actions can write cookies (Server Components can't) — this is how
// the Supabase session cookie gets refreshed now that there's no middleware.
export async function refreshAdminSession() {
  const supabase = await createClient();
  await supabase.auth.getUser();
}
