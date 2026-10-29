import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env.config';
import { healthRouter } from './routes/health.router';
import { resumeRouter, profileRouter } from './modules/resume/resume.router';
import { careerRouter, pathwayRouter, learningRouter } from './modules/career/career.router';
import { projectRouter } from './modules/projects/project.router';
import { readinessRouter } from './modules/readiness/readiness.router';
import { jobRouter } from './modules/jobs/job-search.router';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

// Configure CORS for local frontend origin
app.use(
  cors({
    origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true
  })
);

app.use(express.json());

// API Routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/resume', resumeRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/careers', careerRouter);
app.use('/api/v1/learning-pathways', pathwayRouter);
app.use('/api/v1/learning-resources', learningRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/readiness', readinessRouter);
app.use('/api/v1/jobs', jobRouter);

// Root route for sanity check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Career Orchestrator API Gateway is operational.',
    healthEndpoint: '/api/v1/health'
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Central error handler
app.use(errorHandler);
