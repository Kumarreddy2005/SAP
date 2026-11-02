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

export const ProjectLifecycleStateEnum = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'SUBMITTED',
  'NEEDS_REVISION',
  'REVIEWED',
  'COMPLETED'
]);

export const RubricScoreItemSchema = z.object({
  criterion: z.string().min(1, 'Criterion name is required'),
  weightPercentage: z.number().min(1).max(100),
  awardedScore: z.number().min(0).max(100).optional(),
  feedback: z.string().optional(),
  isSatisfied: z.boolean().optional()
});

export const ProjectSubmissionInputSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  profileId: z.string().min(1, 'Profile ID is required'),
  repositoryUrl: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
      message: 'Repository URL must be a valid http:// or https:// URL'
    })
    .optional(),
  liveDemoUrl: z
    .string()
    .trim()
    .refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
      message: 'Live demo URL must be a valid http:// or https:// URL'
    })
    .optional(),
  projectExplanation: z
    .string()
    .min(10, 'Project explanation must be at least 10 characters detailing what you built'),
  challengesEncountered: z.string().optional(),
  skillsDemonstrated: z.array(z.string()).min(1, 'Select at least one skill demonstrated in this project'),
  learningReflection: z
    .string()
    .min(10, 'Learning reflection must be at least 10 characters detailing key takeaways'),
  supportingEvidenceUrls: z
    .array(
      z
        .string()
        .trim()
        .refine((val) => /^https?:\/\/.+/.test(val), {
          message: 'Evidence links must be valid http:// or https:// URLs'
        })
    )
    .optional(),
  alternativeEvidenceDescription: z.string().optional(),
  rubricAssessments: z.array(RubricScoreItemSchema).optional()
});

export type ProjectSubmissionInput = z.infer<typeof ProjectSubmissionInputSchema>;

export const ProjectReviewInputSchema = z.object({
  submissionId: z.string().min(1, 'Submission ID is required'),
  reviewerProfileId: z.string().optional(),
  status: z.enum(['IN_PROGRESS', 'SUBMITTED', 'NEEDS_REVISION', 'REVIEWED', 'COMPLETED']),
  reviewerType: z.enum(['SELF_ASSESSMENT', 'INDEPENDENT_REVIEWER']),
  rubricAssessments: z.array(RubricScoreItemSchema).min(1, 'Assessment must grade against rubric criteria'),
  reviewerFeedback: z.string().min(5, 'Reviewer feedback must be at least 5 characters')
});

export type ProjectReviewInput = z.infer<typeof ProjectReviewInputSchema>;

export const ProjectStartSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  profileId: z.string().min(1, 'Profile ID is required')
});

export type ProjectStartInput = z.infer<typeof ProjectStartSchema>;

export const JobSearchQuerySchema = z.object({
  location: z.string().optional().default('Remote'),
  keywords: z.string().optional()
});

export type JobSearchQuery = z.infer<typeof JobSearchQuerySchema>;
