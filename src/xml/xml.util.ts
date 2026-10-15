import { Builder, Parser } from 'xml2js';
import type { BuilderOptions, ParserOptions } from 'xml2js';

interface XmlRenderOptions extends NonNullable<BuilderOptions['renderOpts']> {
  allowEmpty?: boolean;
}

interface XmlBuilderOptions extends Omit<BuilderOptions, 'renderOpts'> {
  renderOpts?: XmlRenderOptions;
}

export class Xml {
  /**
   * Converts a JavaScript object into an XML string.
   *
   * By default, the XML declaration is omitted and the output is generated
   * without pretty-printing. Custom xml2js builder options can override
   * these defaults.
   *
   * @param jsonObject - Object to convert into XML.
   * @param options - Optional xml2js builder options.
   * @returns The generated XML string.
   * @throws {Error} If the object cannot be converted into XML.
   * @example
   * Xml.jsonToXml({ user: { name: 'Godfrey', age: 30 } });
   * // '<user><name>Godfrey</name><age>30</age></user>'
   *
   * @example
   * Xml.jsonToXml(
   *   { user: { name: 'Godfrey' } },
   *   { headless: false },
   * );
   */
  public static jsonToXml(
    jsonObject: Record<string, unknown>,
    options?: XmlBuilderOptions,
  ): string {
    const xmlOptions: BuilderOptions = {
      headless: true,
      renderOpts: {
        pretty: false,
      },
      ...options,
    };

    const builder = new Builder(xmlOptions);
    return builder.buildObject(jsonObject);
  }

  /**
   * Converts an XML string into a JavaScript value.
   *
   * By default, single-item XML elements are parsed as individual values
   * rather than arrays. Whitespace around text values is trimmed.
   * Custom xml2js parser options can override these defaults.
   *
   * The returned value is unknown because the resulting structure depends
   * on the XML document and the parser options.
   *
   * @param xml - XML string to parse.
   * @param options - Optional xml2js parser options.
   * @returns A promise resolving to the parsed JavaScript value.
   * @throws {Error} If the XML is invalid or parsing fails.
   * @example
   * const result = await Xml.xmlToJson(
   *   '<user><name>Godfrey</name><age>30</age></user>',
   * );
   * // { user: { name: 'Godfrey', age: '30' } }
   *
   * @example
   * const result = await Xml.xmlToJson(
   *   '<users><user>A</user><user>B</user></users>',
   *   { explicitArray: true },
   * );
   */
  public static async xmlToJson(
    xml: string,
    options?: ParserOptions,
  ): Promise<unknown> {
    const xmlOptions: ParserOptions = {
      explicitArray: false,
      normalize: false,
      normalizeTags: false,
      trim: true,
      ...options,
    };

    const parser = new Parser(xmlOptions);

    return new Promise<unknown>((resolve, reject) => {
      parser.parseString(xml, (error: Error | null, result: unknown): void => {
        if (error !== null) {
          reject(error);
          return;
        }

        resolve(result);
      });
    });
  }

  /**
   * Extracts the first occurrence of an XML element from a string.
   *
   * This method uses string matching rather than an XML parser. It is
   * suitable for simple, predictable XML fragments but does not handle
   * nested elements with the same tag name or complex XML syntax reliably.
   *
   * @param xmlString - XML string to search.
   * @param tagName - Name of the opening and closing tag, without angle brackets.
   * @param includeTags - Whether to include the opening and closing tags.
   * Defaults to true.
   * @returns The extracted XML element or its content, or undefined if not found.
   * @example
   * Xml.extractXml('<user><name>Godfrey</name></user>', 'name');
   * // '<name>Godfrey</name>'
   *
   * @example
   * Xml.extractXml('<user><name>Godfrey</name></user>', 'name', false);
   * // 'Godfrey'
   */
  public static extractXml(
    xmlString: string,
    tagName: string,
    includeTags = true,
  ): string | undefined {
    const startString = `<${tagName}>`;
    const endString = `</${tagName}>`;

    const startIndex = xmlString.indexOf(startString);

    if (startIndex === -1) {
      return undefined;
    }

    const contentStartIndex = startIndex + startString.length;
    const endIndex = xmlString.indexOf(endString, contentStartIndex);

    if (endIndex === -1) {
      return undefined;
    }

    if (includeTags) {
      return xmlString.substring(startIndex, endIndex + endString.length);
    }

    return xmlString.substring(contentStartIndex, endIndex);
  }
}
