import { describe, expect, it } from '@jest/globals';
import { MathHelper } from '../../math/math.util';

describe('MathHelper', () => {
  describe('roundUp', () => {
    it('should round up to the specified precision', () => {
      expect(MathHelper.roundUp(12.341, 2)).toBe(12.35);
      expect(MathHelper.roundUp(12.345, 2)).toBe(12.35);
      expect(MathHelper.roundUp(12.3, 0)).toBe(13);
    });

    it('should round negative numbers toward positive infinity', () => {
      expect(MathHelper.roundUp(-12.341, 2)).toBe(-12.34);
      expect(MathHelper.roundUp(-12.349, 2)).toBe(-12.34);
    });

    it('should support zero precision and large precision', () => {
      expect(MathHelper.roundUp(12.1, 0)).toBe(13);
      expect(MathHelper.roundUp(1.234, 100)).toBe(1.234);
    });

    it.each([NaN, Infinity, -Infinity, '12.34', null, undefined])(
      'should reject invalid values: %s',
      (value) => {
        expect(() => MathHelper.roundUp(value, 2)).toThrow(TypeError);
      },
    );

    it.each([-1, 1.5, 101, NaN, Infinity])(
      'should reject invalid precision: %s',
      (precision) => {
        expect(() => MathHelper.roundUp(12.34, precision)).toThrow(RangeError);
      },
    );
  });

  describe('roundDown', () => {
    it('should round down to the specified precision', () => {
      expect(MathHelper.roundDown(12.349, 2)).toBe(12.34);
      expect(MathHelper.roundDown(12.341, 2)).toBe(12.34);
      expect(MathHelper.roundDown(12.9, 0)).toBe(12);
    });

    it('should round negative numbers toward negative infinity', () => {
      expect(MathHelper.roundDown(-12.341, 2)).toBe(-12.35);
      expect(MathHelper.roundDown(-12.349, 2)).toBe(-12.35);
    });

    it('should reject non-finite values', () => {
      expect(() => MathHelper.roundDown(NaN, 2)).toThrow(TypeError);
      expect(() => MathHelper.roundDown(Infinity, 2)).toThrow(TypeError);
    });

    it('should reject invalid precision', () => {
      expect(() => MathHelper.roundDown(12.34, -1)).toThrow(RangeError);
      expect(() => MathHelper.roundDown(12.34, 1.5)).toThrow(RangeError);
      expect(() => MathHelper.roundDown(12.34, 101)).toThrow(RangeError);
    });
  });

  describe('round', () => {
    it('should round to the nearest value at the specified precision', () => {
      expect(MathHelper.round(12.345, 2)).toBe(12.35);
      expect(MathHelper.round(12.6)).toBe(13);
      expect(MathHelper.round(12.4)).toBe(12);
    });

    it('should support negative numbers', () => {
      expect(MathHelper.round(-12.6)).toBe(-13);
      expect(MathHelper.round(-12.345, 2)).toBe(-12.34);
    });

    it('should support explicit zero precision', () => {
      expect(MathHelper.round(12.6, 0)).toBe(13);
    });

    it('should reject non-finite values', () => {
      expect(() => MathHelper.round(NaN)).toThrow(TypeError);
      expect(() => MathHelper.round(Infinity)).toThrow(TypeError);
    });

    it('should reject invalid precision', () => {
      expect(() => MathHelper.round(12.34, -1)).toThrow(RangeError);
      expect(() => MathHelper.round(12.34, 1.5)).toThrow(RangeError);
      expect(() => MathHelper.round(12.34, 101)).toThrow(RangeError);
    });
  });

  describe('absolute', () => {
    it('should return the absolute value', () => {
      expect(MathHelper.absolute(-15)).toBe(15);
      expect(MathHelper.absolute(15)).toBe(15);
      expect(MathHelper.absolute(0)).toBe(0);
    });

    it('should reject non-finite values', () => {
      expect(() => MathHelper.absolute(NaN)).toThrow(TypeError);
      expect(() => MathHelper.absolute(Infinity)).toThrow(TypeError);
    });

    it('should reject non-numeric values', () => {
      expect(() => MathHelper.absolute('15')).toThrow(TypeError);
      expect(() => MathHelper.absolute(null)).toThrow(TypeError);
    });
  });

  describe('clamp', () => {
    it('should restrict values to the specified range', () => {
      expect(MathHelper.clamp(120, 0, 100)).toBe(100);
      expect(MathHelper.clamp(-5, 0, 100)).toBe(0);
      expect(MathHelper.clamp(50, 0, 100)).toBe(50);
    });

    it('should allow values equal to either boundary', () => {
      expect(MathHelper.clamp(0, 0, 100)).toBe(0);
      expect(MathHelper.clamp(100, 0, 100)).toBe(100);
    });

    it('should support a range with equal boundaries', () => {
      expect(MathHelper.clamp(5, 10, 10)).toBe(10);
    });

    it('should support negative ranges', () => {
      expect(MathHelper.clamp(-5, -10, -1)).toBe(-5);
      expect(MathHelper.clamp(-20, -10, -1)).toBe(-10);
    });

    it('should reject non-finite arguments', () => {
      expect(() => MathHelper.clamp(NaN, 0, 100)).toThrow(TypeError);
      expect(() => MathHelper.clamp(5, -Infinity, 100)).toThrow(TypeError);
      expect(() => MathHelper.clamp(5, 0, Infinity)).toThrow(TypeError);
    });

    it('should reject min greater than max', () => {
      expect(() => MathHelper.clamp(5, 10, 0)).toThrow(RangeError);
      expect(() => MathHelper.clamp(5, 10, 0)).toThrow(
        'MathHelper.clamp: min cannot exceed max',
      );
    });
  });

  describe('percentage', () => {
    it('should calculate what percentage a value represents of a total', () => {
      expect(MathHelper.percentage(25, 200)).toBe(12.5);
      expect(MathHelper.percentage(50, 200)).toBe(25);
      expect(MathHelper.percentage(200, 200)).toBe(100);
    });

    it('should support negative values and percentages above 100', () => {
      expect(MathHelper.percentage(-25, 100)).toBe(-25);
      expect(MathHelper.percentage(150, 100)).toBe(150);
    });

    it('should return zero when the portion is zero', () => {
      expect(MathHelper.percentage(0, 200)).toBe(0);
    });

    it('should reject a zero total', () => {
      expect(() => MathHelper.percentage(25, 0)).toThrow(RangeError);
      expect(() => MathHelper.percentage(25, 0)).toThrow(
        'MathHelper.percentage: total cannot be zero',
      );
    });

    it('should reject non-finite arguments', () => {
      expect(() => MathHelper.percentage(NaN, 100)).toThrow(TypeError);
      expect(() => MathHelper.percentage(25, Infinity)).toThrow(TypeError);
    });
  });

  describe('percentageOf', () => {
    it('should calculate a percentage of a value', () => {
      expect(MathHelper.percentageOf(200, 15)).toBe(30);
      expect(MathHelper.percentageOf(80, 25)).toBe(20);
      expect(MathHelper.percentageOf(100, 100)).toBe(100);
    });

    it('should support zero and negative inputs', () => {
      expect(MathHelper.percentageOf(200, 0)).toBe(0);
      expect(MathHelper.percentageOf(-200, 10)).toBe(-20);
      expect(MathHelper.percentageOf(200, -10)).toBe(-20);
    });

    it('should reject non-finite arguments', () => {
      expect(() => MathHelper.percentageOf(NaN, 10)).toThrow(TypeError);
      expect(() => MathHelper.percentageOf(100, Infinity)).toThrow(TypeError);
    });

    it('should reject non-numeric arguments', () => {
      expect(() => MathHelper.percentageOf('100', 10)).toThrow(TypeError);
      expect(() => MathHelper.percentageOf(100, null)).toThrow(TypeError);
    });
  });

  describe('sum', () => {
    it('should calculate the sum of numbers', () => {
      expect(MathHelper.sum([10, 20, 30])).toBe(60);
      expect(MathHelper.sum([1, 2, 3, 4])).toBe(10);
    });

    it('should return zero for an empty array', () => {
      expect(MathHelper.sum([])).toBe(0);
    });

    it('should support negative numbers and zero', () => {
      expect(MathHelper.sum([-10, 5, 0])).toBe(-5);
      expect(MathHelper.sum([0, 0])).toBe(0);
    });

    it('should accept a readonly array', () => {
      const values: readonly number[] = [10, 20, 30];

      expect(MathHelper.sum(values)).toBe(60);
    });

    it('should reject non-finite array elements', () => {
      expect(() => MathHelper.sum([1, NaN])).toThrow(TypeError);
      expect(() => MathHelper.sum([1, Infinity])).toThrow(TypeError);
    });

    it('should reject a non-array input', () => {
      expect(() =>
        MathHelper.sum('not an array' as unknown as readonly number[]),
      ).toThrow(TypeError);
    });
  });

  describe('average', () => {
    it('should calculate the arithmetic mean', () => {
      expect(MathHelper.average([10, 20, 30])).toBe(20);
      expect(MathHelper.average([1, 2, 3, 4])).toBe(2.5);
    });

    it('should support negative numbers', () => {
      expect(MathHelper.average([-10, 0, 10])).toBe(0);
      expect(MathHelper.average([-2, -4])).toBe(-3);
    });

    it('should reject an empty array', () => {
      expect(() => MathHelper.average([])).toThrow(RangeError);
      expect(() => MathHelper.average([])).toThrow(
        'MathHelper.average: array cannot be empty',
      );
    });

    it('should reject non-finite array elements', () => {
      expect(() => MathHelper.average([1, NaN])).toThrow(TypeError);
      expect(() => MathHelper.average([1, Infinity])).toThrow(TypeError);
    });

    it('should reject a non-array input', () => {
      expect(() =>
        MathHelper.average('not an array' as unknown as readonly number[]),
      ).toThrow(TypeError);
    });
  });

  describe('min', () => {
    it('should find the smallest number', () => {
      expect(MathHelper.min([10, 5, 30])).toBe(5);
      expect(MathHelper.min([-10, -5, 0])).toBe(-10);
    });

    it('should handle an array containing one number', () => {
      expect(MathHelper.min([42])).toBe(42);
    });

    it('should reject an empty array', () => {
      expect(() => MathHelper.min([])).toThrow(RangeError);
      expect(() => MathHelper.min([])).toThrow(
        'MathHelper.min: array cannot be empty',
      );
    });

    it('should reject non-finite array elements', () => {
      expect(() => MathHelper.min([1, NaN])).toThrow(TypeError);
      expect(() => MathHelper.min([1, -Infinity])).toThrow(TypeError);
    });

    it('should reject a non-array input', () => {
      expect(() =>
        MathHelper.min('not an array' as unknown as readonly number[]),
      ).toThrow(TypeError);
    });
  });

  describe('max', () => {
    it('should find the largest number', () => {
      expect(MathHelper.max([10, 5, 30])).toBe(30);
      expect(MathHelper.max([-10, -5, 0])).toBe(0);
    });

    it('should handle an array containing one number', () => {
      expect(MathHelper.max([42])).toBe(42);
    });

    it('should reject an empty array', () => {
      expect(() => MathHelper.max([])).toThrow(RangeError);
      expect(() => MathHelper.max([])).toThrow(
        'MathHelper.max: array cannot be empty',
      );
    });

    it('should reject non-finite array elements', () => {
      expect(() => MathHelper.max([1, NaN])).toThrow(TypeError);
      expect(() => MathHelper.max([1, Infinity])).toThrow(TypeError);
    });

    it('should reject a non-array input', () => {
      expect(() =>
        MathHelper.max('not an array' as unknown as readonly number[]),
      ).toThrow(TypeError);
    });
  });

  describe('isBetween', () => {
    it('should return true when a value is within the range', () => {
      expect(MathHelper.isBetween(15, 10, 20)).toBe(true);
      expect(MathHelper.isBetween(10, 10, 20)).toBe(true);
      expect(MathHelper.isBetween(20, 10, 20)).toBe(true);
    });

    it('should return false when a value is outside the range', () => {
      expect(MathHelper.isBetween(5, 10, 20)).toBe(false);
      expect(MathHelper.isBetween(25, 10, 20)).toBe(false);
    });

    it('should exclude boundaries when inclusive is false', () => {
      expect(MathHelper.isBetween(15, 10, 20, false)).toBe(true);
      expect(MathHelper.isBetween(10, 10, 20, false)).toBe(false);
      expect(MathHelper.isBetween(20, 10, 20, false)).toBe(false);
    });

    it('should handle equal boundaries', () => {
      expect(MathHelper.isBetween(10, 10, 10)).toBe(true);
      expect(MathHelper.isBetween(10, 10, 10, false)).toBe(false);
    });

    it('should reject non-finite arguments', () => {
      expect(() => MathHelper.isBetween(NaN, 0, 10)).toThrow(TypeError);
      expect(() => MathHelper.isBetween(5, -Infinity, 10)).toThrow(TypeError);
      expect(() => MathHelper.isBetween(5, 0, Infinity)).toThrow(TypeError);
    });

    it('should reject min greater than max', () => {
      expect(() => MathHelper.isBetween(5, 10, 0)).toThrow(RangeError);
      expect(() => MathHelper.isBetween(5, 10, 0)).toThrow(
        'MathHelper.isBetween: min cannot exceed max',
      );
    });
  });

  describe('percentageChange', () => {
    it('should calculate percentage increase', () => {
      expect(MathHelper.percentageChange(100, 125)).toBe(25);
      expect(MathHelper.percentageChange(50, 75)).toBe(50);
    });

    it('should calculate percentage decrease', () => {
      expect(MathHelper.percentageChange(100, 80)).toBe(-20);
      expect(MathHelper.percentageChange(200, 100)).toBe(-50);
    });

    it('should return zero when there is no change', () => {
      expect(MathHelper.percentageChange(100, 100)).toBe(0);
      expect(MathHelper.percentageChange(-100, -100)).toBe(0);
    });

    it('should handle negative previous values using their absolute magnitude', () => {
      expect(MathHelper.percentageChange(-100, -50)).toBe(50);
      expect(MathHelper.percentageChange(-100, -150)).toBe(-50);
    });

    it('should handle a current value of zero', () => {
      expect(MathHelper.percentageChange(100, 0)).toBe(-100);
      expect(MathHelper.percentageChange(-100, 0)).toBe(100);
    });

    it('should reject a zero previous value', () => {
      expect(() => MathHelper.percentageChange(0, 100)).toThrow(RangeError);
      expect(() => MathHelper.percentageChange(0, 100)).toThrow(
        'MathHelper.percentageChange: previous value cannot be zero',
      );
    });

    it('should reject non-finite arguments', () => {
      expect(() => MathHelper.percentageChange(NaN, 100)).toThrow(TypeError);
      expect(() => MathHelper.percentageChange(100, Infinity)).toThrow(
        TypeError,
      );
    });

    it('should reject non-numeric arguments', () => {
      expect(() => MathHelper.percentageChange('100', 125)).toThrow(TypeError);
      expect(() => MathHelper.percentageChange(100, null)).toThrow(TypeError);
    });
  });
});
