import { CalendarRange, CheckCircle2, CircleOff, Users2 } from "lucide-react";
import { format, parseISO } from "date-fns";

import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { buildMonthGrid, shiftMonth } from "@/lib/date";
import { getDashboardMonth } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ month?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { month: requestedMonth } = await searchParams;
  const month = requestedMonth ?? format(new Date(), "yyyy-MM");
  const dashboard = await getDashboardMonth(month);
  const grid = buildMonthGrid(month).map((item) => ({
    key: item.key,
    inMonth: item.inMonth,
    label: format(item.date, "d")
  }));

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Attendance Command Center"
        title="Track every tuition day with clarity."
        description="A premium monthly overview for attendance trends, fast date-level drilldowns, and cleaner admin operations."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Students"
          value={dashboard.summary.totalStudents.toString()}
          hint="Live count across your tuition batches"
          icon={<Users2 className="h-5 w-5" />}
        />
        <StatCard
          label="Days Tracked"
          value={dashboard.summary.daysTracked.toString()}
          hint="Marked attendance dates this month"
          icon={<CalendarRange className="h-5 w-5" />}
        />
        <StatCard
          label="Average Attendance"
          value={formatPercent(dashboard.summary.averageAttendance)}
          hint="Monthly attendance health at a glance"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Untracked Days"
          value={(buildMonthGrid(month).filter((item) => item.inMonth).length - dashboard.summary.daysTracked).toString()}
          hint="Dates still waiting for attendance data"
          icon={<CircleOff className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <DashboardCalendar
          month={month}
          monthLabel={format(parseISO(`${month}-01`), "MMMM yyyy")}
          days={grid}
          stats={dashboard.days}
          prevMonth={shiftMonth(month, "prev")}
          nextMonth={shiftMonth(month, "next")}
        />

        <div className="glass-panel rounded-[30px] p-6">
          <h2 className="text-xl font-semibold text-slate-950">Calendar legend</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Each date cell is tuned to help you spot attendance quality quickly.
          </p>

          <div className="mt-4 space-y-2">
            {[
              {
                color: "bg-emerald-100 border-emerald-200",
                title: "Full",
                description: "All students present."
              },
              {
                color: "bg-amber-100 border-amber-200",
                title: "Partial",
                description: "Some students absent."
              },
              {
                color: "bg-rose-100 border-rose-200",
                title: "Low",
                description: "Attendance < 60%."
              },
              {
                color: "bg-sky-100 border-sky-200",
                title: "Recorded",
                description: "Attendance exists."
              },
              {
                color: "bg-slate-100 border-slate-200",
                title: "Empty",
                description: "No attendance data."
              }
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-[18px] bg-white/70 p-3">
                <div className={`h-8 w-8 shrink-0 rounded-xl border ${item.color}`} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-[11px] leading-tight text-slate-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
