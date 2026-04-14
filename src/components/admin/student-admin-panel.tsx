"use client";

import { useState } from "react";
import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Student = {
  id: string;
  name: string;
  className: string;
};

type StudentAdminPanelProps = {
  students: Student[];
};

type FormState = {
  name: string;
  className: string;
};

const initialFormState = {
  name: "",
  className: ""
};

export function StudentAdminPanel({ students }: StudentAdminPanelProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState<Student | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);

  const totalStudents = students.length;

  const updateField = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const openCreate = () => {
    setForm(initialFormState);
    setCreating(true);
  };

  const openEdit = (student: Student) => {
    setForm({
      name: student.name,
      className: student.className
    });
    setEditing(student);
  };

  const refreshView = () => {
    setCreating(false);
    setEditing(null);
    setDeleting(null);
    setForm(initialFormState);
    router.refresh();
  };

  const saveStudent = async () => {
    if (!form.name.trim() || !form.className.trim()) {
      toast.error("Student name and class are required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(editing ? `/api/students/${editing.id}` : "/api/students", {
        method: editing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to save student.");
      }

      toast.success(editing ? "Student updated successfully." : "Student added successfully.");
      refreshView();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save student.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async () => {
    if (!deleting) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/students/${deleting.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to delete student.");
      }

      toast.success("Student deleted successfully.");
      refreshView();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Student management</CardTitle>
              <p className="mt-2 text-sm text-slate-500">
                Maintain your student list with clean, validated admin controls.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-[20px] bg-slate-50 px-4 py-3 text-sm text-slate-500">
                {totalStudents} students
              </div>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 sm:p-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-slate-900">{student.name}</p>
                  <p className="text-sm text-slate-500">{student.className}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => openEdit(student)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => setDeleting(student)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={creating || Boolean(editing)} onOpenChange={(open) => (!open ? refreshView() : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit student" : "Add student"}</DialogTitle>
            <DialogDescription>
              Keep your student registry accurate and clean with validated details.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="student-name">Student Name</Label>
              <Input
                id="student-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-class">Class</Label>
              <Input
                id="student-class"
                value={form.className}
                onChange={(event) => updateField("className", event.target.value)}
                placeholder="Grade 8 / Batch A"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={refreshView}>
              Cancel
            </Button>
            <Button onClick={saveStudent} disabled={saving}>
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              {editing ? "Save Changes" : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleting)} onOpenChange={(open) => (!open ? setDeleting(null) : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete student</DialogTitle>
            <DialogDescription>
              This removes the student and all linked attendance entries. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-[22px] bg-rose-50 p-4 text-sm text-rose-700">
            {deleting?.name} will be removed from the dashboard, reports, and attendance history.
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={deleteStudent} disabled={saving}>
              {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
