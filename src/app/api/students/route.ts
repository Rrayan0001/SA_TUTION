import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = studentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload." }, { status: 400 });
  }

  const existing = await prisma.student.findFirst({
    where: {
      name: {
        equals: parsed.data.name,
        mode: "insensitive"
      },
      className: {
        equals: parsed.data.className,
        mode: "insensitive"
      }
    }
  });

  if (existing) {
    return NextResponse.json(
      { error: "A student with the same name and class already exists." },
      { status: 409 }
    );
  }

  await prisma.student.create({
    data: parsed.data
  });

  revalidatePath("/");
  revalidatePath("/mark-attendance");
  revalidatePath("/students");
  revalidatePath("/admin");

  return NextResponse.json({ success: true });
}
