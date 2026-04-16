import { Status } from "@prisma/client";
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns";

import { dateKey, toDateOnly } from "@/lib/date";
import { prisma } from "@/lib/prisma";

type StudentSummaryFilters = {
  query?: string;
  className?: string;
};

function buildStudentWhere(filters?: StudentSummaryFilters) {
  return {
    ...(filters?.query
      ? {
          name: {
            contains: filters.query,
            mode: "insensitive" as const
          }
        }
      : {}),
    ...(filters?.className
      ? {
          className: filters.className
        }
      : {})
  };
}

export async function getClassOptions() {
  const classes = await prisma.student.findMany({
    distinct: ["className"],
    select: { className: true },
    orderBy: { className: "asc" }
  });

  return classes.map((item) => item.className);
}

export async function getAdminStudents() {
  return prisma.student.findMany({
    orderBy: [{ className: "asc" }, { name: "asc" }]
  });
}

export async function getMarkAttendanceData(date: string) {
  const [students, today] = await Promise.all([
    prisma.student.findMany({
      orderBy: [{ className: "asc" }, { name: "asc" }]
    }),
    getAttendanceDetail(date)
  ]);

  return {
    students,
    today
  };
}

export async function getDashboardMonth(month: string) {
  const monthDate = parseISO(`${month}-01`);
  const start = toDateOnly(format(startOfMonth(monthDate), "yyyy-MM-dd"));
  const end = toDateOnly(format(endOfMonth(monthDate), "yyyy-MM-dd"));

  const [studentCount, attendanceRecords, holidayRecords] = await Promise.all([
    prisma.student.count(),
    prisma.attendance.findMany({
      where: {
        date: {
          gte: start,
          lte: end
        }
      },
      select: {
        date: true,
        status: true
      }
    }),
    prisma.holiday.findMany({
      where: {
        date: {
          gte: start,
          lte: end
        }
      },
      select: {
        date: true,
        reason: true
      }
    })
  ]);

  const holidayDates = new Set(holidayRecords.map((record) => dateKey(record.date)));
  const holidayReasonMap = new Map(holidayRecords.map((record) => [dateKey(record.date), record.reason]));

  const statsMap = new Map<
    string,
    {
      present: number;
      absent: number;
      recordCount: number;
    }
  >();

  for (const record of attendanceRecords) {
    const key = dateKey(record.date);
    if (holidayDates.has(key)) {
      continue;
    }

    const current = statsMap.get(key) ?? { present: 0, absent: 0, recordCount: 0 };
    current.recordCount += 1;
    if (record.status === Status.present) {
      current.present += 1;
    } else {
      current.absent += 1;
    }
    statsMap.set(key, current);
  }

  const attendanceDays = Array.from(statsMap.entries()).map(([key, value]) => {
    const attendancePercentage = studentCount === 0 ? 0 : (value.present / studentCount) * 100;

    let tone: "green" | "yellow" | "red" | "blue" | "holiday" = "blue";
    if (value.absent === 0 && value.recordCount >= studentCount && studentCount > 0) {
      tone = "green";
    } else if (attendancePercentage > 0 && attendancePercentage < 60) {
      tone = "red";
    } else if (value.absent > 0) {
      tone = "yellow";
    }

    return {
      date: key,
      present: value.present,
      absent: value.absent,
      recordCount: value.recordCount,
      attendancePercentage,
      tone,
      isHoliday: false
    };
  });

  const holidayDays = Array.from(holidayDates).map((key) => ({
    date: key,
    present: 0,
    absent: 0,
    recordCount: 0,
    attendancePercentage: 0,
    tone: "holiday" as const,
    isHoliday: true,
    holidayReason: holidayReasonMap.get(key) ?? null
  }));

  const days = [...attendanceDays, ...holidayDays].sort((a, b) => a.date.localeCompare(b.date));
  const totalPresent = attendanceDays.reduce((sum, day) => sum + day.present, 0);
  const daysTracked = attendanceDays.length;
  const averageAttendance =
    studentCount === 0 || daysTracked === 0
      ? 0
      : (totalPresent / (studentCount * daysTracked)) * 100;

  return {
    month,
    studentCount,
    days,
    summary: {
      totalStudents: studentCount,
      daysTracked,
      holidays: holidayDays.length,
      totalPresent,
      averageAttendance
    }
  };
}

export async function getAttendanceDetail(date: string) {
  const normalizedDate = toDateOnly(date);

  const [students, records, holiday] = await Promise.all([
    prisma.student.findMany({
      orderBy: [{ className: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        className: true
      }
    }),
    prisma.attendance.findMany({
      where: { date: normalizedDate },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            className: true
          }
        }
      }
    }),
    prisma.holiday.findUnique({
      where: { date: normalizedDate },
      select: { id: true, reason: true }
    })
  ]);

  const recordMap = new Map(records.map((record) => [record.studentId, record.status]));
  const isHoliday = Boolean(holiday);
  const presentCount = records.filter((record) => record.status === Status.present).length;
  const absentCount = records.filter((record) => record.status === Status.absent).length;
  const totalStudents = students.length;
  const attendancePercentage = isHoliday || totalStudents === 0 ? 0 : (presentCount / totalStudents) * 100;

  return {
    date,
    isHoliday,
    holidayReason: holiday?.reason ?? null,
    totalStudents,
    presentCount: isHoliday ? 0 : presentCount,
    absentCount: isHoliday ? 0 : absentCount,
    attendancePercentage,
    list: students.map((student) => ({
      ...student,
      status: isHoliday ? "holiday" : recordMap.get(student.id) ?? "not_marked"
    }))
  };
}

export async function getStudentsOverview(filters?: StudentSummaryFilters) {
  const [students, classes] = await Promise.all([
    prisma.student.findMany({
      where: buildStudentWhere(filters),
      include: {
        attendance: {
          orderBy: { date: "desc" },
          select: {
            date: true,
            status: true
          }
        }
      },
      orderBy: [{ className: "asc" }, { name: "asc" }]
    }),
    getClassOptions()
  ]);

  return {
    classes,
    students: students.map((student) => {
      const totalClasses = student.attendance.length;
      const presentDays = student.attendance.filter((item) => item.status === Status.present).length;
      const absentDays = student.attendance.filter((item) => item.status === Status.absent).length;
      const attendancePercentage = totalClasses === 0 ? 0 : (presentDays / totalClasses) * 100;

      return {
        id: student.id,
        name: student.name,
        className: student.className,
        totalClasses,
        presentDays,
        absentDays,
        attendancePercentage
      };
    })
  };
}

export async function getStudentDetail(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      attendance: {
        orderBy: { date: "desc" }
      }
    }
  });

  if (!student) {
    return null;
  }

  const totalClasses = student.attendance.length;
  const presentDays = student.attendance.filter((item) => item.status === Status.present).length;
  const absentDays = student.attendance.filter((item) => item.status === Status.absent).length;
  const attendancePercentage = totalClasses === 0 ? 0 : (presentDays / totalClasses) * 100;

  const monthlyMap = new Map<
    string,
    {
      label: string;
      totalClasses: number;
      presentDays: number;
      absentDays: number;
    }
  >();

  for (const item of student.attendance) {
    const monthKey = format(item.date, "yyyy-MM");
    const label = format(item.date, "MMMM yyyy");
    const current = monthlyMap.get(monthKey) ?? {
      label,
      totalClasses: 0,
      presentDays: 0,
      absentDays: 0
    };
    current.totalClasses += 1;
    if (item.status === Status.present) {
      current.presentDays += 1;
    } else {
      current.absentDays += 1;
    }
    monthlyMap.set(monthKey, current);
  }

  const monthlySummary = Array.from(monthlyMap.values()).map((entry) => ({
    ...entry,
    attendancePercentage:
      entry.totalClasses === 0 ? 0 : (entry.presentDays / entry.totalClasses) * 100
  }));

  return {
    id: student.id,
    name: student.name,
    className: student.className,
    totalClasses,
    presentDays,
    absentDays,
    attendancePercentage,
    monthlySummary,
    history: student.attendance.map((item) => ({
      id: item.id,
      date: dateKey(item.date),
      status: item.status
    }))
  };
}
