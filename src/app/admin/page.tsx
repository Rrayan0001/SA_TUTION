import { StudentAdminPanel } from "@/components/admin/student-admin-panel";
import { PageHeader } from "@/components/shared/page-header";
import { getAdminStudents } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const students = await getAdminStudents();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Panel"
        title="Manage students with a clean, premium workflow."
        description="Add new students, update their details, and safely remove records with confirmation before destructive actions."
      />

      <StudentAdminPanel students={students} />
    </div>
  );
}
