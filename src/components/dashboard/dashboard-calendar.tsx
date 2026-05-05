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
  tone: "green" | "yellow" | "red" | "blue" | "holiday";
  isHoliday?: boolean;
  holidayReason?: string | null;
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
  green: "border-[#c7e7cf] bg-[#edf7ef] text-[#1e7e34]",
  yellow: "border-[#f0e1a2] bg-[#fff7db] text-[#8a6d00]",
  red: "border-[#f2c1c1] bg-[#fff1f0] text-[#d0021b]",
  blue: "border-[#d7e9fb] bg-[#f0f7ff] text-[#0066cc]",
  holiday: "border-[#e4d7fb] bg-[#f7f2ff] text-[#6f42c1]"
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
                    blue: "bg-sky-500",
                    holiday: "bg-violet-500"
                  }[attendance.tone]
                : "bg-slate-200";

              return (
                <button
                  key={day.key}
                  type="button"
                  disabled={isUpcoming}
                  onClick={() => setSelectedDate(day.key)}
                  className={`group min-h-[4.75rem] rounded-none border border-[#e0e0e0] p-2 text-left transition-colors duration-200 sm:min-h-24 sm:p-3 ${
                    isUpcoming 
                      ? "cursor-not-allowed opacity-40 bg-[#f5f5f7] text-[#c7c7cc]"
                      : "hover:bg-[#fafafc] active:scale-[0.99]"
                  } ${isToday ? "ring-1 ring-[#0066cc] ring-offset-1" : ""} ${
                    day.inMonth
                      ? attendance
                        ? toneStyles[attendance.tone] + " border-current/25 hover:border-current/40"
                        : isUpcoming
                          ? "border-dashed border-[#e0e0e0] bg-white"
                        : "border-[#e0e0e0] bg-white text-[#1d1d1f]"
                      : "border-transparent bg-white text-[#c7c7cc]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="text-xs font-medium sm:text-sm">{formatDateLabel(day.key, "d")}</span>
                    {attendance ? (
                      <span className="hidden rounded-full bg-white px-2 py-0.5 text-[10px] font-medium border border-[#e0e0e0] sm:inline-flex">
                        {attendance.isHoliday ? "Holiday" : formatPercent(attendance.attendancePercentage)}
                      </span>
                    ) : (
                      <span className="hidden rounded-full bg-[#f5f5f7] px-2 py-0.5 text-[10px] font-medium text-[#7a7a7a] sm:inline-flex">
                        No data
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between sm:hidden">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${isUpcoming ? "bg-[#e0e0e0]" : mobileTone}`}
                    />
                    {attendance ? (
                      <span className="text-[10px] font-medium">
                        {attendance.isHoliday ? "Off" : `${attendance.present}/${attendance.recordCount}`}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#7a7a7a]">-</span>
                    )}
                  </div>

                  <div className="mt-4 hidden space-y-0.5 text-[11px] sm:mt-6 sm:block">
                    {attendance ? (
                      attendance.isHoliday ? (
                        <p className="font-medium">Holiday</p>
                      ) : (
                        <>
                          <p className="font-medium">{attendance.present} present</p>
                          <p className="text-[#7a7a7a]">{attendance.absent} absent</p>
                        </>
                      )
                    ) : (
                      <p className="font-medium text-[#7a7a7a]">Not marked</p>
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
