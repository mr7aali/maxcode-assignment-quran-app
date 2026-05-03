import type { Context } from 'hono';
import { ok } from '../../shared/utils/response';
import { searchAyahs } from './search.service';
import type { SearchLanguage } from './search.types';

export async function searchController(c: Context) {
  const { q, lang } = c.req.valid('query' as never) as unknown as {
    q: string;
    lang: SearchLanguage;
  };
  const data = await searchAyahs(q, lang);
  return c.json(ok(data));
}
