import { describe, expect, it } from '@jest/globals';
import { Str } from '../../string/string.util';

describe('Str', () => {
  describe('generateRequestId', () => {
    it('should generate a request ID with the default prefix', () => {
      const result = Str.generateRequestId();

      expect(result).toMatch(/^TMR\d{13}[0-9a-f]{12}$/);
    });

    it('should generate a request ID with a custom prefix', () => {
      const result = Str.generateRequestId('PAY');

      expect(result).toMatch(/^PAY\d{13}[0-9a-f]{12}$/);
    });

    it('should generate unique request IDs', () => {
      const first = Str.generateRequestId();
      const second = Str.generateRequestId();

      expect(first).not.toBe(second);
    });

    it('should reject an empty prefix', () => {
      expect(() => Str.generateRequestId('')).toThrow(TypeError);
      expect(() => Str.generateRequestId('   ')).toThrow(
        'Str.generateRequestId: prefix must not be empty',
      );
    });
  });

  describe('generateState', () => {
    it('should generate a 64-character hexadecimal string', () => {
      const result = Str.generateState();

      expect(result).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should generate different state values', () => {
      expect(Str.generateState()).not.toBe(Str.generateState());
    });
  });

  describe('generateCodeVerifier', () => {
    it('should generate an 86-character Base64URL verifier', () => {
      const result = Str.generateCodeVerifier();

      expect(result).toHaveLength(86);
      expect(result).toMatch(/^[A-Za-z0-9_-]{86}$/);
    });

    it('should generate different verifiers', () => {
      expect(Str.generateCodeVerifier()).not.toBe(Str.generateCodeVerifier());
    });
  });

  describe('generateCodeChallenge', () => {
    it('should generate a Base64URL SHA-256 challenge', () => {
      const verifier = 'a'.repeat(43);
      const result = Str.generateCodeChallenge(verifier);

      expect(result).toHaveLength(43);
      expect(result).toMatch(/^[A-Za-z0-9_-]{43}$/);
    });

    it('should generate the same challenge for the same verifier', () => {
      const verifier = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFG';

      expect(Str.generateCodeChallenge(verifier)).toBe(
        Str.generateCodeChallenge(verifier),
      );
    });

    it('should generate different challenges for different verifiers', () => {
      const first = 'a'.repeat(43);
      const second = 'b'.repeat(43);

      expect(Str.generateCodeChallenge(first)).not.toBe(
        Str.generateCodeChallenge(second),
      );
    });

    it('should accept a verifier containing allowed special characters', () => {
      const verifier = 'a'.repeat(42) + '-._~';

      expect(() => Str.generateCodeChallenge(verifier)).not.toThrow();
    });

    it('should accept the minimum verifier length', () => {
      expect(() => Str.generateCodeChallenge('a'.repeat(43))).not.toThrow();
    });

    it('should accept the maximum verifier length', () => {
      expect(() => Str.generateCodeChallenge('a'.repeat(128))).not.toThrow();
    });

    it('should reject a verifier shorter than 43 characters', () => {
      expect(() => Str.generateCodeChallenge('a'.repeat(42))).toThrow(
        RangeError,
      );
    });

    it('should reject a verifier longer than 128 characters', () => {
      expect(() => Str.generateCodeChallenge('a'.repeat(129))).toThrow(
        RangeError,
      );
    });

    it('should reject invalid verifier characters', () => {
      expect(() => Str.generateCodeChallenge('a'.repeat(42) + '+')).toThrow(
        RangeError,
      );
      expect(() => Str.generateCodeChallenge('a'.repeat(42) + '/')).toThrow(
        RangeError,
      );
      expect(() => Str.generateCodeChallenge('a'.repeat(42) + ' ')).toThrow(
        RangeError,
      );
    });

    it('should reject a non-string verifier at runtime', () => {
      expect(() => Str.generateCodeChallenge(123 as unknown as string)).toThrow(
        TypeError,
      );
    });
  });

  describe('uuid', () => {
    it('should generate a valid UUID v4', () => {
      const result = Str.uuid();

      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should generate unique UUIDs', () => {
      expect(Str.uuid()).not.toBe(Str.uuid());
    });
  });

  describe('slug', () => {
    it('should convert text into a URL-friendly slug', () => {
      expect(Str.slug('Hello World!')).toBe('hello-world');
      expect(Str.slug('  Multiple   Words  ')).toBe('multiple-words');
    });

    it('should remove diacritics', () => {
      expect(Str.slug('Crème Brûlée')).toBe('creme-brulee');
      expect(Str.slug('café')).toBe('cafe');
    });

    it('should preserve Unicode letters and numbers', () => {
      expect(Str.slug('Привет мир')).toBe('привет-мир');
      expect(Str.slug('مرحبا بالعالم')).toBe('مرحبا-بالعالم');
      expect(Str.slug('hello 世界')).toBe('hello-世界');
    });

    it('should replace punctuation with single hyphens', () => {
      expect(Str.slug('hello!!!world')).toBe('hello-world');
      expect(Str.slug('one___two---three')).toBe('one-two-three');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(Str.slug('---hello-world---')).toBe('hello-world');
    });

    it('should return an empty string for nullish input', () => {
      expect(Str.slug(null)).toBe('');
      expect(Str.slug(undefined)).toBe('');
    });

    it('should return an empty string for empty or punctuation-only input', () => {
      expect(Str.slug('')).toBe('');
      expect(Str.slug('!!!')).toBe('');
    });
  });

  describe('nameCapitalize', () => {
    it('should capitalize the first character and lowercase the rest', () => {
      expect(Str.nameCapitalize('gODFREY')).toBe('Godfrey');
      expect(Str.nameCapitalize('john')).toBe('John');
      expect(Str.nameCapitalize('JOHN')).toBe('John');
    });

    it('should handle a single character', () => {
      expect(Str.nameCapitalize('a')).toBe('A');
      expect(Str.nameCapitalize('Z')).toBe('Z');
    });

    it('should return null for empty or nullish input', () => {
      expect(Str.nameCapitalize('')).toBeNull();
      expect(Str.nameCapitalize(null)).toBeNull();
      expect(Str.nameCapitalize(undefined)).toBeNull();
    });
  });

  describe('toTitleCase', () => {
    it('should capitalize the first character of each word', () => {
      expect(Str.toTitleCase('godfrey elia steven')).toBe(
        'Godfrey Elia Steven',
      );
    });

    it('should lowercase the remaining characters in each word', () => {
      expect(Str.toTitleCase('hELLO wORLD')).toBe('Hello World');
    });

    it('should normalize repeated whitespace', () => {
      expect(Str.toTitleCase('  hello   world  ')).toBe('Hello World');
    });

    it('should return an empty string for empty or whitespace-only input', () => {
      expect(Str.toTitleCase('')).toBe('');
      expect(Str.toTitleCase('   ')).toBe('');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should trim and collapse repeated whitespace', () => {
      expect(Str.normalizeWhitespace('  Hello   World  ')).toBe('Hello World');
    });

    it('should normalize tabs and newlines', () => {
      expect(Str.normalizeWhitespace('Hello\tWorld\nAgain')).toBe(
        'Hello World Again',
      );
    });

    it('should preserve a single space between words', () => {
      expect(Str.normalizeWhitespace('Hello World')).toBe('Hello World');
    });

    it('should return an empty string for whitespace-only input', () => {
      expect(Str.normalizeWhitespace('   \t\n  ')).toBe('');
    });
  });

  describe('removeDiacritics', () => {
    it('should remove diacritical marks', () => {
      expect(Str.removeDiacritics('Crème Brûlée')).toBe('Creme Brulee');
      expect(Str.removeDiacritics('café')).toBe('cafe');
    });

    it('should preserve characters without diacritics', () => {
      expect(Str.removeDiacritics('Hello World 123')).toBe('Hello World 123');
    });

    it('should handle empty input', () => {
      expect(Str.removeDiacritics('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate text and append the default suffix', () => {
      expect(Str.truncate('A long description', 10)).toBe('A long ...');
    });

    it('should return the original text when it fits', () => {
      expect(Str.truncate('Hello', 5)).toBe('Hello');
      expect(Str.truncate('Hello', 10)).toBe('Hello');
    });

    it('should support a custom suffix', () => {
      expect(Str.truncate('Hello World', 8, '…')).toBe('Hello W…');
    });

    it('should truncate to an empty string when maxLength is zero', () => {
      expect(Str.truncate('Hello', 0)).toBe('');
    });

    it('should handle a suffix equal to or longer than maxLength', () => {
      expect(Str.truncate('Hello', 3, '...')).toBe('...');
      expect(Str.truncate('Hello', 2, '*****')).toBe('**');
    });

    it('should support an empty suffix', () => {
      expect(Str.truncate('Hello World', 5, '')).toBe('Hello');
    });

    it.each([-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
      'should reject an invalid maxLength: %s',
      (maxLength) => {
        expect(() => Str.truncate('Hello', maxLength)).toThrow(RangeError);
      },
    );
  });

  describe('equalsIgnoreCase', () => {
    it('should compare strings without case sensitivity', () => {
      expect(Str.equalsIgnoreCase('ADMIN', 'admin')).toBe(true);
      expect(Str.equalsIgnoreCase('Hello', 'HELLO')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(Str.equalsIgnoreCase('admin', 'user')).toBe(false);
      expect(Str.equalsIgnoreCase('hello', 'hell')).toBe(false);
    });

    it('should compare empty strings', () => {
      expect(Str.equalsIgnoreCase('', '')).toBe(true);
    });
  });

  describe('escapeRegExp', () => {
    it('should escape regular expression special characters', () => {
      expect(Str.escapeRegExp('user.name')).toBe('user\\.name');
      expect(Str.escapeRegExp('(a+b)$')).toBe('\\(a\\+b\\)\\$');
    });

    it('should escape all supported special characters', () => {
      const input = '.*+?^${}()|[]\\';
      const result = Str.escapeRegExp(input);

      expect(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('should leave ordinary text unchanged', () => {
      expect(Str.escapeRegExp('hello world 123')).toBe('hello world 123');
    });

    it('should make escaped input match literally in a regular expression', () => {
      const input = 'file.name(1)';
      const expression = new RegExp(Str.escapeRegExp(input));

      expect(expression.test(input)).toBe(true);
      expect(expression.test('fileXname1')).toBe(false);
    });
  });

  describe('removeCommas', () => {
    it('should remove every comma', () => {
      expect(Str.removeCommas('1,000,000')).toBe('1000000');
      expect(Str.removeCommas('a,b,c')).toBe('abc');
    });

    it('should preserve text without commas', () => {
      expect(Str.removeCommas('12345')).toBe('12345');
    });

    it('should return an empty string for nullish input', () => {
      expect(Str.removeCommas(null)).toBe('');
      expect(Str.removeCommas(undefined)).toBe('');
    });

    it('should handle empty input', () => {
      expect(Str.removeCommas('')).toBe('');
    });
  });

  describe('isEmptyOrWhitespace', () => {
    it('should identify empty and whitespace-only strings', () => {
      expect(Str.isEmptyOrWhitespace('')).toBe(true);
      expect(Str.isEmptyOrWhitespace('   ')).toBe(true);
      expect(Str.isEmptyOrWhitespace('\t\n')).toBe(true);
    });

    it('should identify nullish values as empty', () => {
      expect(Str.isEmptyOrWhitespace(null)).toBe(true);
      expect(Str.isEmptyOrWhitespace(undefined)).toBe(true);
    });

    it('should return false for non-empty text', () => {
      expect(Str.isEmptyOrWhitespace('hello')).toBe(false);
      expect(Str.isEmptyOrWhitespace(' hello ')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it.each([
      'user@example.com',
      'first.last@example.co.tz',
      'user+tag@example.com',
      'user123@sub.example.org',
    ])('should accept a basic valid email: %s', (email) => {
      expect(Str.isValidEmail(email)).toBe(true);
    });

    it.each([
      '',
      '   ',
      'user',
      '@example.com',
      'user@',
      'user@example',
      'user@@example.com',
      'user name@example.com',
      'user@example .com',
    ])('should reject an invalid email: "%s"', (email) => {
      expect(Str.isValidEmail(email)).toBe(false);
    });

    it('should trim surrounding whitespace', () => {
      expect(Str.isValidUrl(' https://example.com ')).toBe(true);
    });

    it('should reject nullish values', () => {
      expect(Str.isValidEmail(null)).toBe(false);
      expect(Str.isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it.each([
      'https://example.com',
      'http://localhost:3000',
      'https://example.com/path?name=value',
      'ftp://files.example.com',
    ])('should accept a valid absolute URL: %s', (value) => {
      expect(Str.isValidUrl(value)).toBe(true);
    });

    it.each([
      '',
      '   ',
      'example.com',
      '/relative/path',
      'not a URL',
      'http://',
    ])('should reject an invalid URL: "%s"', (value) => {
      expect(Str.isValidUrl(value)).toBe(false);
    });

    it('should reject nullish values', () => {
      expect(Str.isValidUrl(null)).toBe(false);
      expect(Str.isValidUrl(undefined)).toBe(false);
    });

    it('should trim surrounding whitespace', () => {
      expect(Str.isValidUrl(' https://example.com ')).toBe(true);
    });
  });

  describe('isValidUuid', () => {
    it('should accept valid UUIDs', () => {
      expect(Str.isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(
        true,
      );
      expect(Str.isValidUuid('550E8400-E29B-41D4-A716-446655440000')).toBe(
        true,
      );
    });

    it('should reject malformed UUIDs', () => {
      expect(Str.isValidUuid('not-a-uuid')).toBe(false);
      expect(Str.isValidUuid('550e8400-e29b-41d4-a716')).toBe(false);
      expect(Str.isValidUuid('550e8400-e29b-01d4-a716-446655440000')).toBe(
        false,
      );
    });

    it('should reject nullish values', () => {
      expect(Str.isValidUuid(null)).toBe(false);
      expect(Str.isValidUuid(undefined)).toBe(false);
    });
  });

  describe('randomFixedInteger', () => {
    it('should generate a numeric string with the default length', () => {
      const result = Str.randomFixedInteger();

      expect(result).toHaveLength(10);
      expect(result).toMatch(/^\d{10}$/);
    });

    it('should generate the requested number of digits', () => {
      expect(Str.randomFixedInteger(6)).toMatch(/^\d{6}$/);
      expect(Str.randomFixedInteger(1)).toMatch(/^\d$/);
      expect(Str.randomFixedInteger(20)).toMatch(/^\d{20}$/);
    });

    it('should preserve leading zeros when generated', () => {
      const result = Str.randomFixedInteger(1000);

      expect(result).toHaveLength(1000);
      expect(result).toMatch(/^\d{1000}$/);
    });

    it.each([0, -1, 1.5, NaN, Infinity, 1001])(
      'should reject an invalid digit count: %s',
      (digits) => {
        expect(() => Str.randomFixedInteger(digits)).toThrow(RangeError);
      },
    );
  });

  describe('random', () => {
    it('should generate a hexadecimal string with the default length', () => {
      const result = Str.random();

      expect(result).toHaveLength(10);
      expect(result).toMatch(/^[0-9a-f]{10}$/);
    });

    it('should generate hexadecimal strings of the requested length', () => {
      expect(Str.random(1)).toMatch(/^[0-9a-f]$/);
      expect(Str.random(12)).toMatch(/^[0-9a-f]{12}$/);
      expect(Str.random(31)).toMatch(/^[0-9a-f]{31}$/);
    });

    it('should generate different random strings', () => {
      expect(Str.random(32)).not.toBe(Str.random(32));
    });

    it.each([0, -1, 1.5, NaN, Infinity, 4097])(
      'should reject an invalid length: %s',
      (length) => {
        expect(() => Str.random(length)).toThrow(RangeError);
      },
    );
  });

  describe('randomString', () => {
    it('should generate a string using the default character set', () => {
      const result = Str.randomString(32);

      expect(result).toHaveLength(32);
      expect(result).toMatch(/^[A-Za-z0-9]{32}$/);
    });

    it('should use only characters from the supplied character set', () => {
      const result = Str.randomString(100, 'ABC123');

      expect(result).toHaveLength(100);
      expect(result).toMatch(/^[ABC123]{100}$/);
    });

    it('should support a single allowed character', () => {
      expect(Str.randomString(5, 'X')).toBe('XXXXX');
    });

    it('should generate the requested number of characters', () => {
      expect(Str.randomString(1)).toHaveLength(1);
      expect(Str.randomString(50)).toHaveLength(50);
    });

    it('should reject an empty character set', () => {
      expect(() => Str.randomString(5, '')).toThrow(TypeError);
      expect(() => Str.randomString(5, '')).toThrow(
        'Str.randomString: characters must not be empty',
      );
    });

    it.each([0, -1, 1.5, NaN, Infinity, 4097])(
      'should reject an invalid length: %s',
      (length) => {
        expect(() => Str.randomString(length)).toThrow(RangeError);
      },
    );
  });

  describe('normalizePhoneNumber', () => {
    it('should normalize Tanzanian local numbers', () => {
      expect(Str.normalizePhoneNumber('0712345678')).toBe('+255712345678');
      expect(Str.normalizePhoneNumber('712345678')).toBe('+255712345678');
    });

    it('should normalize international prefix notation', () => {
      expect(Str.normalizePhoneNumber('+255712345678')).toBe('+255712345678');
      expect(Str.normalizePhoneNumber('00255712345678')).toBe('+255712345678');
    });

    it('should accept an explicit country code', () => {
      expect(Str.normalizePhoneNumber('0712345678', '254')).toBe(
        '+254712345678',
      );
      expect(Str.normalizePhoneNumber('712345678', '254')).toBe(
        '+254712345678',
      );
    });

    it('should remove common phone formatting characters', () => {
      expect(Str.normalizePhoneNumber('0712 345 678')).toBe('+255712345678');
      expect(Str.normalizePhoneNumber('(0712) 345-678')).toBe('+255712345678');
    });

    it('should return null for empty or nullish input', () => {
      expect(Str.normalizePhoneNumber('')).toBeNull();
      expect(Str.normalizePhoneNumber('   ')).toBeNull();
      expect(Str.normalizePhoneNumber(null)).toBeNull();
      expect(Str.normalizePhoneNumber(undefined)).toBeNull();
    });

    it('should reject an invalid country code', () => {
      expect(() => Str.normalizePhoneNumber('0712345678', '25A')).toThrow(
        TypeError,
      );
      expect(() => Str.normalizePhoneNumber('0712345678', '+255')).toThrow(
        TypeError,
      );
    });

    it('should reject invalid phone characters', () => {
      expect(() => Str.normalizePhoneNumber('0712ABC678')).toThrow(TypeError);
      expect(() => Str.normalizePhoneNumber('0712/345/678')).toThrow(TypeError);
    });
  });

  describe('normalizePhoneNumberWithoutPlus', () => {
    it('should return a normalized phone number without the plus sign', () => {
      expect(Str.normalizePhoneNumberWithoutPlus('0712345678')).toBe(
        '255712345678',
      );
    });

    it('should support a custom country code', () => {
      expect(Str.normalizePhoneNumberWithoutPlus('0712345678', '254')).toBe(
        '254712345678',
      );
    });

    it('should preserve null for empty or nullish input', () => {
      expect(Str.normalizePhoneNumberWithoutPlus('')).toBeNull();
      expect(Str.normalizePhoneNumberWithoutPlus(null)).toBeNull();
      expect(Str.normalizePhoneNumberWithoutPlus(undefined)).toBeNull();
    });

    it('should propagate validation errors', () => {
      expect(() =>
        Str.normalizePhoneNumberWithoutPlus('0712345678', '25A'),
      ).toThrow(TypeError);
    });
  });

  describe('isValidPhoneNumber', () => {
    it.each([
      '0712345678',
      '0612345678',
      '712345678',
      '612345678',
      '255712345678',
      '+255712345678',
      '255612345678',
      '+255612345678',
    ])('should accept a valid Tanzanian mobile format: %s', (phone) => {
      expect(Str.isValidPhoneNumber(phone)).toBe(true);
    });

    it.each([
      '',
      '   ',
      '0812345678',
      '512345678',
      '255812345678',
      '+254712345678',
      '071234567',
      '07123456789',
      '0712ABC678',
    ])('should reject an invalid Tanzanian mobile format: "%s"', (phone) => {
      expect(Str.isValidPhoneNumber(phone)).toBe(false);
    });

    it('should allow common formatting characters', () => {
      expect(Str.isValidPhoneNumber('0712 345 678')).toBe(true);
      expect(Str.isValidPhoneNumber('(0712) 345-678')).toBe(true);
      expect(Str.isValidPhoneNumber('+255 712 345 678')).toBe(true);
    });

    it('should reject nullish values', () => {
      expect(Str.isValidPhoneNumber(null)).toBe(false);
      expect(Str.isValidPhoneNumber(undefined)).toBe(false);
    });
  });

  describe('maskPhoneNumber', () => {
    it('should preserve the first six and last three characters', () => {
      expect(Str.maskPhoneNumber('+255712345678')).toBe('+25571-XXX-678');
    });

    it('should mask shorter phone numbers', () => {
      expect(Str.maskPhoneNumber('123456')).toBe('123-XXX-456');
      expect(Str.maskPhoneNumber('12345')).toBe('12-XXX-345');
    });

    it('should fully mask strings with three or fewer characters', () => {
      expect(Str.maskPhoneNumber('1')).toBe('XXX');
      expect(Str.maskPhoneNumber('12')).toBe('XXX');
      expect(Str.maskPhoneNumber('123')).toBe('XXX');
    });

    it('should return null for empty or nullish input', () => {
      expect(Str.maskPhoneNumber('')).toBeNull();
      expect(Str.maskPhoneNumber(null)).toBeNull();
      expect(Str.maskPhoneNumber(undefined)).toBeNull();
    });
  });

  describe('maskEmail', () => {
    it('should mask the local part and preserve the domain', () => {
      expect(Str.maskEmail('godfrey@example.com')).toBe('go*****@example.com');
    });

    it('should handle short local parts', () => {
      expect(Str.maskEmail('ab@example.com')).toBe('ab*@example.com');
      expect(Str.maskEmail('a@example.com')).toBe('*@example.com');
    });

    it('should handle longer local parts', () => {
      expect(Str.maskEmail('steven@example.com')).toBe('st****@example.com');
    });

    it('should mask malformed email strings as ordinary strings', () => {
      expect(Str.maskEmail('invalid')).toBe('i*****d');
      expect(Str.maskEmail('@example.com')).toBe('@**********m');
      expect(Str.maskEmail('user@')).toBe('u***@');
      expect(Str.maskEmail('a@b@c')).toBe('a***c');
    });

    it('should return null for empty or nullish input', () => {
      expect(Str.maskEmail('')).toBeNull();
      expect(Str.maskEmail(null)).toBeNull();
      expect(Str.maskEmail(undefined)).toBeNull();
    });
  });

  describe('maskString', () => {
    it('should preserve the first and last characters by default', () => {
      expect(Str.maskString('Godfrey')).toBe('G*****y');
      expect(Str.maskString('1234567890')).toBe('1********0');
    });

    it('should fully mask short strings', () => {
      expect(Str.maskString('AB')).toBe('**');
      expect(Str.maskString('A')).toBe('*');
    });

    it('should support custom visible character counts', () => {
      expect(Str.maskString('1234567890', 2, 2)).toBe('12******90');
      expect(Str.maskString('secret', 1, 0)).toBe('s*****');
      expect(Str.maskString('hello', 0, 0)).toBe('*****');
    });

    it('should support a custom masking character', () => {
      expect(Str.maskString('secret', 1, 0, '#')).toBe('s#####');
      expect(Str.maskString('12345', 1, 1, 'X')).toBe('1XXX5');
    });

    it('should handle empty strings', () => {
      expect(Str.maskString('')).toBe('');
    });

    it('should return null for nullish input', () => {
      expect(Str.maskString(null)).toBeNull();
      expect(Str.maskString(undefined)).toBeNull();
    });

    it('should fully mask the string when visible counts meet or exceed its length', () => {
      expect(Str.maskString('abc', 2, 1)).toBe('***');
      expect(Str.maskString('abc', 3, 0)).toBe('***');
    });

    it('should reject negative visible counts', () => {
      expect(() => Str.maskString('secret', -1, 1)).toThrow(RangeError);
      expect(() => Str.maskString('secret', 1, -1)).toThrow(RangeError);
    });

    it('should reject non-integer visible counts', () => {
      expect(() => Str.maskString('secret', 1.5, 1)).toThrow(RangeError);
      expect(() => Str.maskString('secret', 1, 1.5)).toThrow(RangeError);
    });

    it('should reject an empty mask character', () => {
      expect(() => Str.maskString('secret', 1, 1, '')).toThrow(TypeError);
      expect(() => Str.maskString('secret', 1, 1, '')).toThrow(
        'Str.maskString: maskCharacter must not be empty',
      );
    });
  });
});
