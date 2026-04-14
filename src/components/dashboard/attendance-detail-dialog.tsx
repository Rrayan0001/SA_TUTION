"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateLabel } from "@/lib/date";
import { formatPercent } from "@/lib/utils";

type AttendanceDetail = {
  date: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
  list: Array<{
    id: string;
    name: string;
    className: string;
    status: "present" | "absent" | "not_marked";
  }>;
};

type AttendanceDetailDialogProps = {
  date: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const statusVariant = {
  present: "success",
  absent: "danger",
  not_marked: "default"
} as const;

export function AttendanceDetailDialog({
  date,
  open,
  onOpenChange
}: AttendanceDetailDialogProps) {
  const [detail, setDetail] = useState<AttendanceDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      if (!date || !open) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/attendance/${date}`, { cache: "no-store" });
        const payload = (await response.json()) as AttendanceDetail;
        setDetail(payload);
      } finally {
        setLoading(false);
      }
    }

    void loadDetail();
  }, [date, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{date ? formatDateLabel(date, "EEEE, dd MMMM yyyy") : "Attendance detail"}</DialogTitle>
          <DialogDescription>
            Review the full attendance breakdown for the selected date.
          </DialogDescription>
        </DialogHeader>

        {loading || !detail ? (
          <div className="flex min-h-52 items-center justify-center rounded-[24px] bg-slate-50">
            <LoaderCircle className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: "Total Students", value: detail.totalStudents.toString() },
                { label: "Present", value: detail.presentCount.toString() },
                { label: "Absent", value: detail.absentCount.toString() },
                {
                  label: "Attendance",
                  value: formatPercent(detail.attendancePercentage)
                }
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.list.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-slate-900">{student.name}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[student.status]}>
                          {student.status === "not_marked" ? "No data" : student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
