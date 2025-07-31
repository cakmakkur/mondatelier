export class DateFormatter {
  public static extractYear(rawDate: Date) {
    return rawDate.toString().substring(0, 4);
  }

  public static extractMonth(rawDate: Date) {
    return rawDate.toString().substring(5, 7);
  }

  public static extractDay(rawDate: Date) {
    return rawDate.toString().substring(8, 10);
  }

  public static extractTime(rawDate: Date) {
    return rawDate.toString().substring(11, 16);
  }

  public static extractFullDate(rawDate: Date) {
    const day = this.extractDay(rawDate);
    const month = this.extractMonth(rawDate);
    const year = this.extractYear(rawDate);
    return day + "." + month + "." + year;
  }

  public static extractDayMonth(rawDate: Date) {
    const day = this.extractDay(rawDate);
    const month = this.extractMonth(rawDate);
    return day + "." + month + ".";
  }
}
