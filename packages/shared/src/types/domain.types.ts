/**
 * Domain types for Career Orchestrator
 */

export type SkillCategory =
  | 'SAP_FUNCTIONAL'
  | 'SAP_TECHNICAL'
  | 'SOFTWARE_DEV'
  | 'DATA_ANALYTICS'
  | 'DOMAIN_BUSINESS'
  | 'TRANSFERABLE_SOFT';

export type ProficiencyLevel =
  | 'NOVICE'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'EXPERT';

export type ExtractionMethod =
  | 'EXPLICIT_MENTION'
  | 'CONTEXTUAL_INFERENCE'
  | 'MANUAL_ENTRY';

export type SkillReviewStatus =
  | 'SUGGESTED'
  | 'CONFIRMED'
  | 'REJECTED';

export interface Skill {
  id: string;
  code: string;
  name: string;
  category: SkillCategory;
  description: string;
  isTransferable: boolean;
  synonyms?: string[];
}

export interface ExtractedSkillItem {
  id: string;
  code: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsExperience: number;
  isConfirmed: boolean;
  isTransferable: boolean;
  confidenceScore: number;
  extractionMethod: ExtractionMethod;
  evidenceSnippet?: string;
  reviewStatus: SkillReviewStatus;
}

export interface ResumeUploadResponse {
  profileId: string;
  filename: string;
  fileSizeBytes: number;
  extractedTextPreview: string;
  wordCount: number;
  suggestedSkills: ExtractedSkillItem[];
  warnings: string[];
  status: 'SUCCESS' | 'WARNING' | 'EMPTY_TEXT';
  processedAt: string;
}

export interface ProfileReviewResponse {
  profileId: string;
  status: 'CONFIRMED';
  confirmedSkillsCount: number;
  rejectedSkillsCount: number;
  confirmedSkills: ExtractedSkillItem[];
  updatedAt: string;
}

export type RoleTrack =
  | 'SAP_FUNCTIONAL_CONSULTANT'
  | 'SAP_TECHNICAL_DEVELOPER'
  | 'SAP_INTEGRATION_ARCHITECT'
  | 'ENTERPRISE_ANALYST'
  | 'HYBRID_CROSS_ERP';

export type CareerEcosystem = 'SAP' | 'HYBRID' | 'NON_SAP';

export type CareerFamily =
  | 'FUNCTIONAL_CONSULTING'
  | 'TECHNICAL_DEVELOPMENT'
  | 'INTEGRATION_ARCHITECTURE'
  | 'DATA_ANALYTICS'
  | 'ENTERPRISE_ANALYSIS'
  | 'CLOUD_PLATFORM'
  | 'QA_TESTING'
  | 'PROJECT_MANAGEMENT';

export interface RoleCompetencyRequirement {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  minimumLevel: ProficiencyLevel;
  weight: number;
  isMandatory: boolean;
  rationale?: string;
}

export interface VerifiedLearningResource {
  id: string;
  code: string;
  title: string;
  provider: 'SAP Learning Hub (Student Edition)' | 'openSAP' | 'Official SAP Documentation' | 'Verified Open Courseware';
  targetSkill: string;
  estimatedHours: number;
  externalUrl: string;
  isVerified: boolean;
  verificationDate: string;
  verificationSource: string;
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  syllabusPoints: string[];
}

export interface CareerRole {
  id: string;
  slug: string;
  title: string;
  track: RoleTrack;
  careerFamily: CareerFamily;
  ecosystem: CareerEcosystem;
  summary: string;
  marketDemand: 'High' | 'Critical' | 'Moderate';
  requiredSkills: RoleCompetencyRequirement[];
  preferredSkills?: RoleCompetencyRequirement[];
  prerequisites?: string[];
  suggestedLearningResourceIds?: string[];
  suggestedProjectIds?: string[];
  catalogueSource?: string;
  lastVerifiedDate?: string;
  planningHoursEstimate?: number;
  typicalPivotTimeline?: string;
  tags?: string[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  currentLevel?: ProficiencyLevel;
  requiredLevel: ProficiencyLevel;
  criticality: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedHoursToBridge: number;
}

export interface SkillMatch {
  careerRoleId: string;
  careerRoleTitle: string;
  track: RoleTrack;
  matchPercentage: number;
  matchedSkills: string[];
  transferableSkills: string[];
  skillGaps: SkillGapItem[];
  rationale: string;
}

export type RequirementMatchStatus =
  | 'FULL_MATCH'
  | 'PARTIAL_MATCH'
  | 'MISSING'
  | 'UNVERIFIED';

export interface RequirementMatchDetail {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  isMandatory: boolean;
  weight: number;
  requiredProficiency: ProficiencyLevel;
  candidateProficiency?: ProficiencyLevel;
  candidateYearsExperience?: number;
  matchFactor: number; // 0.0 to 1.0
  status: RequirementMatchStatus;
  evidenceSnippet?: string;
  explanation: string;
}

export interface CareerMatchResult {
  roleId: string;
  roleSlug: string;
  roleTitle: string;
  track: RoleTrack;
  careerFamily: CareerFamily;
  ecosystem: CareerEcosystem;
  summary: string;
  marketDemand: 'High' | 'Critical' | 'Moderate';
  overallScore: number; // 0 - 100
  mandatoryScore: number;
  preferredScore: number;
  totalWeight: number;
  matchedWeight: number;
  matchedSkills: RequirementMatchDetail[];
  partiallyMatchedSkills: RequirementMatchDetail[];
  missingMandatorySkills: RequirementMatchDetail[];
  missingPreferredSkills: RequirementMatchDetail[];
  unverifiedRequirements: RequirementMatchDetail[];
  prerequisiteWarnings: string[];
  isEligibleForPivot: boolean;
  scoreFormula: string;
  disclaimer: string;
  planningHoursEstimate: number;
  typicalPivotTimeline: string;
  tags: string[];
}

export interface CareerComparisonResult {
  profileId?: string;
  roles: CareerMatchResult[];
  sharedTransferableSkills: string[];
  roleSpecificGaps: Record<string, string[]>;
  effortEstimates: Record<string, { hours: number; rationale: string }>;
  prerequisiteWarnings: Record<string, string[]>;
}

export interface SkillGapAnalysis {
  role: CareerRole;
  candidateProfileId?: string;
  candidateName?: string;
  candidateTitle?: string;
  overallFitPercentage: number;
  confirmedMatches: RequirementMatchDetail[];
  partiallyMatched: RequirementMatchDetail[];
  mandatoryGaps: RequirementMatchDetail[];
  recommendedGaps: RequirementMatchDetail[];
  unverifiedRequirements: RequirementMatchDetail[];
  prerequisites: {
    requirement: string;
    isMet: boolean;
    guidance: string;
  }[];
  criticalitySummary: {
    mandatoryGapCount: number;
    recommendedGapCount: number;
    estimatedBridgeHours: number;
  };
  recommendedResources?: VerifiedLearningResource[];
  recommendedProjects?: PracticalProjectDefinition[];
  totalEstimatedBridgeHours?: number;
  calculatedAt?: string;
  disclaimer: string;
}

export interface PracticalProjectDefinition {
  id: string;
  title: string;
  roleSlug: string;
  difficulty: ProficiencyLevel;
  estimatedEffortHours: number;
  targetSkills: string[];
  description: string;
  deliverables: string[];
  rubricCriteria: { criterion: string; weightPercentage: number }[];
}

export interface LearningPathwayMilestone {
  milestoneId: string;
  stepNumber: number;
  title: string;
  objective: string;
  skillsAddressed: string[];
  isEssential: boolean;
  prerequisiteMilestoneIds: string[];
  resources: VerifiedLearningResource[];
  practicalProject?: PracticalProjectDefinition;
  completionCriteria: string;
  estimatedHours: number;
}

export interface LearningPathway {
  pathwayId: string;
  roleId: string;
  roleSlug: string;
  roleTitle: string;
  profileId: string;
  totalMilestones: number;
  totalEstimatedHours: number;
  sequencingRationale: string;
  milestones: LearningPathwayMilestone[];
  generatedAt: string;
  disclaimer: string;
}
