'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { SurahSummary } from '@/types/quran.types';

interface SurahSidebarProps {
  surahs: SurahSummary[];
  activeNumber: number;
  loading: boolean;
}

function searchable(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff]/g, '').replace(/aa/g, 'a');
}

export function SurahSidebar({ surahs, activeNumber, loading }: SurahSidebarProps) {
  const [filter, setFilter] = useState('');
  const isOpen = useAppStore((state) => state.isSurahSidebarOpen);
  const setSurahSidebarOpen = useAppStore((state) => state.setSurahSidebarOpen);

  const filteredSurahs = useMemo(() => {
    const query = searchable(filter);
    if (!query) {
      return surahs;
    }

    return surahs.filter((surah) => {
      const haystack = searchable(
        `${surah.number} ${surah.englishName} ${surah.name} ${surah.englishNameTranslation}`,
      );
      return haystack.includes(query);
    });
  }, [filter, surahs]);

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close surah drawer"
          className="fixed inset-0 z-30 bg-bg-primary/70 backdrop-blur-sm md:hidden"
          type="button"
          onClick={() => setSurahSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed z-40 border-border-default bg-bg-sidebar transition-transform duration-300',
          'bottom-0 left-0 h-[82vh] w-full rounded-t-xl border-t md:left-14 md:top-0 md:h-screen md:w-72 md:rounded-none md:border-r md:border-t-0',
          isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:-translate-x-full md:translate-y-0',
        )}
      >
        <div className="flex h-full flex-col">
          <header className="flex h-20 items-center justify-between border-b border-border-default px-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-accent-gold">SURAH LIST</p>
              <p className="mt-1 text-sm text-text-muted">114 Chapters</p>
            </div>
            <Button
              aria-label="Close surah list"
              className="md:hidden"
              size="icon"
              variant="ghost"
              onClick={() => setSurahSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div className="border-b border-border-default p-3">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                aria-label="Filter surahs"
                className="h-10 w-full rounded-lg border border-border-default bg-bg-primary pl-9 pr-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-gold"
                placeholder="Name, number, Arabic"
                value={filter}
                onChange={(event) => setFilter(event.currentTarget.value)}
              />
            </label>
          </div>

          <div className="gold-scrollbar flex-1 overflow-y-auto py-2">
            {loading && (
              <div className="space-y-2 px-3">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-16" />
                ))}
              </div>
            )}

            {!loading &&
              filteredSurahs.map((surah) => {
                const active = surah.number === activeNumber;
                return (
                  <Link
                    key={surah.number}
                    className={cn(
                      'contain-content grid min-h-[68px] grid-cols-[40px_1fr_auto] items-center gap-3 border-l-2 border-transparent px-3 py-2 transition hover:bg-bg-tertiary/70',
                      active && 'surah-active',
                    )}
                    href={`/surah/${surah.number}`}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setSurahSidebarOpen(false);
                      }
                    }}
                  >
                    <span
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-lg border border-border-default text-sm font-semibold text-text-secondary',
                        active && 'border-accent-gold bg-accent-gold text-bg-primary',
                      )}
                    >
                      {surah.number}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-text-primary">
                        {surah.englishName}
                      </span>
                      <span className="block truncate text-xs text-text-muted">
                        {surah.englishNameTranslation} · {surah.numberOfAyahs}
                      </span>
                    </span>
                    <span className="arabic-text max-w-[70px] truncate text-right text-lg text-text-secondary" dir="rtl">
                      {surah.name}
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      </aside>
    </>
  );
}
