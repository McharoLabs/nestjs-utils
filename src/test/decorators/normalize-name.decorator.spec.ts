import { describe, expect, it } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { NormalizeName } from '../../decorators/normalize-name.decorator';

class NameDto {
  @NormalizeName()
  name?: string | null;
}

describe('NormalizeName', () => {
  it('should normalize uppercase names', () => {
    const dto = plainToInstance(NameDto, {
      name: 'GODFREY STEVEN',
    });

    expect(dto.name).toBe('Godfrey Steven');
  });

  it('should normalize mixed-case names', () => {
    const dto = plainToInstance(NameDto, {
      name: 'GodfreY',
    });

    expect(dto.name).toBe('Godfrey');
  });

  it('should trim surrounding whitespace', () => {
    const dto = plainToInstance(NameDto, {
      name: '  GODFREY STEVEN  ',
    });

    expect(dto.name).toBe('Godfrey Steven');
  });

  it('should collapse repeated whitespace', () => {
    const dto = plainToInstance(NameDto, {
      name: 'john    DOE\tmCHARO',
    });

    expect(dto.name).toBe('John Doe Mcharo');
  });

  it('should normalize names containing hyphens and apostrophes', () => {
    const dto = plainToInstance(NameDto, {
      name: "MARY-JANE O'CONNOR",
    });

    expect(dto.name).toBe("Mary-Jane O'Connor");
  });

  it('should preserve null', () => {
    const dto = plainToInstance(NameDto, {
      name: null,
    });

    expect(dto.name).toBeNull();
  });

  it('should preserve undefined', () => {
    const dto = plainToInstance(NameDto, {});

    expect(dto.name).toBeUndefined();
  });

  it('should preserve an empty string', () => {
    const dto = plainToInstance(NameDto, {
      name: '',
    });

    expect(dto.name).toBe('');
  });

  it('should preserve non-string values unchanged', () => {
    const dto = plainToInstance(NameDto, {
      name: 123,
    });

    expect(dto.name).toBe(123);
  });
});
