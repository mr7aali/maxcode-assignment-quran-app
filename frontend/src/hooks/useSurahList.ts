'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SurahSummary } from '@/types/quran.types';

let cachedSurahs: SurahSummary[] | null = null;

export function primeSurahListCache(surahs: SurahSummary[]): void {
  cachedSurahs = surahs;
}

export function useSurahList(initialSurahs: SurahSummary[] = []) {
  const [surahs, setSurahs] = useState<SurahSummary[]>(cachedSurahs ?? initialSurahs);
  const [loading, setLoading] = useState(!cachedSurahs && initialSurahs.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSurahs.length > 0 && !cachedSurahs) {
      cachedSurahs = initialSurahs;
    }

    if (cachedSurahs) {
      setSurahs(cachedSurahs);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    api
      .getSurahs()
      .then((data) => {
        if (!active) {
          return;
        }
        cachedSurahs = data;
        setSurahs(data);
        setError(null);
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load surahs');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [initialSurahs]);

  return { surahs, loading, error };
}
