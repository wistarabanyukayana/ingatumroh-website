"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { refreshAdminSession } from "@/actions/auth";

// Server Components can't write cookies, so the Supabase auth token can't
// refresh itself while browsing /admin. This pings a Server Action (which
// can write cookies) on every navigation to keep the session alive — the
// job proxy.ts used to do before it was removed (unsupported on Cloudflare).
export function AdminSessionRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    void refreshAdminSession();
  }, [pathname]);

  return null;
}
