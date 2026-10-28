import { ExtractedSkillItem } from '@career-orchestrator/shared';

export interface SkillExtractionResult {
  skills: ExtractedSkillItem[];
  detectedCategories: string[];
  extractionSummary: string;
}

export interface SkillExtractor {
  extractSkills(text: string): Promise<SkillExtractionResult>;
}
