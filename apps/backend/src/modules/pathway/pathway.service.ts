import {
  LearningPathway,
  LearningPathwayMilestone,
  ExtractedSkillItem
} from '@career-orchestrator/shared';
import { skillGapService } from '../gap-analysis/skill-gap.service';
import { getRoleByIdOrSlug } from '../career/career.catalogue';
import { getVerifiedResourcesForSkill } from '../career/learning-resource.catalogue';
import { getProjectsForRole } from '../career/practical-projects.catalogue';

export class PathwayService {
  /**
   * Generates an ordered, personalized learning pathway dynamically derived from
   * the exact skill gaps between the candidate's confirmed profile and target role.
   */
  generatePathway(
    roleSlug: string,
    candidateSkills: ExtractedSkillItem[],
    profileId: string
  ): LearningPathway | null {
    const role = getRoleByIdOrSlug(roleSlug);
    if (!role) {
      return null;
    }

    const gapAnalysis = skillGapService.analyzeSkillGaps(roleSlug, candidateSkills, {
      profileId
    });

    if (!gapAnalysis) {
      return null;
    }

    const confirmedNames = candidateSkills
      .filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED')
      .map((s) => s.name.toLowerCase());

    const availableProjects = getProjectsForRole(role.slug);
    const milestones: LearningPathwayMilestone[] = [];
    let stepNumber = 1;

    // Track completed milestone IDs for dependency sequencing
    const milestoneIdMap: Record<string, string> = {};

    // 1. Process Mandatory Gaps (Essential Foundation & Customizing)
    for (const gap of gapAnalysis.mandatoryGaps) {
      const skillName = gap.skillName;
      const lowerName = skillName.toLowerCase();
      const resources = getVerifiedResourcesForSkill(skillName);

      // Check if candidate already has foundational knowledge
      const alreadyHasFoundation = confirmedNames.some(
        (c) => c.includes(lowerName) || lowerName.includes(c)
      );

      // Map a practical project matching this skill
      const mappedProject = availableProjects.find((p) =>
        p.targetSkills.some(
          (ts) => ts.toLowerCase().includes(lowerName) || lowerName.includes(ts.toLowerCase())
        )
      );

      const milestoneId = `ms-${role.slug}-${stepNumber}`;
      milestoneIdMap[skillName] = milestoneId;

      // Determine prerequisite milestones
      const prereqs: string[] = [];
      if (lowerName.includes('customizing') && milestoneIdMap['General Ledger Accounting']) {
        prereqs.push(milestoneIdMap['General Ledger Accounting']);
      }

      const objective = alreadyHasFoundation
        ? `Accelerate from current knowledge to advanced enterprise application of ${skillName}.`
        : `Bridge core mandatory competency gap: Acquire verified proficiency in ${skillName}.`;

      const completionCriteria = mappedProject
        ? `Complete recommended modules (${resources.map((r) => r.code).join(', ')}) and submit the '${mappedProject.title}' project deliverable.`
        : `Complete study of ${skillName} curriculum modules and pass self-assessment quizzes.`;

      const totalHours = resources.reduce((acc, r) => acc + r.estimatedHours, 0) || 25;

      milestones.push({
        milestoneId,
        stepNumber: stepNumber++,
        title: `Core Competency: ${skillName}`,
        objective,
        skillsAddressed: [skillName],
        isEssential: true,
        prerequisiteMilestoneIds: prereqs,
        resources,
        practicalProject: mappedProject,
        completionCriteria,
        estimatedHours: totalHours
      });
    }

    // 2. Process Partially Matched Competencies (Calibration to Target Level)
    for (const partial of gapAnalysis.partiallyMatched) {
      const skillName = partial.skillName;
      const resources = getVerifiedResourcesForSkill(skillName);
      const milestoneId = `ms-${role.slug}-${stepNumber}`;

      milestones.push({
        milestoneId,
        stepNumber: stepNumber++,
        title: `Proficiency Calibration: ${skillName}`,
        objective: `Calibrate existing ${partial.candidateProficiency || 'Novice'} competency up to the required ${partial.requiredProficiency} enterprise standard.`,
        skillsAddressed: [skillName],
        isEssential: partial.isMandatory,
        prerequisiteMilestoneIds: [],
        resources,
        completionCriteria: `Demonstrate ${partial.requiredProficiency} level proficiency through practical scenario exercise or assessment.`,
        estimatedHours: Math.round(
          (resources.reduce((acc, r) => acc + r.estimatedHours, 0) || 20) * 0.5
        )
      });
    }

    // 3. Process Recommended / Preferred Gaps (Enhancements & Methodologies)
    for (const pref of gapAnalysis.recommendedGaps) {
      const skillName = pref.skillName;
      const resources = getVerifiedResourcesForSkill(skillName);
      const milestoneId = `ms-${role.slug}-${stepNumber}`;

      milestones.push({
        milestoneId,
        stepNumber: stepNumber++,
        title: `Elective Specialization: ${skillName}`,
        objective: `Expand career competitiveness by mastering preferred competency: ${skillName}.`,
        skillsAddressed: [skillName],
        isEssential: false,
        prerequisiteMilestoneIds: [],
        resources,
        completionCriteria: `Review recommended learning materials for ${skillName} and integrate into portfolio.`,
        estimatedHours: resources.reduce((acc, r) => acc + r.estimatedHours, 0) || 15
      });
    }

    // If candidate has zero gaps (100% fit), create a Capstone Mastery Milestone
    if (milestones.length === 0) {
      const capstoneProj = availableProjects[0];
      milestones.push({
        milestoneId: `ms-${role.slug}-capstone`,
        stepNumber: 1,
        title: `Comprehensive Capstone & Certification Validation`,
        objective: `All core competencies are verified in your profile. Solidify full professional readiness by completing an end-to-end integration capstone.`,
        skillsAddressed: role.requiredSkills.map((r) => r.skillName),
        isEssential: true,
        prerequisiteMilestoneIds: [],
        resources: [],
        practicalProject: capstoneProj,
        completionCriteria: `Execute the full scenario capstone deliverable and conduct mock certification practice.`,
        estimatedHours: 20
      });
    }

    // Dependency sorting: ensure prerequisites appear before the milestones that depend on them
    const sortedMilestones = this.topologicalSortMilestones(milestones);

    const totalEstimatedHours = sortedMilestones.reduce(
      (acc, m) => acc + m.estimatedHours,
      0
    );

    const sequencingRationale =
      'Milestones are prioritized sequentially: mandatory domain processes precede configuration customizing; core development precedes integration flows; essential gaps are ordered ahead of elective enhancements.';

    return {
      pathwayId: `pathway-${role.slug}-${Date.now().toString().slice(-6)}`,
      roleId: role.id,
      roleSlug: role.slug,
      roleTitle: role.title,
      profileId,
      totalMilestones: sortedMilestones.length,
      totalEstimatedHours,
      sequencingRationale,
      milestones: sortedMilestones,
      generatedAt: new Date().toISOString(),
      disclaimer:
        'This personalized learning pathway is dynamically constructed to address your confirmed skill deltas. Self-directed study timelines are planning estimates.'
    };
  }

  /**
   * Sorts milestones so that any milestone with prerequisites appears after its dependencies.
   */
  private topologicalSortMilestones(
    milestones: LearningPathwayMilestone[]
  ): LearningPathwayMilestone[] {
    const result: LearningPathwayMilestone[] = [];
    const visited = new Set<string>();

    const visit = (m: LearningPathwayMilestone) => {
      if (visited.has(m.milestoneId)) return;

      // Visit prerequisites first
      for (const prereqId of m.prerequisiteMilestoneIds) {
        const prereqMilestone = milestones.find((x) => x.milestoneId === prereqId);
        if (prereqMilestone && !visited.has(prereqId)) {
          visit(prereqMilestone);
        }
      }

      visited.add(m.milestoneId);
      result.push(m);
    };

    for (const m of milestones) {
      visit(m);
    }

    // Re-index step numbers
    return result.map((m, idx) => ({ ...m, stepNumber: idx + 1 }));
  }
}

export const pathwayService = new PathwayService();
