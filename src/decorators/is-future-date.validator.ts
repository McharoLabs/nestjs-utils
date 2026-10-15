import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validates that a date is strictly after today.
 *
 * Intended for DTO validation. The value must be a valid YYYY-MM-DD date.
 * Today is not considered a future date.
 *
 * @example
 * class AppointmentDto {
 *   @IsFutureDate()
 *   appointmentDate!: string;
 * }
 */
@ValidatorConstraint({ name: 'IsFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (match === null) {
      return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() !== year ||
      date.getUTCMonth() !== month - 1 ||
      date.getUTCDate() !== day
    ) {
      return false;
    }

    const today = new Date();

    const currentDate = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return date.getTime() > currentDate;
  }

  defaultMessage(): string {
    return 'Date must be in the future';
  }
}

export function IsFutureDate(): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: IsFutureDateConstraint,
    });
  };
}
