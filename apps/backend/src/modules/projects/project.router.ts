import { Router } from 'express';
import { projectController } from './project.controller';

export const projectRouter = Router();

// Submissions by profile must precede param wildcard
projectRouter.get('/submissions/:profileId', projectController.getSubmissionsForProfile);
projectRouter.put('/submissions/:submissionId/review', projectController.reviewSubmission);

// Project discovery and details
projectRouter.get('/', projectController.listProjects);
projectRouter.get('/:projectId', projectController.getProject);
projectRouter.post('/:projectId/start', projectController.startProject);
projectRouter.post('/:projectId/submissions', projectController.submitDeliverables);
