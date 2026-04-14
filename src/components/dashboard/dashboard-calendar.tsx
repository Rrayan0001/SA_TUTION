"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState, useEffect } from "react";

import { AttendanceDetailDialog } from "@/components/dashboard/attendance-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLabel } from "@/lib/date";
import { formatPercent } from "@/lib/utils";

type CalendarDay = {
  key: string;
  inMonth: boolean;
  label: string;
};

type MonthDayStats = {
  date: string;
  present: number;
  absent: number;
  recordCount: number;
  attendancePercentage: number;
  tone: "green" | "yellow" | "red" | "blue";
};

type DashboardCalendarProps = {
  month: string;
  monthLabel: string;
  days: CalendarDay[];
  stats: MonthDayStats[];
  prevMonth: string;
  nextMonth: string;
};

const toneStyles: Record<MonthDayStats["tone"], string> = {
  green: "border-emerald-200 bg-emerald-50/85 text-emerald-950",
  yellow: "border-amber-200 bg-amber-50/85 text-amber-950",
  red: "border-rose-200 bg-rose-50/85 text-rose-950",
  blue: "border-sky-200 bg-sky-50/85 text-sky-950"
};

export function DashboardCalendar({
  month,
  monthLabel,
  days,
  stats,
  prevMonth,
  nextMonth
}: DashboardCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [todayDate, setTodayDate] = useState<string>("");
  
  useEffect(() => {
    // Avoid hydration mismatch by setting today after mount
    setTodayDate(format(new Date(), "yyyy-MM-dd"));
  }, []);

  const statsMap = useMemo(() => new Map(stats.map((day) => [day.date, day])), [stats]);

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl">{monthLabel}</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Click any day to view the detailed attendance breakdown.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="icon" asChild>
              <Link href={`/?month=${prevMonth}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Badge variant="info">{month}</Badge>
            <Button variant="secondary" size="icon" asChild>
              <Link href={`/?month=${nextMonth}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 text-slate-900">
          <div className="mb-3 grid grid-cols-7 gap-1 px-1 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:mb-4 sm:gap-2 sm:px-2 sm:text-xs sm:tracking-[0.25em]">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="py-2">
                <span className="sm:hidden">{day.slice(0, 1)}</span>
                <span className="hidden sm:inline">{day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day) => {
              const attendance = statsMap.get(day.key);
              const isUpcoming = todayDate ? day.key > todayDate : false;
              const isToday = day.key === todayDate;
              const mobileTone = attendance
                ? {
                    green: "bg-emerald-500",
                    yellow: "bg-amber-400",
                    red: "bg-rose-500",
                    blue: "bg-sky-500"
                  }[attendance.tone]
                : "bg-slate-200";

              return (
                <button
                  key={day.key}
                  type="button"
                  disabled={isUpcoming}
                  onClick={() => setSelectedDate(day.key)}
                  className={`group min-h-[4.75rem] rounded-[18px] border p-2 text-left transition-all duration-200 sm:min-h-24 sm:p-3 ${
                    isUpcoming 
                      ? "cursor-not-allowed opacity-50 bg-slate-50/40 text-slate-400"
                      : "hover:-translate-y-1 hover:shadow-soft"
                  } ${isToday ? "ring-2 ring-slate-900 ring-offset-1 sm:ring-offset-2" : ""} ${
                    day.inMonth
                      ? attendance
                        ? toneStyles[attendance.tone]
                        : isUpcoming
                          ? "border-slate-200 border-dashed"
                        : "border-slate-200 bg-slate-50/80 text-slate-900"
                      : "border-transparent bg-white/30 text-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-xs font-semibold sm:text-sm">{formatDateLabel(day.key, "d")}</span>
                    {attendance ? (
                      <span className="hidden rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-medium shadow-sm sm:inline-flex">
                        {formatPercent(attendance.attendancePercentage)}
                      </span>
                    ) : (
                      <span className="hidden rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline-flex">
                        No data
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between sm:hidden">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${isUpcoming ? "bg-slate-200" : mobileTone}`}
                    />
                    {attendance ? (
                      <span className="text-[10px] font-medium">
                        {attendance.present}/{attendance.recordCount}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">-</span>
                    )}
                  </div>

                  <div className="mt-4 hidden space-y-0.5 text-[11px] sm:mt-6 sm:block">
                    {attendance ? (
                      <>
                        <p>{attendance.present} present</p>
                        <p>{attendance.absent} absent</p>
                      </>
                    ) : (
                      <p className="text-slate-400">Not marked</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AttendanceDetailDialog
        date={selectedDate}
        open={Boolean(selectedDate)}
        onOpenChange={(open) => {
          if (!open) setSelectedDate(null);
        }}
      />
    </>
  );
}
