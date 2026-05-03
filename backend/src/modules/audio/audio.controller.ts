import type { Context } from 'hono';
import { ok } from '../../shared/utils/response';
import { getAudioUrl, listReciters } from './audio.service';

export function getAudioUrlController(c: Context) {
  const { surah, ayah, reciter } = c.req.valid('query' as never) as unknown as {
    surah: number;
    ayah: number;
    reciter: string;
  };
  return c.json(ok(getAudioUrl(surah, ayah, reciter)));
}

export function listRecitersController(c: Context) {
  return c.json(ok(listReciters()));
}
