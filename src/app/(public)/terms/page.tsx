import Link from "next/link";

import { site, waLink } from "@/config/site";
import { getLandingData } from "@/lib/queries";

export const dynamic = "force-static";

export const metadata = {
  title: "Syarat dan Ketentuan",
  description: `Syarat dan ketentuan layanan ${site.name}.`,
};

export default async function TermsPage() {
  const { settings } = await getLandingData();

  if (!settings) throw new Error("Missing site settings");

  const whatsappHref = waLink(
    settings.whatsappNumber,
    "Assalamu'alaikum, saya ingin bertanya tentang syarat dan ketentuan layanan.",
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
            Syarat dan Ketentuan
          </h1>
          <p className="mt-3 text-sm text-ink/55">
            Terakhir diperbarui: 4 Juli 2026
          </p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-ink/75">
            <section>
              <h2 className="text-lg font-bold text-ink">Tentang layanan</h2>
              <p className="mt-2">
                {site.name} adalah layanan informasi, konsultasi, dan
                pendaftaran perjalanan umroh yang diselenggarakan oleh{" "}
                {settings.legalEntity}. Informasi paket pada website digunakan
                sebagai referensi awal dan dapat berubah mengikuti ketersediaan
                maskapai, hotel, visa, dan kebijakan terkait.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Konsultasi dan pemesanan
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Konsultasi dilakukan melalui WhatsApp atau kanal resmi yang tercantum pada website.</li>
                <li>Pemesanan dianggap diproses setelah calon jamaah memberikan data yang dibutuhkan dan mengikuti instruksi administrasi dari staf kami.</li>
                <li>Website ini tidak memproses pembayaran online. Instruksi pembayaran diberikan langsung oleh staf resmi.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Harga, fasilitas, dan jadwal
              </h2>
              <p className="mt-2">
                Harga, fasilitas, hotel, maskapai, kuota, dan tanggal
                keberangkatan dapat berubah sebelum konfirmasi akhir. Kami akan
                menyampaikan informasi terbaru kepada calon jamaah sebelum
                proses pendaftaran dilanjutkan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Dokumen dan kewajiban jamaah
              </h2>
              <p className="mt-2">
                Jamaah bertanggung jawab memberikan data yang benar, lengkap,
                dan masih berlaku. Keterlambatan atau ketidaksesuaian dokumen
                dapat memengaruhi proses visa, tiket, hotel, atau keberangkatan.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Perubahan dan pembatalan
              </h2>
              <p className="mt-2">
                Ketentuan perubahan jadwal, penggantian paket, pembatalan, dan
                pengembalian dana mengikuti perjanjian pemesanan serta kebijakan
                pihak terkait seperti maskapai, hotel, penyedia visa, dan mitra
                operasional.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">
                Batas tanggung jawab
              </h2>
              <p className="mt-2">
                Kami berupaya menjaga informasi website tetap akurat, tetapi
                keputusan perjalanan sebaiknya mengacu pada konfirmasi terbaru
                dari staf resmi. Kami tidak bertanggung jawab atas gangguan yang
                berada di luar kendali wajar kami, termasuk perubahan regulasi,
                kondisi cuaca, kebijakan penerbangan, atau keadaan darurat.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Perizinan</h2>
              <p className="mt-2">
                Informasi legal layanan: PPIU {settings.ppiuLicenseNo} dan PIHK{" "}
                {settings.pihkLicenseNo}. Detail legal juga dapat dikonfirmasi
                melalui kontak resmi kami.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-ink">Kontak</h2>
              <p className="mt-2">
                Pertanyaan terkait syarat layanan dapat dikirim melalui{" "}
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
