"use client";

import { useActionState } from "react";

import { savePackage } from "@/actions/packages";
import { ImageField } from "@/components/admin/ImageField";
import {
  Field,
  FormCard,
  inputClass,
  StatusMessage,
  SubmitButton,
} from "@/components/admin/ui";
import type { Package } from "@/lib/schemas";

export function PackageForm({ pkg }: { pkg?: Package }) {
  const [state, action] = useActionState(savePackage, null);
  const err = state?.fieldErrors;

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {pkg && <input type="hidden" name="id" value={pkg.id} />}

      <FormCard title="Informasi paket">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama paket" name="name" errors={err?.name}>
          <input
            id="name"
            name="name"
            required
            defaultValue={pkg?.name}
            className={inputClass}
          />
        </Field>
        <Field
          label="Slug"
          name="slug"
          errors={err?.slug}
          hint="Kosongkan untuk dibuat otomatis dari nama."
        >
          <input
            id="slug"
            name="slug"
            defaultValue={pkg?.slug}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Deskripsi" name="description" errors={err?.description}>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={pkg?.description ?? ""}
          className={inputClass}
        />
      </Field>

      <ImageField
        name="heroImageUrl"
        label="Gambar utama"
        folder="packages"
        maxWidth={800}
        defaultUrl={pkg?.heroImageUrl}
      />

      </FormCard>

      <FormCard title="Harga & durasi">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Harga mulai (Rp)"
          name="priceFrom"
          errors={err?.priceFrom}
        >
          <input
            id="priceFrom"
            name="priceFrom"
            type="number"
            min={0}
            required
            defaultValue={pkg?.priceFrom}
            className={inputClass}
          />
        </Field>
        <Field
          label="Durasi (hari)"
          name="durationDays"
          errors={err?.durationDays}
        >
          <input
            id="durationDays"
            name="durationDays"
            type="number"
            min={1}
            required
            defaultValue={pkg?.durationDays}
            className={inputClass}
          />
        </Field>
        <Field label="Maskapai" name="airline" errors={err?.airline}>
          <input
            id="airline"
            name="airline"
            defaultValue={pkg?.airline ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      </FormCard>

      <FormCard title="Hotel">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Hotel Makkah" name="hotelMakkah" errors={err?.hotelMakkah}>
          <input
            id="hotelMakkah"
            name="hotelMakkah"
            defaultValue={pkg?.hotelMakkah ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="Bintang (Makkah)"
          name="hotelMakkahStars"
          errors={err?.hotelMakkahStars}
        >
          <input
            id="hotelMakkahStars"
            name="hotelMakkahStars"
            type="number"
            min={1}
            max={5}
            defaultValue={pkg?.hotelMakkahStars ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="Hotel Madinah"
          name="hotelMadinah"
          errors={err?.hotelMadinah}
        >
          <input
            id="hotelMadinah"
            name="hotelMadinah"
            defaultValue={pkg?.hotelMadinah ?? ""}
            className={inputClass}
          />
        </Field>
        <Field
          label="Bintang (Madinah)"
          name="hotelMadinahStars"
          errors={err?.hotelMadinahStars}
        >
          <input
            id="hotelMadinahStars"
            name="hotelMadinahStars"
            type="number"
            min={1}
            max={5}
            defaultValue={pkg?.hotelMadinahStars ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      </FormCard>

      <FormCard title="Fasilitas & itinerari">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Termasuk"
          name="inclusions"
          errors={err?.inclusions}
          hint="Satu item per baris."
        >
          <textarea
            id="inclusions"
            name="inclusions"
            rows={6}
            defaultValue={pkg?.inclusions.join("\n")}
            className={inputClass}
          />
        </Field>
        <Field
          label="Tidak termasuk"
          name="exclusions"
          errors={err?.exclusions}
          hint="Satu item per baris."
        >
          <textarea
            id="exclusions"
            name="exclusions"
            rows={6}
            defaultValue={pkg?.exclusions.join("\n")}
            className={inputClass}
          />
        </Field>
      </div>

      <Field
        label="Itinerari"
        name="itinerary"
        errors={err?.itinerary}
        hint="Satu hari per baris, format: nomor hari | judul | keterangan. Contoh: 1 | Berangkat dari Jakarta | Kumpul di bandara."
      >
        <textarea
          id="itinerary"
          name="itinerary"
          rows={6}
          defaultValue={pkg?.itinerary
            .map((d) => `${d.day} | ${d.title} | ${d.description}`)
            .join("\n")}
          className={inputClass}
        />
      </Field>

      </FormCard>

      <FormCard title="Publikasi">
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Urutan tampil"
          name="sortOrder"
          errors={err?.sortOrder}
          hint="Angka kecil tampil lebih dulu."
        >
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={pkg?.sortOrder ?? 0}
            className={inputClass}
          />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={pkg?.isFeatured}
            className="size-4 accent-brand-gold"
          />
          Tandai favorit
        </label>
        <label className="flex items-center gap-2 pt-6 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={pkg?.isPublished}
            className="size-4 accent-brand-emerald"
          />
          Tayangkan di website
        </label>
      </div>

      </FormCard>

      <StatusMessage state={state} />

      <SubmitButton>{pkg ? "Simpan perubahan" : "Buat paket"}</SubmitButton>
    </form>
  );
}
