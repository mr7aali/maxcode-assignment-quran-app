import { createMiddleware } from 'hono/factory';

export const loggerMiddleware = createMiddleware(async (c, next) => {
  const startedAt = performance.now();
  await next();
  const elapsed = Math.round((performance.now() - startedAt) * 10) / 10;
  console.info(`${c.req.method} ${c.req.path} ${c.res.status} ${elapsed}ms`);
});
