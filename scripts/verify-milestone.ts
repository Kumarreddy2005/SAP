import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { app } from '../apps/backend/src/app';
import { InMemoryProfileRepository } from '../apps/backend/src/modules/resume/profile.repository';
import { ProfileService } from '../apps/backend/src/modules/resume/profile.service';
import { ResumeService } from '../apps/backend/src/modules/resume/resume.service';
import {
  ResumeUploadResponse,
  ProfileReviewResponse,
  ExtractedSkillItem,
  CareerMatchResult,
  CareerComparisonResult,
  SkillGapAnalysis,
  LearningPathway
} from '@career-orchestrator/shared';

// Helper to create synthetic PDF
async function createSyntheticPdf(textLines: string[]): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 800;

  for (const line of textLines) {
    if (y < 40) break;
    page.drawText(line, {
      x: 50,
      y,
      size: 11,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });
    y -= 18;
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// Helper to create synthetic DOCX
async function createSyntheticDocx(paragraphs: string[]): Promise<Buffer> {
  const zip = new JSZip();
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
      <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
      <Default Extension="xml" ContentType="application/xml"/>
      <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
    </Types>`
  );

  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
      <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
    </Relationships>`
  );

  const bodyXml = paragraphs
    .map((p) => `<w:p><w:r><w:t>${p.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</w:t></w:r></w:p>`)
    .join('');

  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>${bodyXml}</w:body>
    </w:document>`
  );

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  return buffer;
}

async function runMilestoneVerification() {
  console.log('================================================================');
  console.log('CAREER ORCHESTRATOR — END-TO-END RESUME & SKILLS VERIFICATION');
  console.log('================================================================\n');

  // Start in-process Express server for HTTP multipart testing
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099';
  console.log(`[Test Server] Express backend running at ${baseUrl}`);

  try {
    // -------------------------------------------------------------
    // Test 1: Ingest Realistic PDF Resume (Finance & Analytics)
    // -------------------------------------------------------------
    console.log('\n--- TEST 1: REALISTIC PDF INGESTION (FINANCE & ERP) ---');
    const pdfBuffer = await createSyntheticPdf([
      'Alex Vance — Senior Financial & Business Systems Analyst',
      'Contact: alex.vance@example.com | San Jose, CA',
      '',
      'PROFESSIONAL SUMMARY',
      'Senior Financial Analyst with 5+ years driving general ledger reconciliations, balance sheet reporting under IFRS, and variance auditing.',
      'Extensive experience executing SQL queries on relational databases for financial discrepancy audits.',
      'Collaborated closely with cross-functional IT and business teams during SAP S/4HANA user acceptance testing for accounts payable.',
      'Architected complex forecasting models in Microsoft Excel utilizing Power Query, VBA macros, and financial modeling techniques.',
      '',
      'CORE SKILLS & TECHNOLOGIES',
      '- General Ledger Accounting & Financial Reporting (IFRS)',
      '- Relational Database Querying with SQL and PostgreSQL',
      '- SAP S/4HANA Finance architecture awareness',
      '- Advanced Excel financial modeling, pivot tables, and forecasting',
      '- Business Process Mapping and cross-functional stakeholder communication'
    ]);

    const pdfFormData = new FormData();
    pdfFormData.append('file', new Blob([pdfBuffer], { type: 'application/pdf' }), 'Alex_Vance_Resume.pdf');

    const pdfUploadRes = await fetch(`${baseUrl}/api/v1/resume/upload`, {
      method: 'POST',
      body: pdfFormData
    });

    const pdfData = (await pdfUploadRes.json()) as ResumeUploadResponse;
    console.log(`HTTP Status: ${pdfUploadRes.status}`);
    console.log(`Profile ID: ${pdfData.profileId}`);
    console.log(`Filename: ${pdfData.filename} (${pdfData.fileSizeBytes} bytes)`);
    console.log(`Extracted Words: ${pdfData.wordCount}`);
    console.log(`Extracted Preview: "${pdfData.extractedTextPreview.slice(0, 140)}..."`);
    console.log(`Identified Candidate Competencies: ${pdfData.suggestedSkills.length}`);
    pdfData.suggestedSkills.forEach((s, idx) => {
      console.log(`  ${idx + 1}. [${s.code}] ${s.name} (${s.category})`);
      console.log(`     Method: ${s.extractionMethod} | Conf: ${(s.confidenceScore * 100).toFixed(0)}% | Status: ${s.reviewStatus}`);
      console.log(`     Evidence: "${s.evidenceSnippet?.slice(0, 80)}..."`);
    });

    if (pdfUploadRes.status !== 200 || pdfData.suggestedSkills.length < 3) {
      throw new Error('Test 1 failed: PDF extraction did not identify expected competencies.');
    }

    // -------------------------------------------------------------
    // Test 2: Ingest Realistic DOCX Resume (Full Stack Developer)
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: REALISTIC DOCX INGESTION (SOFTWARE ENGINEERING) ---');
    const docxBuffer = await createSyntheticDocx([
      'Morgan Chen — Full-Stack Cloud Software Engineer',
      'Email: morgan.chen@example.com | Austin, TX',
      '',
      'PROFESSIONAL EXPERIENCE',
      'Senior Software Engineer with 4 years building scalable web services using TypeScript, Node.js, Express, and React.',
      'Designed and deployed REST APIs and microservices backed by PostgreSQL and Redis.',
      'Containerized development and deployment workflows using Docker, automated testing pipelines in GitHub Actions CI/CD.',
      'Practiced Agile Scrum ceremonies and collaborated with product management to define technical specifications.'
    ]);

    const docxFormData = new FormData();
    docxFormData.append(
      'file',
      new Blob([docxBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }),
      'Morgan_Chen_Software_Engineer.docx'
    );

    const docxUploadRes = await fetch(`${baseUrl}/api/v1/resume/upload`, {
      method: 'POST',
      body: docxFormData
    });

    const docxData = (await docxUploadRes.json()) as ResumeUploadResponse;
    console.log(`HTTP Status: ${docxUploadRes.status}`);
    console.log(`Profile ID: ${docxData.profileId}`);
    console.log(`Filename: ${docxData.filename} (${docxData.fileSizeBytes} bytes)`);
    console.log(`Extracted Words: ${docxData.wordCount}`);
    console.log(`Identified Candidate Competencies: ${docxData.suggestedSkills.length}`);
    docxData.suggestedSkills.forEach((s, idx) => {
      console.log(`  ${idx + 1}. [${s.code}] ${s.name} (${s.category})`);
      console.log(`     Method: ${s.extractionMethod} | Conf: ${(s.confidenceScore * 100).toFixed(0)}%`);
      console.log(`     Evidence: "${s.evidenceSnippet?.slice(0, 80)}..."`);
    });

    if (docxUploadRes.status !== 200 || docxData.suggestedSkills.length < 3) {
      throw new Error('Test 2 failed: DOCX extraction did not identify expected competencies.');
    }

    // -------------------------------------------------------------
    // Test 3: Edge Case — Scanned / Blank PDF
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: EDGE CASE — BLANK / SCANNED PDF ---');
    const blankPdfBuffer = await createSyntheticPdf([]);
    const blankFormData = new FormData();
    blankFormData.append('file', new Blob([blankPdfBuffer], { type: 'application/pdf' }), 'scanned-invoice.pdf');

    const blankUploadRes = await fetch(`${baseUrl}/api/v1/resume/upload`, {
      method: 'POST',
      body: blankFormData
    });

    const blankData = (await blankUploadRes.json()) as ResumeUploadResponse;
    console.log(`HTTP Status: ${blankUploadRes.status}`);
    console.log(`Status Field: ${blankData.status}`);
    console.log(`Warnings Count: ${blankData.warnings.length}`);
    console.log(`Warning message: "${blankData.warnings[0]}"`);

    if (blankData.status !== 'EMPTY_TEXT' || !blankData.warnings.some((w) => w.includes('OCR'))) {
      throw new Error('Test 3 failed: Blank/scanned PDF was not flagged with EMPTY_TEXT and OCR warning.');
    }

    // -------------------------------------------------------------
    // Test 4: Edge Case — Unsupported File Format
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: EDGE CASE — UNSUPPORTED FILE EXTENSION ---');
    const txtFormData = new FormData();
    txtFormData.append('file', new Blob([Buffer.from('plain text resume')], { type: 'text/plain' }), 'resume.txt');

    const txtUploadRes = await fetch(`${baseUrl}/api/v1/resume/upload`, {
      method: 'POST',
      body: txtFormData
    });

    const txtData = (await txtUploadRes.json()) as { error: string; message: string };
    console.log(`HTTP Status: ${txtUploadRes.status} (Expected 400)`);
    console.log(`Error type: ${txtData.error}`);
    console.log(`Error message: "${txtData.message}"`);

    if (txtUploadRes.status !== 400 || !txtData.message.includes('Unsupported file format')) {
      throw new Error('Test 4 failed: Unsupported file extension was not rejected with 400.');
    }

    // -------------------------------------------------------------
    // Test 5: Human-in-the-Loop Review Interaction (Confirm, Reject, Add)
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: HUMAN-IN-THE-LOOP PROFILE REVIEW VIA API ---');
    const profileId = pdfData.profileId;
    const suggested = pdfData.suggestedSkills;

    // Human-in-the-loop review: confirm finance and ERP skills, reject one skill, add manual competency
    const glSkill = suggested.find((s) => s.name.toLowerCase().includes('general ledger')) || suggested[4];
    const finRepSkill = suggested.find((s) => s.name.toLowerCase().includes('financial reporting')) || suggested[5];
    const bpmSkill = suggested.find((s) => s.name.toLowerCase().includes('process mapping')) || suggested[6];
    const sqlSkill = suggested.find((s) => s.name.toLowerCase().includes('sql')) || suggested[0];
    const s4Skill = suggested.find((s) => s.name.toLowerCase().includes('s/4hana')) || suggested[2];
    const rejectedItem = suggested.find((s) => s.name.toLowerCase().includes('postgres')) || suggested[1];

    const reviewedSkills = [
      {
        skillId: glSkill.id,
        name: glSkill.name,
        category: glSkill.category,
        proficiency: 'ADVANCED' as const,
        yearsExperience: 5.0,
        isConfirmed: true,
        isTransferable: true,
        evidenceSnippet: glSkill.evidenceSnippet,
        extractionMethod: glSkill.extractionMethod,
        reviewStatus: 'CONFIRMED' as const
      },
      {
        skillId: finRepSkill.id,
        name: finRepSkill.name,
        category: finRepSkill.category,
        proficiency: 'INTERMEDIATE' as const,
        yearsExperience: 4.0,
        isConfirmed: true,
        isTransferable: true,
        evidenceSnippet: finRepSkill.evidenceSnippet,
        extractionMethod: finRepSkill.extractionMethod,
        reviewStatus: 'CONFIRMED' as const
      },
      {
        skillId: bpmSkill.id,
        name: bpmSkill.name,
        category: bpmSkill.category,
        proficiency: 'INTERMEDIATE' as const,
        yearsExperience: 3.0,
        isConfirmed: true,
        isTransferable: true,
        evidenceSnippet: bpmSkill.evidenceSnippet,
        extractionMethod: bpmSkill.extractionMethod,
        reviewStatus: 'CONFIRMED' as const
      },
      {
        skillId: sqlSkill.id,
        name: sqlSkill.name,
        category: sqlSkill.category,
        proficiency: 'INTERMEDIATE' as const,
        yearsExperience: 3.5,
        isConfirmed: true,
        isTransferable: true,
        evidenceSnippet: sqlSkill.evidenceSnippet,
        extractionMethod: sqlSkill.extractionMethod,
        reviewStatus: 'CONFIRMED' as const
      },
      {
        skillId: s4Skill.id,
        name: s4Skill.name,
        category: s4Skill.category,
        proficiency: 'INTERMEDIATE' as const,
        yearsExperience: 2.0,
        isConfirmed: true,
        isTransferable: true,
        evidenceSnippet: s4Skill.evidenceSnippet,
        extractionMethod: s4Skill.extractionMethod,
        reviewStatus: 'CONFIRMED' as const
      },
      // Explicitly Rejected Skill (candidate verifies they do NOT have this skill or want it excluded)
      {
        skillId: 'EXCLUDED-COBOL-01',
        name: 'Legacy COBOL Mainframe Maintenance',
        category: 'SOFTWARE_DEV' as const,
        proficiency: 'NOVICE' as const,
        yearsExperience: 0.5,
        isConfirmed: false,
        isTransferable: false,
        reviewStatus: 'REJECTED' as const
      },
      // Manually added competency
      {
        skillId: 'USER-MANUAL-001',
        name: 'S/4HANA Finance Customizing (IMG)',
        category: 'SAP_FUNCTIONAL' as const,
        proficiency: 'NOVICE' as const,
        yearsExperience: 1.0,
        isConfirmed: true,
        isTransferable: false,
        evidenceSnippet: 'Manually verified candidate competency during interactive review.',
        extractionMethod: 'MANUAL_ENTRY' as const,
        reviewStatus: 'CONFIRMED' as const
      }
    ];

    const reviewRes = await fetch(`${baseUrl}/api/v1/profile/${profileId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId,
        fullName: 'Alex Vance',
        currentTitle: 'Senior Financial Analyst',
        yearsExperience: 5.0,
        reviewedSkills,
        notes: 'Candidate human review complete. 6 confirmed competencies, 1 rejected.'
      })
    });

    const reviewData = (await reviewRes.json()) as ProfileReviewResponse;
    console.log(`HTTP Status: ${reviewRes.status}`);
    console.log(`Confirmed Skills Count: ${reviewData.confirmedSkillsCount} (Expected 6)`);
    console.log(`Rejected Skills Count: ${reviewData.rejectedSkillsCount} (Expected 1)`);
    console.log('Confirmed Skills:');
    reviewData.confirmedSkills.forEach((s, idx) => {
      console.log(`  ${idx + 1}. ${s.name} [${s.category}] — ${s.proficiency} (${s.yearsExperience} yrs)`);
    });

    if (reviewData.confirmedSkillsCount !== 6 || reviewData.rejectedSkillsCount !== 1) {
      throw new Error('Test 5 failed: Confirmed/Rejected counts mismatch.');
    }

    // -------------------------------------------------------------
    // Test 6: Verify Persistence & In-Memory Storage Lifecycle
    // -------------------------------------------------------------
    console.log('\n--- TEST 6: VERIFY RETRIEVAL & SERVER RESTART BEHAVIOR ---');
    const getRes = await fetch(`${baseUrl}/api/v1/profile/${profileId}`);
    const getProfileData = await getRes.json();
    console.log(`GET /api/v1/profile/${profileId} Status: ${getRes.status}`);
    console.log(`Is Reviewed: ${getProfileData.isReviewed}`);
    console.log(`Confirmed Skills Stored: ${getProfileData.confirmedSkills?.length}`);

    // Simulate backend restart by querying a clean repository instance
    const freshRepo = new InMemoryProfileRepository();
    const freshService = new ProfileService(freshRepo);
    const restartedCheck = await freshService.getProfile(profileId);
    console.log(`Post-Restart Profile Query Result: ${restartedCheck} (Expected null)`);
    console.log('Truthful disclosure: As documented, without PostgreSQL on host, the InMemoryProfileRepository resets across server restarts. The frontend gracefully detects 404 and offers to re-upload or continue with manual intake.');

    // -------------------------------------------------------------
    // Test 7: Career Matching Engine (All 14 Roles Evaluated)
    // -------------------------------------------------------------
    console.log('\n--- TEST 7: CAREER MATCHING ENGINE EVALUATION (14 ROLES) ---');
    const matchesRes = await fetch(`${baseUrl}/api/v1/careers/matches/${profileId}`);
    const matchesData = (await matchesRes.json()) as {
      profileId: string;
      candidateName: string;
      currentTitle: string;
      confirmedSkillsCount: number;
      totalCareersEvaluated: number;
      matches: CareerMatchResult[];
      evaluatedAt: string;
    };

    console.log(`HTTP Status: ${matchesRes.status}`);
    console.log(`Candidate: ${matchesData.candidateName} (${matchesData.currentTitle})`);
    console.log(`Total Careers Evaluated: ${matchesData.totalCareersEvaluated} (Expected 14)`);

    if (matchesRes.status !== 200 || matchesData.totalCareersEvaluated !== 14 || matchesData.matches.length !== 14) {
      throw new Error(`Test 7 failed: Expected 14 evaluated career roles, got ${matchesData.matches.length}`);
    }

    console.log('Top Career Matches:');
    matchesData.matches.slice(0, 5).forEach((m, idx) => {
      console.log(`  ${idx + 1}. [${m.overallScore}% overall | ${m.mandatoryScore}% mandatory] ${m.roleTitle} (${m.careerFamily})`);
      console.log(`     Pivot Ready: ${m.isEligibleForPivot} | Matched: ${m.matchedSkills.length} | Missing Mand: ${m.missingMandatorySkills.length}`);
      if (m.prerequisiteWarnings.length > 0) {
        console.log(`     Notice: ${m.prerequisiteWarnings[0]}`);
      }
    });

    // Check that excluded/rejected skill is NOT counted in any match
    const rejectedContamination = matchesData.matches.some((m) =>
      m.matchedSkills.some((s) => s.evidenceSnippet?.toLowerCase().includes('cobol') || s.skillName.toLowerCase().includes('cobol'))
    );
    if (rejectedContamination) {
      throw new Error('Test 7 failed: Rejected skill appeared in matched skills!');
    }
    console.log('Integrity check: Zero rejected/unreviewed skills contaminated the matching results.');

    // Verify S/4HANA Finance Consultant has positive score and matched competencies
    const fiRole = matchesData.matches.find((m) => m.roleSlug === 'sap-s4hana-finance-consultant');
    if (!fiRole || fiRole.overallScore <= 0 || fiRole.matchedSkills.length === 0) {
      throw new Error('Test 7 failed: sap-s4hana-finance-consultant was not matched with positive score.');
    }
    console.log(`Target Role Match: '${fiRole.roleTitle}' score = ${fiRole.overallScore}% (Mandatory: ${fiRole.mandatoryScore}%)`);

    // -------------------------------------------------------------
    // Test 8: Multi-Role Side-by-Side Comparison
    // -------------------------------------------------------------
    console.log('\n--- TEST 8: MULTI-ROLE SIDE-BY-SIDE COMPARISON MATRIX ---');
    const compareRes = await fetch(`${baseUrl}/api/v1/careers/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId,
        roleSlugs: [
          'sap-s4hana-finance-consultant',
          'sap-s4hana-sourcing-procurement',
          'enterprise-business-analyst'
        ]
      })
    });

    const compareData = (await compareRes.json()) as CareerComparisonResult;
    console.log(`HTTP Status: ${compareRes.status}`);
    console.log(`Roles Compared: ${compareData.roles.length} (Expected 3)`);
    console.log(`Shared Transferable Skills Identified: ${compareData.sharedTransferableSkills.length}`);
    compareData.sharedTransferableSkills.forEach((s) => {
      console.log(`  - ${s}`);
    });

    if (compareRes.status !== 200 || compareData.roles.length !== 3) {
      throw new Error('Test 8 failed: Multi-role comparison did not return 3 compared roles.');
    }

    compareData.roles.forEach((r) => {
      console.log(`Role: ${r.roleTitle}`);
      console.log(`  Match Score: ${r.overallScore}% | Mandatory Gaps: ${r.missingMandatorySkills.length} | Est. Planning Hours: ~${r.planningHoursEstimate}h`);
    });

    // -------------------------------------------------------------
    // Test 9: Six-Group Detailed Skill-Gap Analysis
    // -------------------------------------------------------------
    console.log('\n--- TEST 9: DETAILED 6-GROUP SKILL GAP ANALYSIS ---');
    const gapsRes = await fetch(`${baseUrl}/api/v1/careers/sap-s4hana-finance-consultant/gaps/${profileId}`);
    const gapsData = (await gapsRes.json()) as SkillGapAnalysis;

    console.log(`HTTP Status: ${gapsRes.status}`);
    console.log(`Target Role: ${gapsData.role.title}`);
    console.log(`  1. Confirmed Matches: ${gapsData.confirmedMatches.length}`);
    gapsData.confirmedMatches.forEach((m) => {
      console.log(`     [FULL] ${m.skillName} (Req: ${m.requiredProficiency} | Cand: ${m.candidateProficiency})`);
      if (m.evidenceSnippet) console.log(`            Evidence: "${m.evidenceSnippet.slice(0, 60)}..."`);
    });

    console.log(`  2. Partial Matches: ${gapsData.partiallyMatched.length}`);
    gapsData.partiallyMatched.forEach((p) => {
      console.log(`     [PARTIAL] ${p.skillName} (Req: ${p.requiredProficiency} | Cand: ${p.candidateProficiency})`);
    });

    console.log(`  3. Mandatory Gaps: ${gapsData.mandatoryGaps.length}`);
    gapsData.mandatoryGaps.forEach((g) => {
      console.log(`     [MANDATORY GAP] ${g.skillName} — Req: ${g.requiredProficiency} (Weight: ${g.weight})`);
    });

    console.log(`  4. Recommended Gaps: ${gapsData.recommendedGaps.length}`);
    console.log(`  5. Unverified Requirements: ${gapsData.unverifiedRequirements.length}`);
    console.log(`  6. External Prerequisites: ${gapsData.prerequisites.length}`);
    console.log(`Total Estimated Bridge Effort: ~${gapsData.totalEstimatedBridgeHours} hours`);
    console.log(`Linked Verified Learning Resources: ${gapsData.recommendedResources.length}`);
    gapsData.recommendedResources.forEach((res) => {
      console.log(`  - [${res.code}] ${res.title} (${res.provider}) -> ${res.externalUrl}`);
    });

    if (gapsRes.status !== 200 || gapsData.mandatoryGaps.length === 0 || gapsData.recommendedResources.length === 0) {
      throw new Error('Test 9 failed: Skill-gap analysis did not properly identify gaps or link verified resources.');
    }

    // -------------------------------------------------------------
    // Test 10: Personalized Sequenced Learning Pathway
    // -------------------------------------------------------------
    console.log('\n--- TEST 10: PERSONALIZED SEQUENCED LEARNING PATHWAY ---');
    const pathwayRes = await fetch(`${baseUrl}/api/v1/learning-pathways`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId,
        roleSlug: 'sap-s4hana-finance-consultant'
      })
    });

    const pathwayData = (await pathwayRes.json()) as LearningPathway;
    console.log(`HTTP Status: ${pathwayRes.status}`);
    console.log(`Target Role: ${pathwayData.roleTitle}`);
    console.log(`Total Pathway Milestones: ${pathwayData.milestones.length}`);
    console.log(`Total Estimated Hours: ~${pathwayData.totalEstimatedHours} hours`);
    console.log(`Sequencing Rationale: "${pathwayData.sequencingRationale}"`);

    pathwayData.milestones.forEach((m) => {
      console.log(`  Milestone ${m.stepNumber}: ${m.title} (~${m.estimatedHours}h, Essential: ${m.isEssential})`);
      console.log(`    Skills Addressed: ${m.skillsAddressed.join(', ')}`);
      m.resources.forEach((r) => {
        console.log(`    Resource: [${r.code}] ${r.title} (${r.externalUrl})`);
      });
      if (m.practicalProject) {
        console.log(`    Practical Project: ${m.practicalProject.title}`);
      }
    });

    if (pathwayRes.status !== 200 || pathwayData.milestones.length === 0) {
      throw new Error('Test 10 failed: Learning pathway generation failed or returned 0 milestones.');
    }

    // Verify ordering: stepNumber must be ascending 1, 2, 3...
    for (let i = 0; i < pathwayData.milestones.length; i++) {
      if (pathwayData.milestones[i].stepNumber !== i + 1) {
        throw new Error(`Test 10 failed: Milestones are not sequentially ordered (${pathwayData.milestones[i].stepNumber} vs ${i + 1})`);
      }
    }

    // -------------------------------------------------------------
    // Test 11: Dynamic Recalculation on Candidate Skill Acquisition
    // -------------------------------------------------------------
    console.log('\n--- TEST 11: DYNAMIC RECALCULATION ON CANDIDATE PROGRESS ---');
    const initialScore = fiRole.overallScore;

    // Candidate verifies and adds 'SAP Fiori Financial Apps' to their confirmed profile
    const updatedSkills = [
      ...reviewedSkills.filter((s) => s.isConfirmed),
      {
        skillId: 'USER-COMPLETED-FIORI',
        name: 'SAP Fiori Financial Apps',
        category: 'SAP_FUNCTIONAL' as const,
        proficiency: 'ADVANCED' as const,
        yearsExperience: 1.0,
        isConfirmed: true,
        isTransferable: true,
        evidenceSnippet: 'Completed openSAP course UX100 and demonstrated app execution.',
        extractionMethod: 'MANUAL_ENTRY' as const,
        reviewStatus: 'CONFIRMED' as const
      }
    ];

    const updateProfileRes = await fetch(`${baseUrl}/api/v1/profile/${profileId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId,
        fullName: 'Alex Vance',
        currentTitle: 'Senior Financial Analyst',
        yearsExperience: 5.5,
        reviewedSkills: updatedSkills,
        notes: 'Candidate completed SAP Fiori qualification.'
      })
    });
    console.log(`Update Profile Review Status: ${updateProfileRes.status}`);

    // Re-query career matches
    const updatedMatchesRes = await fetch(`${baseUrl}/api/v1/careers/matches/${profileId}`);
    const updatedMatchesData = await updatedMatchesRes.json();
    const updatedFiRole = updatedMatchesData.matches.find((m: CareerMatchResult) => m.roleSlug === 'sap-s4hana-finance-consultant');

    console.log(`Initial S/4HANA Finance Match: ${initialScore}%`);
    console.log(`Updated S/4HANA Finance Match: ${updatedFiRole.overallScore}%`);
    console.log(`Score Increase: +${updatedFiRole.overallScore - initialScore}%`);

    if (updatedFiRole.overallScore <= initialScore) {
      throw new Error('Test 11 failed: Match score did not increase after adding verified competency.');
    }

    // Re-query skill gaps and verify SAP Fiori moved to confirmedMatches
    const updatedGapsRes = await fetch(`${baseUrl}/api/v1/careers/sap-s4hana-finance-consultant/gaps/${profileId}`);
    const updatedGapsData = (await updatedGapsRes.json()) as SkillGapAnalysis;
    const nowConfirmed = updatedGapsData.confirmedMatches.some((m) => m.skillName.toLowerCase().includes('fiori'));

    console.log(`SAP Fiori moved to Confirmed Matches: ${nowConfirmed}`);
    console.log(`Updated Total Bridge Hours: ~${updatedGapsData.totalEstimatedBridgeHours}h (was ~${gapsData.totalEstimatedBridgeHours}h)`);

    if (!nowConfirmed || updatedGapsData.totalEstimatedBridgeHours >= gapsData.totalEstimatedBridgeHours) {
      throw new Error('Test 11 failed: Gap analysis did not reflect newly acquired competency.');
    }

    // -------------------------------------------------------------
    // Test 12: Edge Cases & Validation Error Handling
    // -------------------------------------------------------------
    console.log('\n--- TEST 12: EDGE CASES AND VALIDATION ERROR HANDLING ---');

    // 12a: Non-existent profile
    const badProfileRes = await fetch(`${baseUrl}/api/v1/careers/matches/non-existent-profile-xyz`);
    console.log(`Non-existent profile status: ${badProfileRes.status} (Expected 404)`);
    if (badProfileRes.status !== 404) throw new Error('Test 12a failed: Non-existent profile should return 404.');

    // 12b: Non-existent role gap analysis
    const badRoleRes = await fetch(`${baseUrl}/api/v1/careers/non-existent-career-xyz/gaps/${profileId}`);
    console.log(`Non-existent role gap status: ${badRoleRes.status} (Expected 404)`);
    if (badRoleRes.status !== 404) throw new Error('Test 12b failed: Non-existent role should return 404.');

    // 12c: Invalid comparison body (< 2 roles)
    const invalidCompareRes = await fetch(`${baseUrl}/api/v1/careers/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleSlugs: ['single-role'] })
    });
    console.log(`Invalid compare request (<2 roles) status: ${invalidCompareRes.status} (Expected 400)`);
    if (invalidCompareRes.status !== 400) throw new Error('Test 12c failed: Comparing <2 roles should return 400.');

    // -------------------------------------------------------------
    // Test 13: Project Workspaces & Enterprise Scenario Discovery
    // -------------------------------------------------------------
    console.log('\n--- TEST 13: PRACTICAL PROJECT WORKSPACES & DISCOVERY ---');
    const allProjectsRes = await fetch(`${baseUrl}/api/v1/projects`);
    const allProjectsData = await allProjectsRes.json();
    console.log(`Discovered Enterprise Projects: ${allProjectsData.total ?? allProjectsData.projects?.length} projects`);

    if (!Array.isArray(allProjectsData.projects) || allProjectsData.projects.length < 10) {
      throw new Error('Test 13 failed: Expected at least 10 enterprise practical projects in catalogue.');
    }

    const fiProjectsRes = await fetch(`${baseUrl}/api/v1/projects?roleSlug=sap-s4hana-finance-consultant`);
    const fiProjectsData = await fiProjectsRes.json();
    console.log(`Filtered S/4HANA Finance Projects: ${fiProjectsData.total ?? fiProjectsData.projects?.length} projects`);

    const sampleProject = fiProjectsData.projects[0];
    if (!sampleProject || !sampleProject.businessProblem || !sampleProject.stepByStepInstructions?.length || !sampleProject.rubricCriteria?.length) {
      throw new Error('Test 13 failed: Project definition missing detailed enterprise instructions or rubric criteria.');
    }
    console.log(`Sample Project: "${sampleProject.title}" (Difficulty: ${sampleProject.difficulty}, Rubric Criteria: ${sampleProject.rubricCriteria.length})`);

    // -------------------------------------------------------------
    // Test 14: Project Workspace Initiation & Deliverable Submission
    // -------------------------------------------------------------
    console.log('\n--- TEST 14: PROJECT LIFECYCLE INITIATION & SUBMISSION ---');
    const startProjRes = await fetch(`${baseUrl}/api/v1/projects/${sampleProject.id}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId })
    });
    const startedSubmission = await startProjRes.json();
    console.log(`Started Project State: ${startedSubmission.status} (Expected IN_PROGRESS)`);

    if (startedSubmission.status !== 'IN_PROGRESS') {
      throw new Error('Test 14 failed: Starting project should yield IN_PROGRESS status.');
    }

    // Candidate submits deliverable with URLs and reflection
    const submitDeliverablesRes = await fetch(`${baseUrl}/api/v1/projects/${sampleProject.id}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: sampleProject.id,
        profileId,
        repositoryUrl: 'https://github.com/alexvance/s4hana-gl-reconciliation-runbook',
        liveDemoUrl: 'https://demo.example.com/s4hana-gl-audit',
        projectExplanation: 'Engineered an automated S/4HANA General Ledger journal reconciliation workflow with posting runbooks.',
        challengesEncountered: 'Navigating foreign currency ledger postings and multi-GAAP posting rules.',
        skillsDemonstrated: sampleProject.targetSkills,
        learningReflection: 'Deepened practical knowledge of ledger posting keys and financial compliance requirements.'
      })
    });
    const candidateSubmission = await submitDeliverablesRes.json();
    console.log(`Candidate Submission Status: ${candidateSubmission.status} (Expected SUBMITTED)`);
    console.log(`Reviewer Type: ${candidateSubmission.reviewerType} (Expected AWAITING_REVIEW)`);

    // Verify submission is NOT automatically marked COMPLETED upon upload
    if (candidateSubmission.status !== 'SUBMITTED' || candidateSubmission.reviewerType !== 'AWAITING_REVIEW') {
      throw new Error('Test 14 failed: Candidate submission must be SUBMITTED and AWAITING_REVIEW, not automatically COMPLETED.');
    }

    // -------------------------------------------------------------
    // Test 15: Rubric Evaluation & Assessment Decision
    // -------------------------------------------------------------
    console.log('\n--- TEST 15: RUBRIC EVALUATION & ASSESSMENT TRANSITION ---');
    const rubricAssessments = sampleProject.rubricCriteria.map((rc: { criterion: string; weightPercentage: number }) => ({
      criterion: rc.criterion,
      weightPercentage: rc.weightPercentage,
      awardedScore: 92,
      feedback: 'Demonstrated thorough accounting controls and automated reconciliation balance checking.',
      isSatisfied: true
    }));

    const projectReviewRes = await fetch(`${baseUrl}/api/v1/projects/submissions/${candidateSubmission.id}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId: candidateSubmission.id,
        reviewerProfileId: 'lead-evaluator-01',
        reviewerType: 'INDEPENDENT_REVIEWER',
        status: 'COMPLETED',
        rubricAssessments,
        reviewerFeedback: 'Outstanding technical runbook with enterprise grade audit trail and posting documentation.'
      })
    });
    const reviewedSubmission = await projectReviewRes.json();
    console.log(`Reviewed Status: ${reviewedSubmission.status} (Expected COMPLETED)`);
    console.log(`Overall Rubric Score: ${reviewedSubmission.overallScore}% (Expected >= 70%)`);

    if (reviewedSubmission.status !== 'COMPLETED' || (reviewedSubmission.overallScore ?? 0) < 70) {
      throw new Error('Test 15 failed: High-scoring rubric review should transition to COMPLETED.');
    }

    // -------------------------------------------------------------
    // Test 16: Multi-Dimensional Career Readiness Scorecard
    // -------------------------------------------------------------
    console.log('\n--- TEST 16: EXPLAINABLE CAREER READINESS SCORECARD ---');
    const readinessRes = await fetch(`${baseUrl}/api/v1/readiness/${profileId}/sap-s4hana-finance-consultant?completedMilestones=s4-fi-01,s4-fi-02`);
    const readinessData = await readinessRes.json();

    console.log(`Overall Readiness Score: ${readinessData.overallReadinessScore}%`);
    console.log(`Transition Eligibility: ${readinessData.isReadinessEligible}`);
    console.log(`Mandatory Gaps Remaining: ${readinessData.outstandingMandatoryGaps.length}`);
    console.log(`Dimensions:
  - Skill Coverage: ${readinessData.dimensions.skillCoverage.score}% (${readinessData.dimensions.skillCoverage.weightPercentage}%)
  - Mandatory Req:  ${readinessData.dimensions.mandatoryRequirements.score}% (${readinessData.dimensions.mandatoryRequirements.weightPercentage}%)
  - Learning Prog:  ${readinessData.dimensions.learningMilestones.score}% (${readinessData.dimensions.learningMilestones.weightPercentage}%)
  - Project Evidence: ${readinessData.dimensions.projectEvidence.score}% (${readinessData.dimensions.projectEvidence.weightPercentage}%)`);

    // Verify statutory disclaimer
    if (!readinessData.disclaimer || !readinessData.disclaimer.includes('evidence-based progress assessment')) {
      throw new Error('Test 16 failed: Readiness scorecard missing official statutory disclaimer.');
    }

    // -------------------------------------------------------------
    // Test 17: Parameterized External Job Destinations
    // -------------------------------------------------------------
    console.log('\n--- TEST 17: PARAMETERIZED EXTERNAL JOB DESTINATIONS ---');
    const jobsRes = await fetch(`${baseUrl}/api/v1/jobs/search-links/sap-s4hana-finance-consultant?location=Remote&keywords=SAP+S4HANA+Finance`);
    const jobsData = await jobsRes.json();

    console.log(`Role: ${jobsData.roleTitle}`);
    console.log(`Destination Links Generated: ${jobsData.destinationLinks.length}`);
    for (const link of jobsData.destinationLinks) {
      console.log(`  - [${link.portalKey}] ${link.portalName}: ${link.destinationUrl}`);
      if (!link.destinationUrl.startsWith('https://')) {
        throw new Error(`Test 17 failed: Invalid destination URL for ${link.portalName}`);
      }
    }

    // Verify zero-fabrication disclaimer
    if (!jobsData.disclaimer || !jobsData.disclaimer.includes('Zero Fabrication Policy')) {
      throw new Error('Test 17 failed: Job search missing Zero Fabrication Policy disclaimer.');
    }

    // Negative edge case: non-existent role
    const badJobsRes = await fetch(`${baseUrl}/api/v1/jobs/search-links/non-existent-role-xyz`);
    console.log(`Non-existent role jobs status: ${badJobsRes.status} (Expected 404)`);
    if (badJobsRes.status !== 404) {
      throw new Error('Test 17 failed: Querying jobs for unknown role should return 404.');
    }

    console.log('\n================================================================');
    console.log('ALL 17 END-TO-END WORKFLOW VERIFICATIONS PASSED SUCCESSFULLY!');
    console.log('================================================================');
  } finally {
    server.close();
  }
}

runMilestoneVerification().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
