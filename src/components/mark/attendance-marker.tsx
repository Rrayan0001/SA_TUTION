"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarX2, LoaderCircle, Save, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateLabel } from "@/lib/date";

type Student = {
  id: string;
  name: string;
  className: string;
};

type AttendanceMarkerProps = {
  students: Student[];
  selectedDate: string;
  maxDate: string;
  initialIsHoliday: boolean;
  initialHolidayReason: string;
  initialStatuses: Record<string, "present" | "absent" | "not_marked">;
};

export function AttendanceMarker({
  students,
  selectedDate,
  maxDate,
  initialIsHoliday,
  initialHolidayReason,
  initialStatuses
}: AttendanceMarkerProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [holidayLoading, setHolidayLoading] = useState(false);
  const [isHoliday, setIsHoliday] = useState(initialIsHoliday);
  const [holidayReason, setHolidayReason] = useState(initialHolidayReason);
  const [dateValue, setDateValue] = useState(selectedDate);
  const [statuses, setStatuses] = useState<Record<string, "present" | "absent" | "not_marked">>(
    initialStatuses
  );

  useEffect(() => {
    setDateValue(selectedDate);
    setIsHoliday(initialIsHoliday);
    setHolidayReason(initialHolidayReason);
    setStatuses(initialStatuses);
  }, [initialHolidayReason, initialIsHoliday, initialStatuses, selectedDate]);

  const summary = useMemo(() => {
    const values = Object.values(statuses);
    return {
      present: values.filter((value) => value === "present").length,
      absent: values.filter((value) => value === "absent").length,
      pending: students.length - values.filter((value) => value !== "not_marked").length
    };
  }, [statuses, students.length]);

  const setStatus = (studentId: string, status: "present" | "absent") => {
    setStatuses((current) => ({
      ...current,
      [studentId]: current[studentId] === status ? "not_marked" : status
    }));
  };

  const handleDateChange = (value: string) => {
    if (!value) return;

    if (value > maxDate) {
      toast.error("Future attendance cannot be marked.");
      return;
    }

    setDateValue(value);
    router.push(`/mark-attendance?date=${value}`);
  };

  const handleSubmit = async () => {
    if (isHoliday) {
      toast.error("This date is marked as a holiday and is not counted.");
      return;
    }

    const entries = students
      .map((student) => ({
        studentId: student.id,
        status: statuses[student.id]
      }))
      .filter((entry): entry is { studentId: string; status: "present" | "absent" } => entry.status !== "not_marked");

    if (entries.length !== students.length) {
      toast.error("Please mark each student as present or absent.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: selectedDate,
          entries
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to save attendance.");
      }

      toast.success("Attendance saved successfully.");
      router.push(`/?month=${selectedDate.slice(0, 7)}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHoliday = async (holiday: boolean) => {
    setHolidayLoading(true);

    try {
      const response = await fetch("/api/holidays", {
        method: holiday ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: selectedDate,
          reason: holidayReason
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to update holiday.");
      }

      setIsHoliday(holiday);
      if (!holiday) {
        setHolidayReason("");
      }
      if (holiday) {
        setStatuses(Object.fromEntries(students.map((student) => [student.id, "not_marked"])) as Record<
          string,
          "present" | "absent" | "not_marked"
        >);
      }

      toast.success(holiday ? "Holiday saved. This day will not be counted." : "Holiday removed.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update holiday.");
    } finally {
      setHolidayLoading(false);
    }
  };

  if (!students.length) {
    return (
      <EmptyState
        title="No students found"
        description="Add students from the admin panel before marking attendance."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-5 border-b border-[#e0e0e0] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-2xl text-[#1d1d1f]">Attendance register</CardTitle>
            <p className="mt-2 text-sm text-[#7a7a7a]">{formatDateLabel(selectedDate, "EEEE, dd MMMM yyyy")}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(190px,220px)_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="attendance-date">Attendance Date</Label>
              <Input
                id="attendance-date"
                type="date"
                value={dateValue}
                max={maxDate}
                onChange={(event) => handleDateChange(event.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Present", value: isHoliday ? 0 : summary.present, tone: "text-[#1d1d1f]" },
                { label: "Absent", value: isHoliday ? 0 : summary.absent, tone: "text-[#333333]" },
                { label: isHoliday ? "Holiday" : "Pending", value: isHoliday ? "Off" : summary.pending, tone: "text-[#7a7a7a]" }
              ].map((item) => (
                <div key={item.label} className="rounded-full border border-[#e0e0e0] bg-[#fafafc] px-4 py-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#7a7a7a]">{item.label}</p>
                  <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="space-y-4 rounded-none border border-[#e0e0e0] bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
              <p className="font-semibold text-[#1d1d1f]">Holiday option</p>
              <p className="mt-1 text-sm text-[#7a7a7a]">
                Add a reason and mark this date as a holiday so it is excluded from attendance calculations.
              </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {isHoliday ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => toggleHoliday(true)}
                    disabled={holidayLoading || submitting}
                  >
                    {holidayLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Reason
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant={isHoliday ? "secondary" : "outline"}
                  onClick={() => toggleHoliday(!isHoliday)}
                  disabled={holidayLoading || submitting}
                >
                  {holidayLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : isHoliday ? (
                    <Undo2 className="h-4 w-4" />
                  ) : (
                    <CalendarX2 className="h-4 w-4" />
                  )}
                  {isHoliday ? "Remove Holiday" : "Mark as Holiday"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="holiday-reason">Holiday Reason</Label>
              <textarea
                id="holiday-reason"
                value={holidayReason}
                maxLength={240}
                onChange={(event) => setHolidayReason(event.target.value)}
                placeholder="Example: Public holiday, festival, teacher unavailable..."
                className="min-h-24 w-full resize-none rounded-none border border-[#e0e0e0] bg-white px-4 py-3 text-[15px] text-[#1d1d1f] transition duration-200 placeholder:text-[#7a7a7a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/20"
              />
              <p className="text-xs text-[#7a7a7a]">{holidayReason.length}/240 characters</p>
            </div>
          </div>

          {isHoliday ? (
            <div className="rounded-none border border-dashed border-[#e0e0e0] bg-[#fafafc] p-8 text-center">
              <p className="text-lg font-semibold text-[#1d1d1f]">This day is marked as a holiday.</p>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#7a7a7a]">
                No student attendance is required, and this date will not be considered in dashboard averages or student reports.
              </p>
              {holidayReason.trim() ? (
                <div className="mx-auto mt-5 max-w-xl rounded-none border border-[#e0e0e0] bg-white p-4 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">Reason</p>
                  <p className="mt-2 text-sm leading-6 text-[#333333]">{holidayReason.trim()}</p>
                </div>
              ) : null}
            </div>
          ) : (
            students.map((student) => {
              const status = statuses[student.id] ?? "not_marked";

              return (
                <div
                  key={student.id}
                  className="flex flex-col gap-4 rounded-none border border-[#e0e0e0] bg-white p-4 transition-colors duration-200 hover:bg-[#fafafc] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold text-[#1d1d1f]">{student.name}</p>
                    <p className="text-sm text-[#7a7a7a]">{student.className}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant={status === "present" ? "default" : "secondary"}
                      onClick={() => setStatus(student.id, "present")}
                    >
                      Present
                    </Button>
                    <Button
                      type="button"
                      variant={status === "absent" ? "warning" : "secondary"}
                      onClick={() => setStatus(student.id, "absent")}
                    >
                      Absent
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSubmit} disabled={submitting || isHoliday}>
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {isHoliday ? "Holiday Excluded" : "Submit Attendance"}
        </Button>
      </div>
    </div>
  );
}
