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

    // Calculate weighted overall score from rubric assessments
    let totalScore = 0;
    let totalWeight = 0;

    const rubricAssessments = input.rubricAssessments.map((a) => {
      const definedCrit = project.rubricCriteria.find((rc) => rc.criterion === a.criterion);
      const weight = definedCrit?.weightPercentage || a.weightPercentage || 25;
      const score = Math.min(100, Math.max(0, a.awardedScore ?? 0));

      totalScore += (score * weight) / 100;
      totalWeight += weight;

      return {
        criterion: a.criterion,
        weightPercentage: weight,
        awardedScore: score,
        feedback: a.feedback || undefined,
        isSatisfied: score >= 70
      };
    });

    const overallScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;

    // Determine target lifecycle state:
    // If input status is requested and valid, use it; otherwise infer based on score:
    // score >= 75 -> 'COMPLETED', score >= 60 -> 'REVIEWED', score < 60 -> 'NEEDS_REVISION'
    let resolvedStatus: ProjectLifecycleState = input.status;
    if (input.status === 'COMPLETED' && overallScore < 70) {
      resolvedStatus = 'NEEDS_REVISION';
    }

    const updated: ProjectSubmission = {
      ...existing,
      status: resolvedStatus,
      rubricAssessments,
      overallScore,
      reviewerFeedback: input.reviewerFeedback,
      reviewerType: input.reviewerType,
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
