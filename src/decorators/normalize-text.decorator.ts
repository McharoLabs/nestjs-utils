import { Transform } from 'class-transformer';

/**
 * Normalizes general text into readable sentences.
 *
 * Trims surrounding whitespace, collapses repeated whitespace,
 * capitalizes the first letter of each sentence, and adds a
 * trailing period when the text does not end with sentence
 * punctuation.
 *
 * Null, undefined, and non-string values are returned unchanged.
 *
 * @example
 * class CreateProductDto {
 *   @NormalizeText()
 *   description?: string | null;
 * }
 *
 * Input:  "This is a product description. i need you to do something,"
 * Output: "This is a product description. I need you to do something."
 */
export function NormalizeText(): PropertyDecorator {
  return Transform(({ value }: { value: unknown }): unknown => {
    if (typeof value !== 'string') {
      return value;
    }

    const text = value.trim().replace(/\s+/gu, ' ');

    if (text.length === 0) {
      return '';
    }

    const normalized = text
      .replace(
        /(^|[.!?]\s+)(\p{Ll})/gu,
        (_match, prefix: string, letter: string) =>
          `${prefix}${letter.toUpperCase()}`,
      )
      .replace(/[,;:]+$/u, '');

    return /[.!?]$/u.test(normalized) ? normalized : `${normalized}.`;
  });
}
