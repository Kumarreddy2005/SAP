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

export const SkillReviewInputSchema = z.object({
  skillId: z.string().min(1, 'Skill ID is required'),
  name: z.string().min(1, 'Skill name is required'),
  category: SkillCategoryEnum,
  proficiency: ProficiencyLevelEnum,
  yearsExperience: z.number().nonnegative('Years of experience must be non-negative'),
  isConfirmed: z.boolean(),
  isTransferable: z.boolean()
});

export const ProfileReviewSubmissionSchema = z.object({
  profileId: z.string().uuid('Profile ID must be a valid UUID'),
  reviewedSkills: z.array(SkillReviewInputSchema).min(1, 'At least one confirmed skill is required'),
  notes: z.string().optional()
});

export type ProfileReviewSubmission = z.infer<typeof ProfileReviewSubmissionSchema>;
