import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { TimeUtils } from '../../date/date.util';

describe('TimeUtils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getMinutesLeft', () => {
    it('should return the remaining minutes until expiration', () => {
      const expiresAt = new Date('2026-10-15T12:05:00.000Z');

      expect(TimeUtils.getMinutesLeft(expiresAt)).toBe(5);
    });

    it('should round up partial minutes', () => {
      const expiresAt = new Date('2026-10-15T12:02:01.000Z');

      expect(TimeUtils.getMinutesLeft(expiresAt)).toBe(3);
    });

    it('should return zero when the expiration time has passed', () => {
      const expiresAt = new Date('2026-10-15T11:55:00.000Z');

      expect(TimeUtils.getMinutesLeft(expiresAt)).toBe(0);
    });

    it('should return zero when the expiration time is now', () => {
      const expiresAt = new Date('2026-10-15T12:00:00.000Z');

      expect(TimeUtils.getMinutesLeft(expiresAt)).toBe(0);
    });

    it('should return one for an expiration less than one minute away', () => {
      const expiresAt = new Date('2026-10-15T12:00:01.000Z');

      expect(TimeUtils.getMinutesLeft(expiresAt)).toBe(1);
    });

    it('should accept a date-like value supported by the Date constructor', () => {
      const expiresAt = new Date('2026-10-15T12:10:00.000Z');

      expect(TimeUtils.getMinutesLeft(expiresAt)).toBe(10);
    });
  });
});
