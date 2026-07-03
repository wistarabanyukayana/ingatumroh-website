import { site, waLink } from "@/config/site";
import { getLandingData, type LandingData } from "@/lib/queries";

// Statically generated; refreshed via revalidatePath("/") from admin
// server actions. Never touches the database on a visitor request.
export const dynamic = "force-static";

type Settings = NonNullable<LandingData["settings"]>;
type Pkg = LandingData["packages"][number];
type Departure = LandingData["departures"][number];

const idr = (value: number, currency: string) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

const tanggal = (d: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);

// ponytail: FAQ is build-time copy — no faqs table yet. Move to the DB
// (new table + admin CRUD) the day staff need to edit it without a deploy.
const faqs = [
  {
    q: "Apakah travel ini resmi dan berizin?",
    a: "Ya. Kami beroperasi di bawah badan hukum resmi dengan izin PPIU (umroh) dan PIHK (haji khusus) dari Kementerian Agama RI. Nomor izin kami tercantum di halaman ini dan dapat diverifikasi melalui kanal resmi Kemenag.",
  },
  {
    q: "Bagaimana cara mendaftar?",
    a: "Cukup hubungi kami via WhatsApp. Tim kami akan membantu memilih paket, menjelaskan rincian biaya, dan memandu kelengkapan dokumen sampai Anda siap berangkat.",
  },
  {
    q: "Dokumen apa saja yang perlu disiapkan?",
    a: "Paspor dengan masa berlaku minimal 8 bulan, kartu vaksin meningitis, KTP, kartu keluarga, dan pas foto. Tim kami mendampingi seluruh proses pengurusannya.",
  },
  {
    q: "Apakah harga paket sudah termasuk semuanya?",
    a: "Harga sudah termasuk tiket pesawat PP, visa, hotel, konsumsi, transportasi di Tanah Suci, dan pembimbing. Rincian yang tidak termasuk (misalnya pembuatan paspor) dijelaskan transparan di setiap paket.",
  },
  {
    q: "Apakah ada bimbingan manasik sebelum berangkat?",
    a: "Ada. Setiap jamaah mengikuti manasik umroh bersama pembimbing berpengalaman sebelum keberangkatan, dan selama di Tanah Suci didampingi muthawwif berbahasa Indonesia.",
  },
];

function WaButton({
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

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.3-.4 0-.5.2-.8l.4-.5c.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2 0-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

// Isometric Kaaba cube — echoes the logo mark (gold roof, blue body,
// lime base arc). Pure SVG, no asset.
function KaabaMark() {
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

const Stars = ({ n }: { n: number | null }) =>
  n ? (
    <span className="text-brand-gold" aria-label={`hotel bintang ${n}`}>
      {"★".repeat(n)}
    </span>
  ) : null;

const statusLabel: Record<Departure["status"], string> = {
  open: "Tersedia",
  almost_full: "Hampir penuh",
  full: "Penuh",
  departed: "Berangkat",
  cancelled: "Dibatalkan",
};

export default async function Home() {
  const { settings, packages, departures, testimonials, gallery } =
    await getLandingData();

  // Content not seeded yet — keep the build green and the page honest.
  if (!settings) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-brand-blue px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold">{site.name}</h1>
        <p className="mt-4 max-w-md text-lg text-white/80">
          {site.description}
        </p>
      </main>
    );
  }

  const wa = settings.whatsappNumber;
  const nextDepartureByPkg = new Map<number, Departure>();
  for (const d of departures) {
    if (!nextDepartureByPkg.has(d.packageId)) {
      nextDepartureByPkg.set(d.packageId, d);
    }
  }

  return (
    <>
      <Header wa={wa} />
      <main id="beranda">
        <Hero settings={settings} />
        <TrustBar settings={settings} />
        <Packages packages={packages} nextDeparture={nextDepartureByPkg} wa={wa} />
        <Departures departures={departures} packages={packages} wa={wa} />
        <WhyUs />
        <Testimonials testimonials={testimonials} />
        <Gallery gallery={gallery} />
        <Faq />
        <ClosingCta wa={wa} />
      </main>
      <Footer settings={settings} />
      <JsonLd settings={settings} packages={packages} />
    </>
  );
}

function Header({ wa }: { wa: string }) {
  const nav = [
    ["Paket", "#paket"],
    ["Jadwal", "#jadwal"],
    ["Testimoni", "#testimoni"],
    ["FAQ", "#faq"],
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#beranda" className="flex items-center gap-2">
          <span className="size-8">
            <KaabaMark />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-brand-blue">
            {site.name}
          </span>
        </a>
        <nav className="hidden gap-6 text-sm font-medium text-ink/70 md:flex">
          {nav.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-brand-blue">
              {label}
            </a>
          ))}
        </nav>
        <WaButton
          number={wa}
          message="Assalamu'alaikum, saya ingin konsultasi paket umroh."
          className="!px-4 !py-2 text-sm"
        >
          Konsultasi
        </WaButton>
      </div>
    </header>
  );
}

function Hero({ settings }: { settings: Settings }) {
  return (
    <section className="relative overflow-hidden bg-brand-blue text-white">
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden size-105 -translate-y-1/2 opacity-15 lg:block">
        <KaabaMark />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-gold-light">
          Travel umroh berizin resmi Kemenag RI
        </p>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {settings.heroHeadline}
        </h1>
        {settings.heroSubhead && (
          <p className="mt-5 max-w-xl text-lg text-white/85">
            {settings.heroSubhead}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <WaButton
            number={settings.whatsappNumber}
            message="Assalamu'alaikum, saya ingin konsultasi paket umroh."
          >
            Konsultasi Gratis via WhatsApp
          </WaButton>
          <a
            href="#paket"
            className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Lihat Paket
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustBar({ settings }: { settings: Settings }) {
  return (
    <section className="border-b border-ink/5 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-sm text-ink/70 sm:px-6">
        <span className="font-semibold text-ink">
          <span className="text-brand-gold">✓</span> {settings.ppiuLicenseNo}
        </span>
        {settings.pihkLicenseNo && (
          <span className="font-semibold text-ink">
            <span className="text-brand-gold">✓</span>{" "}
            {settings.pihkLicenseNo}
          </span>
        )}
        <span>{settings.legalEntity}</span>
        {settings.partnerLogos.map((p) => (
          <span key={p.name} className="font-medium">
            {p.name}
          </span>
        ))}
      </div>
    </section>
  );
}

function Packages({
  packages,
  nextDeparture,
  wa,
}: {
  packages: Pkg[];
  nextDeparture: Map<number, Departure>;
  wa: string;
}) {
  if (!packages.length) return null;
  return (
    <section id="paket" className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Paket Umroh
        </h2>
        <p className="mt-2 max-w-xl text-ink/60">
          Harga transparan, fasilitas jelas. Semua paket sudah termasuk
          pembimbing dan muthawwif berbahasa Indonesia.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => {
            const next = nextDeparture.get(p.id);
            return (
              <article
                key={p.id}
                className={`flex flex-col rounded-2xl border bg-white p-6 ${
                  p.isFeatured
                    ? "border-brand-gold shadow-lg shadow-brand-gold/10"
                    : "border-ink/10"
                }`}
              >
                {p.isFeatured && (
                  <span className="mb-3 self-start rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-bold text-brand-gold">
                    Favorit Jamaah
                  </span>
                )}
                <h3 className="text-xl font-extrabold text-ink">{p.name}</h3>
                <p className="mt-1 text-sm text-ink/60">
                  {p.durationDays} hari{p.airline ? ` · ${p.airline}` : ""}
                </p>
                <p className="mt-4 text-2xl font-extrabold tabular-nums text-brand-blue">
                  {idr(p.priceFrom, p.currency)}
                  <span className="text-sm font-medium text-ink/50">
                    {" "}
                    / jamaah
                  </span>
                </p>
                <dl className="mt-4 space-y-1.5 text-sm text-ink/75">
                  {p.hotelMakkah && (
                    <div className="flex justify-between gap-2">
                      <dt>Makkah: {p.hotelMakkah}</dt>
                      <dd>
                        <Stars n={p.hotelMakkahStars} />
                      </dd>
                    </div>
                  )}
                  {p.hotelMadinah && (
                    <div className="flex justify-between gap-2">
                      <dt>Madinah: {p.hotelMadinah}</dt>
                      <dd>
                        <Stars n={p.hotelMadinahStars} />
                      </dd>
                    </div>
                  )}
                  {next && (
                    <div className="flex justify-between gap-2">
                      <dt>Keberangkatan terdekat</dt>
                      <dd className="font-semibold text-ink">
                        {tanggal(next.departDate)}
                      </dd>
                    </div>
                  )}
                </dl>
                {p.inclusions.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.inclusions.slice(0, 6).map((inc) => (
                      <li
                        key={inc}
                        className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink/70"
                      >
                        {inc}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-6 flex-1" />
                <WaButton
                  number={wa}
                  message={`Assalamu'alaikum, saya tertarik dengan paket ${p.name}. Mohon info selengkapnya.`}
                  className="w-full text-sm"
                >
                  Tanya Paket Ini
                </WaButton>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Departures({
  departures,
  packages,
  wa,
}: {
  departures: Departure[];
  packages: Pkg[];
  wa: string;
}) {
  if (!departures.length) return null;
  const pkgName = new Map(packages.map((p) => [p.id, p.name]));
  return (
    <section id="jadwal" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Jadwal Keberangkatan
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-140 text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-ink/50">
                <th className="py-3 pr-4 font-semibold">Tanggal</th>
                <th className="py-3 pr-4 font-semibold">Paket</th>
                <th className="py-3 pr-4 font-semibold">Kuota</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {departures.map((d) => (
                <tr key={d.id} className="border-b border-ink/5">
                  <td className="py-3 pr-4 font-semibold tabular-nums text-ink">
                    {tanggal(d.departDate)}
                  </td>
                  <td className="py-3 pr-4 text-ink/75">
                    {pkgName.get(d.packageId)}
                  </td>
                  <td className="py-3 pr-4 tabular-nums text-ink/75">
                    {d.quota} kursi
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        d.status === "almost_full"
                          ? "bg-brand-gold/15 text-brand-gold"
                          : "bg-brand-emerald/10 text-brand-emerald"
                      }`}
                    >
                      {statusLabel[d.status]}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <a
                      href={waLink(
                        wa,
                        `Assalamu'alaikum, saya ingin tanya jadwal umroh ${tanggal(d.departDate)} (${pkgName.get(d.packageId) ?? ""}).`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      Tanya →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    {
      title: "Berizin resmi",
      body: "Terdaftar di Kementerian Agama RI sebagai PPIU (umroh) dan PIHK (haji khusus) — legalitas dapat diverifikasi, bukan sekadar klaim.",
    },
    {
      title: "Pembimbing berpengalaman",
      body: "Manasik sebelum berangkat dan pendampingan muthawwif berbahasa Indonesia selama di Tanah Suci.",
    },
    {
      title: "Harga transparan",
      body: "Rincian biaya jelas di awal: yang termasuk dan yang tidak. Tanpa biaya tersembunyi.",
    },
  ];
  return (
    <section className="bg-brand-blue py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Kenapa jamaah memilih kami
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {items.map((it) => (
            <div key={it.title}>
              <h3 className="text-lg font-bold text-brand-gold-light">
                {it.title}
              </h3>
              <p className="mt-2 text-white/85">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials({
  testimonials,
}: {
  testimonials: LandingData["testimonials"];
}) {
  if (!testimonials.length) return null;
  return (
    <section id="testimoni" className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Kata Jamaah Kami
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="rounded-2xl border border-ink/10 bg-white p-6"
            >
              <blockquote className="text-ink/80">“{t.quote}”</blockquote>
              <figcaption className="mt-4 font-bold text-ink">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery({ gallery }: { gallery: LandingData["gallery"] }) {
  if (!gallery.length) return null;
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Galeri Perjalanan
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((g) => (
            // eslint-disable-next-line @next/next/no-img-element -- images.unoptimized; resized at upload time
            <img
              key={g.id}
              src={g.imageUrl}
              alt={g.caption ?? "Dokumentasi perjalanan umroh"}
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-ink/10 bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-ink">
                {f.q}
                <span className="faq-chevron text-brand-blue transition-transform">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCta({ wa }: { wa: string }) {
  return (
    <section className="bg-white py-16 text-center sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Ingat Allah, ingat umroh.
        </h2>
        <p className="mt-3 text-ink/60">
          Konsultasikan rencana keberangkatan Anda — gratis, tanpa komitmen.
        </p>
        <div className="mt-8">
          <WaButton
            number={wa}
            message="Assalamu'alaikum, saya ingin konsultasi rencana umroh."
          >
            Mulai Konsultasi
          </WaButton>
        </div>
      </div>
    </section>
  );
}

function Footer({ settings }: { settings: Settings }) {
  const socials = Object.entries(settings.socials) as [string, string][];
  return (
    <footer className="bg-ink py-12 text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="text-lg font-extrabold text-white">{site.name}</p>
          <p className="mt-2 text-sm">{settings.legalEntity}</p>
          <p className="mt-1 text-sm">{settings.ppiuLicenseNo}</p>
          {settings.pihkLicenseNo && (
            <p className="mt-1 text-sm">{settings.pihkLicenseNo}</p>
          )}
        </div>
        <div className="text-sm">
          <p className="font-bold text-white">Kontak</p>
          {settings.address && <p className="mt-2">{settings.address}</p>}
          {settings.contactPhone && <p className="mt-1">{settings.contactPhone}</p>}
          {settings.contactEmail && <p className="mt-1">{settings.contactEmail}</p>}
        </div>
        <div className="text-sm">
          <p className="font-bold text-white">Media Sosial</p>
          <ul className="mt-2 space-y-1">
            {socials.map(([name, url]) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize hover:text-white"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {settings.legalEntity}. Hak cipta
        dilindungi.
      </p>
    </footer>
  );
}

function JsonLd({
  settings,
  packages,
}: {
  settings: Settings;
  packages: Pkg[];
}) {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: site.name,
      legalName: settings.legalEntity,
      description: site.description,
      url: site.url,
      telephone: settings.contactPhone ?? undefined,
      address: settings.address ?? undefined,
      makesOffer: packages.map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: p.priceFrom,
        priceCurrency: p.currency,
        availability: "https://schema.org/InStock",
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
