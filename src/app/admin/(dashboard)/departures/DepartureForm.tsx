"use client";

import { useActionState } from "react";

import { saveDeparture } from "@/actions/departures";
import {
  Field,
  FormCard,
  inputClass,
  StatusMessage,
  SubmitButton,
} from "@/components/admin/ui";
import { isoDate, isoToDisplayDate } from "@/lib/date";
import type { Departure } from "@/lib/schemas";

const toDisplayDate = (d: Date) => isoToDisplayDate(isoDate(d));

export function DepartureForm({
  departure,
  packageOptions,
}: {
  departure?: Departure;
  packageOptions: { id: number; name: string; durationDays: number }[];
}) {
  const [state, action] = useActionState(saveDeparture, null);
  const err = state?.fieldErrors;

  return (
    <form action={action} className="max-w-xl space-y-6">
      {departure && <input type="hidden" name="id" value={departure.id} />}

      <FormCard title="Detail jadwal">

      <Field label="Paket" name="packageId" errors={err?.packageId}>
        <select
          id="packageId"
          name="packageId"
          required
          defaultValue={departure?.packageId}
          className={inputClass}
        >
          {packageOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.durationDays} hari
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Tanggal berangkat"
          name="departDate"
          errors={err?.departDate}
          hint="Format DD/MM/YYYY. Jadwal lampau tidak tampil di halaman publik."
        >
          <input
            id="departDate"
            name="departDate"
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            pattern="[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}"
            required
            defaultValue={departure && toDisplayDate(departure.departDate)}
            className={inputClass}
          />
        </Field>
        <Field
          label="Tanggal pulang"
          name="returnDate"
          errors={err?.returnDate}
          hint="Harus sesuai atau lebih lama dari durasi paket."
        >
          <input
            id="returnDate"
            name="returnDate"
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            pattern="[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}"
            required
            defaultValue={departure && toDisplayDate(departure.returnDate)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kuota kursi" name="quota" errors={err?.quota}>
          <input
            id="quota"
            name="quota"
            type="number"
            min={1}
            required
            defaultValue={departure?.quota ?? 45}
            className={inputClass}
          />
        </Field>
        <Field
          label="Status"
          name="status"
          errors={err?.status}
          hint="Status publik hanya menampilkan Tersedia dan Hampir penuh untuk jadwal hari ini atau mendatang."
        >
          <select
            id="status"
            name="status"
            defaultValue={departure?.status ?? "open"}
            className={inputClass}
          >
            <option value="open">Tersedia</option>
            <option value="almost_full">Hampir penuh</option>
            <option value="full">Penuh</option>
            <option value="departed">Sudah berangkat</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </Field>
      </div>

      </FormCard>

      <StatusMessage state={state} />

      <SubmitButton>
        {departure ? "Simpan perubahan" : "Buat jadwal"}
      </SubmitButton>
    </form>
  );
}
