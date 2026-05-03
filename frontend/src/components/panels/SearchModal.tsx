'use client';

import { useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return [{ text, match: false }];
    }

    const pattern = new RegExp(`(${escapeRegExp(trimmed)})`, 'ig');
    return text.split(pattern).map((part) => ({
      text: part,
      match: pattern.test(part),
    }));
  }, [query, text]);

  return (
    <>
      {parts.map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          className={part.match ? 'rounded bg-accent-gold/20 text-accent-gold-light' : undefined}
        >
          {part.text}
        </span>
      ))}
    </>
  );
}

export function SearchModal() {
  const router = useRouter();
  const isOpen = useAppStore((state) => state.isSearchOpen);
  const setSearchOpen = useAppStore((state) => state.setSearchOpen);
  const { query, setQuery, results, loading } = useSearch();

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-bg-primary/80 px-4 py-16 backdrop-blur"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setSearchOpen(false);
        }
      }}
    >
      <div className="w-full max-w-2xl animate-fade-scale rounded-xl border border-border-default bg-bg-secondary shadow-2xl">
        <div className="flex h-14 items-center gap-3 border-b border-border-default px-4">
          <Search className="h-5 w-5 text-accent-gold" />
          <input
            autoFocus
            className="h-full flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
            placeholder="Search the translation"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          <Button aria-label="Close search" size="icon" variant="ghost" onClick={() => setSearchOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="gold-scrollbar max-h-[64vh] overflow-y-auto p-2">
          {loading && (
            <div className="space-y-2 p-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div className="flex flex-col items-center justify-center px-8 py-14 text-center text-text-secondary">
              <Search className="mb-3 h-8 w-8 text-text-muted" />
              <p className="text-sm">Type at least two characters to search.</p>
            </div>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center px-8 py-14 text-center text-text-secondary">
              <Search className="mb-3 h-8 w-8 text-text-muted" />
              <p className="text-sm">No matching ayahs found.</p>
            </div>
          )}

          {!loading &&
            results.map((result) => (
              <button
                key={`${result.surahNumber}:${result.ayahNumber}:${result.text}`}
                type="button"
                className={cn(
                  'w-full rounded-lg px-4 py-3 text-left transition hover:bg-bg-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold',
                )}
                onClick={() => {
                  setSearchOpen(false);
                  router.push(`/surah/${result.surahNumber}#ayah-${result.ayahNumber}`);
                }}
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-text-muted">
                  <span className="rounded-full border border-accent-gold/40 bg-accent-gold/10 px-2 py-0.5 text-accent-gold-light">
                    {result.surahNumber}:{result.ayahNumber}
                  </span>
                  <span>{result.surahEnglishName}</span>
                </div>
                <p className="text-sm leading-6 text-text-secondary">
                  <HighlightedText query={query} text={result.text} />
                </p>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
