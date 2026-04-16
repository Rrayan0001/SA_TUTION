import { PageHeader } from "@/components/shared/page-header";
import { AttendanceMarker } from "@/components/mark/attendance-marker";
import { getMarkAttendanceData } from "@/lib/data";
import { todayKey } from "@/lib/date";

export const dynamic = "force-dynamic";

type MarkAttendancePageProps = {
  searchParams: Promise<{ date?: string }>;
};

function getSafeAttendanceDate(date: string | undefined, maxDate: string) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return maxDate;
  }

  return date > maxDate ? maxDate : date;
}

export default async function MarkAttendancePage({ searchParams }: MarkAttendancePageProps) {
  const today = todayKey();
  const params = await searchParams;
  const selectedDate = getSafeAttendanceDate(params.date, today);
  const data = await getMarkAttendanceData(selectedDate);
  const initialStatuses = data.today.list.reduce<
    Record<string, "present" | "absent" | "not_marked">
  >((accumulator, item) => {
    accumulator[item.id] = item.status as "present" | "absent" | "not_marked";
    return accumulator;
  }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Daily Workflow"
        title="Mark attendance for any previous class day."
        description="Choose today or an earlier date, use fast present and absent toggles, then save without duplicate entries."
      />

      <AttendanceMarker
        students={data.students}
        selectedDate={selectedDate}
        maxDate={today}
        initialStatuses={initialStatuses}
      />
    </div>
  );
}
