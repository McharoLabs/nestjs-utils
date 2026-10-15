import { describe, expect, it } from '@jest/globals';
import type { BuilderOptions, ParserOptions } from 'xml2js';
import { Xml } from '../../xml/xml.util';

describe('Xml', () => {
  describe('jsonToXml', () => {
    it('should convert a JavaScript object into XML without a declaration', () => {
      const result = Xml.jsonToXml({
        user: {
          name: 'Godfrey',
          age: 30,
        },
      });

      expect(result).toBe('<user><name>Godfrey</name><age>30</age></user>');
    });

    it('should omit the XML declaration by default', () => {
      const result = Xml.jsonToXml({
        user: {
          name: 'Godfrey',
        },
      });

      expect(result.startsWith('<?xml')).toBe(false);
    });

    it('should include the XML declaration when headless is false', () => {
      const result = Xml.jsonToXml(
        { user: { name: 'Godfrey' } },
        { headless: false },
      );

      expect(result).toContain('<?xml');
      expect(result).toContain('<user><name>Godfrey</name></user>');
    });

    it('should pretty-print XML when requested', () => {
      const result = Xml.jsonToXml(
        {
          user: {
            name: 'Godfrey',
            age: 30,
          },
        },
        {
          renderOpts: {
            pretty: true,
            indent: '  ',
            newline: '\n',
          },
        },
      );

      expect(result).toContain('\n');
      expect(result).toContain('  <name>Godfrey</name>');
    });

    it('should escape XML special characters', () => {
      const result = Xml.jsonToXml({
        message: 'Tom & Jerry <friends>',
      });

      expect(result).toContain('Tom &amp; Jerry &lt;friends&gt;');
    });

    it('should support arrays', () => {
      const result = Xml.jsonToXml({
        users: {
          user: ['Alice', 'Bob'],
        },
      });

      expect(result).toBe('<users><user>Alice</user><user>Bob</user></users>');
    });

    it('should support attributes using the xml2js attribute convention', () => {
      const result = Xml.jsonToXml({
        user: {
          $: {
            id: '123',
          },
          _: 'Godfrey',
        },
      });

      expect(result).toContain('<user id="123">Godfrey</user>');
    });

    it('should allow custom builder options to override defaults', () => {
      const options: XmlBuilderOptionsForTest = {
        headless: false,
        renderOpts: {
          pretty: true,
          indent: '    ',
          newline: '\n',
        },
      };

      const result = Xml.jsonToXml(
        {
          user: {
            name: 'Godfrey',
          },
        },
        options,
      );

      expect(result).toContain('<?xml');
      expect(result).toContain('    <name>Godfrey</name>');
    });

    it('should build XML when an object contains a function value', () => {
      expect(() =>
        Xml.jsonToXml({
          user: {
            value: () => 'unsupported',
          },
        }),
      ).not.toThrow();
    });
  });

  describe('xmlToJson', () => {
    it('should parse XML into a JavaScript object', async () => {
      const result = await Xml.xmlToJson(
        '<user><name>Godfrey</name><age>30</age></user>',
      );

      expect(result).toEqual({
        user: {
          name: 'Godfrey',
          age: '30',
        },
      });
    });

    it('should parse single-item elements as individual values by default', async () => {
      const result = await Xml.xmlToJson('<user><name>Godfrey</name></user>');

      expect(result).toEqual({
        user: {
          name: 'Godfrey',
        },
      });
    });

    it('should trim whitespace around text values by default', async () => {
      const result = await Xml.xmlToJson(
        '<user><name>  Godfrey  </name></user>',
      );

      expect(result).toEqual({
        user: {
          name: 'Godfrey',
        },
      });
    });

    it('should preserve whitespace when trim is false', async () => {
      const result = await Xml.xmlToJson(
        '<user><name>  Godfrey  </name></user>',
        { trim: false },
      );

      expect(result).toEqual({
        user: {
          name: '  Godfrey  ',
        },
      });
    });

    it('should parse repeated elements as arrays when explicitArray is true', async () => {
      const result = await Xml.xmlToJson(
        '<users><user>Alice</user><user>Bob</user></users>',
        { explicitArray: true },
      );

      expect(result).toEqual({
        users: {
          user: ['Alice', 'Bob'],
        },
      });
    });

    it('should preserve XML tag names by default', async () => {
      const result = await Xml.xmlToJson(
        '<UserProfile><FirstName>Godfrey</FirstName></UserProfile>',
      );

      expect(result).toEqual({
        UserProfile: {
          FirstName: 'Godfrey',
        },
      });
    });

    it('should normalize tag names when requested', async () => {
      const result = await Xml.xmlToJson(
        '<UserProfile><FirstName>Godfrey</FirstName></UserProfile>',
        { normalizeTags: true },
      );

      expect(result).toEqual({
        userprofile: {
          firstname: 'Godfrey',
        },
      });
    });

    it('should parse XML attributes when explicitCharkey and explicitRoot options are provided', async () => {
      const result = await Xml.xmlToJson(
        '<user id="123"><name>Godfrey</name></user>',
        {
          explicitRoot: true,
          attrkey: '$',
        },
      );

      expect(result).toEqual({
        user: {
          $: {
            id: '123',
          },
          name: 'Godfrey',
        },
      });
    });

    it('should allow custom parser options to override defaults', async () => {
      const options: ParserOptions = {
        explicitArray: true,
        trim: false,
      };

      const result = await Xml.xmlToJson(
        '<users><user> Alice </user><user> Bob </user></users>',
        options,
      );

      expect(result).toEqual({
        users: {
          user: [' Alice ', ' Bob '],
        },
      });
    });

    it('should reject invalid XML', async () => {
      await expect(
        Xml.xmlToJson('<user><name>Godfrey</user>'),
      ).rejects.toThrow();
    });

    it('should resolve null for an empty XML string', async () => {
      await expect(Xml.xmlToJson('')).resolves.toBeNull();
    });

    it('should parse an XML declaration', async () => {
      const result = await Xml.xmlToJson(
        '<?xml version="1.0" encoding="UTF-8"?><user><name>Godfrey</name></user>',
      );

      expect(result).toEqual({
        user: {
          name: 'Godfrey',
        },
      });
    });
  });

  describe('extractXml', () => {
    it('should extract an XML element including its tags by default', () => {
      const result = Xml.extractXml(
        '<user><name>Godfrey</name></user>',
        'name',
      );

      expect(result).toBe('<name>Godfrey</name>');
    });

    it('should extract element content when includeTags is false', () => {
      const result = Xml.extractXml(
        '<user><name>Godfrey</name></user>',
        'name',
        false,
      );

      expect(result).toBe('Godfrey');
    });

    it('should return undefined when the opening tag is missing', () => {
      const result = Xml.extractXml(
        '<user><name>Godfrey</name></user>',
        'email',
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined when the closing tag is missing', () => {
      const result = Xml.extractXml('<user><name>Godfrey</user>', 'name');

      expect(result).toBeUndefined();
    });

    it('should extract the first occurrence of an element', () => {
      const result = Xml.extractXml(
        '<users><user>Alice</user><user>Bob</user></users>',
        'user',
      );

      expect(result).toBe('<user>Alice</user>');
    });

    it('should extract nested element content', () => {
      const result = Xml.extractXml(
        '<user><profile><name>Godfrey</name></profile></user>',
        'profile',
        false,
      );

      expect(result).toBe('<name>Godfrey</name>');
    });

    it('should return an empty string for an empty element', () => {
      const result = Xml.extractXml(
        '<user><name></name></user>',
        'name',
        false,
      );

      expect(result).toBe('');
    });

    it('should extract content containing nested elements', () => {
      const result = Xml.extractXml(
        '<user><profile><name>Godfrey</name><age>30</age></profile></user>',
        'profile',
        false,
      );

      expect(result).toBe('<name>Godfrey</name><age>30</age>');
    });

    it('should return undefined when the tag exists only as a self-closing element', () => {
      const result = Xml.extractXml('<user><name /></user>', 'name');

      expect(result).toBeUndefined();
    });
  });
});

interface XmlBuilderOptionsForTest {
  headless: boolean;
  renderOpts: NonNullable<BuilderOptions['renderOpts']>;
}
