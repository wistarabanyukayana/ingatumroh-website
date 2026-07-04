const block = "animate-pulse rounded-lg bg-ink/10";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className={`${block} h-7 w-48`} />
        <div className={`${block} h-4 w-72 max-w-full`} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="rounded-2xl border border-ink/10 p-5">
            <div className={`${block} mb-4 size-10`} />
            <div className={`${block} mb-3 h-5 w-28`} />
            <div className={`${block} h-4 w-full`} />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <div className="grid gap-4 border-b border-ink/10 p-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={`${block} h-4`} />
          ))}
        </div>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="grid gap-4 border-b border-ink/5 p-4 last:border-b-0 md:grid-cols-4"
          >
            <div className={`${block} h-4 md:col-span-2`} />
            <div className={`${block} h-4`} />
            <div className={`${block} h-4`} />
          </div>
        ))}
      </div>
    </div>
  );
}
