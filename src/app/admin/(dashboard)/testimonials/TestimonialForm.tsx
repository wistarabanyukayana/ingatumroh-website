"use client";

import { useActionState } from "react";

import { saveTestimonial } from "@/actions/testimonials";
import { ImageField } from "@/components/admin/ImageField";
import {
  Field,
  inputClass,
  StatusMessage,
  SubmitButton,
} from "@/components/admin/ui";
import type { Testimonial } from "@/lib/schemas";

export function TestimonialForm({
  testimonial,
  packageOptions,
}: {
  testimonial?: Testimonial;
  packageOptions: { id: number; name: string }[];
}) {
  const [state, action] = useActionState(saveTestimonial, null);
  const err = state?.fieldErrors;

  return (
    <form action={action} className="max-w-xl space-y-6">
      <StatusMessage state={state} />
      {testimonial && (
        <input type="hidden" name="id" value={testimonial.id} />
      )}

      <Field label="Nama jamaah" name="name" errors={err?.name}>
        <input
          id="name"
          name="name"
          required
          defaultValue={testimonial?.name}
          className={inputClass}
        />
      </Field>

      <Field label="Kutipan" name="quote" errors={err?.quote}>
        <textarea
          id="quote"
          name="quote"
          rows={4}
          required
          defaultValue={testimonial?.quote}
          className={inputClass}
        />
      </Field>

      <ImageField
        name="photoUrl"
        label="Foto (opsional)"
        folder="testimonials"
        maxWidth={400}
        defaultUrl={testimonial?.photoUrl}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Paket terkait (opsional)"
          name="packageId"
          errors={err?.packageId}
        >
          <select
            id="packageId"
            name="packageId"
            defaultValue={testimonial?.packageId ?? ""}
            className={inputClass}
          >
            <option value="">—</option>
            {packageOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Urutan tampil" name="sortOrder" errors={err?.sortOrder}>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={testimonial?.sortOrder ?? 0}
            className={inputClass}
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={testimonial?.isPublished}
          className="size-4 accent-brand-emerald"
        />
        Tayangkan di website
      </label>

      <SubmitButton>
        {testimonial ? "Simpan perubahan" : "Buat testimoni"}
      </SubmitButton>
    </form>
  );
}
