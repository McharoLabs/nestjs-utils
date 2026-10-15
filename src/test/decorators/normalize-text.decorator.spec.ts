import { describe, expect, it } from '@jest/globals';
import { plainToInstance } from 'class-transformer';
import { NormalizeText } from '../../decorators/normalize-text.decorator';

class TextDto {
  @NormalizeText()
  description?: string | null;
}

describe('NormalizeText', () => {
  it('should capitalize sentence beginnings and normalize punctuation', () => {
    const dto = plainToInstance(TextDto, {
      description: 'This is a product description. i need you to do something,',
    });

    expect(dto.description).toBe(
      'This is a product description. I need you to do something.',
    );
  });

  it('should capitalize the first letter and add a period', () => {
    const dto = plainToInstance(TextDto, {
      description: 'hello world',
    });

    expect(dto.description).toBe('Hello world.');
  });

  it('should trim surrounding whitespace', () => {
    const dto = plainToInstance(TextDto, {
      description: '  this is a test  ',
    });

    expect(dto.description).toBe('This is a test.');
  });

  it('should collapse repeated whitespace', () => {
    const dto = plainToInstance(TextDto, {
      description: 'first   sentence.\n\nsecond sentence',
    });

    expect(dto.description).toBe('First sentence. Second sentence.');
  });

  it('should remove trailing commas, semicolons, and colons', () => {
    expect(
      plainToInstance(TextDto, { description: 'hello,' }).description,
    ).toBe('Hello.');

    expect(
      plainToInstance(TextDto, { description: 'hello;' }).description,
    ).toBe('Hello.');

    expect(
      plainToInstance(TextDto, { description: 'hello:' }).description,
    ).toBe('Hello.');
  });

  it('should preserve existing sentence-ending punctuation', () => {
    expect(
      plainToInstance(TextDto, { description: 'hello.' }).description,
    ).toBe('Hello.');

    expect(
      plainToInstance(TextDto, { description: 'how are you?' }).description,
    ).toBe('How are you?');

    expect(
      plainToInstance(TextDto, { description: 'well done!' }).description,
    ).toBe('Well done!');
  });

  it('should preserve an empty string after trimming', () => {
    const dto = plainToInstance(TextDto, {
      description: '   ',
    });

    expect(dto.description).toBe('');
  });

  it('should preserve null', () => {
    const dto = plainToInstance(TextDto, {
      description: null,
    });

    expect(dto.description).toBeNull();
  });

  it('should preserve undefined', () => {
    const dto = plainToInstance(TextDto, {});

    expect(dto.description).toBeUndefined();
  });
});
