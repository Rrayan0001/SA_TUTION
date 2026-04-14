export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-10 w-72 animate-pulse rounded-full bg-slate-200" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[28px] bg-white/70 shadow-soft" />
        ))}
      </div>
      <div className="h-[420px] animate-pulse rounded-[32px] bg-white/70 shadow-soft" />
    </div>
  );
}
