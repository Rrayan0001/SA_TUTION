import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths
} from "date-fns";

export function todayKey() {
  return format(new Date(), "yyyy-MM-dd");
}

export function toDateOnly(value: string | Date) {
  const key = typeof value === "string" ? value : value.toISOString().slice(0, 10);
  return new Date(`${key}T00:00:00.000Z`);
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDateLabel(value: string | Date, pattern = "dd MMM yyyy") {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, pattern);
}

export function buildMonthGrid(month: string) {
  const monthDate = parseISO(`${month}-01`);
  const start = startOfWeek(startOfMonth(monthDate), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(monthDate), { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    key: format(date, "yyyy-MM-dd"),
    inMonth: isSameMonth(date, monthDate)
  }));
}

export function shiftMonth(month: string, direction: "prev" | "next") {
  const base = parseISO(`${month}-01`);
  return format(direction === "prev" ? subMonths(base, 1) : addMonths(base, 1), "yyyy-MM");
}
