import { describe, expect, it } from '@jest/globals';
import { FileHelper } from '../../file/file.util';

describe('FileHelper', () => {
  describe('fileTypeFromBuffer', () => {
    it('should detect a PNG image from its buffer', async () => {
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
        0x49, 0x48, 0x44, 0x52,
      ]);

      const result = await FileHelper.fileTypeFromBuffer(pngBuffer);

      expect(result).toBeDefined();
      expect(result?.ext).toBe('png');
      expect(result?.mime).toBe('image/png');
    });

    it('should return undefined for an unrecognized buffer', async () => {
      const buffer = Buffer.from('This is not a recognized file format.');

      const result = await FileHelper.fileTypeFromBuffer(buffer);

      expect(result).toBeUndefined();
    });

    it('should return undefined for an empty buffer', async () => {
      const result = await FileHelper.fileTypeFromBuffer(Buffer.alloc(0));

      expect(result).toBeUndefined();
    });
  });

  describe('humanReadableSize', () => {
    it('should format bytes', () => {
      expect(FileHelper.humanReadableSize(0)).toBe('0.00 B');
      expect(FileHelper.humanReadableSize(500)).toBe('500.00 B');
    });

    it('should format kilobytes', () => {
      expect(FileHelper.humanReadableSize(1024)).toBe('1.00 KB');
      expect(FileHelper.humanReadableSize(1536)).toBe('1.50 KB');
    });

    it('should format megabytes', () => {
      expect(FileHelper.humanReadableSize(1024 ** 2)).toBe('1.00 MB');
      expect(FileHelper.humanReadableSize(1.5 * 1024 ** 2)).toBe('1.50 MB');
    });

    it('should format gigabytes', () => {
      expect(FileHelper.humanReadableSize(1024 ** 3)).toBe('1.00 GB');
    });

    it('should format terabytes', () => {
      expect(FileHelper.humanReadableSize(1024 ** 4)).toBe('1.00 TB');
    });

    it('should not exceed terabytes for larger values', () => {
      expect(FileHelper.humanReadableSize(1024 ** 5)).toBe('1024.00 TB');
    });

    it('should format values smaller than one byte', () => {
      expect(FileHelper.humanReadableSize(0.5)).toBe('0.50 B');
    });
  });
});
