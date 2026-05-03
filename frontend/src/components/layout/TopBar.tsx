'use client';

import { ChevronLeft, ChevronRight, Menu, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { SurahSummary } from '@/types/quran.types';

interface TopBarProps {
  surah: SurahSummary | null;
}

export function TopBar({ surah }: TopBarProps) {
  const setSurahSidebarOpen = useAppStore((state) => state.setSurahSidebarOpen);
  const setSearchOpen = useAppStore((state) => state.setSearchOpen);
  const isFontPanelOpen = useAppStore((state) => state.isFontPanelOpen);
  const setFontPanelOpen = useAppStore((state) => state.setFontPanelOpen);
  const previous = surah ? surah.number - 1 : 0;
  const next = surah ? surah.number + 1 : 115;

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border-default bg-bg-primary/80 px-3 backdrop-blur md:px-5">
      <div className="flex items-center gap-1">
        <Button
          aria-label="Open surah list"
          className="md:hidden"
          size="icon"
          variant="ghost"
          onClick={() => setSurahSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link
          aria-disabled={previous < 1}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary',
            previous < 1 && 'pointer-events-none opacity-40',
          )}
          href={previous >= 1 ? `/surah/${previous}` : '#'}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <Link
          aria-disabled={next > 114}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-bg-tertiary hover:text-text-primary',
            next > 114 && 'pointer-events-none opacity-40',
          )}
          href={next <= 114 ? `/surah/${next}` : '#'}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>

      <div className="min-w-0 px-2 text-center">
        {surah ? (
          <div className="flex items-center justify-center gap-2">
            <span className="truncate text-sm font-semibold text-text-primary">
              {surah.number}. {surah.englishName}
            </span>
            <Badge tone={surah.revelationType === 'Medinan' ? 'teal' : 'gold'}>
              {surah.revelationType}
            </Badge>
          </div>
        ) : (
          <span className="text-sm text-text-muted">Loading</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          aria-label="Open search"
          className="hidden rounded-full px-3 md:inline-flex"
          size="sm"
          variant="outline"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-4 w-4" />
          Search
          <span className="rounded border border-border-default px-1.5 py-0.5 text-[10px] text-text-muted">
            ⌘K
          </span>
        </Button>
        <Button aria-label="Open search" className="md:hidden" size="icon" variant="ghost" onClick={() => setSearchOpen(true)}>
          <Search className="h-5 w-5" />
        </Button>
        <Button
          aria-label="Open settings"
          className={cn(isFontPanelOpen && 'text-accent-gold')}
          size="icon"
          variant="ghost"
          onClick={() => setFontPanelOpen(!isFontPanelOpen)}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
