export type RevelationType = 'Meccan' | 'Medinan';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}

export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: RevelationType;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  text: string;
}

export interface SurahEdition extends SurahSummary {
  ayahs: Ayah[];
}

export interface SurahDetail {
  summary: SurahSummary;
  arabic: SurahEdition;
  english: SurahEdition;
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  text: string;
  edition: string;
}
