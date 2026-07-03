"use client";

import { useActionState } from "react";

import { saveDeparture } from "@/actions/departures";
import {
  Field,
  inputClass,
  StatusMessage,
  SubmitButton,
} from "@/components/admin/ui";
import type { Departure } from "@/lib/schemas";

const toDateInput = (d: Date) => d.toISOString().slice(0, 10);

export function DepartureForm({
  departure,
  packageOptions,
}: {
  departure?: Departure;
  packageOptions: { id: number; name: string }[];
}) {
  const [state, action] = useActionState(saveDeparture, null);
  const err = state?.fieldErrors;

  return (
    <form action={action} className="max-w-xl space-y-6">
      <StatusMessage state={state} />
      {departure && <input type="hidden" name="id" value={departure.id} />}

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
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Tanggal berangkat"
          name="departDate"
          errors={err?.departDate}
        >
          <input
            id="departDate"
            name="departDate"
            type="date"
            required
            defaultValue={departure && toDateInput(departure.departDate)}
            className={inputClass}
          />
        </Field>
        <Field
          label="Tanggal pulang"
          name="returnDate"
          errors={err?.returnDate}
        >
          <input
            id="returnDate"
            name="returnDate"
            type="date"
            required
            defaultValue={departure && toDateInput(departure.returnDate)}
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
        <Field label="Status" name="status" errors={err?.status}>
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

      <SubmitButton>
        {departure ? "Simpan perubahan" : "Buat jadwal"}
      </SubmitButton>
    </form>
  );
}
