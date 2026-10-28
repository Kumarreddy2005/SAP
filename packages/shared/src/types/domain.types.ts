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

export interface Skill {
  id: string;
  code: string;
  name: string;
  category: SkillCategory;
  description: string;
  isTransferable: boolean;
  synonyms?: string[];
}

export type RoleTrack =
  | 'SAP_FUNCTIONAL_CONSULTANT'
  | 'SAP_TECHNICAL_DEVELOPER'
  | 'SAP_INTEGRATION_ARCHITECT'
  | 'ENTERPRISE_ANALYST'
  | 'HYBRID_CROSS_ERP';

export interface RoleCompetencyRequirement {
  skillId: string;
  skillName: string;
  category: SkillCategory;
  minimumLevel: ProficiencyLevel;
  weight: number;
  isMandatory: boolean;
}

export interface CareerRole {
  id: string;
  slug: string;
  title: string;
  track: RoleTrack;
  summary: string;
  marketDemand: 'High' | 'Critical' | 'Moderate';
  requiredSkills: RoleCompetencyRequirement[];
  prerequisites?: string[];
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
