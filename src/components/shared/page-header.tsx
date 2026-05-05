type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-2">
      <div className="space-y-3">
        <p className="text-[12px] font-medium uppercase tracking-[0.32em] text-[#7a7a7a]">{eyebrow}</p>
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl text-[17px] leading-7 text-[#333333]">{description}</p>
      </div>
    </div>
  );
}
