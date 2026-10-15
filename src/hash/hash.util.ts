import * as bcrypt from 'bcrypt';

export class Hash {
  private static readonly SALT_ROUNDS = 10;

  static async make(value: string): Promise<string> {
    return this.bcryptHash(value);
  }

  static async compare(value: string, hashedValue: string): Promise<boolean> {
    return this.bcryptVerify(value, hashedValue);
  }

  static async bcryptHash(
    value: string,
    saltRounds = Hash.SALT_ROUNDS,
  ): Promise<string> {
    return await bcrypt.hash(value, saltRounds);
  }

  static async bcryptVerify(
    value: string,
    hashedValue: string,
  ): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue);
  }
}
