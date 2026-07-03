import { site } from "@/config/site";

// Placeholder shell — the real landing page (hero, packages, trust bar,
// testimonials, gallery, FAQ, footer) is Phase 1, built after the schema
// and plan are confirmed.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brand-blue px-6 text-center text-white">
      <h1 className="text-4xl font-bold">{site.name}</h1>
      <p className="mt-4 max-w-md text-lg text-white/80">{site.description}</p>
    </main>
  );
}
