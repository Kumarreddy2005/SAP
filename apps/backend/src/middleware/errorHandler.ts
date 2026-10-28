import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Handle validation errors from Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Request payload validation failed',
      issues: err.errors
    });
    return;
  }

  // Handle generic errors safely without leaking internal system state
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.url}:`, err);

  res.status(500).json({
    error: 'InternalServerError',
    message: isDevelopment ? errorMessage : 'An unexpected error occurred. Please try again later.'
  });
}
