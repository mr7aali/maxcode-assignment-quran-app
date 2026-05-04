import app from './index';
import { env } from './config/env';

Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

console.info(`Quran API listening on http://localhost:${env.PORT}`);
