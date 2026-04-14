import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/lib/validators";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = studentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload." }, { status: 400 });
  }

  const duplicate = await prisma.student.findFirst({
    where: {
      NOT: { id },
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

  if (duplicate) {
    return NextResponse.json(
      { error: "Another student with the same name and class already exists." },
      { status: 409 }
    );
  }

  await prisma.student.update({
    where: { id },
    data: parsed.data
  });

  revalidatePath("/");
  revalidatePath("/mark-attendance");
  revalidatePath("/students");
  revalidatePath(`/students/${id}`);
  revalidatePath("/admin");

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.student.delete({
    where: { id }
  });

  revalidatePath("/");
  revalidatePath("/mark-attendance");
  revalidatePath("/students");
  revalidatePath("/admin");

  return NextResponse.json({ success: true });
}
