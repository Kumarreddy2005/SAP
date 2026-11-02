import { Request, Response, NextFunction } from 'express';
import { ProfileReviewSubmissionSchema } from '@career-orchestrator/shared';
import { ResumeService } from './resume.service';
import { ProfileService } from './profile.service';
import { projectRepository } from '../projects/project.repository';

export class ResumeController {
  private resumeService = new ResumeService();
  private profileService = new ProfileService();

  uploadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          error: 'BadRequest',
          message: 'No resume document provided. Please provide a file using multipart form-data with the field name "file".'
        });
        return;
      }

      const response = await this.resumeService.processResumeUpload(
        req.file.buffer,
        req.file.originalname
      );

      res.status(200).json(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to process resume document.';
      
      // Known validation errors return 400
      if (
        message.includes('Unsupported file format') ||
        message.includes('File size') ||
        message.includes('Invalid PDF') ||
        message.includes('Invalid Word') ||
        message.includes('empty') ||
        message.includes('password')
      ) {
        res.status(400).json({
          error: 'ValidationError',
          message
        });
        return;
      }

      console.error('[ResumeController] Resume upload processing failed:', message);
      res.status(500).json({
        error: 'ParsingError',
        message: 'An unexpected error occurred while parsing the resume document.'
      });
    }
  };

  reviewProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileId = req.params.id;
      if (!profileId) {
        res.status(400).json({
          error: 'BadRequest',
          message: 'Profile identifier is required in route parameter.'
        });
        return;
      }

      const payload = {
        ...req.body,
        profileId
      };

      const parsed = ProfileReviewSubmissionSchema.safeParse(payload);
      if (!parsed.success) {
        res.status(400).json({
          error: 'ValidationError',
          message: 'Invalid profile review submission data.',
          issues: parsed.error.format()
        });
        return;
      }

      const response = await this.profileService.reviewProfile(profileId, parsed.data);
      if (!response) {
        res.status(404).json({
          error: 'NotFound',
          message: `Profile with ID "${profileId}" was not found or has expired.`
        });
        return;
      }

      res.status(200).json(response);
    } catch (err: unknown) {
      console.error('[ResumeController] Profile review failed:', err);
      next(err);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileId = req.params.id;
      const profile = await this.profileService.getProfile(profileId);

      if (!profile) {
        res.status(404).json({
          error: 'NotFound',
          message: `Profile with ID "${profileId}" was not found.`
        });
        return;
      }

      res.status(200).json(profile);
    } catch (err: unknown) {
      next(err);
    }
  };

  deleteProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileId = req.params.id;
      if (!profileId) {
        res.status(400).json({
          error: 'BadRequest',
          message: 'Profile identifier is required.'
        });
        return;
      }

      const existing = await this.profileService.getProfile(profileId);
      if (!existing) {
        const deletedSubmissions = await projectRepository.deleteSubmissionsByProfile(profileId);
        res.status(404).json({
          error: 'NotFound',
          success: false,
          profileId,
          message: `Candidate profile with ID "${profileId}" was not found or has already expired from in-memory session storage.`,
          deletedProfile: false,
          deletedSubmissionsCount: deletedSubmissions,
          storageType: 'IN_MEMORY_SESSION'
        });
        return;
      }

      const deleted = await this.profileService.deleteProfile(profileId);
      const deletedSubmissions = await projectRepository.deleteSubmissionsByProfile(profileId);

      res.status(200).json({
        success: true,
        profileId,
        deletedProfile: deleted,
        deletedSubmissionsCount: deletedSubmissions,
        storageType: 'IN_MEMORY_SESSION',
        message: 'Candidate session and associated project submissions successfully purged from in-memory development runtime.'
      });
    } catch (err: unknown) {
      console.error('[ResumeController] Profile deletion failed:', err);
      next(err);
    }
  };
}
