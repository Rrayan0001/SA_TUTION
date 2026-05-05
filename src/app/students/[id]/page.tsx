import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { formatDateLabel } from "@/lib/date";
import { getStudentDetail } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

type StudentDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function StudentDetailPage({ params }: StudentDetailProps) {
  const { id } = await params;
  const student = await getStudentDetail(id);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Individual Report"
        title={student.name}
        description={`Detailed attendance history for ${student.className}, including monthly summaries and complete date-wise records.`}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Attendance Rate"
          value={formatPercent(student.attendancePercentage)}
          hint="Overall performance across all recorded classes"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Total Classes"
          value={student.totalClasses.toString()}
          hint="Attendance entries recorded for this student"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatCard
          label="Present Days"
          value={student.presentDays.toString()}
          hint="Successful class attendance days"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Absent Days"
          value={student.absentDays.toString()}
          hint="Days marked absent"
          icon={<XCircle className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1d1d1f]">Monthly summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.monthlySummary.length ? (
              student.monthlySummary.map((month) => (
                <div key={month.label} className="rounded-none border border-[#e0e0e0] bg-[#fafafc] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#1d1d1f]">{month.label}</p>
                      <p className="text-sm text-[#7a7a7a]">{month.totalClasses} recorded classes</p>
                    </div>
                    <Badge variant="info">{formatPercent(month.attendancePercentage)}</Badge>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-[#e9e9eb]">
                    <div
                      className="h-2 rounded-full bg-[#1d1d1f]"
                      style={{ width: `${Math.max(month.attendancePercentage, 6)}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-[#7a7a7a]">
                    <span>{month.presentDays} present</span>
                    <span>{month.absentDays} absent</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-none border border-dashed border-[#e0e0e0] p-8 text-center text-sm text-[#7a7a7a]">
                No attendance has been recorded for this student yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#1d1d1f]">Date-wise history</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.history.length ? (
                  student.history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-[#1d1d1f]">
                        {formatDateLabel(item.date, "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === "present" ? "success" : "danger"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-slate-500">
                      No attendance history yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
