import { createMiddleware } from 'hono/factory';
import { AppError } from '../utils/errors';

interface RateRecord {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60 * 1000;
const LIMIT = 100;
const requests = new Map<string, RateRecord>();

function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }

  return headers.get('cf-connecting-ip') ?? headers.get('x-real-ip') ?? 'unknown';
}

export const rateLimitMiddleware = createMiddleware(async (c, next) => {
  const key = getClientIp(c.req.raw.headers);
  const now = Date.now();
  const record = requests.get(key);

  if (!record || now > record.resetAt) {
    requests.set(key, { count: 1, resetAt: now + WINDOW_MS });
    await next();
    return;
  }

  if (record.count >= LIMIT) {
    throw new AppError('Rate limit exceeded. Try again in a minute.', 429);
  }

  record.count += 1;
  await next();
});
