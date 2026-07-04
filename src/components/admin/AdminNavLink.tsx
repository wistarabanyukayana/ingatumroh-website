"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Nav pill that highlights the section the admin is currently in.
export function AdminNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
        active
          ? "bg-brand-blue/10 font-semibold text-brand-blue"
          : "hover:bg-brand-blue/5 hover:text-brand-blue"
      }`}
    >
      {children}
    </Link>
  );
}
