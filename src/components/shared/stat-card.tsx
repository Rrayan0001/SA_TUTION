import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
};

export function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="flex items-start justify-between gap-4 p-6">
        <div className="space-y-2 flex-1">
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#7a7a7a]">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">{value}</p>
          <p className="text-sm leading-6 text-[#7a7a7a]">{hint}</p>
        </div>
        <div className="rounded-full border border-[#e0e0e0] bg-[#fafafc] p-3 text-[#0066cc]">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
