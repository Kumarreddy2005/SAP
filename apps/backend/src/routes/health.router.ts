import { Router, Request, Response } from 'express';
import { HealthResponse } from '@career-orchestrator/shared';
import { env } from '../config/env.config';

export const healthRouter = Router();

healthRouter.get('/', (req: Request, res: Response<HealthResponse>) => {
  const response: HealthResponse = {
    status: 'ok',
    application: 'Career Orchestrator',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
});
