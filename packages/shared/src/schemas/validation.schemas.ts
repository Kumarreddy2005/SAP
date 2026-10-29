import { z } from 'zod';

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  application: z.string(),
  environment: z.string(),
  timestamp: z.string()
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const SkillCategoryEnum = z.enum([
  'SAP_FUNCTIONAL',
  'SAP_TECHNICAL',
  'SOFTWARE_DEV',
  'DATA_ANALYTICS',
  'DOMAIN_BUSINESS',
  'TRANSFERABLE_SOFT'
]);

export const ProficiencyLevelEnum = z.enum([
  'NOVICE',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
]);

export const ExtractionMethodEnum = z.enum([
  'EXPLICIT_MENTION',
  'CONTEXTUAL_INFERENCE',
  'MANUAL_ENTRY'
]);

export const SkillReviewStatusEnum = z.enum([
  'SUGGESTED',
  'CONFIRMED',
  'REJECTED'
]);

export const SkillReviewInputSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  name: z.string().min(1, 'Skill name is required'),
  category: SkillCategoryEnum,
  proficiency: ProficiencyLevelEnum,
  yearsExperience: z.number().nonnegative('Years of experience must be non-negative'),
  isConfirmed: z.boolean(),
  isTransferable: z.boolean(),
  evidenceSnippet: z.string().optional(),
  extractionMethod: ExtractionMethodEnum.optional(),
  reviewStatus: SkillReviewStatusEnum.optional()
});

export type SkillReviewInput = z.infer<typeof SkillReviewInputSchema>;

export const ProfileReviewSubmissionSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
  fullName: z.string().optional(),
  currentTitle: z.string().optional(),
  yearsExperience: z.number().nonnegative().optional(),
  reviewedSkills: z.array(SkillReviewInputSchema),
  notes: z.string().optional()
});

export type ProfileReviewSubmission = z.infer<typeof ProfileReviewSubmissionSchema>;

export const CareerCompareRequestSchema = z.object({
  profileId: z.string().optional(),
  roleSlugs: z
    .array(z.string().min(1, 'Role slug cannot be empty'))
    .min(2, 'At least two roles must be selected for comparison')
    .max(4, 'A maximum of 4 roles may be compared simultaneously')
});

export type CareerCompareRequest = z.infer<typeof CareerCompareRequestSchema>;

export const PathwayGenerationRequestSchema = z.object({
  profileId: z.string().min(1, 'Profile ID is required'),
  roleSlug: z.string().min(1, 'Role slug or identifier is required')
});

export type PathwayGenerationRequest = z.infer<typeof PathwayGenerationRequestSchema>;

export const CareerFilterQuerySchema = z.object({
  search: z.string().optional(),
  ecosystem: z.enum(['ALL', 'SAP', 'HYBRID', 'NON_SAP']).optional().default('ALL'),
  family: z.string().optional(),
  track: z.string().optional(),
  sortBy: z.enum(['match', 'title', 'effort', 'demand']).optional().default('match'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  page: z.coerce.number().min(1).optional().default(1)
});

export type CareerFilterQuery = z.infer<typeof CareerFilterQuerySchema>;
