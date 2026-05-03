export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
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

export interface TranslationAyah extends Ayah {
  text: string;
}

export interface SurahEdition {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface SurahDetail {
  summary: SurahSummary;
  arabic: SurahEdition;
  english: SurahEdition;
}

export interface AyahPair {
  surahNumber: number;
  ayahNumber: number;
  globalAyahNumber: number;
  arabic: string;
  translation: string;
  juz: number;
  page: number;
}

export interface UpstreamResponse<T> {
  code: number;
  status: string;
  data: T;
}

export interface UpstreamSurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface UpstreamAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface UpstreamSurahEdition extends UpstreamSurahSummary {
  ayahs: UpstreamAyah[];
}
