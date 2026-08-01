import type { FastifyInstance } from 'fastify';

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
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async (): Promise<HealthResponse> => ({
    status: 'ok',
    time: new Date().toISOString(),
  }));
}
