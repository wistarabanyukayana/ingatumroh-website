import Link from "next/link";

import { KaabaMark } from "@/components/KaabaMark";
import { Reveal } from "@/components/Reveal";
import { SiteHeader } from "@/components/SiteHeader";
import { WaButton, WaFab } from "@/components/Wa";
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
// The legality answer names the operating entity so customers aren't
// surprised when documents/visas carry that name instead of the brand.
const buildFaqs = (legalEntity: string) => [
  {
    q: "Apakah travel ini resmi dan berizin?",
    a: `Ya. ${site.name} adalah layanan umroh yang diselenggarakan oleh ${legalEntity}, pemegang izin PPIU (umroh) dan PIHK (haji khusus) dari Kementerian Agama RI. Nama tersebut yang akan Anda temui pada dokumen resmi keberangkatan — layanan dan pendampingan Anda tetap bersama ${site.name}. Nomor izin tercantum di halaman ini dan dapat diverifikasi melalui kanal resmi Kemenag.`,
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

type FaqItem = ReturnType<typeof buildFaqs>[number];

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

// Shared section header: gold kicker eyebrow → headline → lead.
function SectionHeading({
  kicker,
  title,
  lead,
  dark = false,
}: {
  kicker: string;
  title: string;
  lead?: string;
  dark?: boolean;
}) {
  return (
    <Reveal>
      <p className="kicker">{kicker}</p>
      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {lead && (
        <p className={`mt-3 max-w-xl ${dark ? "text-white/80" : "text-ink/60"}`}>
          {lead}
        </p>
      )}
    </Reveal>
  );
}

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
  const faqs = buildFaqs(settings.legalEntity);
  const nextDepartureByPkg = new Map<number, Departure>();
  for (const d of departures) {
    if (!nextDepartureByPkg.has(d.packageId)) {
      nextDepartureByPkg.set(d.packageId, d);
    }
  }

  return (
    <>
      <SiteHeader wa={wa} />
      <main id="beranda">
        <Hero settings={settings} />
        <TrustBar settings={settings} />
        <Packages
          packages={packages}
          nextDeparture={nextDepartureByPkg}
          wa={wa}
        />
        <Departures departures={departures} packages={packages} wa={wa} />
        <WhyUs />
        <Testimonials testimonials={testimonials} />
        <Gallery gallery={gallery} />
        <Faq faqs={faqs} />
        <ClosingCta wa={wa} />
      </main>
      <Footer settings={settings} />
      <WaFab number={wa} />
      <JsonLd settings={settings} packages={packages} faqs={faqs} />
    </>
  );
}

function Hero({ settings }: { settings: Settings }) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-brand-blue to-brand-blue-deep text-white">
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden size-105 -translate-y-1/2 opacity-15 lg:block">
        <KaabaMark />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <p className="mb-5 inline-block rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-gold-light">
            Travel umroh berizin resmi Kemenag RI
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="max-w-2xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {settings.heroHeadline}
          </h1>
        </Reveal>
        {settings.heroSubhead && (
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              {settings.heroSubhead}
            </p>
          </Reveal>
        )}
        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
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
        </Reveal>
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
        <span className="text-xs text-ink/45">
          Izin atas nama {settings.legalEntity}
        </span>
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
    <section id="paket" className="scroll-mt-16 bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Paket"
          title="Paket Umroh"
          lead="Harga transparan, fasilitas jelas. Semua paket sudah termasuk pembimbing dan muthawwif berbahasa Indonesia."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((p, i) => {
            const next = nextDeparture.get(p.id);
            return (
              <Reveal key={p.id} delay={(i % 3) * 100} className="h-full">
                <article
                  className={`flex h-full flex-col rounded-2xl border bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10 ${
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
              </Reveal>
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
    <section id="jadwal" className="scroll-mt-16 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Jadwal"
          title="Jadwal Keberangkatan"
          lead="Kursi setiap keberangkatan terbatas — amankan tanggal Anda lebih awal."
        />
        <Reveal delay={100}>
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
                  <tr
                    key={d.id}
                    className="border-b border-ink/5 transition-colors hover:bg-surface/60"
                  >
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
        </Reveal>
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
        <SectionHeading
          kicker="Keunggulan"
          title="Kenapa jamaah memilih kami"
          dark
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100} className="h-full">
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-bold text-brand-gold-light">
                  {it.title}
                </h3>
                <p className="mt-2 text-white/85">{it.body}</p>
              </div>
            </Reveal>
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
    <section id="testimoni" className="scroll-mt-16 bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading kicker="Testimoni" title="Kata Jamaah Kami" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 100} className="h-full">
              <figure className="h-full rounded-2xl border border-ink/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5">
                <span
                  aria-hidden
                  className="block text-5xl font-extrabold leading-none text-brand-gold/50"
                >
                  “
                </span>
                <blockquote className="mt-1 text-ink/80">{t.quote}</blockquote>
                <figcaption className="mt-4 font-bold text-ink">
                  {t.name}
                </figcaption>
              </figure>
            </Reveal>
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
        <SectionHeading kicker="Galeri" title="Galeri Perjalanan" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {gallery.map((g, i) => (
            <Reveal key={g.id} delay={(i % 4) * 80}>
              <figure className="group relative overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- images.unoptimized; resized at upload time */}
                <img
                  src={g.imageUrl}
                  alt={g.caption ?? "Dokumentasi perjalanan umroh"}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {g.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/70 to-transparent px-3 pb-2 pt-8 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {g.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section id="faq" className="scroll-mt-16 bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          kicker="FAQ"
          title="Pertanyaan yang Sering Diajukan"
        />
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-ink/10 bg-white px-5 py-4 transition-colors open:border-brand-blue/30 hover:border-brand-blue/30"
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
    <section className="relative overflow-hidden bg-brand-blue-deep py-20 text-center text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-125 -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
      >
        <KaabaMark />
      </div>
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        <Reveal>
          <p className="kicker">Mulai Perjalanan</p>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ingat Allah, ingat umroh.
          </h2>
          <p className="mt-3 text-white/75">
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
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_0.9fr_0.8fr]">
        <div>
          <p className="text-xl font-extrabold tracking-tight">{site.name}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
            Layanan perjalanan umroh yang dikelola oleh {settings.legalEntity}
            dengan pendampingan administrasi, manasik, dan keberangkatan yang
            jelas.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-white/80">
            <span className="rounded-full border border-white/15 px-3 py-1">
              PPIU {settings.ppiuLicenseNo}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1">
              PIHK {settings.pihkLicenseNo}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/45">
            Kantor
          </h2>
          <div className="mt-4 space-y-2 text-sm leading-6 text-white/70">
            {settings.address && <p>{settings.address}</p>}
            {settings.contactPhone && <p>{settings.contactPhone}</p>}
            {settings.contactEmail && <p>{settings.contactEmail}</p>}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/45">
            Konsultasi
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Butuh jadwal, estimasi biaya, atau pilihan hotel? Tim kami siap
            bantu lewat WhatsApp.
          </p>
          <a
            href={waLink(
              settings.whatsappNumber,
              "Assalamu'alaikum, saya ingin konsultasi rencana umroh.",
            )}
            className="mt-5 inline-flex rounded-full bg-brand-gold px-5 py-2.5 text-sm font-bold text-ink transition hover:brightness-105"
          >
            Hubungi WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {site.name}. Semua hak dilindungi.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-white">
              Syarat dan Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function JsonLd({
  settings,
  packages,
  faqs,
}: {
  settings: Settings;
  packages: Pkg[];
  faqs: FaqItem[];
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
