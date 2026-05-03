import type { Context } from 'hono';
import { ok } from '../../shared/utils/response';
import { getAyahs, getSurah, listSurahs } from './surah.service';

export async function listSurahsController(c: Context) {
  const data = await listSurahs();
  return c.json(ok(data));
}

export async function getSurahController(c: Context) {
  const { number } = c.req.valid('param' as never) as unknown as { number: number };
  const data = await getSurah(number);
  return c.json(ok(data));
}

export async function getAyahsController(c: Context) {
  const { number } = c.req.valid('param' as never) as unknown as { number: number };
  const data = await getAyahs(number);
  return c.json(ok(data));
}
