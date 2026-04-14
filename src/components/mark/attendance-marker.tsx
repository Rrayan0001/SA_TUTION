"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateLabel } from "@/lib/date";

type Student = {
  id: string;
  name: string;
  className: string;
};

type AttendanceMarkerProps = {
  students: Student[];
  today: string;
  initialStatuses: Record<string, "present" | "absent" | "not_marked">;
};

export function AttendanceMarker({ students, today, initialStatuses }: AttendanceMarkerProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, "present" | "absent" | "not_marked">>(
    initialStatuses
  );

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

  const handleSubmit = async () => {
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
          date: today,
          entries
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to save attendance.");
      }

      toast.success("Attendance saved successfully.");
      router.push(`/?month=${today.slice(0, 7)}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save attendance.");
    } finally {
      setSubmitting(false);
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
        <CardHeader className="flex flex-col gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-2xl">Today&apos;s register</CardTitle>
            <p className="mt-2 text-sm text-slate-500">{formatDateLabel(today, "EEEE, dd MMMM yyyy")}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Present", value: summary.present, tone: "text-slate-900" },
              { label: "Absent", value: summary.absent, tone: "text-slate-700" },
              { label: "Pending", value: summary.pending, tone: "text-slate-500" }
            ].map((item) => (
              <div key={item.label} className="rounded-[20px] bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          {students.map((student) => {
            const status = statuses[student.id] ?? "not_marked";

            return (
              <div
                key={student.id}
                className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-slate-900">{student.name}</p>
                  <p className="text-sm text-slate-500">{student.className}</p>
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          Submit Attendance
        </Button>
      </div>
    </div>
  );
}
