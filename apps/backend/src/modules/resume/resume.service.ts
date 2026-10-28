import crypto from 'crypto';
import { ResumeUploadResponse } from '@career-orchestrator/shared';
import { validateResumeFile } from './file-validator';
import { PdfExtractor } from './pdf-extractor';
import { DocxExtractor } from './docx-extractor';
import { DeterministicSkillExtractor } from './deterministic-skill-extractor';
import { ProfileRepository, profileRepository } from './profile.repository';

export class ResumeService {
  private pdfExtractor = new PdfExtractor();
  private docxExtractor = new DocxExtractor();
  private skillExtractor = new DeterministicSkillExtractor();

  constructor(private repo: ProfileRepository = profileRepository) {}

  async processResumeUpload(
    fileBuffer: Buffer,
    originalFilename: string
  ): Promise<ResumeUploadResponse> {
    // 1. File Validation
    const validation = validateResumeFile(fileBuffer, originalFilename);
    if (!validation.isValid || !validation.fileType) {
      throw new Error(validation.errorMessage || 'File validation failed.');
    }

    // 2. Text Extraction based on validated file type
    const extractionResult =
      validation.fileType === 'pdf'
        ? await this.pdfExtractor.extractText(fileBuffer)
        : await this.docxExtractor.extractText(fileBuffer);

    const warnings = [...extractionResult.warnings];

    // Check for empty/image-only text
    if (extractionResult.isEmpty || extractionResult.wordCount === 0) {
      const profileId = crypto.randomUUID();
      await this.repo.createProfile({
        id: profileId,
        filename: originalFilename,
        rawTextPreview: '',
        suggestedSkills: [],
        confirmedSkills: [],
        isReviewed: false
      });

      return {
        profileId,
        filename: originalFilename,
        fileSizeBytes: fileBuffer.length,
        extractedTextPreview: '',
        wordCount: 0,
        suggestedSkills: [],
        warnings,
        status: 'EMPTY_TEXT',
        processedAt: new Date().toISOString()
      };
    }

    // 3. Competency Extraction via Deterministic Ontology Engine
    const skillResult = await this.skillExtractor.extractSkills(extractionResult.text);

    if (skillResult.skills.length === 0) {
      warnings.push(
        'No direct competency matches found against standard enterprise taxonomy. You can manually enter your skills on the review screen.'
      );
    }

    // 4. Staging Profile in Repository
    const profileId = crypto.randomUUID();
    const previewLength = Math.min(600, extractionResult.text.length);
    const textPreview =
      extractionResult.text.slice(0, previewLength).trim() +
      (extractionResult.text.length > previewLength ? '...' : '');

    await this.repo.createProfile({
      id: profileId,
      filename: originalFilename,
      rawTextPreview: textPreview,
      suggestedSkills: skillResult.skills,
      confirmedSkills: [],
      isReviewed: false
    });

    return {
      profileId,
      filename: originalFilename,
      fileSizeBytes: fileBuffer.length,
      extractedTextPreview: textPreview,
      wordCount: extractionResult.wordCount,
      suggestedSkills: skillResult.skills,
      warnings,
      status: warnings.length > 0 ? 'WARNING' : 'SUCCESS',
      processedAt: new Date().toISOString()
    };
  }
}
