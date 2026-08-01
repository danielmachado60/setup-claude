import { pathToFileURL } from 'node:url';
import Fastify, { type FastifyInstance } from 'fastify';
import { healthRoutes } from './routes/health.ts';

/**
 * Assembles the application WITHOUT calling listen — this is what the tests
 * import. When the project grows, extract this function to src/app.ts,
 * following the layered structure in PACK.md.
 */
export async function createApp(): Promise<FastifyInstance> {
  const app = Fastify({
    // Fastify's built-in logger is Pino (structured JSON) — do not install
    // pino separately. Disabled in tests to keep the output clean.
    logger: process.env.NODE_ENV !== 'test',
  });

  await app.register(healthRoutes);

  return app;
}

async function start(): Promise<void> {
  const app = await createApp();
  const port = Number(process.env.PORT ?? 3000);

  // Graceful shutdown: stop accepting new connections and drain in-flight
  // requests before exiting (PACK.md, "Process lifecycle").
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      app.log.info({ signal }, 'Shutting down the API');
      void app.close().then(() => process.exit(0));
    });
  }

  try {
    await app.listen({ port, host: '0.0.0.0' });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

// Starts the server only when the file is executed directly
// (`npm run dev` / `npm start`) — never when imported by the tests.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  void start();
}
