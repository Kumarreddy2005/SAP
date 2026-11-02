import {
  CareerReadinessScorecard,
  ReadinessDimensionScore,
  CareerRole,
  ProjectSubmission
} from '@career-orchestrator/shared';
import { getRoleByIdOrSlug } from '../career/career.catalogue';
import { careerMatcherService } from '../matching/career-matcher.service';
import { pathwayService } from '../pathway/pathway.service';
import { ProjectRepository, projectRepository } from '../projects/project.repository';
import { ProfileRepository, profileRepository } from '../resume/profile.repository';

export class ReadinessService {
  constructor(
    private profileRepo: ProfileRepository = profileRepository,
    private projRepo: ProjectRepository = projectRepository
  ) {}

  /**
   * Generates a comprehensive, explainable career readiness scorecard.
   */
  async computeReadinessScorecard(
    profileId: string,
    roleIdOrSlug: string,
    completedMilestoneIds: string[] = []
  ): Promise<CareerReadinessScorecard | null> {
    const role = getRoleByIdOrSlug(roleIdOrSlug);
    if (!role) return null;

    const profile = await this.profileRepo.getProfileById(profileId);
    if (!profile) return null;

    const confirmedSkills = (profile.confirmedSkills || []).filter(
      (s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED'
    );

    // 1. Evaluate deterministic competency matching
    const matchEvaluation = careerMatcherService.evaluateSingleRole(role, confirmedSkills);

    // 2. Fetch project submissions for candidate strictly associated with this career role
    const submissions = await this.projRepo.getSubmissionsByProfile(profileId);
    const roleProjects = submissions.filter((s) => {
      // Must belong directly to this target role's suggested projects
      return role.suggestedProjectIds?.includes(s.projectId);
    });

    const independentReviewedProjects = roleProjects.filter(
      (s) =>
        (s.status === 'REVIEWED' || s.status === 'COMPLETED') &&
        s.reviewerType === 'INDEPENDENT_REVIEWER'
    );
    const selfAssessedProjects = roleProjects.filter(
      (s) =>
        (s.status === 'REVIEWED' || s.status === 'COMPLETED') &&
        s.reviewerType === 'SELF_ASSESSMENT'
    );
    const reviewedOrCompletedProjects = roleProjects.filter(
      (s) => s.status === 'REVIEWED' || s.status === 'COMPLETED'
    );
    const submittedAwaitingProjects = roleProjects.filter((s) => s.status === 'SUBMITTED');

    // 3. Evaluate learning pathway milestones with deduplication and existence validation
    const pathway = pathwayService.generatePathway(role.slug, confirmedSkills, profileId);
    const totalMilestones = pathway ? pathway.milestones.length : 0;
    const validMilestoneIds = new Set(
      pathway ? pathway.milestones.map((m) => m.milestoneId) : []
    );

    // Deduplicate and filter out unknown IDs
    const uniqueClaimedIds = Array.from(
      new Set(completedMilestoneIds.map((id) => id.trim()).filter(Boolean))
    );
    const verifiedClaimedMilestones = uniqueClaimedIds.filter((id) =>
      validMilestoneIds.has(id)
    );
    const completedCount = verifiedClaimedMilestones.length;
    const milestonePct =
      totalMilestones > 0 ? Math.min(100, Math.round((completedCount / totalMilestones) * 100)) : 0;

    // 4. Calculate dimensional scores
    // Dimension 1: Overall Curriculum Coverage (35% weight)
    const dimSkillCoverage: ReadinessDimensionScore = {
      name: 'Curriculum Competency Overlap',
      score: matchEvaluation.overallScore,
      weightPercentage: 35,
      demonstratedDetails: `${matchEvaluation.matchedSkills.length} competencies fully or partially demonstrated in candidate profile.`,
      gapDetails: `${matchEvaluation.missingMandatorySkills.length + matchEvaluation.missingPreferredSkills.length} curriculum competencies remaining to bridge.`,
      status:
        matchEvaluation.overallScore >= 75
          ? 'STRONG'
          : matchEvaluation.overallScore >= 45
            ? 'IN_PROGRESS'
            : confirmedSkills.length === 0
              ? 'INSUFFICIENT_DATA'
              : 'NEEDS_ATTENTION'
    };

    // Dimension 2: Mandatory Core Prerequisites (35% weight)
    const dimMandatory: ReadinessDimensionScore = {
      name: 'Essential Role Requirements',
      score: matchEvaluation.mandatoryScore,
      weightPercentage: 35,
      demonstratedDetails: `${matchEvaluation.matchedSkills.filter((m) => m.isMandatory).length} of ${role.requiredSkills.filter((r) => r.isMandatory).length} essential requirements satisfied.`,
      gapDetails:
        matchEvaluation.missingMandatorySkills.length === 0
          ? 'Zero mandatory gaps remaining.'
          : `${matchEvaluation.missingMandatorySkills.map((m) => m.skillName).join(', ')} required.`,
      status:
        matchEvaluation.mandatoryScore === 100
          ? 'STRONG'
          : matchEvaluation.mandatoryScore >= 60
            ? 'IN_PROGRESS'
            : 'NEEDS_ATTENTION'
    };

    // Dimension 3: Learning Milestones Completion (15% weight)
    const completedTitles = pathway
      ? pathway.milestones
          .filter((m) => verifiedClaimedMilestones.includes(m.milestoneId))
          .map((m) => m.title)
      : [];
    const remainingTitles = pathway
      ? pathway.milestones
          .filter((m) => !verifiedClaimedMilestones.includes(m.milestoneId))
          .map((m) => m.title)
      : [];

    const dimLearning: ReadinessDimensionScore = {
      name: 'Structured Learning Journey (Self-Reported)',
      score: milestonePct,
      weightPercentage: 15,
      demonstratedDetails: `${completedCount} of ${totalMilestones} curriculum milestones self-reported as completed (active session progress; external LMS credential verification not connected).`,
      gapDetails: `${remainingTitles.length} milestones remaining on learning pathway.`,
      status:
        milestonePct >= 80
          ? 'STRONG'
          : milestonePct >= 30
            ? 'IN_PROGRESS'
            : totalMilestones === 0
              ? 'STRONG'
              : 'NEEDS_ATTENTION'
    };

    // Dimension 4: Practical Applied Project Evidence (15% weight)
    const availableRoleProjCount = role.suggestedProjectIds?.length || 2;
    const projectScore = Math.min(
      100,
      Math.round(
        (reviewedOrCompletedProjects.length / Math.max(1, availableRoleProjCount)) * 80 +
          (submittedAwaitingProjects.length > 0 ? 20 : 0)
      )
    );

    const dimProjects: ReadinessDimensionScore = {
      name: 'Applied Scenario Projects',
      score: projectScore,
      weightPercentage: 15,
      demonstratedDetails: `${reviewedOrCompletedProjects.length} role-specific projects reviewed (${independentReviewedProjects.length} independent, ${selfAssessedProjects.length} self-assessed, ${submittedAwaitingProjects.length} awaiting review).`,
      gapDetails: `${Math.max(0, availableRoleProjCount - reviewedOrCompletedProjects.length)} scenario projects recommended to complete evidence portfolio.`,
      status:
        projectScore >= 75
          ? 'STRONG'
          : projectScore >= 25 || submittedAwaitingProjects.length > 0
            ? 'IN_PROGRESS'
            : 'NEEDS_ATTENTION'
    };

    // Overall composite calculation
    // If candidate has zero confirmed competencies, return 0 with clear insufficient data text
    let overallReadinessScore = 0;
    if (confirmedSkills.length > 0) {
      overallReadinessScore = Math.round(
        dimSkillCoverage.score * 0.35 +
          dimMandatory.score * 0.35 +
          dimLearning.score * 0.15 +
          dimProjects.score * 0.15
      );
    }

    const isReadinessEligible =
      matchEvaluation.isEligibleForPivot && confirmedSkills.length > 0;

    // Generate actionable next steps
    const nextRecommendedActions: string[] = [];
    if (matchEvaluation.missingMandatorySkills.length > 0) {
      nextRecommendedActions.push(
        `Bridge essential mandatory skill: '${matchEvaluation.missingMandatorySkills[0].skillName}' through suggested courseware.`
      );
    }
    if (remainingTitles.length > 0) {
      nextRecommendedActions.push(`Complete next sequenced learning milestone: '${remainingTitles[0]}'.`);
    }
    if (roleProjects.length === 0 && role.suggestedProjectIds && role.suggestedProjectIds.length > 0) {
      nextRecommendedActions.push(
        `Initiate and submit practical project: '${role.suggestedProjectIds[0]}' to demonstrate applied scenario competence.`
      );
    }
    if (submittedAwaitingProjects.length > 0) {
      nextRecommendedActions.push(
        `${submittedAwaitingProjects.length} project submission is currently awaiting assessment against the rubric.`
      );
    }
    if (isReadinessEligible) {
      nextRecommendedActions.push(
        `All core mandatory competencies verified! Explore external job postings in the Job Discovery portal.`
      );
    }

    const summaryText =
      confirmedSkills.length === 0
        ? 'Not enough evidence yet. Please upload a resume or confirm competencies in your profile.'
        : isReadinessEligible
          ? `High transition alignment for ${role.title}. Core mandatory prerequisites are satisfied with ${matchEvaluation.overallScore}% curriculum overlap.`
          : `Emerging readiness for ${role.title}. ${matchEvaluation.missingMandatorySkills.length} mandatory prerequisite(s) remain outstanding before pivot readiness.`;

    return {
      profileId,
      isDemoProfile: profileId === 'demo-profile',
      roleId: role.id,
      roleSlug: role.slug,
      roleTitle: role.title,
      overallReadinessScore,
      isReadinessEligible,
      summaryText,
      dimensions: {
        skillCoverage: dimSkillCoverage,
        mandatoryRequirements: dimMandatory,
        learningMilestones: dimLearning,
        projectEvidence: dimProjects
      },
      confirmedMandatorySkills: matchEvaluation.matchedSkills
        .filter((m) => m.isMandatory)
        .map((m) => m.skillName),
      outstandingMandatoryGaps: matchEvaluation.missingMandatorySkills.map((m) => m.skillName),
      outstandingPreferredGaps: matchEvaluation.missingPreferredSkills.map((p) => p.skillName),
      learningMilestoneProgress: {
        completedCount,
        totalCount: totalMilestones,
        completionPercentage: milestonePct,
        completedMilestoneTitles: completedTitles,
        remainingMilestoneTitles: remainingTitles
      },
      projectEvidenceProgress: {
        submittedCount: roleProjects.length,
        reviewedCount: reviewedOrCompletedProjects.length,
        totalAvailableProjects: availableRoleProjCount,
        submissionsAwaitingReviewCount: submittedAwaitingProjects.length,
        completedProjectsCount: roleProjects.filter((p) => p.status === 'COMPLETED').length
      },
      nextRecommendedActions,
      calculatedAt: new Date().toISOString(),
      disclaimer:
        'Career readiness is an evidence-based progress assessment against this role’s defined requirements. It is not a hiring probability, job guarantee or substitute for an employer’s selection process.'
    };
  }
}

export const readinessService = new ReadinessService();
