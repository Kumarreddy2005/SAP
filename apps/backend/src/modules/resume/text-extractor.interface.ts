export interface TextExtractionResult {
  text: string;
  wordCount: number;
  warnings: string[];
  isEmpty: boolean;
  pageCount?: number;
}

export interface TextExtractor {
  extractText(buffer: Buffer): Promise<TextExtractionResult>;
}
