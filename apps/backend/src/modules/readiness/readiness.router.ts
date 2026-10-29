import { Router } from 'express';
import { readinessController } from './readiness.controller';

export const readinessRouter = Router();

readinessRouter.get('/:profileId/:roleId', readinessController.getReadinessScorecard);
