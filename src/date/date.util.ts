export class TimeUtils {
  static getMinutesLeft(expiresAt: Date): number {
    return Math.max(
      0,
      Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 60000),
    );
  }
}
