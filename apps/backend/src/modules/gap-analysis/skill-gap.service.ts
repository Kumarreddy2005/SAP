import {
  SkillGapAnalysis,
  CareerRole,
  ExtractedSkillItem,
  VerifiedLearningResource
} from '@career-orchestrator/shared';
import { getRoleByIdOrSlug } from '../career/career.catalogue';
import { careerMatcherService } from '../matching/career-matcher.service';
import { getVerifiedResourcesForSkill, getVerifiedResourceById } from '../career/learning-resource.catalogue';
import { getProjectsForRole } from '../career/practical-projects.catalogue';

export class SkillGapService {
  /**
   * Performs an in-depth gap analysis of a candidate against a target career role.
   */
  analyzeSkillGaps(
    roleIdOrSlug: string,
    candidateSkills: ExtractedSkillItem[],
    candidateMetadata?: { profileId?: string; fullName?: string; currentTitle?: string }
  ): SkillGapAnalysis | null {
    const role = getRoleByIdOrSlug(roleIdOrSlug);
    if (!role) {
      return null;
    }

    // Evaluate matching using the deterministic matching engine
    const evaluation = careerMatcherService.evaluateSingleRole(
      role,
      candidateSkills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED')
    );

    // Map external prerequisites
    const mappedPrerequisites = (role.prerequisites || []).map((prereq) => {
      const lowerPrereq = prereq.toLowerCase();
      // Check if candidate confirmed skills address the prerequisite domain
      const isMet = candidateSkills
        .filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED')
        .some((s) => {
          const sName = s.name.toLowerCase();
          return (
            lowerPrereq.includes(sName) ||
            sName.includes('accounting') && lowerPrereq.includes('accounting') ||
            sName.includes('sql') && lowerPrereq.includes('sql') ||
            sName.includes('programming') && lowerPrereq.includes('programming')
          );
        });

      return {
        requirement: prereq,
        isMet,
        guidance: isMet
          ? 'Met by confirmed competencies in your verified profile.'
          : 'Foundational concept recommended prior to undertaking advanced configuration customizing.'
      };
    });

    // Map practical projects for this role
    const availableProjects = getProjectsForRole(role.slug);

    // Enrich missing mandatory gaps with verified resources and projects
    const enrichedMandatoryGaps = evaluation.missingMandatorySkills.map((gap) => {
      const resources = getVerifiedResourcesForSkill(gap.skillName);
      const matchedProj = availableProjects.find((p) =>
        p.targetSkills.some(
          (ts) => ts.toLowerCase().includes(gap.skillName.toLowerCase()) || gap.skillName.toLowerCase().includes(ts.toLowerCase())
        )
      );

      return {
        ...gap,
        recommendedResource: resources.length > 0 ? resources[0] : undefined,
        suggestedProject: matchedProj
      };
    });

    const enrichedRecommendedGaps = evaluation.missingPreferredSkills.map((gap) => {
      const resources = getVerifiedResourcesForSkill(gap.skillName);
      return {
        ...gap,
        recommendedResource: resources.length > 0 ? resources[0] : undefined
      };
    });

    const enrichedPartiallyMatched = evaluation.partiallyMatchedSkills.map((partial) => {
      const resources = getVerifiedResourcesForSkill(partial.skillName);
      return {
        ...partial,
        recommendedResource: resources.length > 0 ? resources[0] : undefined
      };
    });

    // Compute estimated hours to bridge all mandatory and partial gaps
    const totalGapCount = enrichedMandatoryGaps.length + enrichedPartiallyMatched.length;
    const estimatedBridgeHours = Math.round(
      (role.planningHoursEstimate || 80) * (totalGapCount / Math.max(1, role.requiredSkills.length))
    );

    const recommendedResources: VerifiedLearningResource[] = role.suggestedLearningResourceIds
      ? role.suggestedLearningResourceIds
          .map((id) => getVerifiedResourceById(id))
          .filter((r): r is VerifiedLearningResource => r !== undefined)
      : [];

    return {
      role,
      candidateProfileId: candidateMetadata?.profileId,
      candidateName: candidateMetadata?.fullName,
      candidateTitle: candidateMetadata?.currentTitle,
      overallFitPercentage: evaluation.overallScore,
      confirmedMatches: evaluation.matchedSkills,
      partiallyMatched: enrichedPartiallyMatched,
      mandatoryGaps: enrichedMandatoryGaps,
      recommendedGaps: enrichedRecommendedGaps,
      unverifiedRequirements: evaluation.unverifiedRequirements,
      prerequisites: mappedPrerequisites,
      criticalitySummary: {
        mandatoryGapCount: enrichedMandatoryGaps.length,
        recommendedGapCount: enrichedRecommendedGaps.length,
        estimatedBridgeHours: Math.max(15, estimatedBridgeHours)
      },
      recommendedResources,
      recommendedProjects: availableProjects,
      totalEstimatedBridgeHours: Math.max(15, estimatedBridgeHours),
      calculatedAt: new Date().toISOString(),
      disclaimer:
        'Skill gaps represent competency requirements not currently confirmed in your candidate profile. They guide your study pathway and do not imply an unbridgeable barrier.'
    };
  }
}

export const skillGapService = new SkillGapService();
