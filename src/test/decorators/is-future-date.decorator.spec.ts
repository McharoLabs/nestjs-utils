import { describe, expect, it } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { IsFutureDate, IsFutureDateConstraint } from '../../decorators';

class FutureDateDto {
  @IsFutureDate()
  date!: string;
}

function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year.toString()}-${month}-${day}`;
}

describe('IsFutureDate', () => {
  const constraint = new IsFutureDateConstraint();

  describe('validate', () => {
    it('should accept a future date', () => {
      expect(constraint.validate(getDateOffset(1))).toBe(true);
    });

    it('should reject a past date', () => {
      expect(constraint.validate(getDateOffset(-1))).toBe(false);
    });

    it('should reject today', () => {
      expect(constraint.validate(getDateOffset(0))).toBe(false);
    });

    it('should reject an invalid calendar date', () => {
      expect(constraint.validate('2026-02-30')).toBe(false);
    });

    it('should reject an invalid date format', () => {
      expect(constraint.validate('15/12/2027')).toBe(false);
    });

    it('should reject an empty string', () => {
      expect(constraint.validate('')).toBe(false);
    });

    it('should reject null and undefined', () => {
      expect(constraint.validate(null)).toBe(false);
      expect(constraint.validate(undefined)).toBe(false);
    });

    it('should reject non-string values', () => {
      expect(constraint.validate(123)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return the default validation message', () => {
      expect(constraint.defaultMessage()).toBe('Date must be in the future');
    });
  });

  describe('DTO validation', () => {
    it('should accept a future date in a DTO', () => {
      const dto = plainToInstance(FutureDateDto, {
        date: getDateOffset(1),
      });

      expect(validateSync(dto)).toHaveLength(0);
    });

    it('should reject today in a DTO', () => {
      const dto = plainToInstance(FutureDateDto, {
        date: getDateOffset(0),
      });

      expect(validateSync(dto)).toHaveLength(1);
    });
  });
});
