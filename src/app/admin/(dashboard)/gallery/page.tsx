import { asc } from "drizzle-orm";

import { deleteGalleryImage, toggleGalleryImage } from "@/actions/gallery";
import { ConfirmSubmit } from "@/components/admin/ui";
import { getDb } from "@/db";
import { galleryImages } from "@/db/schema";

import { GalleryUploadForm } from "./GalleryUploadForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Galeri" };

export default async function GalleryPage() {
  const rows = await getDb()
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        Galeri Perjalanan
      </h1>

      <div className="rounded-2xl border border-ink/10 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink/50">
          Tambah foto
        </h2>
        <GalleryUploadForm />
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center text-sm text-ink/50">
          Belum ada foto di galeri.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {rows.map((g) => (
            <div
              key={g.id}
              className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- images.unoptimized */}
              <img
                src={g.imageUrl}
                alt={g.caption ?? ""}
                loading="lazy"
                className={`aspect-square w-full object-cover ${g.isPublished ? "" : "opacity-40"}`}
              />
              <div className="space-y-2 p-3 text-xs">
                <p className="line-clamp-1 font-semibold text-ink">
                  {g.caption ?? "—"}
                </p>
                {g.album && <p className="text-ink/50">{g.album}</p>}
                <div className="flex items-center justify-between pt-1">
                  <form action={toggleGalleryImage}>
                    <input type="hidden" name="id" value={g.id} />
                    <input
                      type="hidden"
                      name="publish"
                      value={String(!g.isPublished)}
                    />
                    <button
                      type="submit"
                      className={`font-bold ${
                        g.isPublished
                          ? "text-ink/50 hover:text-ink"
                          : "text-brand-emerald hover:underline"
                      }`}
                    >
                      {g.isPublished ? "Sembunyikan" : "Tayangkan"}
                    </button>
                  </form>
                  <form action={deleteGalleryImage}>
                    <input type="hidden" name="id" value={g.id} />
                    <ConfirmSubmit
                      confirmText="Hapus foto ini dari galeri?"
                      className="font-bold text-red-600 hover:underline"
                    >
                      Hapus
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
