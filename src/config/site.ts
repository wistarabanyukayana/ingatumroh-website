// Build-time brand constants. Anything staff should edit without a deploy
// (WhatsApp number, license number, hero copy, contacts) lives in the
// site_settings table instead — never here.

// NOTE: the logo asset reads "Ingatumrah.id" while the brief said
// "Ingatumroh" — using the logo spelling for user-facing copy. Single
// constant; flip here if the final brand differs.
export const site = {
  name: "Ingatumrah.id",
  description:
    "Perjalanan umroh yang tenang, amanah, dan berizin resmi. Konsultasi gratis via WhatsApp.",
  locale: "id-ID",
} as const;

// Every CTA routes through this — WhatsApp-first lead capture.
// `number`: digits only, international format without "+" (from site_settings).
export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
