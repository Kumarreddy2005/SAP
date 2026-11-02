import {
  PracticalProjectDefinition,
  ProjectSubmission,
  ProjectSubmissionInput,
  ProjectReviewInput,
  ProjectLifecycleState
} from '@career-orchestrator/shared';
import {
  PRACTICAL_PROJECTS_CATALOGUE,
  getProjectById,
  getProjectsForRole
} from '../career/practical-projects.catalogue';
import { ProjectRepository, projectRepository } from './project.repository';

export class ProjectService {
  constructor(private repo: ProjectRepository = projectRepository) {}

  /**
   * Retrieves available projects with multi-criteria filtering
   */
  listProjects(filters?: {
    roleSlug?: string;
    search?: string;
    difficulty?: string;
    skill?: string;
  }): PracticalProjectDefinition[] {
    let projects = [...PRACTICAL_PROJECTS_CATALOGUE];

    if (filters?.roleSlug && filters.roleSlug !== 'ALL') {
      projects = projects.filter((p) => p.roleSlug === filters.roleSlug);
    }

    if (filters?.difficulty && filters.difficulty !== 'ALL') {
      projects = projects.filter((p) => p.difficulty === filters.difficulty);
    }

    if (filters?.skill) {
      const sLower = filters.skill.toLowerCase();
      projects = projects.filter((p) =>
        p.targetSkills.some((ts) => ts.toLowerCase().includes(sLower))
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.targetSkills.some((ts) => ts.toLowerCase().includes(q))
      );
    }

    return projects;
  }

  /**
   * Retrieves single project detail
   */
  getProject(projectId: string): PracticalProjectDefinition | null {
    return getProjectById(projectId) || null;
  }

  /**
   * Initiates project workspace for candidate (transitions to IN_PROGRESS)
   */
  async startProject(projectId: string, profileId: string): Promise<ProjectSubmission | null> {
    const project = getProjectById(projectId);
    if (!project) return null;

    return this.repo.startProject(projectId, profileId);
  }

  /**
   * Records candidate deliverable submission.
   *
   * Crucial lifecycle rule:
   * A submission transitions state to 'SUBMITTED' and labels reviewerType as 'AWAITING_REVIEW'.
   * Submitting evidence does NOT automatically certify competency or mark the project 'COMPLETED'.
   */
  async submitProject(input: ProjectSubmissionInput): Promise<ProjectSubmission | null> {
    const project = getProjectById(input.projectId);
    if (!project) return null;

    const existing = await this.repo.getSubmission(input.projectId, input.profileId);
    const now = new Date().toISOString();

    const rubricAssessments = (project.rubricCriteria || []).map((c) => {
      const match = (input.rubricAssessments || []).find((r) => r.criterion === c.criterion);
      return {
        criterion: c.criterion,
        weightPercentage: c.weightPercentage,
        awardedScore: match?.awardedScore,
        feedback: match?.feedback,
        isSatisfied: match?.isSatisfied
      };
    });

    const submission: ProjectSubmission = {
      id: existing?.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectId: input.projectId,
      profileId: input.profileId,
      status: 'SUBMITTED', // Transitions to SUBMITTED, awaiting genuine evaluation
      repositoryUrl: input.repositoryUrl || undefined,
      liveDemoUrl: input.liveDemoUrl || undefined,
      projectExplanation: input.projectExplanation.trim(),
      challengesEncountered: input.challengesEncountered?.trim() || undefined,
      skillsDemonstrated: input.skillsDemonstrated,
      learningReflection: input.learningReflection.trim(),
      supportingEvidenceUrls: input.supportingEvidenceUrls,
      alternativeEvidenceDescription: input.alternativeEvidenceDescription?.trim() || undefined,
      rubricAssessments,
      reviewerType: 'AWAITING_REVIEW',
      submittedAt: now,
      updatedAt: now
    };

    return this.repo.saveSubmission(submission);
  }

  /**
   * Assesses project evidence against rubric criteria.
   * Supports self-assessment and simulated independent review.
   */
  async reviewProject(input: ProjectReviewInput): Promise<ProjectSubmission | null> {
    const existing = await this.repo.getSubmissionById(input.submissionId);
    if (!existing) return null;

    const project = getProjectById(existing.projectId);
    if (!project) return null;

    const now = new Date().toISOString();

    // Calculate weighted overall score strictly against defined project rubric criteria
    let totalScore = 0;
    let totalWeight = 0;

    const rubricAssessments = project.rubricCriteria.map((definedCrit) => {
      const match = input.rubricAssessments.find(
        (a) => a.criterion.trim().toLowerCase() === definedCrit.criterion.trim().toLowerCase()
      );
      const weight = definedCrit.weightPercentage;
      const score = Math.min(100, Math.max(0, match?.awardedScore ?? 0));

      totalScore += (score * weight) / 100;
      totalWeight += weight;

      return {
        criterion: definedCrit.criterion,
        weightPercentage: weight,
        awardedScore: score,
        feedback: match?.feedback || undefined,
        isSatisfied: score >= 70
      };
    });

    const overallScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;

    // Apply strict lifecycle state resolution
    let resolvedStatus: ProjectLifecycleState = input.status;
    if (overallScore < 70) {
      resolvedStatus = 'NEEDS_REVISION';
    } else if (input.status === 'COMPLETED' && input.reviewerType === 'SELF_ASSESSMENT') {
      // Self-assessment alone cannot unilaterally award COMPLETED status without independent review
      resolvedStatus = 'REVIEWED';
    }

    const updated: ProjectSubmission = {
      ...existing,
      status: resolvedStatus,
      rubricAssessments,
      overallScore,
      reviewerFeedback: input.reviewerFeedback,
      reviewerType: input.reviewerType,
      submittedAt: existing.submittedAt || now,
      reviewedAt: now,
      updatedAt: now
    };

    return this.repo.saveSubmission(updated);
  }

  /**
   * Retrieves all project submissions for a candidate profile
   */
  async getSubmissionsByProfile(profileId: string): Promise<ProjectSubmission[]> {
    return this.repo.getSubmissionsByProfile(profileId);
  }
}

export const projectService = new ProjectService();
