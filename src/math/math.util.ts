/**
 * Provides reusable mathematical and numeric utility methods.
 *
 * @example
 * MathHelper.round(12.345, 2); // 12.35
 * MathHelper.percentage(25, 200); // 12.5
 */
export class MathHelper {
  /**
   * Rounds a number up to the specified decimal precision.
   * Rounds toward positive infinity.
   *
   * @param value - The finite number to round.
   * @param precision - The number of decimal places (0–100).
   * @returns The rounded number.
   * @throws {TypeError} If value is not a finite number.
   * @throws {RangeError} If precision is invalid.
   *
   * @example
   * MathHelper.roundUp(12.341, 2); // 12.35
   * MathHelper.roundUp(-12.341, 2); // -12.34
   */
  static roundUp(value: unknown, precision: number): number {
    this.validateNumber(value, 'roundUp');
    this.validatePrecision(precision);

    const factor = 10 ** precision;
    return Math.ceil(value * factor) / factor;
  }

  /**
   * Rounds a number down to the specified decimal precision.
   * Rounds toward negative infinity.
   *
   * @param value - The finite number to round.
   * @param precision - The number of decimal places (0–100).
   * @returns The rounded number.
   * @throws {TypeError} If value is not a finite number.
   * @throws {RangeError} If precision is invalid.
   *
   * @example
   * MathHelper.roundDown(12.349, 2); // 12.34
   * MathHelper.roundDown(-12.341, 2); // -12.35
   */
  static roundDown(value: unknown, precision: number): number {
    this.validateNumber(value, 'roundDown');
    this.validatePrecision(precision);

    const factor = 10 ** precision;
    return Math.floor(value * factor) / factor;
  }

  /**
   * Rounds a number to the nearest value at the specified precision.
   *
   * @param value - The finite number to round.
   * @param precision - The number of decimal places (0–100). Defaults to 0.
   * @returns The rounded number.
   * @throws {TypeError} If value is not a finite number.
   * @throws {RangeError} If precision is invalid.
   *
   * @example
   * MathHelper.round(12.345, 2); // 12.35
   * MathHelper.round(12.6); // 13
   */
  static round(value: unknown, precision = 0): number {
    this.validateNumber(value, 'round');
    this.validatePrecision(precision);

    const factor = 10 ** precision;
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  /**
   * Returns the non-negative magnitude of a number.
   *
   * @param value - The finite number to evaluate.
   * @returns The absolute value.
   * @throws {TypeError} If value is not a finite number.
   *
   * @example
   * MathHelper.absolute(-15); // 15
   * MathHelper.absolute(15); // 15
   */
  static absolute(value: unknown): number {
    this.validateNumber(value, 'absolute');

    return Math.abs(value);
  }

  /**
   * Restricts a number to a specified minimum and maximum.
   *
   * @param value - The finite number to restrict.
   * @param min - The minimum permitted value.
   * @param max - The maximum permitted value.
   * @returns The value bounded by min and max.
   * @throws {TypeError} If any argument is not a finite number.
   * @throws {RangeError} If min exceeds max.
   *
   * @example
   * MathHelper.clamp(120, 0, 100); // 100
   * MathHelper.clamp(-5, 0, 100); // 0
   * MathHelper.clamp(50, 0, 100); // 50
   */
  static clamp(value: unknown, min: number, max: number): number {
    this.validateNumber(value, 'clamp');
    this.validateNumber(min, 'clamp');
    this.validateNumber(max, 'clamp');

    if (min > max) {
      throw new RangeError('MathHelper.clamp: min cannot exceed max');
    }

    return Math.min(Math.max(value, min), max);
  }

  /**
   * Calculates what percentage a value represents of a total.
   *
   * @param value - The portion being measured.
   * @param total - The total amount, which must not be zero.
   * @returns The percentage, which may be negative or exceed 100.
   * @throws {TypeError} If either argument is not a finite number.
   * @throws {RangeError} If total is zero.
   *
   * @example
   * MathHelper.percentage(25, 200); // 12.5
   * MathHelper.percentage(50, 200); // 25
   */
  static percentage(value: unknown, total: unknown): number {
    this.validateNumber(value, 'percentage');
    this.validateNumber(total, 'percentage');

    if (total === 0) {
      throw new RangeError('MathHelper.percentage: total cannot be zero');
    }

    return (value / total) * 100;
  }

  /**
   * Calculates a specified percentage of a value.
   *
   * @param value - The base number.
   * @param percentage - The percentage to calculate.
   * @returns The calculated amount.
   * @throws {TypeError} If either argument is not a finite number.
   *
   * @example
   * MathHelper.percentageOf(200, 15); // 30
   * MathHelper.percentageOf(80, 25); // 20
   */
  static percentageOf(value: unknown, percentage: unknown): number {
    this.validateNumber(value, 'percentageOf');
    this.validateNumber(percentage, 'percentageOf');

    return (value * percentage) / 100;
  }

  /**
   * Calculates the sum of an array of numbers.
   *
   * @param values - The numbers to add. An empty array returns zero.
   * @returns The sum of all numbers.
   * @throws {TypeError} If the input is not an array or contains non-finite numbers.
   *
   * @example
   * MathHelper.sum([10, 20, 30]); // 60
   * MathHelper.sum([]); // 0
   */
  static sum(values: readonly number[]): number {
    this.validateArray(values, 'sum');

    return values.reduce((total, value) => {
      this.validateNumber(value, 'sum');

      return total + value;
    }, 0);
  }

  /**
   * Calculates the arithmetic mean of an array of numbers.
   *
   * @param values - The numbers to average.
   * @returns The arithmetic mean.
   * @throws {TypeError} If the input is not an array or contains non-finite numbers.
   * @throws {RangeError} If the array is empty.
   *
   * @example
   * MathHelper.average([10, 20, 30]); // 20
   */
  static average(values: readonly number[]): number {
    this.validateNonEmptyArray(values, 'average');

    return this.sum(values) / values.length;
  }

  /**
   * Finds the smallest number in an array.
   *
   * @param values - A non-empty array of finite numbers.
   * @returns The smallest number.
   * @throws {TypeError} If the input is not an array or contains non-finite numbers.
   * @throws {RangeError} If the array is empty.
   *
   * @example
   * MathHelper.min([10, 5, 30]); // 5
   */
  static min(values: readonly number[]): number {
    this.validateNonEmptyArray(values, 'min');

    values.forEach((value) => {
      this.validateNumber(value, 'min');
    });

    return Math.min(...values);
  }

  /**
   * Finds the largest number in an array.
   *
   * @param values - A non-empty array of finite numbers.
   * @returns The largest number.
   * @throws {TypeError} If the input is not an array or contains non-finite numbers.
   * @throws {RangeError} If the array is empty.
   *
   * @example
   * MathHelper.max([10, 5, 30]); // 30
   */
  static max(values: readonly number[]): number {
    this.validateNonEmptyArray(values, 'max');

    values.forEach((value) => {
      this.validateNumber(value, 'max');
    });

    return Math.max(...values);
  }

  /**
   * Checks whether a number falls within a specified range.
   *
   * @param value - The number to check.
   * @param min - The lower boundary.
   * @param max - The upper boundary.
   * @param inclusive - Whether the boundaries are included. Defaults to true.
   * @returns True if the number is within the range; otherwise false.
   * @throws {TypeError} If any numeric argument is not finite.
   * @throws {RangeError} If min exceeds max.
   *
   * @example
   * MathHelper.isBetween(15, 10, 20); // true
   * MathHelper.isBetween(10, 10, 20, false); // false
   */
  static isBetween(
    value: unknown,
    min: number,
    max: number,
    inclusive = true,
  ): boolean {
    this.validateNumber(value, 'isBetween');
    this.validateNumber(min, 'isBetween');
    this.validateNumber(max, 'isBetween');

    if (min > max) {
      throw new RangeError('MathHelper.isBetween: min cannot exceed max');
    }

    return inclusive
      ? value >= min && value <= max
      : value > min && value < max;
  }

  /**
   * Calculates the percentage increase or decrease between two values.
   *
   * @param previousValue - The original value; must not be zero.
   * @param currentValue - The new value.
   * @returns The percentage change. Positive means an increase; negative means a decrease.
   * @throws {TypeError} If either argument is not a finite number.
   * @throws {RangeError} If previousValue is zero.
   *
   * @example
   * MathHelper.percentageChange(100, 125); // 25
   * MathHelper.percentageChange(100, 80); // -20
   */
  static percentageChange(
    previousValue: unknown,
    currentValue: unknown,
  ): number {
    this.validateNumber(previousValue, 'percentageChange');
    this.validateNumber(currentValue, 'percentageChange');

    if (previousValue === 0) {
      throw new RangeError(
        'MathHelper.percentageChange: previous value cannot be zero',
      );
    }

    return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
  }

  /**
   * Validates that a value is a finite JavaScript number.
   *
   * @param value - The value to validate.
   * @param method - The method name used in the error message.
   * @throws {TypeError} If the value is not a finite number.
   */
  private static validateNumber(
    value: unknown,
    method: string,
  ): asserts value is number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(
        `MathHelper.${method}: ${String(value)} is not a finite number`,
      );
    }
  }

  /**
   * Validates decimal precision.
   *
   * @param precision - The number of decimal places.
   * @throws {RangeError} If precision is not an integer between 0 and 100.
   */
  private static validatePrecision(precision: number): void {
    if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
      throw new RangeError(
        'MathHelper: precision must be an integer between 0 and 100',
      );
    }
  }

  /**
   * Validates that the supplied value is an array.
   *
   * @param values - The value to validate.
   * @param method - The method name used in the error message.
   * @throws {TypeError} If the value is not an array.
   */
  private static validateArray(
    values: readonly number[],
    method: string,
  ): void {
    if (!Array.isArray(values)) {
      throw new TypeError(`MathHelper.${method}: values must be an array`);
    }
  }

  /**
   * Validates that an array contains at least one element.
   *
   * @param values - The array to validate.
   * @param method - The method name used in the error message.
   * @throws {TypeError} If the value is not an array.
   * @throws {RangeError} If the array is empty.
   */
  private static validateNonEmptyArray(
    values: readonly number[],
    method: string,
  ): void {
    this.validateArray(values, method);

    if (values.length === 0) {
      throw new RangeError(`MathHelper.${method}: array cannot be empty`);
    }
  }
}
