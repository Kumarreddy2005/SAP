import { Router } from 'express';
import multer from 'multer';
import { ResumeController } from './resume.controller';

export const resumeRouter = Router();
const controller = new ResumeController();

// Multer memory storage configuration with 10MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

// POST /api/v1/resume/upload
resumeRouter.post('/upload', upload.single('file'), controller.uploadResume);

export const profileRouter = Router();

// PUT /api/v1/profile/:id/review
profileRouter.put('/:id/review', controller.reviewProfile);

// GET /api/v1/profile/:id
profileRouter.get('/:id', controller.getProfile);

// DELETE /api/v1/profile/:id
profileRouter.delete('/:id', controller.deleteProfile);
