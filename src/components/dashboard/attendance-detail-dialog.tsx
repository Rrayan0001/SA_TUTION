"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarX2, LoaderCircle, Save, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { formatDateLabel } from "@/lib/date";
import { formatPercent } from "@/lib/utils";

type AttendanceDetail = {
  date: string;
  isHoliday: boolean;
  holidayReason: string | null;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  list: Array<{
    id: string;
    name: string;
    className: string;
    status: "present" | "absent" | "not_marked" | "holiday";
  }>;
};

type AttendanceStatus = "present" | "absent" | "not_marked";

type AttendanceDetailDialogProps = {
  date: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AttendanceDetailDialog({
  date,
  open,
  onOpenChange
}: AttendanceDetailDialogProps) {
  const router = useRouter();
  const [detail, setDetail] = useState<AttendanceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [holidayLoading, setHolidayLoading] = useState(false);
  const [holidayReason, setHolidayReason] = useState("");
  const [isHoliday, setIsHoliday] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    async function loadDetail() {
      if (!date || !open) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/attendance/${date}`, { cache: "no-store" });
        const payload = (await response.json()) as AttendanceDetail;
        setDetail(payload);
        setIsHoliday(payload.isHoliday);
        setHolidayReason(payload.holidayReason ?? "");
        setStatuses(
          Object.fromEntries(
            payload.list.map((student) => [student.id, student.status])
          ) as Record<string, AttendanceStatus>
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDetail();
  }, [date, open]);

  const refreshDetail = async () => {
    if (!date) {
      return;
    }

    const refreshed = await fetch(`/api/attendance/${date}`, { cache: "no-store" });
    const payload = (await refreshed.json()) as AttendanceDetail;
    setDetail(payload);
    setIsHoliday(payload.isHoliday);
    setHolidayReason(payload.holidayReason ?? "");
    setStatuses(
      Object.fromEntries(payload.list.map((student) => [student.id, student.status])) as Record<
        string,
        AttendanceStatus
      >
    );
  };

  const summary = useMemo(() => {
    const values = Object.values(statuses);
    const pending = detail ? detail.list.length - values.filter((status) => status !== "not_marked").length : 0;

    return {
      present: values.filter((status) => status === "present").length,
      absent: values.filter((status) => status === "absent").length,
      pending
    };
  }, [detail, statuses]);

  const canSave = Boolean(detail) && !detail?.isHoliday && summary.pending === 0;

  const toggleHoliday = async (holiday: boolean) => {
    if (!date) {
      return;
    }

    setHolidayLoading(true);

    try {
      const response = await fetch("/api/holidays", {
        method: holiday ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date,
          reason: holidayReason
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to update holiday.");
      }

      toast.success(holiday ? "Holiday saved." : "Holiday removed.");
      await refreshDetail();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update holiday.");
    } finally {
      setHolidayLoading(false);
    }
  };

  const setStatus = (studentId: string, status: Exclude<AttendanceStatus, "not_marked">) => {
    setStatuses((current) => ({
      ...current,
      [studentId]: current[studentId] === status ? "not_marked" : status
    }));
  };

  const handleSave = async () => {
    if (!date || !detail || detail.isHoliday) {
      return;
    }

    const entries = detail.list
      .map((student) => ({
        studentId: student.id,
        status: statuses[student.id] ?? "not_marked"
      }))
      .filter(
        (entry): entry is { studentId: string; status: "present" | "absent" } =>
          entry.status !== "not_marked"
      );

    if (entries.length !== detail.list.length) {
      toast.error("Please mark every student as present or absent.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date,
          entries
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to save attendance.");
      }

      toast.success("Attendance saved.");
      await refreshDetail();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{date ? formatDateLabel(date, "EEEE, dd MMMM yyyy") : "Attendance detail"}</DialogTitle>
          <DialogDescription>
            {detail?.isHoliday
              ? "This date is marked as a holiday and is excluded from attendance calculations."
              : "Mark attendance directly in this pop-up, then save without leaving the calendar."}
          </DialogDescription>
        </DialogHeader>

        {loading || !detail ? (
          <div className="flex min-h-52 items-center justify-center rounded-[24px] bg-slate-50">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : detail.list.length === 0 ? (
          <EmptyState title="No students found" description="Add students before marking attendance for this day." />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Total Students", value: detail.totalStudents.toString() },
                { label: "Present", value: summary.present.toString() },
                { label: "Absent", value: summary.absent.toString() },
                {
                  label: "Attendance",
                  value: isHoliday ? "Excluded" : formatPercent(detail.attendancePercentage)
                }
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>

            {isHoliday && holidayReason ? (
              <div className="rounded-[24px] border border-violet-200 bg-violet-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Holiday Reason</p>
                <p className="mt-2 text-sm leading-6 text-violet-950">{holidayReason}</p>
              </div>
            ) : null}

            <div className="rounded-[24px] border border-slate-200 bg-white p-4">
              <div className="space-y-4 rounded-[20px] border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">Holiday option</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Add a reason and mark this date as a holiday so it is excluded from attendance calculations.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {isHoliday ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => toggleHoliday(true)}
                        disabled={holidayLoading || saving}
                      >
                        {holidayLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Reason
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant={isHoliday ? "secondary" : "outline"}
                      onClick={() => toggleHoliday(!isHoliday)}
                      disabled={holidayLoading || saving}
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
                  <label htmlFor="holiday-reason" className="text-sm font-medium text-slate-700">
                    Holiday Reason
                  </label>
                  <textarea
                    id="holiday-reason"
                    value={holidayReason}
                    maxLength={240}
                    onChange={(event) => setHolidayReason(event.target.value)}
                    placeholder="Example: Public holiday, festival, teacher unavailable..."
                    className="min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm transition duration-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
                  />
                  <p className="text-xs text-slate-400">{holidayReason.length}/240 characters</p>
                </div>
              </div>

              {isHoliday ? (
                <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-lg font-semibold text-slate-950">This day is marked as a holiday.</p>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Remove the holiday first if you want to record attendance here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <span>Mark each student directly in the pop-up.</span>
                    <span>{summary.pending} pending</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {detail.list.map((student) => {
                      const status = statuses[student.id] ?? "not_marked";

                      return (
                        <div
                          key={student.id}
                          className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-white p-4 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="text-base font-semibold text-slate-900">{student.name}</p>
                            <p className="text-sm text-slate-500">Class {student.className}</p>
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
                    })}
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={!canSave || saving}>
                      {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Attendance
                    </Button>
                  </div>
                </>
              )}
            </div>

            {!isHoliday && summary.pending > 0 ? (
              <p className="text-sm text-slate-500">
                Save is disabled until every student is marked present or absent.
              </p>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}