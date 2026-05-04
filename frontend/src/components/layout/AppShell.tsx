'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { BookmarksPanel } from '@/components/panels/BookmarksPanel';
import { FontPanel } from '@/components/panels/FontPanel';
import { SearchModal } from '@/components/panels/SearchModal';
import { AyahCard } from '@/components/reader/AyahCard';
import { AyahSkeleton } from '@/components/reader/AyahSkeleton';
import { SurahHeader } from '@/components/reader/SurahHeader';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useSurah } from '@/hooks/useSurah';
import { useSurahList } from '@/hooks/useSurahList';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useAudioStore } from '@/store/useAudioStore';
import type { SurahDetail, SurahSummary } from '@/types/quran.types';
import { IconSidebar } from './IconSidebar';
import { SurahSidebar } from './SurahSidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  selectedNumber: number;
  initialSurahs: SurahSummary[];
  initialSurah: SurahDetail | null;
}

export function AppShell({ selectedNumber, initialSurahs, initialSurah }: AppShellProps) {
  useKeyboard();
  const pathname = usePathname();
  const clearPlaying = useAudioStore((state) => state.clearPlaying);
  const isSurahSidebarOpen = useAppStore((state) => state.isSurahSidebarOpen);
  const theme = useAppStore((state) => state.theme);
  const { surahs, loading: surahsLoading } = useSurahList(initialSurahs);
  const { detail, loading, error } = useSurah(selectedNumber, initialSurah);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light-paper-texture', theme === 'light');
  }, [theme]);

  useEffect(() => {
    clearPlaying();
  }, [clearPlaying, pathname]);

  const activeSurah = useMemo(
    () => detail?.summary ?? surahs.find((surah) => surah.number === selectedNumber) ?? null,
    [detail, selectedNumber, surahs],
  );

  return (
    <div className="relative z-10 min-h-screen bg-bg-primary text-text-primary">
      <IconSidebar />
      <SurahSidebar activeNumber={selectedNumber} loading={surahsLoading} surahs={surahs} />
      <div
        className={cn(
          'min-h-screen pl-14 transition-[padding] duration-300 md:pl-14',
          isSurahSidebarOpen && 'md:pl-[344px]',
        )}
      >
        <TopBar surah={activeSurah} />
        <main className="min-h-[calc(100vh-56px)]">
          {activeSurah && <SurahHeader surah={activeSurah} />}

          {loading && (
            <div>
              {Array.from({ length: 6 }).map((_, index) => (
                <AyahSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-xl px-6 py-20 text-center">
              <p className="text-lg font-semibold text-text-primary">Unable to load this surah.</p>
              <p className="mt-2 text-sm text-text-secondary">{error}</p>
            </div>
          )}

          {!loading &&
            detail?.arabic.ayahs.map((ayah, index) => (
              <AyahCard
                key={ayah.number}
                arabicAyah={ayah}
                surahNumber={selectedNumber}
                surahName={detail.summary.englishName}
                banglaTranslation={detail.bangla.ayahs[index]?.text ?? ''}
                englishTranslation={detail.english.ayahs[index]?.text ?? ''}
              />
            ))}
        </main>
      </div>
      <BookmarksPanel />
      <FontPanel />
      <SearchModal />
    </div>
  );
}
