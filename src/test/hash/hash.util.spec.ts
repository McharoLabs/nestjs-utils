import { describe, expect, it } from '@jest/globals';
import { Hash } from '../../hash/hash.util';

describe('Hash', () => {
  const value = 'password123';
  const wrongValue = 'wrong-password';

  describe('make', () => {
    it('should hash a value', async () => {
      const result = await Hash.make(value);

      expect(result).not.toBe(value);
      expect(result).toMatch(/^\$2[aby]\$10\$/);
      expect(await Hash.compare(value, result)).toBe(true);
    });

    it('should generate different hashes for the same value', async () => {
      const firstHash = await Hash.make(value);
      const secondHash = await Hash.make(value);

      expect(firstHash).not.toBe(secondHash);
      expect(await Hash.compare(value, firstHash)).toBe(true);
      expect(await Hash.compare(value, secondHash)).toBe(true);
    });
  });

  describe('compare', () => {
    it('should return true when the value matches the hash', async () => {
      const hash = await Hash.make(value);

      await expect(Hash.compare(value, hash)).resolves.toBe(true);
    });

    it('should return false when the value does not match the hash', async () => {
      const hash = await Hash.make(value);

      await expect(Hash.compare(wrongValue, hash)).resolves.toBe(false);
    });
  });

  describe('bcryptHash', () => {
    it('should hash a value using the default salt rounds', async () => {
      const result = await Hash.bcryptHash(value);

      expect(result).toMatch(/^\$2[aby]\$10\$/);
      expect(await Hash.bcryptVerify(value, result)).toBe(true);
    });

    it('should support custom salt rounds', async () => {
      const result = await Hash.bcryptHash(value, 12);

      expect(result).toMatch(/^\$2[aby]\$12\$/);
      expect(await Hash.bcryptVerify(value, result)).toBe(true);
    });
  });

  describe('bcryptVerify', () => {
    it('should return true when the value matches the hash', async () => {
      const hash = await Hash.bcryptHash(value);

      await expect(Hash.bcryptVerify(value, hash)).resolves.toBe(true);
    });

    it('should return false when the value does not match the hash', async () => {
      const hash = await Hash.bcryptHash(value);

      await expect(Hash.bcryptVerify(wrongValue, hash)).resolves.toBe(false);
    });
  });
});
