import { Request, Response, NextFunction } from 'express';
import { readinessService, ReadinessService } from './readiness.service';

export class ReadinessController {
  constructor(private service: ReadinessService = readinessService) {}

  /**
   * GET /api/v1/readiness/:profileId/:roleId
   */
  getReadinessScorecard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { profileId, roleId } = req.params;
      const { completedMilestones } = req.query;

      let milestoneIds: string[] = [];
      if (typeof completedMilestones === 'string') {
        milestoneIds = completedMilestones.split(',').filter(Boolean);
      } else if (Array.isArray(completedMilestones)) {
        milestoneIds = completedMilestones.map(String).filter(Boolean);
      }

      const scorecard = await this.service.computeReadinessScorecard(
        profileId,
        roleId,
        milestoneIds
      );

      if (!scorecard) {
        res.status(404).json({
          error: 'NotFound',
          message: `Readiness scorecard could not be generated for profile '${profileId}' and role '${roleId}'. Ensure both profile and career role exist.`
        });
        return;
      }

      res.status(200).json(scorecard);
    } catch (err: unknown) {
      next(err);
    }
  };
}

export const readinessController = new ReadinessController();
