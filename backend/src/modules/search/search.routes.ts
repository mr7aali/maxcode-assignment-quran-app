import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { fail } from '../../shared/utils/response';
import { searchController } from './search.controller';
import type { SearchLanguage } from './search.types';

const searchQueryValidator = validator('query', (value, c) => {
  const q = String(value.q ?? '').trim();
  const lang = String(value.lang ?? 'en');

  if (q.length < 2) {
    return c.json(fail('Search query must be at least 2 characters'), 400);
  }

  if (lang !== 'en' && lang !== 'ar') {
    return c.json(fail('lang must be "en" or "ar"'), 400);
  }

  return { q, lang: lang as SearchLanguage };
});

export const searchRoutes = new Hono().get('/search', searchQueryValidator, searchController);
