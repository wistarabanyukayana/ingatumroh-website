import { PackageForm } from "../PackageForm";

export const metadata = { title: "Paket baru" };

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        Paket baru
      </h1>
      <PackageForm />
    </div>
  );
}
