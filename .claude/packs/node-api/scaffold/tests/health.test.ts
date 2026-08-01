import { describe, expect, it } from 'vitest';
import { createApp } from '../src/server.ts';

// Integration test: assembles the real app (without listen) and injects the
// request — the PACK.md testing priority. Deletable: replace it when the
// first real endpoint lands.
describe('GET /health', () => {
  it('responds 200 with ok status and the current time', async () => {
    const app = await createApp();

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    const body = response.json<{ status: string; time: string }>();
    expect(body.status).toBe('ok');
    expect(new Date(body.time).getTime()).not.toBeNaN();

    await app.close();
  });
});
