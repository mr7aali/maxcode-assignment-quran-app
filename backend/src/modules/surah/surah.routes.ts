import { Hono } from 'hono';
import { validator } from 'hono/validator';
import { fail } from '../../shared/utils/response';
import { getAyahsController, getSurahController, listSurahsController } from './surah.controller';

const parseSurahParam = validator('param', (value, c) => {
  const number = Number(value.number);
  if (!Number.isInteger(number) || number < 1 || number > 114) {
    return c.json(fail('Surah number must be between 1 and 114'), 400);
  }
  return { number };
});

export const surahRoutes = new Hono()
  .get('/surahs', listSurahsController)
  .get('/surah/:number', parseSurahParam, getSurahController)
  .get('/surah/:number/ayahs', parseSurahParam, getAyahsController);
