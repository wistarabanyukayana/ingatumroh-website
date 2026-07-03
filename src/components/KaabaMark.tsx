// Isometric Kaaba cube — echoes the logo mark (gold roof, blue body,
// lime base arc). Pure SVG, no asset. Shared by the public page and admin.
export function KaabaMark() {
  return (
    <svg viewBox="0 0 200 200" className="size-full" aria-hidden>
      <ellipse cx="100" cy="168" rx="78" ry="18" fill="none" stroke="#8bc53f" strokeWidth="7" opacity="0.9" />
      <path d="M100 30 160 62 100 94 40 62Z" fill="#f5a623" />
      <path d="M40 62v58l60 32V94Z" fill="#0f2f73" />
      <path d="M160 62v58l-60 32V94Z" fill="#143c85" />
      <path d="M40 76l60 32v12L40 88Zm120 0v12l-60 32v-12Z" fill="#e8c14a" />
    </svg>
  );
}
