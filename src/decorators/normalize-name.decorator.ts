import { Transform } from 'class-transformer';

/**
 * Normalizes a person's name by trimming surrounding whitespace,
 * collapsing repeated spaces, converting letters to lowercase,
 * and capitalizing the first letter of each word.
 *
 * Null, undefined, and non-string values are returned unchanged.
 *
 * @example
 * class RegistrationDto {
 *   @NormalizeName()
 *   name?: string | null;
 * }
 *
 * NormalizeName("  GODFREY   STEVEN  ") => "Godfrey Steven"
 * NormalizeName("GodfreY")              => "Godfrey"
 * NormalizeName(null)                   => null
 * NormalizeName(undefined)              => undefined
 */
export function NormalizeName(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value !== 'string') {
      return value;
    }

    return value
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .replace(
        /(^|[\s'-])(\p{L})/gu,
        (_match: string, separator: string, letter: string): string =>
          `${separator}${letter.toUpperCase()}`,
      );
  });
}
