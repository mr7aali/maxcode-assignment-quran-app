import { createMiddleware } from 'hono/factory';

export const cacheHeadersMiddleware = createMiddleware(async (c, next) => {
  await next();
  if (c.req.method === 'GET' && c.res.status >= 200 && c.res.status < 300) {
    c.res.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=3600');
  }
});
