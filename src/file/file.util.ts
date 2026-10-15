import type { FileTypeResult } from 'file-type';

export class FileHelper {
  static async fileTypeFromBuffer(
    buffer: Buffer,
  ): Promise<FileTypeResult | undefined> {
    const { fileTypeFromBuffer } = await import('file-type');
    return fileTypeFromBuffer(buffer);
  }

  static humanReadableSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex] ?? 'B'}`;
  }
}
