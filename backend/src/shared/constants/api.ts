export const API_PATHS = {
  health: '/api/health',
  surahs: '/api/surahs',
  surah: '/api/surah/:number',
  surahAyahs: '/api/surah/:number/ayahs',
  search: '/api/search',
  audioUrl: '/api/audio/url',
  reciters: '/api/reciters',
} as const;

export const QURAN_EDITIONS = {
  arabic: 'quran-uthmani',
  english: 'en.asad',
  bangla: 'bn.bengali',
} as const;
