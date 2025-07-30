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
