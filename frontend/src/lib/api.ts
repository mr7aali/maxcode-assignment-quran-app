import type { AudioUrlResponse, ReciterOption } from '@/types/audio.types';
import type { ApiResponse, SearchResult, SurahDetail, SurahSummary } from '@/types/quran.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.error ?? `Request failed with ${response.status}`);
  }

  return payload.data;
}

export const api = {
  getSurahs: (init?: RequestInit) => request<SurahSummary[]>('/api/surahs', init),
  getSurah: (number: number, init?: RequestInit) => request<SurahDetail>(`/api/surah/${number}`, init),
  search: (query: string, lang = 'en', init?: RequestInit) =>
    request<SearchResult[]>(
      `/api/search?q=${encodeURIComponent(query)}&lang=${encodeURIComponent(lang)}`,
      init,
    ),
  getAudioUrl: (surah: number, ayah: number, reciter: string, init?: RequestInit) =>
    request<AudioUrlResponse>(
      `/api/audio/url?surah=${surah}&ayah=${ayah}&reciter=${encodeURIComponent(reciter)}`,
      init,
    ),
  getReciters: (init?: RequestInit) => request<ReciterOption[]>('/api/reciters', init),
};
