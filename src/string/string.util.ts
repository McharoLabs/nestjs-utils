import { createHash, randomBytes, randomInt, randomUUID } from 'node:crypto';

export class Str {
  /**
   * Generates a request identifier using a prefix, timestamp, and random UUID characters.
   *
   * @param prefix - Identifier prefix. Defaults to `TRM`.
   * @returns A request identifier.
   * @throws {TypeError} If the prefix is not a string.
   * @example
   * Str.generateRequestId(); // TMR1723456789123a1b2c3d4e5f6
   * Str.generateRequestId('PAY'); // PAY1723456789123a1b2c3d4e5f6
   */
  static generateRequestId(prefix = 'TMR'): string {
    if (typeof prefix !== 'string' || prefix.trim().length === 0) {
      throw new TypeError('Str.generateRequestId: prefix must not be empty');
    }

    const timestamp = Date.now();
    const uniquePart = randomUUID().replaceAll('-', '').slice(0, 12);

    return `${prefix}${timestamp.toString()}${uniquePart}`;
  }

  /**
   * Generates a cryptographically secure random state value.
   *
   * Suitable for OAuth state parameters and similar security-sensitive values.
   *
   * @returns A 64-character hexadecimal string.
   * @example
   * Str.generateState();
   */
  static generateState(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Generates a cryptographically secure PKCE code verifier.
   *
   * @returns An 86-character Base64URL string.
   * @example
   * const verifier = Str.generateCodeVerifier();
   */
  static generateCodeVerifier(): string {
    return randomBytes(64).toString('base64url');
  }

  /**
   * Generates a SHA-256 PKCE code challenge from a code verifier.
   *
   * @param verifier - The PKCE code verifier, 43–128 allowed characters.
   * @returns The Base64URL-encoded SHA-256 challenge.
   * @throws {TypeError} If the verifier is not a string.
   * @throws {RangeError} If the verifier does not meet PKCE length requirements.
   * @example
   * const verifier = Str.generateCodeVerifier();
   * const challenge = Str.generateCodeChallenge(verifier);
   */
  static generateCodeChallenge(verifier: string): string {
    if (typeof verifier !== 'string') {
      throw new TypeError(
        'Str.generateCodeChallenge: verifier must be a string',
      );
    }

    if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) {
      throw new RangeError(
        'Str.generateCodeChallenge: verifier must contain 43–128 valid characters',
      );
    }

    return createHash('sha256').update(verifier).digest('base64url');
  }

  /**
   * Generates a UUID v4.
   *
   * @returns A randomly generated UUID.
   * @example
   * Str.uuid(); // "550e8400-e29b-41d4-a716-446655440000"
   */
  static uuid(): string {
    return randomUUID();
  }

  /**
   * Converts text into a URL-friendly slug.
   *
   * Preserves Unicode letters and numbers, removes diacritics, and normalizes
   * whitespace and punctuation into single hyphens.
   *
   * @param text - Text to convert.
   * @returns A slug, or an empty string when the input is nullish.
   * @example
   * Str.slug('Hello World!'); // "hello-world"
   * Str.slug('Crème Brûlée'); // "creme-brulee"
   */
  static slug(text: string | null | undefined): string {
    if (text === null || text === undefined) {
      return '';
    }

    return text
      .normalize('NFKD')
      .replace(/\p{M}/gu, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Capitalizes the first character and lowercases the remaining characters.
   *
   * @param text - Text to capitalize.
   * @returns Capitalized text, or null for empty or nullish input.
   * @example
   * Str.nameCapitalize('gODFREY'); // "Godfrey"
   */
  static nameCapitalize(text: string | null | undefined): string | null {
    if (text === null || text === undefined || text.length === 0) {
      return null;
    }

    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  /**
   * Converts text to title case by capitalizing the first character of each word.
   *
   * @param value - Text to format.
   * @returns Title-cased text.
   * @example
   * Str.toTitleCase('godfrey elia steven'); // "Godfrey Elia Steven"
   */
  static toTitleCase(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Removes leading, trailing, and repeated whitespace.
   *
   * @param value - Text to normalize.
   * @returns Text with consecutive whitespace replaced by a single space.
   * @example
   * Str.normalizeWhitespace('  Hello   World  '); // "Hello World"
   */
  static normalizeWhitespace(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  /**
   * Removes diacritical marks from text.
   *
   * @param value - Text to normalize.
   * @returns Text without combining diacritical marks.
   * @example
   * Str.removeDiacritics('Crème Brûlée'); // "Creme Brulee"
   */
  static removeDiacritics(value: string): string {
    return value.normalize('NFKD').replace(/\p{M}/gu, '');
  }

  /**
   * Truncates text to a maximum length, optionally adding a suffix.
   *
   * @param value - Text to truncate.
   * @param maxLength - Maximum length, including the suffix.
   * @param suffix - Suffix to append when truncation occurs. Defaults to `...`.
   * @returns The truncated or original text.
   * @throws {RangeError} If maxLength is not a non-negative integer.
   * @example
   * Str.truncate('A long description', 10); // "A long ..."
   */
  static truncate(value: string, maxLength: number, suffix = '...'): string {
    if (!Number.isSafeInteger(maxLength) || maxLength < 0) {
      throw new RangeError(
        'Str.truncate: maxLength must be a non-negative safe integer',
      );
    }

    if (value.length <= maxLength) {
      return value;
    }

    if (suffix.length >= maxLength) {
      return suffix.slice(0, maxLength);
    }

    return value.slice(0, maxLength - suffix.length) + suffix;
  }

  /**
   * Compares two strings without case sensitivity.
   *
   * @param first - First string.
   * @param second - Second string.
   * @returns True when both strings are equal ignoring case.
   * @example
   * Str.equalsIgnoreCase('ADMIN', 'admin'); // true
   */
  static equalsIgnoreCase(first: string, second: string): boolean {
    return first.toLowerCase() === second.toLowerCase();
  }

  /**
   * Escapes special regular expression characters in a string.
   *
   * Useful when inserting literal user input into a regular expression.
   *
   * @param value - Literal text to escape.
   * @returns Text safe to insert as a regular expression literal.
   * @example
   * Str.escapeRegExp('user.name'); // "user\\.name"
   */
  static escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Removes every comma from a string.
   *
   * @param value - Text to process.
   * @returns Text without commas, or an empty string for nullish input.
   * @example
   * Str.removeCommas('1,000,000'); // "1000000"
   */
  static removeCommas(value: string | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }

    return value.replaceAll(',', '');
  }

  /**
   * Checks whether a value is empty or contains only whitespace.
   *
   * @param value - Value to check.
   * @returns True for empty, whitespace-only, null, or undefined values.
   * @example
   * Str.isEmptyOrWhitespace('   '); // true
   */
  static isEmptyOrWhitespace(value: string | null | undefined): boolean {
    return value === null || value === undefined || value.trim() === '';
  }

  /**
   * Checks whether a string has a basic email-address format.
   *
   * This does not verify whether the address exists or belongs to a user.
   *
   * @param value - Email address to check.
   * @returns True if the address matches the basic format.
   * @example
   * Str.isValidEmail('user@example.com'); // true
   */
  static isValidEmail(value: string | null | undefined): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  /**
   * Checks whether a value is a valid absolute URL.
   *
   * @param value - URL to check.
   * @returns True if the URL can be parsed and has a protocol and hostname.
   * @example
   * Str.isValidUrl('https://example.com'); // true
   */
  static isValidUrl(value: string | null | undefined): boolean {
    if (value === null || value === undefined || value.trim() === '') {
      return false;
    }

    try {
      const url = new URL(value);
      return Boolean(url.protocol && url.hostname);
    } catch {
      return false;
    }
  }

  /**
   * Checks whether a string has the standard UUID format.
   *
   * @param value - UUID to check.
   * @returns True if the string matches a UUID format.
   * @example
   * Str.isValidUuid('550e8400-e29b-41d4-a716-446655440000'); // true
   */
  static isValidUuid(value: string | null | undefined): boolean {
    return (
      value !== null &&
      value !== undefined &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value,
      )
    );
  }

  /**
   * Generates a cryptographically secure random integer represented as digits.
   *
   * The result is a string so leading zeros are preserved.
   *
   * @param digits - Number of digits to generate. Defaults to 10.
   * @returns A random numeric string of the requested length.
   * @throws {RangeError} If digits is not an integer between 1 and 1000.
   * @example
   * Str.randomFixedInteger(6); // "004821"
   */
  static randomFixedInteger(digits = 10): string {
    if (!Number.isSafeInteger(digits) || digits < 1 || digits > 1000) {
      throw new RangeError(
        'Str.randomFixedInteger: digits must be between 1 and 1000',
      );
    }

    return Array.from({ length: digits }, () => String(randomInt(10))).join('');
  }

  /**
   * Generates a cryptographically secure random hexadecimal string.
   *
   * @param length - Number of hexadecimal characters. Defaults to 10.
   * @returns A random hexadecimal string of the requested length.
   * @throws {RangeError} If length is not an integer between 1 and 4096.
   * @example
   * Str.random(12); // A 12-character hexadecimal string
   */
  static random(length = 10): string {
    if (!Number.isSafeInteger(length) || length < 1 || length > 4096) {
      throw new RangeError('Str.random: length must be between 1 and 4096');
    }

    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * Generates a cryptographically secure random string from a custom character set.
   *
   * @param length - Number of characters to generate.
   * @param characters - Characters allowed in the result.
   * @returns A random string of the requested length.
   * @throws {RangeError} If length is invalid.
   * @throws {TypeError} If characters is empty.
   * @example
   * Str.randomString(6, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789');
   */
  static randomString(
    length: number,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ): string {
    if (!Number.isSafeInteger(length) || length < 1 || length > 4096) {
      throw new RangeError(
        'Str.randomString: length must be between 1 and 4096',
      );
    }

    if (characters.length === 0) {
      throw new TypeError('Str.randomString: characters must not be empty');
    }

    return Array.from({ length }, () =>
      characters.charAt(randomInt(characters.length)),
    ).join('');
  }

  /**
   * Normalizes a phone number into international format.
   *
   * Assumes Tanzania (`255`) for local numbers by default. Supply another
   * country code when processing local numbers from a different country.
   * This method formats input; it does not verify that a number is assigned.
   *
   * @param phone - Phone number to normalize.
   * @param countryCode - Default country calling code without `+`. Defaults to `255`.
   * @returns Normalized phone number beginning with `+`, or null for empty input.
   * @example
   * Str.normalizePhoneNumber('0712345678'); // "+255712345678"
   * Str.normalizePhoneNumber('712345678'); // "+255712345678"
   * Str.normalizePhoneNumber('0712345678', '254'); // "+254712345678"
   */
  static normalizePhoneNumber(
    phone: string | null | undefined,
    countryCode = '255',
  ): string | null {
    if (phone === null || phone === undefined || phone.trim() === '') {
      return null;
    }

    if (!/^\d+$/.test(countryCode)) {
      throw new TypeError(
        'Str.normalizePhoneNumber: countryCode must contain digits only',
      );
    }

    let normalized = phone.trim().replace(/[\s().-]/g, '');

    if (!/^\+?\d+$/.test(normalized)) {
      throw new TypeError(
        'Str.normalizePhoneNumber: phone contains invalid characters',
      );
    }

    if (normalized.startsWith('00')) {
      normalized = `+${normalized.slice(2)}`;
    }

    if (normalized.startsWith('+')) {
      return normalized;
    }

    if (normalized.startsWith('0')) {
      return `+${countryCode}${normalized.slice(1)}`;
    }

    if (normalized.startsWith(countryCode)) {
      return `+${normalized}`;
    }

    return `+${countryCode}${normalized}`;
  }

  /**
   * Normalizes a phone number and removes its leading plus sign.
   *
   * @param phone - Phone number to normalize.
   * @param countryCode - Default country calling code. Defaults to `255`.
   * @returns Normalized digits without `+`, or null for empty input.
   * @example
   * Str.normalizePhoneNumberWithoutPlus('0712345678'); // "255712345678"
   */
  static normalizePhoneNumberWithoutPlus(
    phone: string | null | undefined,
    countryCode = '255',
  ): string | null {
    return (
      this.normalizePhoneNumber(phone, countryCode)?.replace(/^\+/, '') ?? null
    );
  }

  /**
   * Checks whether a phone number matches common Tanzanian mobile formats.
   *
   * Accepts local numbers such as `0712345678`, `712345678`,
   * and international numbers such as `+255712345678`.
   * This is a format check, not carrier or ownership verification.
   *
   * @param phone - Phone number to validate.
   * @returns True if the number matches the expected Tanzanian mobile format.
   * @example
   * Str.isValidPhoneNumber('0712345678'); // true
   * Str.isValidPhoneNumber('+255712345678'); // true
   */
  static isValidPhoneNumber(phone: string | null | undefined): boolean {
    if (phone === null || phone === undefined) {
      return false;
    }

    const normalized = phone.trim().replace(/[\s().-]/g, '');

    return /^(?:0[67]\d{8}|[67]\d{8}|255[67]\d{8}|\+255[67]\d{8})$/.test(
      normalized,
    );
  }

  /**
   * Masks a phone number for display while preserving its first six
   * and last three characters.
   *
   * @param phoneNumber - Phone number to mask.
   * @returns Masked number, or null for empty input.
   * @example
   * Str.maskPhoneNumber('+255712345678'); // "+25571-XXX-678"
   */
  static maskPhoneNumber(
    phoneNumber: string | null | undefined,
  ): string | null {
    if (
      phoneNumber === null ||
      phoneNumber === undefined ||
      phoneNumber === ''
    ) {
      return null;
    }

    if (phoneNumber.length <= 3) {
      return 'XXX';
    }

    const firstDigits = phoneNumber.slice(
      0,
      Math.min(6, phoneNumber.length - 3),
    );
    const lastDigits = phoneNumber.slice(-3);

    return `${firstDigits}-XXX-${lastDigits}`;
  }

  /**
   * Masks an email address while preserving part of the local name
   * and the domain.
   *
   * For local names of different lengths, the masking adapts to the
   * available characters. Invalid or incomplete email formats are
   * handled as ordinary strings.
   *
   * @param email - Email address to mask.
   * @returns Masked email address, or null for empty or nullish input.
   * @example
   * Str.maskEmail('godfrey@example.com'); // "go*****@example.com"
   * Str.maskEmail('ab@example.com');      // "a*@example.com"
   * Str.maskEmail('a@example.com');       // "*@example.com"
   * Str.maskEmail('');                    // null
   */
  static maskEmail(email: string | null | undefined): string | null {
    if (email === null || email === undefined || email.length === 0) {
      return null;
    }

    const atIndex = email.indexOf('@');

    if (
      atIndex <= 0 ||
      atIndex === email.length - 1 ||
      email.includes('@', atIndex + 1)
    ) {
      return this.maskString(email);
    }

    const localPart = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1);

    const visibleCharacters = localPart.length === 1 ? 0 : 2;
    const maskedLength = Math.max(1, localPart.length - visibleCharacters);

    const maskedLocalPart =
      localPart.slice(0, visibleCharacters) + '*'.repeat(maskedLength);

    return `${maskedLocalPart}@${domain}`;
  }

  /**
   * Masks a string of any length, including a single character.
   *
   * By default, preserves the first and last characters when the input
   * has at least three characters. Shorter strings are fully masked.
   *
   * @param value - String to mask.
   * @param visibleStart - Number of characters to preserve at the beginning.
   * @param visibleEnd - Number of characters to preserve at the end.
   * @param maskCharacter - Character used for masking. Defaults to `*`.
   * @returns The masked string, or null for nullish input.
   * @throws {RangeError} If the visible character counts are negative or not integers.
   * @throws {TypeError} If maskCharacter is empty.
   * @example
   * Str.maskString('Godfrey');             // "G*****y"
   * Str.maskString('AB');                  // "**"
   * Str.maskString('A');                   // "*"
   * Str.maskString('1234567890', 2, 2);    // "12******90"
   * Str.maskString('secret', 1, 0, '#');   // "s#####"
   * Str.maskString('hello', 0, 0);         // "*****"
   */
  static maskString(
    value: string | null | undefined,
    visibleStart = 1,
    visibleEnd = 1,
    maskCharacter = '*',
  ): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (
      !Number.isSafeInteger(visibleStart) ||
      visibleStart < 0 ||
      !Number.isSafeInteger(visibleEnd) ||
      visibleEnd < 0
    ) {
      throw new RangeError(
        'Str.maskString: visibleStart and visibleEnd must be non-negative integers',
      );
    }

    if (maskCharacter.length === 0) {
      throw new TypeError('Str.maskString: maskCharacter must not be empty');
    }

    const length = value.length;

    if (length === 0) {
      return '';
    }

    const totalVisible = visibleStart + visibleEnd;

    if (totalVisible >= length) {
      return maskCharacter.repeat(length);
    }

    return (
      value.slice(0, visibleStart) +
      maskCharacter.repeat(length - totalVisible) +
      (visibleEnd > 0 ? value.slice(-visibleEnd) : '')
    );
  }
}
