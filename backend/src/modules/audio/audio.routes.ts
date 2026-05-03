import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { RECITERS } from '../../shared/constants/reciters';
import { fail } from '../../shared/utils/response';
import { getAudioUrlController, listRecitersController } from './audio.controller';

const audioQueryValidator = validator('query', (value, c) => {
  const surah = Number(value.surah);
  const ayah = Number(value.ayah);
  const reciter = String(value.reciter ?? 'Alafasy_128kbps');

  if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
    return c.json(fail('surah must be between 1 and 114'), 400);
  }

  if (!Number.isInteger(ayah) || ayah < 1 || ayah > 286) {
    return c.json(fail('ayah must be between 1 and 286'), 400);
  }

  if (!Object.prototype.hasOwnProperty.call(RECITERS, reciter)) {
    return c.json(fail('Unknown reciter'), 400);
  }

  return { surah, ayah, reciter };
});

export const audioRoutes = new Hono()
  .get('/audio/url', audioQueryValidator, getAudioUrlController)
  .get('/reciters', listRecitersController);
