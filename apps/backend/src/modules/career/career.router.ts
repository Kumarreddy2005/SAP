import { Router } from 'express';
import { CareerController } from './career.controller';

export const careerRouter = Router();
export const pathwayRouter = Router();
export const learningRouter = Router();

const controller = new CareerController();

// 1. Specific routes first (to prevent :idOrSlug capturing)
careerRouter.get('/matches/:profileId', controller.calculateMatchesForProfile);
careerRouter.post('/compare', controller.compareCareers);
careerRouter.get('/:idOrSlug/gaps/:profileId', controller.getSkillGaps);

// 2. Collection & Entity routes
careerRouter.get('/', controller.listCareers);
careerRouter.get('/:idOrSlug', controller.getCareer);

// 3. Learning pathways and resources
pathwayRouter.post('/', controller.generatePathway);
learningRouter.get('/', controller.listLearningResources);
