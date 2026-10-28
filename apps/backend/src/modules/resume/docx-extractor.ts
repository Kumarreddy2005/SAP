import mammoth from 'mammoth';
import { TextExtractor, TextExtractionResult } from './text-extractor.interface';

export class DocxExtractor implements TextExtractor {
  async extractText(buffer: Buffer): Promise<TextExtractionResult> {
    const warnings: string[] = [];

    try {
      const result = await mammoth.extractRawText({ buffer });
      const rawText = result.value || '';
      const sanitized = rawText.replace(/\r\n/g, '\n').trim();
      const words = sanitized.length > 0 ? sanitized.split(/\s+/).filter(Boolean) : [];

      if (result.messages && result.messages.length > 0) {
        for (const msg of result.messages) {
          if (msg.type === 'warning') {
            warnings.push(`DOCX warning: ${msg.message}`);
          }
        }
      }

      if (words.length === 0) {
        warnings.push(
          'Document contains no readable body text. Ensure content is not saved exclusively inside embedded images or unsupported form objects.'
        );
        return {
          text: '',
          wordCount: 0,
          warnings,
          isEmpty: true
        };
      }

      return {
        text: sanitized,
        wordCount: words.length,
        warnings,
        isEmpty: false
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`DOCX parsing failed: ${message}`);
    }
  }
}
