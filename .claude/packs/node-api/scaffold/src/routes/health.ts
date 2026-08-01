import type { FastifyPluginCallback } from 'fastify';

/** Health check response body. */
interface HealthResponse {
  status: 'ok';
  time: string;
}

/**
 * Plugin with the API's health route — consumed by the orchestrator and
 * monitoring. When there are critical dependencies (database, queue),
 * verify them here before answering "ok" (PACK.md, "Process lifecycle").
 *
 * Reference example for the routes layer: a route validates and delegates
 * to src/services/, it never contains business logic or data access.
 */
export const healthRoutes: FastifyPluginCallback = (app, _opts, done) => {
  app.get('/health', (): HealthResponse => ({
    status: 'ok',
    time: new Date().toISOString(),
  }));
  done();
};
