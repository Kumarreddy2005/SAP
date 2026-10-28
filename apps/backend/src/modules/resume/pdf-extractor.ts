import { TextExtractor, TextExtractionResult } from './text-extractor.interface';

// Use the robust Mozilla pdfjs-dist legacy bundle
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

export class PdfExtractor implements TextExtractor {
  async extractText(buffer: Buffer): Promise<TextExtractionResult> {
    const warnings: string[] = [];

    try {
      const data = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({
        data,
        useSystemFonts: true,
        disableFontFace: true,
        isEvalSupported: false
      });

      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages || 1;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += pageText + '\n';
      }

      const sanitized = fullText.replace(/\r\n/g, '\n').trim();
      const words = sanitized.length > 0 ? sanitized.split(/\s+/).filter(Boolean) : [];

      if (words.length === 0) {
        warnings.push(
          'Scanned document or image-only PDF detected with no extractable text layer. Optical Character Recognition (OCR) is not currently enabled. Please use a text-based PDF or enter experience manually.'
        );
        return {
          text: '',
          wordCount: 0,
          warnings,
          isEmpty: true,
          pageCount: numPages
        };
      }

      if (words.length < 15) {
        warnings.push(
          'Very sparse text extracted from PDF. Document might contain scanned images or non-standard font encodings.'
        );
      }

      return {
        text: sanitized,
        wordCount: words.length,
        warnings,
        isEmpty: false,
        pageCount: numPages
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (
        message.toLowerCase().includes('password') ||
        message.toLowerCase().includes('encrypted') ||
        message.includes('PasswordException')
      ) {
        throw new Error('PDF document is encrypted or password-protected. Please provide an unencrypted document.');
      }
      throw new Error(`PDF parsing failed: ${message}`);
    }
  }
}
