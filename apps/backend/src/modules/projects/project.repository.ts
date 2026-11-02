import {
  ProjectSubmission,
  ProjectLifecycleState,
  RubricScoreItem
} from '@career-orchestrator/shared';
import { PRACTICAL_PROJECTS_CATALOGUE, getProjectById } from '../career/practical-projects.catalogue';

export interface ProjectRepository {
  getSubmission(projectId: string, profileId: string): Promise<ProjectSubmission | null>;
  getSubmissionById(submissionId: string): Promise<ProjectSubmission | null>;
  getSubmissionsByProfile(profileId: string): Promise<ProjectSubmission[]>;
  saveSubmission(submission: ProjectSubmission): Promise<ProjectSubmission>;
  startProject(projectId: string, profileId: string): Promise<ProjectSubmission>;
  deleteSubmissionsByProfile(profileId: string): Promise<number>;
}

/**
 * In-Memory Development Project Repository
 *
 * NOTE: Isolated, non-durable development fallback while PostgreSQL is not configured on host.
 * Project submissions and lifecycle states are retained in-process for the current session.
 */
export class InMemoryProjectRepository implements ProjectRepository {
  private submissions = new Map<string, ProjectSubmission>();

  constructor() {
    // Seed initial demo project submission for Alex Vance demo profile
    this.seedDemoSubmission();
  }

  private seedDemoSubmission() {
    const defaultProj = PRACTICAL_PROJECTS_CATALOGUE[0];
    if (!defaultProj) return;

    const demoSub: ProjectSubmission = {
      id: 'sub-demo-001',
      projectId: defaultProj.id,
      profileId: 'demo-profile',
      status: 'REVIEWED',
      repositoryUrl: 'https://github.com/example/sap-fi-enterprise-blueprint',
      liveDemoUrl: 'https://drive.google.com/file/d/example-blueprint-preview/view',
      projectExplanation:
        'Architected multinational enterprise structure for dual-subsidiary retail group with US and European company codes, defining Universal Journal ACDOCA ledger configurations.',
      challengesEncountered:
        'Reconciling different fiscal year variants (K4 calendar year vs V3 4-4-5 retail period) across non-leading ledgers.',
      skillsDemonstrated: [
        'S/4HANA Finance Customizing (IMG)',
        'General Ledger Accounting',
        'Business Process Mapping'
      ],
      learningReflection:
        'Gained deep appreciation of document splitting rules in Universal Journal and how field status variants prevent improper line-item postings.',
      rubricAssessments: defaultProj.rubricCriteria.map((c) => ({
        criterion: c.criterion,
        weightPercentage: c.weightPercentage,
        awardedScore: 88,
        feedback: 'Thorough organizational hierarchy and well-structured GL chart of accounts.',
        isSatisfied: true
      })),
      overallScore: 88,
      reviewerFeedback:
        'Exemplary functional documentation. Clear separation of leading and non-leading ledger variants.',
      reviewerType: 'INDEPENDENT_REVIEWER',
      submittedAt: '2026-10-28T14:30:00.000Z',
      reviewedAt: '2026-10-28T16:00:00.000Z',
      updatedAt: '2026-10-28T16:00:00.000Z'
    };

    this.submissions.set(`${demoSub.profileId}:${demoSub.projectId}`, demoSub);
    this.submissions.set(demoSub.id, demoSub);
  }

  async getSubmission(projectId: string, profileId: string): Promise<ProjectSubmission | null> {
    const key = `${profileId}:${projectId}`;
    return this.submissions.get(key) || null;
  }

  async getSubmissionById(submissionId: string): Promise<ProjectSubmission | null> {
    return this.submissions.get(submissionId) || null;
  }

  async getSubmissionsByProfile(profileId: string): Promise<ProjectSubmission[]> {
    const results: ProjectSubmission[] = [];
    const seenIds = new Set<string>();

    for (const sub of this.submissions.values()) {
      if (sub.profileId === profileId && !seenIds.has(sub.id)) {
        seenIds.add(sub.id);
        results.push(sub);
      }
    }
    return results;
  }

  async saveSubmission(submission: ProjectSubmission): Promise<ProjectSubmission> {
    const key = `${submission.profileId}:${submission.projectId}`;
    this.submissions.set(key, submission);
    this.submissions.set(submission.id, submission);
    return submission;
  }

  async startProject(projectId: string, profileId: string): Promise<ProjectSubmission> {
    const existing = await this.getSubmission(projectId, profileId);
    if (existing) {
      return existing;
    }

    const proj = getProjectById(projectId);
    const rubricAssessments: RubricScoreItem[] = (proj?.rubricCriteria || []).map((c) => ({
      criterion: c.criterion,
      weightPercentage: c.weightPercentage
    }));

    const newSub: ProjectSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectId,
      profileId,
      status: 'IN_PROGRESS',
      projectExplanation: '',
      skillsDemonstrated: [],
      learningReflection: '',
      rubricAssessments,
      reviewerType: 'AWAITING_REVIEW',
      updatedAt: new Date().toISOString()
    };

    return this.saveSubmission(newSub);
  }

  async deleteSubmissionsByProfile(profileId: string): Promise<number> {
    const matchingSubIds = new Set<string>();
    const keysToDelete: string[] = [];

    for (const [key, sub] of this.submissions.entries()) {
      if (sub.profileId === profileId) {
        keysToDelete.push(key);
        matchingSubIds.add(sub.id);
      }
    }

    for (const key of keysToDelete) {
      this.submissions.delete(key);
    }

    return matchingSubIds.size;
  }
}

export const projectRepository = new InMemoryProjectRepository();
