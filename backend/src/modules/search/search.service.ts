import { env } from '../../config/env';
import { QURAN_EDITIONS } from '../../shared/constants/api';
import { sharedCache, SURAH_TTL_MS } from '../../shared/utils/cache';
import { AppError } from '../../shared/utils/errors';
import type {
  SearchLanguage,
  SearchResult,
  UpstreamResponse,
  UpstreamSearchResponse,
} from './search.types';

function editionForLanguage(lang: SearchLanguage): string {
  if (lang === 'ar') {
    return QURAN_EDITIONS.arabic;
  }

  if (lang === 'bn') {
    return QURAN_EDITIONS.bangla;
  }

  return QURAN_EDITIONS.english;
}

export async function searchAyahs(query: string, lang: SearchLanguage): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400);
  }

  const cacheKey = `search:${lang}:${trimmed.toLowerCase()}`;
  const cached = sharedCache.get<SearchResult[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const edition = editionForLanguage(lang);

  try {
    const response = await fetch(
      `${env.QURAN_API_BASE}/search/${encodeURIComponent(trimmed)}/all/${edition}`,
    );

    if (!response.ok) {
      throw new AppError(`Quran search responded with ${response.status}`, 502);
    }

    const payload = (await response.json()) as UpstreamResponse<UpstreamSearchResponse>;
    const results = payload.data.matches.map((match) => ({
      surahNumber: match.surah.number,
      surahName: match.surah.name,
      surahEnglishName: match.surah.englishName,
      ayahNumber: match.numberInSurah,
      text: match.text,
      edition: match.edition.identifier,
    }));

    sharedCache.set(cacheKey, results, SURAH_TTL_MS);
    return results;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to search Quran data', 502);
  }
}
