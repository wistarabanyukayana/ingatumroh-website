"use client";

import { useActionState } from "react";

import { addGalleryImage } from "@/actions/gallery";
import { ImageField } from "@/components/admin/ImageField";
import {
  Field,
  inputClass,
  StatusMessage,
  SubmitButton,
} from "@/components/admin/ui";

export function GalleryUploadForm() {
  const [state, action] = useActionState(addGalleryImage, null);
  const err = state?.fieldErrors;

  return (
    <form action={action} className="space-y-4">
      <StatusMessage state={state} />
      <ImageField
        name="imageUrl"
        label="Foto"
        folder="gallery"
        maxWidth={400}
      />
      {err?.imageUrl && (
        <p className="text-xs font-medium text-red-600">
          Pilih foto terlebih dahulu.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Keterangan (opsional)" name="caption">
          <input id="caption" name="caption" className={inputClass} />
        </Field>
        <Field
          label="Album (opsional)"
          name="album"
          hint="Contoh: Umroh Ramadhan 1447H"
        >
          <input id="album" name="album" className={inputClass} />
        </Field>
        <Field label="Urutan tampil" name="sortOrder">
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={0}
            className={inputClass}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked
          className="size-4 accent-brand-emerald"
        />
        Langsung tayangkan
      </label>
      <SubmitButton>Tambah ke galeri</SubmitButton>
    </form>
  );
}
