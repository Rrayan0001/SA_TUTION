import { NextResponse } from "next/server";

import { getAttendanceDetail } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const { date } = await params;
  const detail = await getAttendanceDetail(date);

  return NextResponse.json(detail);
}
