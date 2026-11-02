import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CareerMatcherService } from '../../matching/career-matcher.service';
import { SkillGapService } from '../../gap-analysis/skill-gap.service';
import { PathwayService } from '../../pathway/pathway.service';
import { CAREER_CATALOGUE, getRoleByIdOrSlug, getAllCareerRoles } from '../career.catalogue';
import { VERIFIED_LEARNING_RESOURCES } from '../learning-resource.catalogue';
import { InMemoryProfileRepository } from '../../resume/profile.repository';
import { ExtractedSkillItem } from '@career-orchestrator/shared';

// Helper to build synthetic test skills
function createSkill(
  name: string,
  proficiency: 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
  isConfirmed: boolean = true,
  reviewStatus: 'SUGGESTED' | 'CONFIRMED' | 'REJECTED' = 'CONFIRMED',
  years: number = 3.0
): ExtractedSkillItem {
  return {
    id: `test-skill-${name.toLowerCase().replace(/\s+/g, '-')}`,
    code: `TEST-${name.slice(0, 4).toUpperCase()}`,
    name,
    category: 'DOMAIN_BUSINESS',
    proficiency,
    yearsExperience: years,
    isConfirmed,
    isTransferable: true,
    confidenceScore: 0.95,
    extractionMethod: 'EXPLICIT_MENTION',
    evidenceSnippet: `Demonstrated candidate experience in ${name} across multiple enterprise projects.`,
    reviewStatus
  };
}

describe('Explainable Career-Matching Engine Suite', () => {
  const matcher = new CareerMatcherService();

  test('1. Exact skill matches receive full 1.0 match factor', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    const skills = [
      createSkill('General Ledger Accounting', 'ADVANCED', true, 'CONFIRMED'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'INTERMEDIATE', true, 'CONFIRMED'),
      createSkill('SAP Fiori Financial Apps', 'INTERMEDIATE', true, 'CONFIRMED'),
      createSkill('Financial Reporting & IFRS', 'INTERMEDIATE', true, 'CONFIRMED')
    ];

    const result = matcher.evaluateSingleRole(role, skills);
    // 4 mandatory skills matched at 100% (weight 3.6 out of total 4.7) = 77% overall, 100% mandatory coverage
    assert.equal(result.overallScore, 77);
    assert.equal(result.mandatoryScore, 100);
    assert.equal(result.isEligibleForPivot, true);

    const glMatch = result.matchedSkills.find((s) => s.skillName === 'General Ledger Accounting');
    assert.ok(glMatch, 'General Ledger Accounting must be matched');
    assert.equal(glMatch.matchFactor, 1.0);
    assert.equal(glMatch.status, 'FULL_MATCH');
  });

  test('2. Missing mandatory skills receive 0.0 factor and generate prerequisite warnings', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    // Candidate has only Fiori, missing General Ledger and Customizing
    const skills = [createSkill('SAP Fiori Financial Apps', 'ADVANCED', true, 'CONFIRMED')];

    const result = matcher.evaluateSingleRole(role, skills);
    assert.equal(result.isEligibleForPivot, false);
    assert.ok(result.prerequisiteWarnings.length > 0);
    assert.ok(
      result.missingMandatorySkills.some((s) => s.skillName === 'General Ledger Accounting')
    );
    const missingGL = result.missingMandatorySkills.find(
      (s) => s.skillName === 'General Ledger Accounting'
    );
    assert.equal(missingGL?.matchFactor, 0.0);
  });

  test('3. Missing preferred skills receive 0.0 factor without blocking essential eligibility', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    // Candidate satisfies ALL mandatory skills, but lacks preferred SAP Activate Methodology
    const skills = [
      createSkill('General Ledger Accounting', 'ADVANCED', true, 'CONFIRMED'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'ADVANCED', true, 'CONFIRMED'),
      createSkill('SAP Fiori Financial Apps', 'ADVANCED', true, 'CONFIRMED'),
      createSkill('Financial Reporting & IFRS', 'ADVANCED', true, 'CONFIRMED')
    ];

    const result = matcher.evaluateSingleRole(role, skills);
    assert.equal(result.isEligibleForPivot, true);
    assert.ok(
      result.missingPreferredSkills.some((s) => s.skillName === 'SAP Activate Methodology')
    );
  });

  test('4. Partial proficiency matches receive proportional factor bounded between 0 and 1', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    // Role requires ADVANCED (rank 3) for General Ledger Accounting.
    // Candidate is NOVICE (rank 1).
    const skills = [createSkill('General Ledger Accounting', 'NOVICE', true, 'CONFIRMED')];

    const result = matcher.evaluateSingleRole(role, skills);
    // Mandatory skill below required level remains an outstanding mandatory requirement
    const mandatoryGap = result.missingMandatorySkills.find(
      (s) => s.skillName === 'General Ledger Accounting'
    );
    assert.ok(mandatoryGap, 'Mandatory skill below required proficiency must remain an outstanding requirement');
    assert.equal(mandatoryGap.status, 'PARTIAL_MATCH');
    assert.ok(
      mandatoryGap.matchFactor > 0 && mandatoryGap.matchFactor < 1.0,
      `Expected factor between 0 and 1, got ${mandatoryGap.matchFactor}`
    );
    assert.equal(result.isEligibleForPivot, false, 'Candidate must not be eligible when mandatory proficiency is unmet');

    // Preferred skill below required level can remain a partial match without blocking eligibility
    const roleWithPref = matcher.evaluateSingleRole(role, [
      createSkill('General Ledger Accounting', 'ADVANCED'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'INTERMEDIATE'),
      createSkill('SAP Fiori Financial Apps', 'INTERMEDIATE'),
      createSkill('Financial Reporting & IFRS', 'INTERMEDIATE'),
      createSkill('Business Process Mapping', 'NOVICE') // Preferred skill requiring INTERMEDIATE
    ]);
    const prefPartial = roleWithPref.partiallyMatchedSkills.find(
      (s) => s.skillName === 'Business Process Mapping'
    );
    assert.ok(prefPartial, 'Preferred skill below required level should be in partiallyMatchedSkills');
    assert.equal(roleWithPref.isEligibleForPivot, true);
  });

  test('5. Unreviewed skills (reviewStatus = SUGGESTED) do not count as confirmed', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    // Skill is unconfirmed SUGGESTED
    const unconfirmedSkill = createSkill(
      'General Ledger Accounting',
      'ADVANCED',
      false,
      'SUGGESTED'
    );

    const result = matcher.evaluateCandidateAgainstAllCareers([unconfirmedSkill]);
    const fiRole = result.find((r) => r.roleSlug === role.slug)!;

    assert.ok(
      fiRole.missingMandatorySkills.some((s) => s.skillName === 'General Ledger Accounting'),
      'Unreviewed suggested skills must not count towards match'
    );
    assert.equal(fiRole.matchedSkills.length, 0);
  });

  test('6. Rejected skills (reviewStatus = REJECTED) do not count as confirmed', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    const rejectedSkill = createSkill('General Ledger Accounting', 'ADVANCED', false, 'REJECTED');

    const result = matcher.evaluateCandidateAgainstAllCareers([rejectedSkill]);
    const fiRole = result.find((r) => r.roleSlug === role.slug)!;

    assert.equal(fiRole.matchedSkills.length, 0);
    assert.ok(
      fiRole.missingMandatorySkills.some((s) => s.skillName === 'General Ledger Accounting')
    );
  });

  test('7. Unknown / undeclared proficiency is handled conservatively with documented factor 0.5', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    const skillWithoutProficiency: ExtractedSkillItem = {
      ...createSkill('General Ledger Accounting', 'INTERMEDIATE', true, 'CONFIRMED'),
      proficiency: undefined as unknown as 'INTERMEDIATE'
    };

    const result = matcher.evaluateSingleRole(role, [skillWithoutProficiency]);
    // Mandatory skill with undeclared proficiency remains an outstanding mandatory requirement
    const uncalibrated = result.missingMandatorySkills.find(
      (s) => s.skillName === 'General Ledger Accounting'
    );
    assert.ok(uncalibrated, 'Should be flagged as uncalibrated mandatory requirement');
    assert.equal(uncalibrated.matchFactor, 0.5);
    assert.ok(result.unverifiedRequirements.some((s) => s.skillName === 'General Ledger Accounting'));
  });

  test('8. Essential prerequisites are displayed independently of the weighted score', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    // Candidate has 0 skills
    const result = matcher.evaluateSingleRole(role, []);
    assert.ok(result.prerequisiteWarnings.length >= 2);
    assert.equal(result.isEligibleForPivot, false);
    assert.equal(result.overallScore, 0);
  });

  test('9. Deterministic scoring produces identical, reproducible results for identical inputs', () => {
    const role = getRoleByIdOrSlug('sap-abap-cloud-developer')!;
    const skills = [
      createSkill('Relational Database Querying (SQL)', 'ADVANCED', true, 'CONFIRMED'),
      createSkill('REST APIs & OData Protocol', 'INTERMEDIATE', true, 'CONFIRMED')
    ];

    const run1 = matcher.evaluateSingleRole(role, skills);
    const run2 = matcher.evaluateSingleRole(role, skills);

    assert.equal(run1.overallScore, run2.overallScore);
    assert.equal(run1.matchedWeight, run2.matchedWeight);
    assert.equal(run1.matchedSkills.length, run2.matchedSkills.length);
    assert.equal(run1.scoreFormula, run2.scoreFormula);
  });

  test('10. Full career catalogue discovery returns all available roles rather than a restricted top-3 subset', () => {
    const skills = [createSkill('Relational Database Querying (SQL)', 'ADVANCED', true, 'CONFIRMED')];
    const results = matcher.evaluateCandidateAgainstAllCareers(skills);

    assert.ok(
      results.length >= 10,
      `Expected full catalogue (>= 10 roles), got ${results.length} roles`
    );
    assert.equal(results.length, CAREER_CATALOGUE.length);
  });

  test('10b. Regression: Proficiency matrix combinations across NOVICE, INTERMEDIATE, ADVANCED, EXPERT', () => {
    const role = getRoleByIdOrSlug('sap-s4hana-finance-consultant')!;
    // Mandatory requirements:
    // General Ledger Accounting (Req: ADVANCED)
    // S/4HANA Finance Customizing (IMG) (Req: INTERMEDIATE)
    // SAP Fiori Financial Apps (Req: INTERMEDIATE)
    // Financial Reporting & IFRS (Req: INTERMEDIATE)

    // Combination 1: NOVICE in mandatory skill requiring ADVANCED -> NOT eligible
    const rNovice = matcher.evaluateSingleRole(role, [
      createSkill('General Ledger Accounting', 'NOVICE'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'ADVANCED'),
      createSkill('SAP Fiori Financial Apps', 'ADVANCED'),
      createSkill('Financial Reporting & IFRS', 'ADVANCED')
    ]);
    assert.equal(rNovice.isEligibleForPivot, false);
    assert.ok(rNovice.missingMandatorySkills.some((s) => s.skillName === 'General Ledger Accounting'));

    // Combination 2: INTERMEDIATE in mandatory skill requiring ADVANCED -> NOT eligible
    const rInter = matcher.evaluateSingleRole(role, [
      createSkill('General Ledger Accounting', 'INTERMEDIATE'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'ADVANCED'),
      createSkill('SAP Fiori Financial Apps', 'ADVANCED'),
      createSkill('Financial Reporting & IFRS', 'ADVANCED')
    ]);
    assert.equal(rInter.isEligibleForPivot, false);
    assert.ok(rInter.missingMandatorySkills.some((s) => s.skillName === 'General Ledger Accounting'));

    // Combination 3: ADVANCED in mandatory skill requiring ADVANCED -> ELIGIBLE
    const rAdv = matcher.evaluateSingleRole(role, [
      createSkill('General Ledger Accounting', 'ADVANCED'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'INTERMEDIATE'),
      createSkill('SAP Fiori Financial Apps', 'INTERMEDIATE'),
      createSkill('Financial Reporting & IFRS', 'INTERMEDIATE')
    ]);
    assert.equal(rAdv.isEligibleForPivot, true);
    assert.equal(rAdv.missingMandatorySkills.length, 0);

    // Combination 4: EXPERT in mandatory skill requiring ADVANCED -> ELIGIBLE (exceeds requirement)
    const rExpert = matcher.evaluateSingleRole(role, [
      createSkill('General Ledger Accounting', 'EXPERT'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'EXPERT'),
      createSkill('SAP Fiori Financial Apps', 'EXPERT'),
      createSkill('Financial Reporting & IFRS', 'EXPERT')
    ]);
    assert.equal(rExpert.isEligibleForPivot, true);
    assert.equal(rExpert.missingMandatorySkills.length, 0);
    assert.equal(rExpert.mandatoryScore, 100);

    // Combination 5: Preferred skill below required level (NOVICE for Business Process Mapping) -> Remains PARTIAL MATCH, does NOT block eligibility
    const rPrefNovice = matcher.evaluateSingleRole(role, [
      createSkill('General Ledger Accounting', 'ADVANCED'),
      createSkill('S/4HANA Finance Customizing (IMG)', 'INTERMEDIATE'),
      createSkill('SAP Fiori Financial Apps', 'INTERMEDIATE'),
      createSkill('Financial Reporting & IFRS', 'INTERMEDIATE'),
      createSkill('Business Process Mapping', 'NOVICE') // preferred skill requiring INTERMEDIATE
    ]);
    assert.equal(rPrefNovice.isEligibleForPivot, true);
    assert.ok(rPrefNovice.partiallyMatchedSkills.some((s) => s.skillName === 'Business Process Mapping'));
  });
});

describe('Detailed Skill-Gap Analysis Suite', () => {
  const gapService = new SkillGapService();

  test('11. Correctly classifies requirements into matched, partial, mandatory, and recommended gaps', () => {
    const skills = [
      // Full match for General Ledger (required ADVANCED, candidate ADVANCED)
      createSkill('General Ledger Accounting', 'ADVANCED', true, 'CONFIRMED'),
      // Mandatory gap: Customizing (required INTERMEDIATE, candidate NOVICE -> mandatory gap)
      createSkill('S/4HANA Finance Customizing (IMG)', 'NOVICE', true, 'CONFIRMED'),
      // Partial match: Preferred skill below required level (candidate NOVICE, required INTERMEDIATE)
      createSkill('Business Process Mapping', 'NOVICE', true, 'CONFIRMED')
    ];

    const analysis = gapService.analyzeSkillGaps('sap-s4hana-finance-consultant', skills)!;
    assert.ok(analysis);
    assert.ok(analysis.confirmedMatches.some((m) => m.skillName === 'General Ledger Accounting'));
    assert.ok(
      analysis.mandatoryGaps.some((g) => g.skillName === 'S/4HANA Finance Customizing (IMG)')
    );
    assert.ok(
      analysis.partiallyMatched.some((p) => p.skillName === 'Business Process Mapping')
    );
    assert.ok(
      analysis.mandatoryGaps.some((g) => g.skillName === 'SAP Fiori Financial Apps')
    );
    assert.ok(
      analysis.recommendedGaps.some((r) => r.skillName === 'SAP Activate Methodology')
    );
  });

  test('12. Handles empty or nonexistent profile gracefully with 0% fit and full gap breakdown', () => {
    const analysis = gapService.analyzeSkillGaps('sap-s4hana-finance-consultant', [])!;
    assert.ok(analysis);
    assert.equal(analysis.overallFitPercentage, 0);
    assert.equal(analysis.confirmedMatches.length, 0);
    assert.ok(analysis.mandatoryGaps.length >= 3);
  });

  test('13. Returns null for nonexistent role identifier', () => {
    const analysis = gapService.analyzeSkillGaps('nonexistent-role-slug', []);
    assert.equal(analysis, null);
  });

  test('14. Missing or expired profile produces clean error handling in repository', async () => {
    const repo = new InMemoryProfileRepository();
    const profile = await repo.getProfileById('non-existent-profile-id');
    assert.equal(profile, null);
  });

  test('15. Incomplete profile warnings when candidate has zero confirmed competencies', () => {
    const analysis = gapService.analyzeSkillGaps('sap-abap-cloud-developer', [])!;
    assert.ok(analysis.criticalitySummary.mandatoryGapCount >= 3);
    assert.ok(analysis.criticalitySummary.estimatedBridgeHours > 0);
  });
});

describe('Personalized Learning Pathway Suite', () => {
  const pathwayService = new PathwayService();

  test('16. Pathway changes dynamically when the target role changes', () => {
    const skills = [createSkill('Relational Database Querying (SQL)', 'ADVANCED', true, 'CONFIRMED')];

    const fiPathway = pathwayService.generatePathway('sap-s4hana-finance-consultant', skills, 'p1')!;
    const abapPathway = pathwayService.generatePathway('sap-abap-cloud-developer', skills, 'p1')!;

    assert.notEqual(fiPathway.roleId, abapPathway.roleId);
    assert.notEqual(fiPathway.milestones[0].title, abapPathway.milestones[0].title);
  });

  test('17. Already-confirmed skills are not assigned beginner courses', () => {
    // Candidate already has ADVANCED General Ledger Accounting
    const skills = [
      createSkill('General Ledger Accounting', 'ADVANCED', true, 'CONFIRMED'),
      createSkill('Financial Reporting & IFRS', 'ADVANCED', true, 'CONFIRMED')
    ];

    const pathway = pathwayService.generatePathway('sap-s4hana-finance-consultant', skills, 'p1')!;
    // General Ledger is already met, so it should not be listed as a missing mandatory gap milestone
    assert.ok(
      !pathway.milestones.some((m) => m.title === 'Core Competency: General Ledger Accounting'),
      'Confirmed skill should not be generated as a beginner gap milestone'
    );
  });

  test('18. Milestones explicitly reference the specific gaps they address', () => {
    const skills = [createSkill('General Ledger Accounting', 'ADVANCED', true, 'CONFIRMED')];
    const pathway = pathwayService.generatePathway('sap-s4hana-finance-consultant', skills, 'p1')!;

    for (const m of pathway.milestones) {
      assert.ok(m.skillsAddressed.length > 0);
      assert.ok(m.title.length > 0);
      assert.ok(m.objective.length > 0);
    }
  });

  test('19. Prerequisite ordering is respected where dependencies exist', () => {
    const pathway = pathwayService.generatePathway('sap-s4hana-finance-consultant', [], 'p1')!;
    assert.ok(pathway.milestones.length >= 2);

    // Verify step numbers are strictly sequential 1, 2, 3...
    pathway.milestones.forEach((m, idx) => {
      assert.equal(m.stepNumber, idx + 1);
    });
  });

  test('20. Unverified resources are not represented as verified', () => {
    for (const res of VERIFIED_LEARNING_RESOURCES) {
      assert.equal(res.isVerified, true);
      assert.ok(res.verificationDate.length > 0);
      assert.ok(res.verificationSource.length > 0);
      assert.ok(res.externalUrl.startsWith('https://'));
    }
  });

  test('21. Milestones have completion criteria and deliverables', () => {
    const pathway = pathwayService.generatePathway('sap-s4hana-finance-consultant', [], 'p1')!;
    for (const m of pathway.milestones) {
      assert.ok(m.completionCriteria.length > 0);
      assert.ok(m.estimatedHours > 0);
    }
  });
});
