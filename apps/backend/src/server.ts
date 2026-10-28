import { app } from './app';
import { env } from './config/env.config';

const server = app.listen(env.PORT, () => {
  console.log(`[Backend] Career Orchestrator API running on http://localhost:${env.PORT}`);
  console.log(`[Backend] Health check available at http://localhost:${env.PORT}/api/v1/health`);
  console.log(`[Backend] Environment: ${env.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  console.log('[Backend] SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('[Backend] HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('[Backend] SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('[Backend] HTTP server closed');
  });
});
