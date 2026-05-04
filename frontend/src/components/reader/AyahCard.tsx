'use client';

import { Bookmark, Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { AudioProgress } from '@/components/audio/AudioProgress';
import { Button } from '@/components/ui/Button';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { arabicFontClass, cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { Ayah } from '@/types/quran.types';

interface AyahCardProps {
  surahNumber: number;
  surahName: string;
  arabicAyah: Ayah;
  englishTranslation?: string;
  banglaTranslation?: string;
}

export function AyahCard({
  surahNumber,
  surahName,
  arabicAyah,
  englishTranslation = '',
  banglaTranslation = '',
}: AyahCardProps) {
  const [copied, setCopied] = useState(false);
  const settings = useAppStore((state) => state.settings);
  const bookmarkId = `${surahNumber}:${arabicAyah.numberInSurah}`;
  const isBookmarked = useAppStore((state) =>
    state.bookmarks.some((bookmark) => bookmark.id === bookmarkId),
  );
  const toggleBookmark = useAppStore((state) => state.toggleBookmark);
  const player = useAudioPlayer(surahNumber, arabicAyah.numberInSurah);
  const ayahId = `ayah-${arabicAyah.numberInSurah}`;

  async function copyAyah(): Promise<void> {
    const text = [
      arabicAyah.text,
      `${arabicAyah.numberInSurah}. ${englishTranslation}`,
      banglaTranslation,
    ].filter(Boolean).join('\n\n');
    await navigator.clipboard.writeText(text.trim());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function onBookmark(): void {
    toggleBookmark({
      id: bookmarkId,
      surahNumber,
      surahName: surahName || `Surah ${surahNumber}`,
      ayahNumber: arabicAyah.numberInSurah,
      arabicText: arabicAyah.text,
      englishTranslation,
      banglaTranslation,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <article
      id={ayahId}
      className={cn(
        'group border-b border-border-light px-6 py-7 transition hover:bg-bg-secondary hover:shadow-[var(--shadow-sm)]',
        player.isPlaying && 'bg-accent-gold-bg shadow-[var(--shadow-sm)]',
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className={cn('ayah-badge', player.isPlaying && 'shadow-[0_0_24px_rgba(201,168,76,0.35)]')}>
          {arabicAyah.numberInSurah}
        </span>
        <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:transition md:group-hover:opacity-100">
          <Button aria-label="Copy ayah" size="icon" variant="ghost" onClick={copyAyah}>
            {copied ? <Check className="h-4 w-4 text-accent-teal" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark ayah'}
            aria-pressed={isBookmarked}
            className={cn(isBookmarked && 'text-accent-gold hover:text-accent-gold')}
            size="icon"
            variant="ghost"
            onClick={onBookmark}
          >
            <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
          </Button>
          <AudioPlayer
            ayahNumber={arabicAyah.numberInSurah}
            compact
            controls={player}
            surahNumber={surahNumber}
          />
        </div>
      </div>

      <p
        className={cn('text-right text-text-arabic', arabicFontClass(settings.arabicFont))}
        dir="rtl"
        style={{ fontSize: settings.arabicFontSize, lineHeight: 2.2 }}
      >
        {arabicAyah.text}
      </p>

      {player.isPlaying && (
        <AudioProgress className="mt-6" progress={player.progress} onSeek={player.seek} />
      )}

      {settings.showTranslation && (
        <div className="mt-6 max-w-3xl space-y-3 leading-8 text-text-secondary">
          <p style={{ fontSize: settings.translationFontSize }}>
            <span className="mr-2 font-semibold text-accent-gold">{arabicAyah.numberInSurah}</span>
            {englishTranslation}
          </p>
          {banglaTranslation && (
            <p lang="bn" style={{ fontSize: settings.translationFontSize }}>
              {banglaTranslation}
            </p>
          )}
        </div>
      )}
    </article>
  );
}
