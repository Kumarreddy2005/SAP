import { Request, Response, NextFunction } from 'express';
import {
  ProjectSubmissionInputSchema,
  ProjectReviewInputSchema,
  ProjectStartSchema
} from '@career-orchestrator/shared';
import { projectService, ProjectService } from './project.service';

export class ProjectController {
  constructor(private service: ProjectService = projectService) {}

  /**
   * GET /api/v1/projects
   */
  listProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { roleSlug, search, difficulty, skill } = req.query;
      const projects = this.service.listProjects({
        roleSlug: typeof roleSlug === 'string' ? roleSlug : undefined,
        search: typeof search === 'string' ? search : undefined,
        difficulty: typeof difficulty === 'string' ? difficulty : undefined,
        skill: typeof skill === 'string' ? skill : undefined
      });

      res.status(200).json({
        total: projects.length,
        projects
      });
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * GET /api/v1/projects/:projectId
   */
  getProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const project = this.service.getProject(projectId);

      if (!project) {
        res.status(404).json({
          error: 'NotFound',
          message: `Practical project '${projectId}' was not found in catalogue.`
        });
        return;
      }

      res.status(200).json(project);
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * POST /api/v1/projects/:projectId/start
   */
  startProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const parsed = ProjectStartSchema.safeParse({ ...req.body, projectId });

      if (!parsed.success) {
        res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid project start payload.',
          issues: parsed.error.format()
        });
        return;
      }

      const submission = await this.service.startProject(projectId, parsed.data.profileId);
      if (!submission) {
        res.status(404).json({
          error: 'NotFound',
          message: `Practical project '${projectId}' was not found.`
        });
        return;
      }

      res.status(200).json(submission);
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * POST /api/v1/projects/:projectId/submissions
   */
  submitDeliverables = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { projectId } = req.params;
      const parsed = ProjectSubmissionInputSchema.safeParse({ ...req.body, projectId });

      if (!parsed.success) {
        res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid project submission data.',
          issues: parsed.error.format()
        });
        return;
      }

      const submission = await this.service.submitProject(parsed.data);
      if (!submission) {
        res.status(404).json({
          error: 'NotFound',
          message: `Practical project '${projectId}' was not found.`
        });
        return;
      }

      res.status(201).json(submission);
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * GET /api/v1/projects/submissions/:profileId
   */
  getSubmissionsForProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { profileId } = req.params;
      const submissions = await this.service.getSubmissionsByProfile(profileId);

      res.status(200).json({
        profileId,
        total: submissions.length,
        submissions
      });
    } catch (err: unknown) {
      next(err);
    }
  };

  /**
   * PUT /api/v1/projects/submissions/:submissionId/review
   */
  reviewSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { submissionId } = req.params;
      const parsed = ProjectReviewInputSchema.safeParse({ ...req.body, submissionId });

      if (!parsed.success) {
        res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid project review payload.',
          issues: parsed.error.format()
        });
        return;
      }

      const updated = await this.service.reviewProject(parsed.data);
      if (!updated) {
        res.status(404).json({
          error: 'NotFound',
          message: `Submission with ID '${submissionId}' was not found.`
        });
        return;
      }

      res.status(200).json(updated);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('Cannot review project deliverables')) {
        res.status(400).json({
          error: 'InvalidLifecycleTransition',
          message: err.message
        });
        return;
      }
      next(err);
    }
  };
}

export const projectController = new ProjectController();
