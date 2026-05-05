import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPercent } from "@/lib/utils";

type StudentCardProps = {
  id: string;
  name: string;
  className: string;
  totalClasses: number;
  presentDays: number;
  absentDays: number;
  attendancePercentage: number;
};

export function StudentCard({
  id,
  name,
  className,
  totalClasses,
  presentDays,
  absentDays,
  attendancePercentage
}: StudentCardProps) {
  return (
    <Link href={`/students/${id}`}>
      <Card className="h-full transition-colors duration-200 hover:bg-[#fafafc]">
        <CardContent className="flex h-full flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-[#1d1d1f]">{name}</h3>
              <p className="mt-1 text-sm text-[#7a7a7a]">{className}</p>
            </div>
            <Badge variant="info">{formatPercent(attendancePercentage)}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Classes", value: totalClasses },
              { label: "Present", value: presentDays },
              { label: "Absent", value: absentDays }
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-[#e0e0e0] bg-white p-3">
                <p className="text-xs uppercase tracking-[0.22em] text-[#7a7a7a]">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-[#1d1d1f]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between text-sm text-[#7a7a7a]">
            <span>Open full report</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
