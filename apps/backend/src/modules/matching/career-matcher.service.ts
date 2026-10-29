import {
  CareerRole,
  ExtractedSkillItem,
  CareerMatchResult,
  RequirementMatchDetail,
  ProficiencyLevel,
  RoleCompetencyRequirement,
  CareerComparisonResult
} from '@career-orchestrator/shared';
import { CAREER_CATALOGUE, getAllCareerRoles } from '../career/career.catalogue';

const PROFICIENCY_RANK: Record<ProficiencyLevel, number> = {
  NOVICE: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4
};

export class CareerMatcherService {
  constructor(private catalogue: CareerRole[] = getAllCareerRoles()) {}

  /**
   * Evaluates all careers in the catalogue against the candidate's confirmed skills.
   * Returns a complete, transparently scored list sorted by overall match score.
   */
  evaluateCandidateAgainstAllCareers(
    candidateSkills: ExtractedSkillItem[]
  ): CareerMatchResult[] {
    // Strictly isolate confirmed skills; rejected and suggested items are filtered out
    const activeConfirmedSkills = candidateSkills.filter(
      (s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED'
    );

    const results = this.catalogue.map((role) =>
      this.evaluateSingleRole(role, activeConfirmedSkills)
    );

    // Return complete matching catalogue sorted descending by overallScore
    return results.sort((a, b) => b.overallScore - a.overallScore);
  }

  /**
   * Evaluates a single career role against confirmed candidate skills.
   */
  evaluateSingleRole(
    role: CareerRole,
    confirmedSkills: ExtractedSkillItem[]
  ): CareerMatchResult {
    const allRequirements: RoleCompetencyRequirement[] = [
      ...role.requiredSkills,
      ...(role.preferredSkills || [])
    ];

    let totalWeight = 0;
    let matchedWeight = 0;

    let mandatoryTotalWeight = 0;
    let mandatoryMatchedWeight = 0;

    let preferredTotalWeight = 0;
    let preferredMatchedWeight = 0;

    const matchedSkills: RequirementMatchDetail[] = [];
    const partiallyMatchedSkills: RequirementMatchDetail[] = [];
    const missingMandatorySkills: RequirementMatchDetail[] = [];
    const missingPreferredSkills: RequirementMatchDetail[] = [];
    const unverifiedRequirements: RequirementMatchDetail[] = [];
    const prerequisiteWarnings: string[] = [];

    for (const req of allRequirements) {
      const weight = req.weight || 1.0;
      totalWeight += weight;

      if (req.isMandatory) {
        mandatoryTotalWeight += weight;
      } else {
        preferredTotalWeight += weight;
      }

      // Find matching confirmed skill by canonical code or normalized title overlap
      const candidateMatch = this.findMatchingCandidateSkill(req, confirmedSkills);

      if (!candidateMatch) {
        // Skill is completely missing from confirmed profile
        const detail: RequirementMatchDetail = {
          skillId: req.skillId,
          skillName: req.skillName,
          category: req.category,
          isMandatory: req.isMandatory,
          weight,
          requiredProficiency: req.minimumLevel,
          matchFactor: 0.0,
          status: 'MISSING',
          explanation: req.isMandatory
            ? `Mandatory requirement '${req.skillName}' was not found in confirmed candidate profile.`
            : `Preferred skill '${req.skillName}' not demonstrated in confirmed profile.`
        };

        if (req.isMandatory) {
          missingMandatorySkills.push(detail);
          prerequisiteWarnings.push(
            `Essential requirement missing: '${req.skillName}' (${req.minimumLevel} level required).`
          );
        } else {
          missingPreferredSkills.push(detail);
        }
        continue;
      }

      // Candidate has a confirmed skill — evaluate proficiency match factor
      const reqRank = PROFICIENCY_RANK[req.minimumLevel] || 2;
      const candRank = candidateMatch.proficiency
        ? PROFICIENCY_RANK[candidateMatch.proficiency]
        : undefined;

      let matchFactor = 1.0;
      let status: 'FULL_MATCH' | 'PARTIAL_MATCH' = 'FULL_MATCH';
      let explanation = '';

      if (candRank === undefined) {
        // Proficiency not declared: apply documented conservative rule
        matchFactor = 0.5;
        status = 'PARTIAL_MATCH';
        explanation = `Skill '${candidateMatch.name}' is confirmed, but proficiency is undeclared. Conservatively assigned 50% match factor.`;
        unverifiedRequirements.push({
          skillId: req.skillId,
          skillName: req.skillName,
          category: req.category,
          isMandatory: req.isMandatory,
          weight,
          requiredProficiency: req.minimumLevel,
          matchFactor,
          status: 'UNVERIFIED',
          explanation: 'Candidate proficiency uncalibrated; requires assessment.'
        });
      } else if (candRank >= reqRank) {
        // Candidate meets or exceeds minimum requirement
        matchFactor = 1.0;
        status = 'FULL_MATCH';
        explanation = `Candidate verified at ${candidateMatch.proficiency} level, meeting or exceeding required ${req.minimumLevel} proficiency.`;
      } else {
        // Candidate has skill at lower proficiency: partial match
        matchFactor = Math.max(0.4, Number((candRank / reqRank).toFixed(2)));
        status = 'PARTIAL_MATCH';
        explanation = `Candidate verified at ${candidateMatch.proficiency} level (below target ${req.minimumLevel} requirement). Partial match credit: ${(matchFactor * 100).toFixed(0)}%.`;
      }

      const weightedContribution = weight * matchFactor;
      matchedWeight += weightedContribution;

      if (req.isMandatory) {
        mandatoryMatchedWeight += weightedContribution;
      } else {
        preferredMatchedWeight += weightedContribution;
      }

      const matchDetail: RequirementMatchDetail = {
        skillId: req.skillId,
        skillName: req.skillName,
        category: req.category,
        isMandatory: req.isMandatory,
        weight,
        requiredProficiency: req.minimumLevel,
        candidateProficiency: candidateMatch.proficiency,
        candidateYearsExperience: candidateMatch.yearsExperience,
        matchFactor,
        status,
        evidenceSnippet: candidateMatch.evidenceSnippet,
        explanation
      };

      if (status === 'FULL_MATCH') {
        matchedSkills.push(matchDetail);
      } else {
        partiallyMatchedSkills.push(matchDetail);
      }
    }

    const overallScore =
      totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;

    const mandatoryScore =
      mandatoryTotalWeight > 0
        ? Math.round((mandatoryMatchedWeight / mandatoryTotalWeight) * 100)
        : 100;

    const preferredScore =
      preferredTotalWeight > 0
        ? Math.round((preferredMatchedWeight / preferredTotalWeight) * 100)
        : 100;

    // Prerequisite eligibility check: mandatory gaps generate active warnings
    const isEligibleForPivot = missingMandatorySkills.length === 0;

    const scoreFormula = `Score = 100 * (sum(weight * matchFactor) / sum(weights)) = 100 * (${matchedWeight.toFixed(2)} / ${totalWeight.toFixed(2)}) = ${overallScore}%`;

    const disclaimer =
      'This match score represents a deterministic, explainable curriculum overlap calculation derived strictly from your confirmed profile competencies against published role requirements. It does NOT predict hiring likelihood or guarantee employment.';

    return {
      roleId: role.id,
      roleSlug: role.slug,
      roleTitle: role.title,
      track: role.track,
      careerFamily: role.careerFamily,
      ecosystem: role.ecosystem,
      summary: role.summary,
      marketDemand: role.marketDemand,
      overallScore,
      mandatoryScore,
      preferredScore,
      totalWeight: Number(totalWeight.toFixed(2)),
      matchedWeight: Number(matchedWeight.toFixed(2)),
      matchedSkills,
      partiallyMatchedSkills,
      missingMandatorySkills,
      missingPreferredSkills,
      unverifiedRequirements,
      prerequisiteWarnings,
      isEligibleForPivot,
      scoreFormula,
      disclaimer,
      planningHoursEstimate: role.planningHoursEstimate || 80,
      typicalPivotTimeline: role.typicalPivotTimeline || '8–12 weeks',
      tags: role.tags || []
    };
  }

  /**
   * Compares 2 to 4 selected career roles against candidate profile.
   */
  compareSelectedRoles(
    roleSlugs: string[],
    candidateSkills: ExtractedSkillItem[],
    profileId?: string
  ): CareerComparisonResult {
    const rolesToCompare = roleSlugs
      .map((slug) => this.catalogue.find((r) => r.slug === slug || r.id === slug))
      .filter((r): r is CareerRole => r !== undefined);

    const evaluatedRoles = rolesToCompare.map((role) =>
      this.evaluateSingleRole(
        role,
        candidateSkills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED')
      )
    );

    // Identify shared transferable skills across all selected roles
    const allMatchedSkillNames = evaluatedRoles.map((r) =>
      new Set(r.matchedSkills.map((m) => m.skillName.toLowerCase()))
    );

    const sharedTransferableSkills: string[] = [];
    if (allMatchedSkillNames.length > 0) {
      const firstSet = allMatchedSkillNames[0];
      for (const skill of firstSet) {
        if (allMatchedSkillNames.every((set) => set.has(skill))) {
          // Find original casing
          const found = evaluatedRoles[0].matchedSkills.find(
            (m) => m.skillName.toLowerCase() === skill
          );
          if (found) sharedTransferableSkills.push(found.skillName);
        }
      }
    }

    const roleSpecificGaps: Record<string, string[]> = {};
    const effortEstimates: Record<string, { hours: number; rationale: string }> = {};
    const prerequisiteWarnings: Record<string, string[]> = {};

    for (const r of evaluatedRoles) {
      roleSpecificGaps[r.roleSlug] = [
        ...r.missingMandatorySkills.map((m) => `[Mandatory] ${m.skillName}`),
        ...r.missingPreferredSkills.map((p) => `[Preferred] ${p.skillName}`)
      ];

      effortEstimates[r.roleSlug] = {
        hours: r.planningHoursEstimate,
        rationale: `Estimated ${r.planningHoursEstimate} planning hours based on bridging ${r.missingMandatorySkills.length} mandatory and ${r.missingPreferredSkills.length} preferred gaps.`
      };

      prerequisiteWarnings[r.roleSlug] = r.prerequisiteWarnings;
    }

    return {
      profileId,
      roles: evaluatedRoles,
      sharedTransferableSkills,
      roleSpecificGaps,
      effortEstimates,
      prerequisiteWarnings
    };
  }

  /**
   * Helper: Matches candidate skill using code, exact name, or normalized sub-string match.
   */
  private findMatchingCandidateSkill(
    req: RoleCompetencyRequirement,
    confirmedSkills: ExtractedSkillItem[]
  ): ExtractedSkillItem | undefined {
    const reqCode = req.skillId.toLowerCase();
    const reqName = req.skillName.toLowerCase();

    return confirmedSkills.find((cand) => {
      const candCode = (cand.code || '').toLowerCase();
      const candName = (cand.name || '').toLowerCase();

      // Direct code match
      if (candCode && (candCode === reqCode || reqCode.includes(candCode))) {
        return true;
      }

      // Exact name match
      if (candName === reqName) {
        return true;
      }

      // Semantic sub-phrase matching with boundary safety
      if (candName.includes(reqName) || reqName.includes(candName)) {
        return true;
      }

      // Keyword synonym checks for common abbreviations
      if (reqName.includes('sql') && candName.includes('sql')) return true;
      if (reqName.includes('abap') && candName.includes('abap')) return true;
      if (reqName.includes('s/4hana') && candName.includes('s/4hana')) return true;
      if (reqName.includes('general ledger') && candName.includes('general ledger')) return true;
      if (reqName.includes('financial reporting') && candName.includes('financial reporting')) return true;
      if (reqName.includes('business process mapping') && candName.includes('business process')) return true;
      if (reqName.includes('rest api') && (candName.includes('rest') || candName.includes('api'))) return true;
      if (reqName.includes('docker') && candName.includes('docker')) return true;
      if (reqName.includes('agile') && (candName.includes('agile') || candName.includes('scrum'))) return true;

      return false;
    });
  }
}

export const careerMatcherService = new CareerMatcherService();
