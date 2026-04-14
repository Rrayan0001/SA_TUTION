import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StudentCard } from "@/components/students/student-card";
import { StudentFilters } from "@/components/students/student-filters";
import { getStudentsOverview } from "@/lib/data";

export const dynamic = "force-dynamic";

type StudentsPageProps = {
  searchParams: Promise<{ q?: string; class?: string }>;
};

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const params = await searchParams;
  const data = await getStudentsOverview({
    query: params.q,
    className: params.class
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Student Reports"
        title="Review attendance performance student by student."
        description="Search by name, filter by class, and open an individual report to inspect monthly and date-wise attendance history."
      />

      <StudentFilters classes={data.classes} query={params.q} className={params.class} />

      {data.students.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.students.map((student) => (
            <StudentCard key={student.id} {...student} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No students match your filters"
          description="Adjust the search text or class filter to see more student reports."
        />
      )}
    </div>
  );
}
