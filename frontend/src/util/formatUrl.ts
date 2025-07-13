export class FormatUrl {
  static toUser(url: string): string {
    url = url.replace(/^https?:\/\//, "");
    if (url.length > 20) {
      return url.slice(0, 17) + "...";
    }
    return url;
  }

  static toDB() {}
}
