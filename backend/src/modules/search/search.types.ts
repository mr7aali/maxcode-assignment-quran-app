export type SearchLanguage = 'en' | 'ar';

export interface SearchQuery {
  q: string;
  lang: SearchLanguage;
}

export interface SearchResult {
  surahNumber: number;
  surahName: string;
  surahEnglishName: string;
  ayahNumber: number;
  text: string;
  edition: string;
}

export interface UpstreamSearchMatch {
  number: number;
  text: string;
  edition: {
    identifier: string;
    language: string;
    englishName: string;
  };
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
  numberInSurah: number;
}

export interface UpstreamSearchResponse {
  count: number;
  matches: UpstreamSearchMatch[];
}

export interface UpstreamResponse<T> {
  code: number;
  status: string;
  data: T;
}
