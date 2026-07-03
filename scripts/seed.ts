// Phase 1 launch content. Run once: `node scripts/seed.ts`
// (Node 24 type-stripping; relative imports because aliases don't resolve
// outside the Next build.)
// Idempotent: bails if packages already exist. Placeholder values that staff
// MUST replace before real launch are marked [GANTI].

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  departures,
  packages,
  siteSettings,
  testimonials,
} from "../src/db/schema.ts";

process.loadEnvFile(new URL("../.env", import.meta.url).pathname);

// getDb() is bypassed: src/db/index.ts uses extensionless imports that
// Node's type-stripping can't resolve outside the Next build.
const db = drizzle(
  postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 }),
);

const existing = await db.select({ id: packages.id }).from(packages).limit(1);
if (existing.length) {
  console.log("Already seeded — nothing to do.");
  process.exit(0);
}

await db
  .insert(siteSettings)
  .values({
    id: 1,
    whatsappNumber: "6281234567890", // [GANTI] real WhatsApp number
    ppiuLicenseNo: "SK PPIU 64/2020",
    pihkLicenseNo: "SK PIHK 690/2020",
    legalEntity: "PT. Delta Laras Wisata",
    heroHeadline: "Ingat Allah, Ingat Umroh.",
    heroSubhead:
      "Berangkat ke Tanah Suci dengan tenang bersama travel berizin resmi Kemenag. Pembimbing berpengalaman, harga transparan, jadwal pasti.",
    contactEmail: "info@ingatumrah.id", // [GANTI]
    address: "Surabaya, Jawa Timur", // [GANTI] full office address
    socials: {},
  })
  .onConflictDoNothing();

const [hemat, reguler, thaif] = await db
  .insert(packages)
  .values([
    {
      name: "Umroh Hemat 9 Hari",
      slug: "umroh-hemat-9-hari",
      description:
        "Pilihan paling terjangkau tanpa mengurangi kekhusyukan ibadah. Hotel bintang 3 dengan akses shuttle ke Masjidil Haram dan Masjid Nabawi.",
      priceFrom: 28_500_000,
      durationDays: 9,
      airline: "Lion Air",
      hotelMakkah: "Al Kiswah Towers",
      hotelMakkahStars: 3,
      hotelMadinah: "Al Majeedi ARAC",
      hotelMadinahStars: 3,
      inclusions: [
        "Tiket pesawat PP",
        "Visa umroh",
        "Hotel bintang 3",
        "Makan 3x sehari",
        "Bus AC selama tur",
        "Muthawwif berbahasa Indonesia",
        "Air zamzam 5L",
        "Perlengkapan umroh",
      ],
      exclusions: [
        "Pembuatan paspor",
        "Suntik meningitis",
        "Pengeluaran pribadi",
      ],
      itinerary: [
        { day: 1, title: "Berangkat dari Jakarta (CGK)", description: "Kumpul di bandara, penerbangan menuju Jeddah." },
        { day: 2, title: "Umroh pertama", description: "Miqat, thawaf, sa'i, dan tahallul bersama pembimbing." },
        { day: 5, title: "Perjalanan ke Madinah", description: "Ziarah dan shalat di Masjid Nabawi." },
        { day: 9, title: "Kepulangan", description: "Penerbangan kembali ke Jakarta." },
      ],
      facilities: [],
      isFeatured: false,
      isPublished: true,
      sortOrder: 2,
    },
    {
      name: "Umroh Reguler 9 Hari",
      slug: "umroh-reguler-9-hari",
      description:
        "Paket paling seimbang: hotel bintang 4 dekat Masjidil Haram, penerbangan Saudia langsung, dan bimbingan penuh dari manasik hingga pulang.",
      priceFrom: 31_900_000,
      durationDays: 9,
      airline: "Saudia",
      hotelMakkah: "Sofwah Al Orjuwan",
      hotelMakkahStars: 4,
      hotelMadinah: "Durrat Al Eiman",
      hotelMadinahStars: 4,
      inclusions: [
        "Tiket pesawat PP",
        "Visa umroh",
        "Hotel bintang 4",
        "Makan 3x sehari",
        "Bus AC selama tur",
        "Muthawwif berbahasa Indonesia",
        "Air zamzam 5L",
        "Perlengkapan umroh",
      ],
      exclusions: [
        "Pembuatan paspor",
        "Suntik meningitis",
        "Pengeluaran pribadi",
      ],
      itinerary: [
        { day: 1, title: "Berangkat dari Jakarta (CGK)", description: "Penerbangan langsung Saudia menuju Jeddah." },
        { day: 2, title: "Umroh pertama", description: "Miqat, thawaf, sa'i, dan tahallul bersama pembimbing." },
        { day: 5, title: "Perjalanan ke Madinah", description: "Ziarah Raudhah dan shalat di Masjid Nabawi." },
        { day: 9, title: "Kepulangan", description: "City tour Jeddah, lalu penerbangan ke Jakarta." },
      ],
      facilities: [],
      isFeatured: true,
      isPublished: true,
      sortOrder: 1,
    },
    {
      name: "Umroh Plus Thaif 12 Hari",
      slug: "umroh-plus-thaif-12-hari",
      description:
        "Ibadah lebih lapang 12 hari dengan ziarah kota Thaif — kebun mawar, Masjid Abdullah bin Abbas, dan jejak perjalanan Rasulullah ﷺ.",
      priceFrom: 37_900_000,
      durationDays: 12,
      airline: "Garuda Indonesia",
      hotelMakkah: "Anjum Hotel Makkah",
      hotelMakkahStars: 4,
      hotelMadinah: "Frontel Al Harithia",
      hotelMadinahStars: 4,
      inclusions: [
        "Tiket pesawat PP",
        "Visa umroh",
        "Hotel bintang 4",
        "Makan 3x sehari",
        "Ziarah Thaif",
        "Muthawwif berbahasa Indonesia",
        "Air zamzam 5L",
        "Perlengkapan umroh",
      ],
      exclusions: [
        "Pembuatan paspor",
        "Suntik meningitis",
        "Pengeluaran pribadi",
      ],
      itinerary: [
        { day: 1, title: "Berangkat dari Jakarta (CGK)", description: "Penerbangan Garuda Indonesia menuju Jeddah." },
        { day: 2, title: "Umroh pertama", description: "Miqat, thawaf, sa'i, dan tahallul bersama pembimbing." },
        { day: 6, title: "Ziarah Thaif", description: "Perjalanan sehari ke Thaif: kebun mawar dan situs bersejarah." },
        { day: 8, title: "Perjalanan ke Madinah", description: "Ziarah Raudhah dan shalat di Masjid Nabawi." },
        { day: 12, title: "Kepulangan", description: "Penerbangan kembali ke Jakarta." },
      ],
      facilities: [],
      isFeatured: false,
      isPublished: true,
      sortOrder: 3,
    },
  ])
  .returning({ id: packages.id, name: packages.name });

if (!hemat || !reguler || !thaif) {
  throw new Error("package insert returned fewer rows than expected");
}

await db.insert(departures).values([
  { packageId: reguler.id, departDate: new Date("2026-08-12"), returnDate: new Date("2026-08-20"), quota: 45, status: "almost_full" },
  { packageId: hemat.id, departDate: new Date("2026-08-26"), returnDate: new Date("2026-09-03"), quota: 40, status: "open" },
  { packageId: reguler.id, departDate: new Date("2026-09-16"), returnDate: new Date("2026-09-24"), quota: 45, status: "open" },
  { packageId: thaif.id, departDate: new Date("2026-10-07"), returnDate: new Date("2026-10-18"), quota: 30, status: "open" },
  { packageId: reguler.id, departDate: new Date("2026-11-11"), returnDate: new Date("2026-11-19"), quota: 45, status: "open" },
  { packageId: thaif.id, departDate: new Date("2026-12-16"), returnDate: new Date("2026-12-27"), quota: 30, status: "open" },
]);

await db.insert(testimonials).values([
  {
    name: "H. Syamsul Arifin",
    quote:
      "Alhamdulillah, dari manasik sampai pulang semuanya terurus. Pembimbingnya sabar menuntun kami yang baru pertama kali umroh.",
    packageId: reguler.id,
    isPublished: true,
    sortOrder: 1,
  },
  {
    name: "Hj. Nurul Hidayati",
    quote:
      "Hotelnya benar-benar dekat dengan Masjidil Haram seperti yang dijanjikan. Tidak ada biaya tambahan yang mengejutkan.",
    packageId: reguler.id,
    isPublished: true,
    sortOrder: 2,
  },
  {
    name: "Ahmad Fauzi & keluarga",
    quote:
      "Berangkat bertiga dengan orang tua. Tim sangat membantu urusan kursi roda dan kebutuhan lansia. Sangat amanah.",
    packageId: hemat.id,
    isPublished: true,
    sortOrder: 3,
  },
]);

console.log("Seeded: site_settings, 3 packages, 6 departures, 3 testimonials.");
process.exit(0);
