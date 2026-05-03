import { env } from '../../config/env';
import { QURAN_EDITIONS } from '../../shared/constants/api';
import { sharedCache, SURAH_TTL_MS } from '../../shared/utils/cache';
import { AppError } from '../../shared/utils/errors';
import type {
  AyahPair,
  SurahDetail,
  SurahEdition,
  SurahSummary,
  UpstreamResponse,
  UpstreamSurahEdition,
  UpstreamSurahSummary,
} from './surah.types';

const SURAH_LIST_KEY = 'surahs:list';

function assertSurahNumber(number: number): void {
  if (!Number.isInteger(number) || number < 1 || number > 114) {
    throw new AppError('Surah number must be between 1 and 114', 400);
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${env.QURAN_API_BASE}${path}`);
    if (!response.ok) {
      throw new AppError(`Quran API responded with ${response.status}`, 502);
    }

    const payload = (await response.json()) as UpstreamResponse<T>;
    if (payload.code >= 400) {
      throw new AppError(payload.status || 'Quran API request failed', 502);
    }

    return payload.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch Quran data', 502);
  }
}

function toSurahSummary(data: UpstreamSurahSummary): SurahSummary {
  return {
    number: data.number,
    name: data.name,
    englishName: data.englishName,
    englishNameTranslation: data.englishNameTranslation,
    revelationType: data.revelationType,
    numberOfAyahs: data.numberOfAyahs,
  };
}

function toSurahEdition(data: UpstreamSurahEdition): SurahEdition {
  return {
    ...toSurahSummary(data),
    ayahs: data.ayahs,
  };
}

export async function listSurahs(): Promise<SurahSummary[]> {
  const cached = sharedCache.get<SurahSummary[]>(SURAH_LIST_KEY);
  if (cached) {
    return cached;
  }

  const data = await fetchJson<UpstreamSurahSummary[]>('/surah');
  const surahs = data.map(toSurahSummary);
  sharedCache.set(SURAH_LIST_KEY, surahs, SURAH_TTL_MS);
  return surahs;
}

export async function getSurah(number: number): Promise<SurahDetail> {
  assertSurahNumber(number);

  const cacheKey = `surah:${number}:detail`;
  const cached = sharedCache.get<SurahDetail>(cacheKey);
  if (cached) {
    return cached;
  }

  const [arabicData, englishData] = await Promise.all([
    fetchJson<UpstreamSurahEdition>(`/surah/${number}/${QURAN_EDITIONS.arabic}`),
    fetchJson<UpstreamSurahEdition>(`/surah/${number}/${QURAN_EDITIONS.english}`),
  ]);

  const detail: SurahDetail = {
    summary: toSurahSummary(arabicData),
    arabic: toSurahEdition(arabicData),
    english: toSurahEdition(englishData),
  };

  sharedCache.set(cacheKey, detail, SURAH_TTL_MS);
  return detail;
}

export async function getAyahs(number: number): Promise<AyahPair[]> {
  const detail = await getSurah(number);

  return detail.arabic.ayahs.map((ayah, index) => {
    const translation = detail.english.ayahs[index];
    return {
      surahNumber: number,
      ayahNumber: ayah.numberInSurah,
      globalAyahNumber: ayah.number,
      arabic: ayah.text,
      translation: translation?.text ?? '',
      juz: ayah.juz,
      page: ayah.page,
    };
  });
}
