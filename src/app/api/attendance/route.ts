import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { attendancePayloadSchema } from "@/lib/validators";
import { toDateOnly } from "@/lib/date";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = attendancePayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload." }, { status: 400 });
  }

  const normalizedDate = toDateOnly(parsed.data.date);

  await prisma.$transaction(
    parsed.data.entries.map((entry) =>
      prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: entry.studentId,
            date: normalizedDate
          }
        },
        update: {
          status: entry.status
        },
        create: {
          studentId: entry.studentId,
          date: normalizedDate,
          status: entry.status
        }
      })
    )
  );

  revalidatePath("/");
  revalidatePath("/mark-attendance");
  revalidatePath("/students");

  return NextResponse.json({ success: true });
}
