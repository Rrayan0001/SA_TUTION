import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { toDateOnly, todayKey } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { holidayPayloadSchema } from "@/lib/validators";

function revalidateAttendanceViews(date: string) {
  revalidatePath("/");
  revalidatePath(`/api/attendance/${date}`);
  revalidatePath("/mark-attendance");
  revalidatePath("/students");
}

function normalizeReason(reason: string | undefined) {
  const trimmed = reason?.trim();
  return trimmed ? trimmed : null;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = holidayPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload." }, { status: 400 });
  }

  if (parsed.data.date > todayKey()) {
    return NextResponse.json({ error: "Future dates cannot be marked as holidays." }, { status: 400 });
  }

  const normalizedDate = toDateOnly(parsed.data.date);
  const reason = normalizeReason(parsed.data.reason);

  await prisma.$transaction([
    prisma.attendance.deleteMany({
      where: { date: normalizedDate }
    }),
    prisma.holiday.upsert({
      where: { date: normalizedDate },
      update: { reason },
      create: { date: normalizedDate, reason }
    })
  ]);

  revalidateAttendanceViews(parsed.data.date);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = holidayPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload." }, { status: 400 });
  }

  await prisma.holiday.deleteMany({
    where: { date: toDateOnly(parsed.data.date) }
  });

  revalidateAttendanceViews(parsed.data.date);

  return NextResponse.json({ success: true });
}
