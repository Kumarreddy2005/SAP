import { Request, Response, NextFunction } from 'express';
import {
  CareerCompareRequestSchema,
  PathwayGenerationRequestSchema,
  CareerFilterQuerySchema,
  ExtractedSkillItem
} from '@career-orchestrator/shared';
import { getAllCareerRoles, getRoleByIdOrSlug } from './career.catalogue';
import { VERIFIED_LEARNING_RESOURCES } from './learning-resource.catalogue';
import { careerMatcherService } from '../matching/career-matcher.service';
import { skillGapService } from '../gap-analysis/skill-gap.service';
import { pathwayService } from '../pathway/pathway.service';
import { profileRepository, ProfileRepository } from '../resume/profile.repository';

export class CareerController {
  constructor(private repo: ProfileRepository = profileRepository) {}

  /**
   * GET /api/v1/careers
   * List all careers with search, ecosystem filter, family filter, and pagination.
   */
  listCareers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = CareerFilterQuerySchema.safeParse(req.query);
      const query = parsed.success
        ? parsed.data
        : {
            search: undefined,
            family: undefined,
            track: undefined,
            ecosystem: 'ALL' as const,
            limit: 50,
            page: 1,
            sortBy: 'title' as const,
            sortOrder: 'asc' as const
          };

      let roles = getAllCareerRoles();

      // Search filter
      if (query.search && query.search.trim()) {
        const s = query.search.toLowerCase().trim();
        roles = roles.filter(
          (r) =>
            r.title.toLowerCase().includes(s) ||
            r.summary.toLowerCase().includes(s) ||
            (r.tags && r.tags.some((t) => t.toLowerCase().includes(s))) ||
            r.requiredSkills.some((req) => req.skillName.toLowerCase().includes(s))
        );
      }

      // Ecosystem filter
      if (query.ecosystem && query.ecosystem !== 'ALL') {
        roles = roles.filter((r) => r.ecosystem === query.ecosystem);
      }

      // Career family filter
      if (query.family && query.family !== 'ALL') {
        roles = roles.filter((r) => r.careerFamily === query.family);
      }

      // Specialization track filter
      if (query.track && query.track !== 'ALL') {
        roles = roles.filter((r) => r.track === query.track);
      }

      const total = roles.length;
      const page = query.page || 1;
      const limit = query.limit || 50;
      const startIndex = (page - 1) * limit;
      const paginated = roles.slice(startIndex, startIndex + limit);

      res.status(200).json({
        total,
        page,
        limit,
        roles: paginated
      });
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * GET /api/v1/careers/:idOrSlug
   * Get single career role details.
   */
  getCareer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idOrSlug } = req.params;
      const role = getRoleByIdOrSlug(idOrSlug);

      if (!role) {
        res.status(404).json({
          error: 'NotFound',
          message: `Career role with identifier '${idOrSlug}' was not found in the catalogue.`
        });
        return;
      }

      res.status(200).json(role);
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * GET /api/v1/careers/matches/:profileId
   * Calculates explainable career matches across the entire catalogue for a reviewed candidate profile.
   */
  calculateMatchesForProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { profileId } = req.params;
      const profile = await this.repo.getProfileById(profileId);

      if (!profile) {
        res.status(404).json({
          error: 'NotFound',
          message: `Candidate profile '${profileId}' was not found or session has expired. Please upload or review your profile first.`
        });
        return;
      }

      if (!profile.isReviewed) {
        res.status(400).json({
          error: 'UnreviewedProfile',
          message: 'Profile has not been reviewed yet. Human verification is required before career matching can be calculated.'
        });
        return;
      }

      const confirmedSkills = profile.confirmedSkills || [];
      const matches = careerMatcherService.evaluateCandidateAgainstAllCareers(confirmedSkills);

      res.status(200).json({
        profileId,
        isDemoProfile: profileId === 'demo-profile',
        candidateName: profile.fullName || 'Candidate',
        currentTitle: profile.currentTitle || 'Professional',
        confirmedSkillsCount: confirmedSkills.length,
        totalCareersEvaluated: matches.length,
        matches,
        evaluatedAt: new Date().toISOString()
      });
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * POST /api/v1/careers/compare
   * Compares 2 to 4 selected career roles side-by-side with transferable skills and gap deltas.
   */
  compareCareers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = CareerCompareRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid comparison parameters.',
          issues: parsed.error.format()
        });
        return;
      }

      const { roleSlugs, profileId } = parsed.data;
      let candidateSkills: ExtractedSkillItem[] = [];

      if (profileId && profileId !== 'demo-profile') {
        const profile = await this.repo.getProfileById(profileId);
        if (!profile) {
          res.status(404).json({
            error: 'NotFound',
            message: `Profile '${profileId}' was not found.`
          });
          return;
        }

        if (!profile.isReviewed) {
          res.status(400).json({
            error: 'UnreviewedProfile',
            message: 'Profile has not been reviewed yet. Human verification is required before career comparison can be calculated.'
          });
          return;
        }

        candidateSkills = profile.confirmedSkills || [];
      }

      const result = careerMatcherService.compareSelectedRoles(roleSlugs, candidateSkills, profileId);
      res.status(200).json({
        ...result,
        isDemoProfile: profileId === 'demo-profile' || !profileId
      });
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * GET /api/v1/careers/:idOrSlug/gaps/:profileId
   * Analyzes target role requirements and breaks down exact gaps for a candidate.
   */
  getSkillGaps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { idOrSlug, profileId } = req.params;
      const role = getRoleByIdOrSlug(idOrSlug);

      if (!role) {
        res.status(404).json({
          error: 'NotFound',
          message: `Career role '${idOrSlug}' does not exist.`
        });
        return;
      }

      const profile = await this.repo.getProfileById(profileId);
      if (!profile) {
        res.status(404).json({
          error: 'NotFound',
          message: `Profile '${profileId}' was not found.`
        });
        return;
      }

      if (!profile.isReviewed) {
        res.status(400).json({
          error: 'UnreviewedProfile',
          message: 'Profile has not been reviewed yet. Human verification is required before skill gaps can be calculated.'
        });
        return;
      }

      const gapAnalysis = skillGapService.analyzeSkillGaps(idOrSlug, profile.confirmedSkills || [], {
        profileId,
        fullName: profile.fullName,
        currentTitle: profile.currentTitle
      });

      if (!gapAnalysis) {
        res.status(404).json({
          error: 'NotFound',
          message: `Failed to analyze gaps for role '${idOrSlug}'.`
        });
        return;
      }

      res.status(200).json({
        ...gapAnalysis,
        isDemoProfile: profileId === 'demo-profile'
      });
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * POST /api/v1/learning-pathways
   * Generates a sequenced, personalized learning pathway bridging actual candidate skill gaps.
   */
  generatePathway = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = PathwayGenerationRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid pathway request parameters.',
          issues: parsed.error.format()
        });
        return;
      }

      const { profileId, roleSlug } = parsed.data;
      const profile = await this.repo.getProfileById(profileId);

      if (!profile) {
        res.status(404).json({
          error: 'NotFound',
          message: `Profile '${profileId}' was not found. Please upload or review your resume.`
        });
        return;
      }

      if (!profile.isReviewed) {
        res.status(400).json({
          error: 'UnreviewedProfile',
          message: 'Profile has not been reviewed yet. Human verification is required before a personalized pathway can be generated.'
        });
        return;
      }

      const pathway = pathwayService.generatePathway(
        roleSlug,
        profile.confirmedSkills || [],
        profileId
      );

      if (!pathway) {
        res.status(404).json({
          error: 'NotFound',
          message: `Career role with identifier '${roleSlug}' was not found.`
        });
        return;
      }

      res.status(200).json(pathway);
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * GET /api/v1/learning-resources
   * Returns list of verified learning resources with official URLs and metadata.
   */
  listLearningResources = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.status(200).json({
        total: VERIFIED_LEARNING_RESOURCES.length,
        resources: VERIFIED_LEARNING_RESOURCES
      });
    } catch (err: unknown) {
      next(err);
    }
  };
}
