import Link from "next/link";

import { site, waLink } from "@/config/site";
import { getLandingData } from "@/lib/queries";

export const dynamic = "force-static";

export const metadata = {
  title: "Kebijakan Privasi",
  description: `Kebijakan privasi ${site.name} untuk calon jamaah dan pelanggan.`,
};

export default async function PrivacyPage() {
  const { settings } = await getLandingData();

  if (!settings) throw new Error("Missing site settings");

  const whatsappHref = waLink(
    settings.whatsappNumber,
    "Assalamu'alaikum, saya ingin bertanya tentang kebijakan privasi.",
  );

  return (
    <main className="bg-surface">
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <Link
          href="/"
          className="text-sm font-semibold text-brand-blue hover:underline"
        >
          Kembali ke beranda
        </Link>

        <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-gold">
            {site.name}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Kebijakan Privasi
          </h1>
          <p className="mt-3 text-sm text-ink/55">
            Terakhir diperbarui: 4 Juli 2026
          </p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-ink/75">
            <section>
              <h2 className="text-lg font-bold text-ink">Ringkasan</h2>
              <p className="mt-2">
                Kebijakan ini menjelaskan bagaimana {site.name}, layanan umroh
                yang diselenggarakan oleh {settings.legalEntity}, mengumpulkan,
                menggunakan, menyimpan, dan melindungi data calon jamaah.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Data yang kami kumpulkan
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Nama, nomor telepon, email, dan alamat.</li>
                <li>Preferensi perjalanan, paket, tanggal keberangkatan, dan jumlah jamaah.</li>
                <li>Dokumen perjalanan atau administrasi yang diperlukan untuk pendaftaran umroh.</li>
                <li>Riwayat percakapan atau permintaan yang dikirim melalui WhatsApp, formulir, atau kanal resmi kami.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Cara kami menggunakan data
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Menjawab konsultasi dan menyiapkan rekomendasi paket.</li>
                <li>Memproses pendaftaran, administrasi perjalanan, manasik, dan keberangkatan.</li>
                <li>Menghubungi jamaah terkait perubahan jadwal, dokumen, atau kebutuhan layanan.</li>
                <li>Memenuhi kewajiban hukum, perizinan, dan pelaporan yang berlaku.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Penyimpanan dan keamanan
              </h2>
              <p className="mt-2">
                Data disimpan pada sistem yang digunakan untuk operasional
                layanan dan hanya dapat diakses oleh staf yang membutuhkan data
                tersebut untuk membantu proses perjalanan. Kami tidak menjual
                data pribadi jamaah kepada pihak ketiga.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Berbagi data dengan pihak terkait
              </h2>
              <p className="mt-2">
                Untuk menjalankan perjalanan umroh, sebagian data dapat
                dibagikan kepada pihak yang relevan seperti maskapai, hotel,
                penyedia visa, pembimbing perjalanan, otoritas pemerintah, atau
                mitra operasional lain sesuai kebutuhan layanan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Hak jamaah</h2>
              <p className="mt-2">
                Jamaah dapat meminta koreksi, pembaruan, atau penghapusan data
                pribadi sepanjang tidak bertentangan dengan kewajiban hukum,
                administrasi, atau arsip transaksi yang wajib kami simpan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Kontak</h2>
              <p className="mt-2">
                Pertanyaan terkait privasi dapat dikirim melalui{" "}
                <a className="font-semibold text-brand-blue" href={whatsappHref}>
                  WhatsApp
                </a>
                {settings.contactEmail ? ` atau email ${settings.contactEmail}` : ""}.
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
