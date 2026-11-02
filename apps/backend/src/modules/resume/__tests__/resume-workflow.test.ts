import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { validateResumeFile } from '../file-validator';
import { PdfExtractor } from '../pdf-extractor';
import { DocxExtractor } from '../docx-extractor';
import { DeterministicSkillExtractor } from '../deterministic-skill-extractor';
import { ResumeService } from '../resume.service';
import { ProfileService } from '../profile.service';
import { InMemoryProfileRepository } from '../profile.repository';
import {
  createTestPdfBuffer,
  createTestDocxBuffer,
  createMalformedPdfBuffer,
  createOverSizedBuffer
} from './test-helpers';

describe('Resume Ingestion & Skill Extraction Workflow Suite', () => {
  let repo: InMemoryProfileRepository;
  let resumeService: ResumeService;
  let profileService: ProfileService;

  beforeEach(() => {
    repo = new InMemoryProfileRepository();
    resumeService = new ResumeService(repo);
    profileService = new ProfileService(repo);
  });

  // Test 1: Valid text-based PDF parsed
  it('1. Parses a valid text-based PDF successfully', async () => {
    const text = 'Lead Cloud Engineer with expertise in TypeScript, Node.js, and Docker containerization.';
    const buffer = await createTestPdfBuffer(text);

    const extractor = new PdfExtractor();
    const result = await extractor.extractText(buffer);

    assert.strictEqual(result.isEmpty, false);
    assert.ok(result.wordCount > 5, 'Word count should be positive');
    assert.ok(result.text.includes('TypeScript'), 'Should contain TypeScript');
  });

  // Test 2: Valid DOCX parsed
  it('2. Parses a valid DOCX file successfully', async () => {
    const text = 'Senior Financial Analyst experienced in General Ledger Accounting and IFRS reporting.';
    const buffer = await createTestDocxBuffer(text);

    const extractor = new DocxExtractor();
    const result = await extractor.extractText(buffer);

    assert.strictEqual(result.isEmpty, false);
    assert.ok(result.wordCount > 5);
    assert.ok(result.text.includes('General Ledger Accounting'));
  });

  // Test 3: Supported file with recognizable skills produces evidence-backed suggestions
  it('3. Identifies candidate skills with supporting evidence snippets', async () => {
    const text = 'Senior Full-Stack Developer with 5 years of experience building scalable enterprise architectures, REST APIs, and responsive React frontends with PostgreSQL databases.';
    const buffer = await createTestPdfBuffer(text);

    const uploadResponse = await resumeService.processResumeUpload(buffer, 'developer_resume.pdf');

    assert.strictEqual(uploadResponse.status, 'SUCCESS');
    assert.ok(uploadResponse.suggestedSkills.length >= 3, 'Should detect React, REST, PostgreSQL');

    const reactSkill = uploadResponse.suggestedSkills.find((s) => s.code === 'FRONT-REACT');
    assert.ok(reactSkill, 'React skill should be suggested');
    assert.ok(reactSkill.evidenceSnippet, 'Evidence snippet must be provided');
    assert.ok(reactSkill.confidenceScore > 0.8, 'Heuristic confidence score should be high');
  });

  // Test 4: File containing no recognizable skills returns valid empty result
  it('4. Returns valid empty result with warning when no recognizable competencies exist', async () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';
    const buffer = await createTestPdfBuffer(text);

    const response = await resumeService.processResumeUpload(buffer, 'latin_text.pdf');

    assert.strictEqual(response.suggestedSkills.length, 0);
    assert.strictEqual(response.status, 'WARNING');
    assert.ok(response.warnings.some((w) => w.includes('No direct competency matches')));
  });

  // Test 5: Unsupported file type is rejected
  it('5. Rejects unsupported file extensions and binary formats', () => {
    const buffer = Buffer.from('console.log("hello world");');
    const result = validateResumeFile(buffer, 'script.js');

    assert.strictEqual(result.isValid, false);
    assert.ok(result.errorMessage?.includes('Unsupported file format'));
  });

  // Test 6: File exceeding 10 MB is rejected
  it('6. Rejects files exceeding the 10 MB size limit', () => {
    const overSized = createOverSizedBuffer();
    const result = validateResumeFile(overSized, 'giant_resume.pdf');

    assert.strictEqual(result.isValid, false);
    assert.ok(result.errorMessage?.includes('exceeds the maximum allowed limit of 10 MB'));
  });

  // Test 7: Malformed or unreadable PDF produces an appropriate error
  it('7. Handles malformed or corrupt PDF files gracefully with clean error message', async () => {
    const malformed = createMalformedPdfBuffer();

    await assert.rejects(
      async () => {
        const extractor = new PdfExtractor();
        await extractor.extractText(malformed);
      },
      (err: Error) => {
        assert.ok(err.message.includes('PDF parsing failed'));
        return true;
      }
    );
  });

  // Test 8: Empty or missing upload is rejected
  it('8. Rejects empty (0-byte) files', () => {
    const emptyBuffer = Buffer.alloc(0);
    const result = validateResumeFile(emptyBuffer, 'empty.pdf');

    assert.strictEqual(result.isValid, false);
    assert.ok(result.errorMessage?.includes('empty (0 bytes)'));
  });

  // Test 9: Duplicate skill suggestions are removed
  it('9. Deduplicates skills when multiple aliases appear in the text', async () => {
    const text = 'Proficient in Python, Python3, and writing Python automation scripts.';
    const extractor = new DeterministicSkillExtractor();
    const result = await extractor.extractSkills(text);

    const pythonMatches = result.skills.filter((s) => s.code === 'LANG-PYTHON');
    assert.strictEqual(pythonMatches.length, 1, 'Python must only be suggested once');
  });

  // Test 10: Suggested skills are not automatically marked as confirmed
  it('10. Leaves suggested skills unconfirmed by default (reviewStatus = SUGGESTED)', async () => {
    const text = 'Expert in SAP S/4HANA Finance and ABAP Cloud development.';
    const buffer = await createTestPdfBuffer(text);
    const response = await resumeService.processResumeUpload(buffer, 'sap_consultant.pdf');

    for (const skill of response.suggestedSkills) {
      assert.strictEqual(skill.isConfirmed, false, 'Skill must not be pre-confirmed');
      assert.strictEqual(skill.reviewStatus, 'SUGGESTED');
    }
  });

  // Test 11: User can confirm a skill
  it('11. Allows user to confirm proposed skills through the review API', async () => {
    const text = 'Senior Software Engineer specializing in TypeScript and React.';
    const buffer = await createTestPdfBuffer(text);
    const uploaded = await resumeService.processResumeUpload(buffer, 'dev.pdf');

    const tsSkill = uploaded.suggestedSkills.find((s) => s.code === 'LANG-TS')!;
    assert.ok(tsSkill);

    const reviewResponse = await profileService.reviewProfile(uploaded.profileId, {
      profileId: uploaded.profileId,
      reviewedSkills: [
        {
          skillId: tsSkill.id,
          name: tsSkill.name,
          category: tsSkill.category,
          proficiency: 'ADVANCED',
          yearsExperience: 4.0,
          isConfirmed: true,
          isTransferable: true,
          evidenceSnippet: tsSkill.evidenceSnippet,
          reviewStatus: 'CONFIRMED'
        }
      ]
    });

    assert.ok(reviewResponse);
    assert.strictEqual(reviewResponse.confirmedSkillsCount, 1);
    assert.strictEqual(reviewResponse.confirmedSkills[0].proficiency, 'ADVANCED');
    assert.strictEqual(reviewResponse.confirmedSkills[0].isConfirmed, true);
  });

  // Test 12: User can reject a skill
  it('12. Excludes rejected skills from confirmed competencies', async () => {
    const text = 'Proficient in SQL and Java programming.';
    const buffer = await createTestPdfBuffer(text);
    const uploaded = await resumeService.processResumeUpload(buffer, 'cv.pdf');

    const javaSkill = uploaded.suggestedSkills.find((s) => s.code === 'LANG-JAVA')!;
    const sqlSkill = uploaded.suggestedSkills.find((s) => s.code === 'LANG-SQL')!;

    const reviewResponse = await profileService.reviewProfile(uploaded.profileId, {
      profileId: uploaded.profileId,
      reviewedSkills: [
        {
          skillId: sqlSkill.id,
          name: sqlSkill.name,
          category: sqlSkill.category,
          proficiency: 'INTERMEDIATE',
          yearsExperience: 2.0,
          isConfirmed: true,
          isTransferable: true
        },
        {
          skillId: javaSkill.id,
          name: javaSkill.name,
          category: javaSkill.category,
          proficiency: 'NOVICE',
          yearsExperience: 0.5,
          isConfirmed: false, // Rejected by candidate
          isTransferable: true,
          reviewStatus: 'REJECTED'
        }
      ]
    });

    assert.ok(reviewResponse);
    assert.strictEqual(reviewResponse.confirmedSkillsCount, 1);
    assert.strictEqual(reviewResponse.rejectedSkillsCount, 1);
    assert.strictEqual(reviewResponse.confirmedSkills[0].name, sqlSkill.name);
    assert.ok(!reviewResponse.confirmedSkills.some((s) => s.name === javaSkill.name));
  });

  // Test 13: User can add a skill manually
  it('13. Supports adding new manual skills during review', async () => {
    const text = 'Accountant experienced in financial statements.';
    const buffer = await createTestPdfBuffer(text);
    const uploaded = await resumeService.processResumeUpload(buffer, 'acct.pdf');

    const reviewResponse = await profileService.reviewProfile(uploaded.profileId, {
      profileId: uploaded.profileId,
      reviewedSkills: [
        {
          skillId: 'manual-skill-custom-1',
          name: 'SAP S/4HANA Finance Customizing (IMG)',
          category: 'SAP_FUNCTIONAL',
          proficiency: 'INTERMEDIATE',
          yearsExperience: 1.5,
          isConfirmed: true,
          isTransferable: false,
          extractionMethod: 'MANUAL_ENTRY'
        }
      ]
    });

    assert.ok(reviewResponse);
    assert.strictEqual(reviewResponse.confirmedSkillsCount, 1);
    assert.strictEqual(reviewResponse.confirmedSkills[0].extractionMethod, 'MANUAL_ENTRY');
    assert.strictEqual(reviewResponse.confirmedSkills[0].name, 'SAP S/4HANA Finance Customizing (IMG)');
  });

  // Test 14: Nonexistent profile returns null (handled as 404 by controller)
  it('14. Returns null for nonexistent profile identifiers', async () => {
    const result = await profileService.reviewProfile('non-existent-profile-id', {
      profileId: 'non-existent-profile-id',
      reviewedSkills: []
    });

    assert.strictEqual(result, null);
  });

  // Test 15: Scanned / Image-only PDF detection
  it('15. Detects image-only / blank PDF and flags empty text status with warning', async () => {
    const blankBuffer = await createTestPdfBuffer('');
    const response = await resumeService.processResumeUpload(blankBuffer, 'scanned_image_only.pdf');

    assert.strictEqual(response.status, 'EMPTY_TEXT');
    assert.strictEqual(response.wordCount, 0);
    assert.ok(response.warnings.some((w) => w.includes('Optical Character Recognition') || w.includes('OCR')));
  });

  // Test 16: Skill review defaults and confidence preservation
  it('16. Validates that confirmed skills require explicit proficiency and preserves confidence separately', async () => {
    const text = 'Senior Analyst skilled in SQL database querying.';
    const buffer = await createTestPdfBuffer(text);
    const uploaded = await resumeService.processResumeUpload(buffer, 'analyst.pdf');

    const sqlSkill = uploaded.suggestedSkills.find((s) => s.code === 'LANG-SQL')!;
    assert.ok(sqlSkill);
    // Verified: initial extraction leaves proficiency undefined rather than silently inventing INTERMEDIATE
    assert.strictEqual(sqlSkill.proficiency, undefined);
    assert.ok(sqlSkill.confidenceScore > 0.8);

    // Save with candidate calibrated proficiency
    const reviewResponse = await profileService.reviewProfile(uploaded.profileId, {
      profileId: uploaded.profileId,
      reviewedSkills: [
        {
          skillId: sqlSkill.id,
          name: sqlSkill.name,
          category: sqlSkill.category,
          proficiency: 'ADVANCED', // explicitly chosen by candidate
          yearsExperience: 4.0,
          confidenceScore: sqlSkill.confidenceScore, // preserved extraction confidence
          isConfirmed: true,
          isTransferable: true,
          evidenceSnippet: sqlSkill.evidenceSnippet,
          extractionMethod: sqlSkill.extractionMethod
        }
      ]
    });

    assert.ok(reviewResponse);
    assert.strictEqual(reviewResponse.confirmedSkillsCount, 1);
    const confirmed = reviewResponse.confirmedSkills[0];
    assert.strictEqual(confirmed.proficiency, 'ADVANCED');
    assert.strictEqual(confirmed.yearsExperience, 4.0);
    assert.strictEqual(confirmed.confidenceScore, sqlSkill.confidenceScore);
  });

  // Test 17: Candidate session reset & profile deletion
  it('17. Candidate session purge: successfully removes profile and verified existence returns null', async () => {
    const text = 'Data Engineer skilled in Python and SQL.';
    const buffer = await createTestPdfBuffer(text);
    const uploaded = await resumeService.processResumeUpload(buffer, 'data_engineer.pdf');

    const created = await profileService.getProfile(uploaded.profileId);
    assert.ok(created);
    assert.strictEqual(created.id, uploaded.profileId);

    const deleted = await profileService.deleteProfile(uploaded.profileId);
    assert.strictEqual(deleted, true);

    const afterDelete = await profileService.getProfile(uploaded.profileId);
    assert.strictEqual(afterDelete, null);
  });

  // Test 18: Deleting nonexistent profile returns false gracefully
  it('18. Candidate session purge: deleting nonexistent profile returns false without throwing', async () => {
    const nonExistentId = 'nonexistent-profile-999';
    const deleted = await profileService.deleteProfile(nonExistentId);
    assert.strictEqual(deleted, false);

    const check = await profileService.getProfile(nonExistentId);
    assert.strictEqual(check, null);
  });
});
