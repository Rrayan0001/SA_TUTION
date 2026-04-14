type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{description}</p>
      </div>
    </div>
  );
}
