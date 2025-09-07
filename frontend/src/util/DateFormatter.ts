export class DateFormatter {
  public static extractYear(rawDate: Date): string {
    return String(rawDate.getFullYear()); // e.g. "2025"
  }

  public static extractMonth(rawDate: Date): string {
    // getMonth() returns 0-11, so +1
    return String(rawDate.getMonth() + 1).padStart(2, "0"); // e.g. "08"
  }

  public static extractDay(rawDate: Date): string {
    return String(rawDate.getDate()).padStart(2, "0"); // e.g. "19"
  }

  public static extractTime(rawDate: Date): string {
    // formats to HH:mm, always two digits
    return rawDate.toTimeString().slice(0, 5); // e.g. "14:30"
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

  public static createdXAgo(rawDate: Date) {
    const timestamp = new Date(rawDate).getTime();
    const timeDiff = Date.now() - timestamp;
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    if (hoursDiff < 24) {
      return hoursDiff + " hours ago";
    } else {
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        return daysDiff + " days ago";
      } else {
        const weeksDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
        if (weeksDiff < 4) {
          return weeksDiff + " weeks ago";
        } else {
          const monthsDiff = Math.floor(
            timeDiff / (1000 * 60 * 60 * 24 * 7 * 4)
          );
          if (monthsDiff < 12) {
            return monthsDiff + " months ago";
          } else {
            const yearsDiff = Math.floor(
              timeDiff / (1000 * 60 * 60 * 24 * 7 * 4 * 12)
            );
            return yearsDiff + " years ago";
          }
        }
      }
    }
  }
}
