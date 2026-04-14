import { PageHeader } from "@/components/shared/page-header";
import { AttendanceMarker } from "@/components/mark/attendance-marker";
import { getMarkAttendanceData } from "@/lib/data";
import { todayKey } from "@/lib/date";

export const dynamic = "force-dynamic";

export default async function MarkAttendancePage() {
  const data = await getMarkAttendanceData();
  const today = todayKey();
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
        title="Mark attendance in one smooth pass."
        description="Use fast present and absent toggles, then save the full register for today without duplicate entries."
      />

      <AttendanceMarker
        students={data.students}
        today={today}
        initialStatuses={initialStatuses}
      />
    </div>
  );
}
