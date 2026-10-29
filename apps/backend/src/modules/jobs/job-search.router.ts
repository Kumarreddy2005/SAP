import { Router } from 'express';
import { jobSearchController } from './job-search.controller';

export const jobRouter = Router();

jobRouter.get('/search-links/:roleId', jobSearchController.getSearchLinks);
