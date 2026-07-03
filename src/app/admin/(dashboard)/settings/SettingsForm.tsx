"use client";

import { useActionState } from "react";

import { saveSettings } from "@/actions/settings";
import {
  Field,
  inputClass,
  StatusMessage,
  SubmitButton,
} from "@/components/admin/ui";
import type { SiteSettings } from "@/lib/schemas";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action] = useActionState(saveSettings, null);
  const err = state?.fieldErrors;

  return (
    <form action={action} className="max-w-2xl space-y-6">
      <StatusMessage state={state} />

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink/50">
          Kontak & CTA
        </h2>
        <div className="space-y-4">
          <Field
            label="Nomor WhatsApp"
            name="whatsappNumber"
            errors={err?.whatsappNumber}
            hint="Format internasional tanpa tanda +, contoh: 6282122122250. Dipakai semua tombol CTA."
          >
            <input
              id="whatsappNumber"
              name="whatsappNumber"
              required
              defaultValue={settings.whatsappNumber}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Email kontak"
              name="contactEmail"
              errors={err?.contactEmail}
            >
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={settings.contactEmail ?? ""}
                className={inputClass}
              />
            </Field>
            <Field
              label="Telepon kontak"
              name="contactPhone"
              errors={err?.contactPhone}
            >
              <input
                id="contactPhone"
                name="contactPhone"
                defaultValue={settings.contactPhone ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Alamat kantor" name="address" errors={err?.address}>
            <textarea
              id="address"
              name="address"
              rows={2}
              defaultValue={settings.address ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink/50">
          Legalitas
        </h2>
        <div className="space-y-4">
          <Field
            label="Badan hukum"
            name="legalEntity"
            errors={err?.legalEntity}
          >
            <input
              id="legalEntity"
              name="legalEntity"
              required
              defaultValue={settings.legalEntity}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Izin PPIU"
              name="ppiuLicenseNo"
              errors={err?.ppiuLicenseNo}
            >
              <input
                id="ppiuLicenseNo"
                name="ppiuLicenseNo"
                required
                defaultValue={settings.ppiuLicenseNo}
                className={inputClass}
              />
            </Field>
            <Field
              label="Izin PIHK (opsional)"
              name="pihkLicenseNo"
              errors={err?.pihkLicenseNo}
            >
              <input
                id="pihkLicenseNo"
                name="pihkLicenseNo"
                defaultValue={settings.pihkLicenseNo ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink/50">
          Hero halaman depan
        </h2>
        <div className="space-y-4">
          <Field
            label="Judul utama"
            name="heroHeadline"
            errors={err?.heroHeadline}
          >
            <input
              id="heroHeadline"
              name="heroHeadline"
              required
              defaultValue={settings.heroHeadline}
              className={inputClass}
            />
          </Field>
          <Field
            label="Subjudul"
            name="heroSubhead"
            errors={err?.heroSubhead}
          >
            <textarea
              id="heroSubhead"
              name="heroSubhead"
              rows={2}
              defaultValue={settings.heroSubhead ?? ""}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink/50">
          Media sosial (URL, opsional)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["instagram", "facebook", "tiktok", "youtube"] as const).map(
            (k) => (
              <Field
                key={k}
                label={k}
                name={`socials.${k}`}
                errors={err?.[`socials.${k}`]}
              >
                <input
                  id={`socials.${k}`}
                  name={`socials.${k}`}
                  type="url"
                  placeholder="https://…"
                  defaultValue={settings.socials[k] ?? ""}
                  className={inputClass}
                />
              </Field>
            ),
          )}
        </div>
      </div>

      <SubmitButton>Simpan pengaturan</SubmitButton>
    </form>
  );
}
