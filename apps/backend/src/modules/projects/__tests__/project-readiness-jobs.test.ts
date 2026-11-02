import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ProjectService } from '../project.service';
import { InMemoryProjectRepository } from '../project.repository';
import { ReadinessService } from '../../readiness/readiness.service';
import { JobSearchService } from '../../jobs/job-search.service';
import { pathwayService } from '../../pathway/pathway.service';
import { InMemoryProfileRepository } from '../../resume/profile.repository';
import { ProfileService } from '../../resume/profile.service';
import { ExtractedSkillItem } from '@career-orchestrator/shared';

function createSkill(
  name: string,
  proficiency: 'NOVICE' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
  isConfirmed: boolean = true,
  reviewStatus: 'SUGGESTED' | 'CONFIRMED' | 'REJECTED' = 'CONFIRMED'
): ExtractedSkillItem {
  return {
    id: `skill-${name.toLowerCase().replace(/\s+/g, '-')}`,
    code: `CODE-${name.slice(0, 4).toUpperCase()}`,
    name,
    category: 'DOMAIN_BUSINESS',
    proficiency,
    yearsExperience: 4.0,
    isConfirmed,
    isTransferable: true,
    confidenceScore: 0.95,
    extractionMethod: 'EXPLICIT_MENTION',
    evidenceSnippet: `Demonstrated experience in ${name}.`,
    reviewStatus
  };
}

describe('Interactive Project Workspaces Suite', () => {
  const repo = new InMemoryProjectRepository();
  const service = new ProjectService(repo);

  test('1. Retrieves available practical projects with filter support', () => {
    const all = service.listProjects();
    assert.ok(all.length >= 10, 'Expected at least 10 practical projects in catalogue');

    const fiProjects = service.listProjects({ roleSlug: 'sap-s4hana-finance-consultant' });
    assert.ok(fiProjects.length >= 2, 'Expected at least 2 Finance projects');
    fiProjects.forEach((p) => {
      assert.equal(p.roleSlug, 'sap-s4hana-finance-consultant');
    });

    const advProjects = service.listProjects({ difficulty: 'ADVANCED' });
    assert.ok(advProjects.length > 0);
    advProjects.forEach((p) => assert.equal(p.difficulty, 'ADVANCED'));

    const searchResults = service.listProjects({ search: 'clean-core' });
    assert.ok(searchResults.length > 0);
    assert.ok(searchResults.some((p) => p.id === 'proj-abap-01'));
  });

  test('2. Retrieves single project details with business problem and rubric', () => {
    const project = service.getProject('proj-fi-01');
    assert.ok(project);
    assert.equal(project.id, 'proj-fi-01');
    assert.ok(project.businessProblem && project.businessProblem.length > 20);
    assert.ok(project.objectives && project.objectives.length > 0);
    assert.ok(project.rubricCriteria.length >= 3);
    assert.equal(project.rubricCriteria.reduce((sum, r) => sum + r.weightPercentage, 0), 100);
  });

  test('3. Returns null for unknown project identifier', () => {
    const unknown = service.getProject('non-existent-proj-999');
    assert.equal(unknown, null);
  });

  test('4. Starting a project initializes submission with IN_PROGRESS state', async () => {
    const sub = await service.startProject('proj-fi-01', 'test-user-01');
    assert.ok(sub);
    assert.equal(sub.projectId, 'proj-fi-01');
    assert.equal(sub.profileId, 'test-user-01');
    assert.equal(sub.status, 'IN_PROGRESS');
    assert.equal(sub.reviewerType, 'AWAITING_REVIEW');
  });

  test('5. Submitting deliverables transitions status to SUBMITTED without premature completion', async () => {
    const submission = await service.submitProject({
      projectId: 'proj-fi-01',
      profileId: 'test-user-01',
      repositoryUrl: 'https://github.com/candidate/sap-fi-blueprint',
      liveDemoUrl: 'https://drive.google.com/file/d/preview',
      projectExplanation:
        'Constructed complete functional specification detailing multinational company code hierarchy and ACDOCA universal journal ledgers.',
      challengesEncountered:
        'Resolving non-calendar fiscal year variant K4 against V3 retail calendar.',
      skillsDemonstrated: [
        'S/4HANA Finance Customizing (IMG)',
        'General Ledger Accounting',
        'Business Process Mapping'
      ],
      learningReflection:
        'Learned how document splitting maintains real-time balance sheet integrity by segment.',
      supportingEvidenceUrls: ['https://example.com/evidence-document.pdf']
    });

    assert.ok(submission);
    assert.equal(submission.status, 'SUBMITTED');
    assert.equal(submission.reviewerType, 'AWAITING_REVIEW');
    assert.equal(submission.overallScore, undefined, 'Score must not be awarded before review');
    assert.ok(submission.submittedAt);
  });

  test('6. Reviewing project evaluates rubric and awards weighted score', async () => {
    const existing = await repo.getSubmission('proj-fi-01', 'test-user-01');
    assert.ok(existing);

    const reviewed = await service.reviewProject({
      submissionId: existing.id,
      status: 'COMPLETED',
      reviewerType: 'INDEPENDENT_REVIEWER',
      reviewerFeedback:
        'Strong architectural documentation. Chart of accounts and company codes are mapped accurately according to SAP best practices.',
      rubricAssessments: [
        {
          criterion: 'Completeness of Organizational Structure Hierarchy',
          weightPercentage: 35,
          awardedScore: 90,
          feedback: 'Excellent hierarchy diagram.'
        },
        {
          criterion: 'Accurate General Ledger Account Group segmentation',
          weightPercentage: 35,
          awardedScore: 85,
          feedback: 'Solid balance sheet and P&L account groups.'
        },
        {
          criterion: 'Professional enterprise documentation formatting',
          weightPercentage: 30,
          awardedScore: 90,
          feedback: 'Clean formatting.'
        }
      ]
    });

    assert.ok(reviewed);
    assert.equal(reviewed.status, 'COMPLETED');
    assert.equal(reviewed.reviewerType, 'INDEPENDENT_REVIEWER');
    // Weighted score: (90*35 + 85*35 + 90*30)/100 = (3150 + 2975 + 2700)/100 = 88.25 -> 88
    assert.equal(reviewed.overallScore, 88);
    assert.ok(reviewed.reviewedAt);
    assert.ok(reviewed.rubricAssessments.every((r) => r.isSatisfied === true));
  });

  test('7. Failing rubric score forces NEEDS_REVISION state', async () => {
    const sub = await service.startProject('proj-fi-02', 'test-user-02');
    assert.ok(sub);

    const reviewed = await service.reviewProject({
      submissionId: sub.id,
      status: 'COMPLETED', // Candidate requested completed, but scores are unsatisfactory
      reviewerType: 'INDEPENDENT_REVIEWER',
      reviewerFeedback:
        'Deliverable is incomplete. Month-end checklist is missing document splitting rules.',
      rubricAssessments: [
        {
          criterion: 'Correctness of foreign currency & document split rules',
          weightPercentage: 40,
          awardedScore: 40,
          feedback: 'Document splitting not addressed.'
        },
        {
          criterion: 'Clarity of the closing procedure runbook',
          weightPercentage: 30,
          awardedScore: 50,
          feedback: 'Checklist lacks transaction codes.'
        },
        {
          criterion: 'Financial variance analysis insight',
          weightPercentage: 30,
          awardedScore: 45,
          feedback: 'No commentary on variances.'
        }
      ]
    });

    assert.ok(reviewed);
    assert.equal(reviewed.status, 'NEEDS_REVISION', 'Must downgrade to NEEDS_REVISION if score < 70');
    assert.ok((reviewed.overallScore || 0) < 60);
  });
});

describe('Career Readiness Scorecard Suite', () => {
  const profileRepo = new InMemoryProfileRepository();
  const projRepo = new InMemoryProjectRepository();
  const readiness = new ReadinessService(profileRepo, projRepo);

  test('8. Returns null for non-existent profile or role', async () => {
    const res = await readiness.computeReadinessScorecard('non-existent-profile', 'sap-s4hana-finance-consultant');
    assert.equal(res, null);

    const res2 = await readiness.computeReadinessScorecard('demo-profile', 'non-existent-role');
    assert.equal(res2, null);
  });

  test('9. Computes multi-dimensional readiness with mandatory prerequisite checks', async () => {
    // Setup a candidate profile with partial finance skills
    const created = await profileRepo.createProfile({
      id: 'profile-readiness-test',
      fullName: 'Jordan Taylor',
      currentTitle: 'Senior Accountant',
      suggestedSkills: [],
      confirmedSkills: [
        createSkill('General Ledger Accounting', 'ADVANCED', true, 'CONFIRMED'),
        createSkill('Financial Reporting & IFRS', 'INTERMEDIATE', true, 'CONFIRMED'),
        createSkill('Business Process Mapping', 'INTERMEDIATE', true, 'CONFIRMED')
      ],
      isReviewed: true
    });

    const scorecard = await readiness.computeReadinessScorecard(
      created.id,
      'sap-s4hana-finance-consultant',
      ['milestone-01']
    );

    assert.ok(scorecard);
    assert.equal(scorecard.roleSlug, 'sap-s4hana-finance-consultant');
    assert.equal(scorecard.isReadinessEligible, false, 'Should be ineligible because mandatory gaps exist');
    assert.ok(scorecard.outstandingMandatoryGaps.length > 0);
    assert.ok(scorecard.dimensions.skillCoverage.score > 0);
    assert.ok(scorecard.dimensions.mandatoryRequirements.score > 0);
    assert.ok(scorecard.disclaimer.includes('not a hiring probability'));
  });

  test('10. Confirmed mandatory coverage achieves pivot readiness', async () => {
    const created = await profileRepo.createProfile({
      id: 'profile-pivot-ready',
      fullName: 'Alex Vance',
      currentTitle: 'Lead Financial Systems Consultant',
      suggestedSkills: [],
      confirmedSkills: [
        createSkill('General Ledger Accounting', 'ADVANCED', true, 'CONFIRMED'),
        createSkill('S/4HANA Finance Customizing (IMG)', 'INTERMEDIATE', true, 'CONFIRMED'),
        createSkill('SAP Fiori Financial Apps', 'INTERMEDIATE', true, 'CONFIRMED'),
        createSkill('Financial Reporting & IFRS', 'INTERMEDIATE', true, 'CONFIRMED'),
        createSkill('Business Process Mapping', 'INTERMEDIATE', true, 'CONFIRMED')
      ],
      isReviewed: true
    });

    // Generate pathway milestones to obtain valid IDs and verify invalid IDs are rejected
    const pathway = pathwayService.generatePathway('sap-s4hana-finance-consultant', created.confirmedSkills, created.id);
    const validIds = pathway ? pathway.milestones.map((m) => m.milestoneId) : [];

    // Passing valid IDs plus unknown/fake IDs to test milestone integrity validation
    const scorecard = await readiness.computeReadinessScorecard(
      created.id,
      'sap-s4hana-finance-consultant',
      [...validIds, 'fake-unknown-id-xyz', 'fake-unknown-id-xyz']
    );

    assert.ok(scorecard);
    assert.equal(scorecard.isReadinessEligible, true);
    assert.equal(scorecard.outstandingMandatoryGaps.length, 0);
    assert.equal(scorecard.dimensions.mandatoryRequirements.score, 100);
    // Fake IDs should have been filtered out
    assert.equal(scorecard.learningMilestoneProgress.completedCount, validIds.length);
    assert.ok(scorecard.overallReadinessScore >= 70);
  });
});

describe('External Job Search Destinations Suite', () => {
  const jobService = new JobSearchService();

  test('11. Generates verified external search destinations with encoded queries', () => {
    const result = jobService.generateSearchDestinations('sap-s4hana-finance-consultant', {
      location: 'New York, NY',
      keywords: 'SAP S/4HANA Finance Lead'
    });

    assert.ok(result);
    assert.equal(result.roleSlug, 'sap-s4hana-finance-consultant');
    assert.equal(result.destinationLinks.length, 3);

    const sapLink = result.destinationLinks.find((l) => l.portalKey === 'SAP_OFFICIAL');
    assert.ok(sapLink);
    assert.ok(sapLink.destinationUrl.includes('jobs.sap.com'));
    assert.ok(sapLink.destinationUrl.includes(encodeURIComponent('SAP S/4HANA Finance Lead')));
    assert.ok(sapLink.destinationUrl.includes(encodeURIComponent('New York, NY')));

    const linkedinLink = result.destinationLinks.find((l) => l.portalKey === 'LINKEDIN');
    assert.ok(linkedinLink);
    assert.ok(linkedinLink.destinationUrl.includes('linkedin.com/jobs'));

    const indeedLink = result.destinationLinks.find((l) => l.portalKey === 'INDEED');
    assert.ok(indeedLink);
    assert.ok(indeedLink.destinationUrl.includes('indeed.com'));

    assert.ok(result.disclaimer.includes('does not scrape private employer databases'));
  });

  test('12. Returns null for unknown role slug', () => {
    const unknown = jobService.generateSearchDestinations('non-existent-career-slug');
    assert.equal(unknown, null);
  });
});
