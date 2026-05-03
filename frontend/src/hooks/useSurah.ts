'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SurahDetail, SurahEdition } from '@/types/quran.types';

interface UseSurahState {
  detail: SurahDetail | null;
  arabic: SurahEdition | null;
  english: SurahEdition | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useSurah(number: number, initialDetail: SurahDetail | null = null): UseSurahState {
  const [detail, setDetail] = useState<SurahDetail | null>(initialDetail);
  const [loading, setLoading] = useState(!initialDetail);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => {
    setVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    if (initialDetail?.summary.number === number && version === 0) {
      setDetail(initialDetail);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    api
      .getSurah(number)
      .then((data) => {
        if (!active) {
          return;
        }
        setDetail(data);
        setError(null);
      })
      .catch((fetchError: unknown) => {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to load surah');
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
  }, [initialDetail, number, version]);

  return {
    detail,
    arabic: detail?.arabic ?? null,
    english: detail?.english ?? null,
    loading,
    error,
    reload,
  };
}
