export function getWeekNumber(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // Set to nearest Thursday: current date + 4 - current day number (Sunday = 7)
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

  // Get first day of year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  // Calculate week number
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return weekNo;
}

export function getDateOfISOWeek(week: number, year: number): Date {
  const simple = new Date(year, 0, 1 + (week - 1) * 7); // Jan 1 + (week-1)*7 days
  const dayOfWeek = simple.getDay(); // 0=Sun, 1=Mon, ...
  const ISOWeekStart = simple;

  // Adjust to Monday
  const diff = (dayOfWeek <= 0 ? 7 : dayOfWeek) - 1;
  ISOWeekStart.setDate(simple.getDate() - diff);

  return ISOWeekStart;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
