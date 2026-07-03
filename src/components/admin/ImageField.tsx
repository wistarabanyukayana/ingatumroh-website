"use client";

import { useId, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { Label } from "./ui";

// Invariant 9: images are resized/compressed in the browser before upload
// (canvas → WebP), then stored in the public "images" Supabase bucket.
// The form only ever sees the resulting public URL (hidden input).
async function resizeToWebp(file: File, maxWidth: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.82),
  );
  if (!blob) throw new Error("Konversi gambar gagal.");
  return blob;
}

export function ImageField({
  name,
  label,
  folder,
  maxWidth,
  defaultUrl,
}: {
  name: string;
  label: string;
  folder: string;
  maxWidth: number;
  defaultUrl?: string | null;
}) {
  const id = useId();
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await resizeToWebp(file, maxWidth);
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const supabase = createClient();
      const { error: upErr } = await supabase.storage
        .from("images")
        .upload(path, blob, { contentType: "image/webp" });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unggah gagal. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-4">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- images.unoptimized; resized at upload
          <img
            src={url}
            alt=""
            className="size-16 rounded-lg border border-ink/10 object-cover"
          />
        ) : (
          <div className="grid size-16 place-items-center rounded-lg border border-dashed border-ink/20 text-xs text-ink/40">
            —
          </div>
        )}
        <div className="text-sm">
          <input
            id={id}
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0])}
            className="block text-xs text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-brand-blue/10 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-brand-blue hover:file:bg-brand-blue/15"
          />
          <p className="mt-1 text-xs text-ink/45">
            {busy
              ? "Mengunggah…"
              : `Otomatis dikecilkan ke ${maxWidth}px (WebP).`}
          </p>
          {url && !busy && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="mt-1 text-xs font-semibold text-red-600 hover:underline"
            >
              Hapus gambar
            </button>
          )}
          {error && (
            <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
