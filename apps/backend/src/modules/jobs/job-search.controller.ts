import { Request, Response, NextFunction } from 'express';
import { jobSearchService, JobSearchService } from './job-search.service';

export class JobSearchController {
  constructor(private service: JobSearchService = jobSearchService) {}

  /**
   * GET /api/v1/jobs/search-links/:roleId
   */
  getSearchLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { roleId } = req.params;
      const { location, keywords } = req.query;

      const result = this.service.generateSearchDestinations(roleId, {
        location: typeof location === 'string' ? location : undefined,
        keywords: typeof keywords === 'string' ? keywords : undefined
      });

      if (!result) {
        res.status(404).json({
          error: 'NotFound',
          message: `Career role '${roleId}' was not found in catalogue.`
        });
        return;
      }

      res.status(200).json(result);
    } catch (err: unknown) {
      next(err);
    }
  };
}

export const jobSearchController = new JobSearchController();
