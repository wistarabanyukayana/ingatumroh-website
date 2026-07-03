import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client — used only inside /admin (login form, uploads).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
