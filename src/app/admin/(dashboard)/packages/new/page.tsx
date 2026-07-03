import { PackageForm } from "../PackageForm";

export const metadata = { title: "Paket baru" };

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Paket baru
      </h1>
      <PackageForm />
    </div>
  );
}
