import { waLink } from "@/config/site";

// Shared WhatsApp CTA primitives. Every CTA goes through waLink() with the
// number from site_settings — never hardcode the number (AGENTS.md #5).

export function WaIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.2-.8l.4-.5c.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

export function WaButton({
  number,
  message,
  children,
  className = "",
}: {
  number: string;
  message: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={waLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand-emerald px-6 py-3 font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-emerald ${className}`}
    >
      <WaIcon />
      {children}
    </a>
  );
}

// Floating action button — always within thumb reach on mobile, where the
// header CTA has scrolled away.
export function WaFab({ number }: { number: string }) {
  return (
    <a
      href={waLink(number, "Assalamu'alaikum, saya ingin konsultasi rencana umroh.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Konsultasi via WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center justify-center rounded-full bg-[#25d366] p-3.5 text-white shadow-lg shadow-ink/25 transition-transform hover:scale-110 active:scale-95"
    >
      <WaIcon className="size-6" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
        Tanya kami di WhatsApp
      </span>
    </a>
  );
}
