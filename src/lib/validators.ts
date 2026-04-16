import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().trim().min(1, "Student name is required"),
  className: z.string().trim().min(1, "Class is required")
});

export const attendanceEntrySchema = z.object({
  studentId: z.string().uuid(),
  status: z.enum(["present", "absent"])
});

export const attendancePayloadSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entries: z.array(attendanceEntrySchema).min(1, "Select at least one student")
});

export const holidayPayloadSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().trim().max(240, "Reason must be 240 characters or less").optional()
});
