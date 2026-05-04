import { Hono } from 'hono';
import { audioRoutes } from './modules/audio/audio.routes';
import { searchRoutes } from './modules/search/search.routes';
import { surahRoutes } from './modules/surah/surah.routes';
import { cacheHeadersMiddleware } from './shared/middleware/cache.middleware';
import { corsMiddleware } from './shared/middleware/cors.middleware';
import { loggerMiddleware } from './shared/middleware/logger.middleware';
import { rateLimitMiddleware } from './shared/middleware/rateLimit.middleware';
import { toAppError } from './shared/utils/errors';
import { fail, ok } from './shared/utils/response';

const app = new Hono();

app.use('*', loggerMiddleware);
app.use('*', corsMiddleware);
app.use('/api/*', rateLimitMiddleware);
app.use('/api/*', cacheHeadersMiddleware);

app.get('/api/health', (c) =>
  c.json(
    ok({
      status: 'ok',
      service: 'quran-app-backend',
      uptime: Math.round(process.uptime()),
    }),
  ),
);

app.route('/api', surahRoutes);
app.route('/api', searchRoutes);
app.route('/api', audioRoutes);

app.notFound((c) => c.json(fail('Route not found'), 404));

app.onError((error, c) => {
  const appError = toAppError(error);
  const status = appError.statusCode >= 400 && appError.statusCode <= 599 ? appError.statusCode : 500;
  return c.json(fail(appError.message), status as 400);
});

export default app;
