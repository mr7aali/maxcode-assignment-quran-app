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
  arabicAyah: Ayah;
  translation?: string;
}

export function AyahCard({ surahNumber, arabicAyah, translation = '' }: AyahCardProps) {
  const [copied, setCopied] = useState(false);
  const settings = useAppStore((state) => state.settings);
  const player = useAudioPlayer(surahNumber, arabicAyah.numberInSurah);
  const ayahId = `ayah-${arabicAyah.numberInSurah}`;

  async function copyAyah(): Promise<void> {
    const text = `${arabicAyah.text}\n\n${arabicAyah.numberInSurah}. ${translation}`;
    await navigator.clipboard.writeText(text.trim());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <article
      id={ayahId}
      className={cn(
        'group border-b border-border-default px-6 py-7 transition hover:bg-accent-gold/[0.035]',
        player.isPlaying && 'bg-accent-gold/[0.07]',
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
          <Button aria-label="Bookmark ayah" disabled size="icon" variant="ghost">
            <Bookmark className="h-4 w-4" />
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
        className={cn('text-right text-text-primary', arabicFontClass(settings.arabicFont))}
        dir="rtl"
        style={{ fontSize: settings.arabicFontSize, lineHeight: 2.2 }}
      >
        {arabicAyah.text}
      </p>

      {player.isPlaying && (
        <AudioProgress className="mt-6" progress={player.progress} onSeek={player.seek} />
      )}

      {settings.showTranslation && (
        <p
          className="mt-6 max-w-3xl leading-8 text-text-secondary"
          style={{ fontSize: settings.translationFontSize }}
        >
          <span className="mr-2 font-semibold text-accent-gold">{arabicAyah.numberInSurah}</span>
          {translation}
        </p>
      )}
    </article>
  );
}
