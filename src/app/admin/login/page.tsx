import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { KaabaMark } from "@/components/KaabaMark";
import { site } from "@/config/site";
import { createClient } from "@/lib/supabase/server";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Masuk Admin" };

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="size-14">
            <KaabaMark />
          </span>
          <h1 className="text-xl font-extrabold tracking-tight text-brand-blue">
            {site.name}
          </h1>
          <p className="text-sm text-ink/60">
            Masuk untuk mengelola konten website.
          </p>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
