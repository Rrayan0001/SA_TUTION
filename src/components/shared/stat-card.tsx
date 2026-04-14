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
    <Card className="overflow-hidden">
      <CardContent className="flex items-start justify-between gap-4 p-4">
        <div className="space-y-1">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="text-[11px] leading-4 text-slate-500">{hint}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div>
      </CardContent>
    </Card>
  );
}
