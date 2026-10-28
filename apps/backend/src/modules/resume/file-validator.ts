export type SupportedFileType = 'pdf' | 'docx';

export interface FileValidationResult {
  isValid: boolean;
  fileType?: SupportedFileType;
  errorMessage?: string;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validates resume file size, extension, and binary magic bytes.
 * Does not trust client-supplied MIME types alone.
 */
export function validateResumeFile(
  fileBuffer: Buffer,
  originalFilename: string
): FileValidationResult {
  // 1. Check for empty file
  if (!fileBuffer || fileBuffer.length === 0) {
    return {
      isValid: false,
      errorMessage: 'Uploaded file is empty (0 bytes). Please upload a valid document.'
    };
  }

  // 2. Check file size
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (fileBuffer.length / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorMessage: `File size (${sizeMb} MB) exceeds the maximum allowed limit of 10 MB.`
    };
  }

  // 3. Inspect filename extension
  const lowerName = originalFilename.toLowerCase();
  const isPdfExt = lowerName.endsWith('.pdf');
  const isDocxExt = lowerName.endsWith('.docx');

  if (!isPdfExt && !isDocxExt) {
    return {
      isValid: false,
      errorMessage: 'Unsupported file format. Only Adobe PDF (.pdf) and Microsoft Word (.docx) documents are supported.'
    };
  }

  // 4. Verify binary magic bytes
  if (isPdfExt) {
    // PDF files begin with '%PDF-' (0x25 0x50 0x44 0x46)
    const pdfMagic = fileBuffer.slice(0, 5).toString('utf-8');
    if (!pdfMagic.startsWith('%PDF')) {
      return {
        isValid: false,
        errorMessage: 'Invalid PDF file. The file content does not match standard PDF binary signatures.'
      };
    }
    return { isValid: true, fileType: 'pdf' };
  }

  if (isDocxExt) {
    // Modern DOCX is a zipped XML package beginning with PK header: 0x50 0x4B 0x03 0x04
    const isZipHeader =
      fileBuffer.length >= 4 &&
      fileBuffer[0] === 0x50 &&
      fileBuffer[1] === 0x4b &&
      fileBuffer[2] === 0x03 &&
      fileBuffer[3] === 0x04;

    if (!isZipHeader) {
      return {
        isValid: false,
        errorMessage: 'Invalid Word document. The file does not have valid DOCX archive headers (legacy binary .doc is not supported).'
      };
    }
    return { isValid: true, fileType: 'docx' };
  }

  return {
    isValid: false,
    errorMessage: 'File validation failed for an unknown format.'
  };
}
