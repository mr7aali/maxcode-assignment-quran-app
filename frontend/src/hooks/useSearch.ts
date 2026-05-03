'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { SearchResult } from '@/types/quran.types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setLoading(true);
      api
        .search(trimmed)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [query]);

  return { query, setQuery, results, loading };
}
