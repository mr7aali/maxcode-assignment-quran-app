'use client';

import { Loader2, Pause, Play } from 'lucide-react';
import { AudioProgress } from '@/components/audio/AudioProgress';
import { Button } from '@/components/ui/Button';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { formatAudioTime } from '@/lib/audio';
import { cn } from '@/lib/utils';
import { useAudioStore } from '@/store/useAudioStore';

interface NowPlayingBarProps {
  sidebarOpen: boolean;
  surahName?: string | undefined;
}

interface ParsedAyahId {
  surahNumber: number;
  ayahNumber: number;
}

function parseAyahId(id: string | null): ParsedAyahId | null {
  if (!id) {
    return null;
  }

  const [surahPart, ayahPart] = id.split(':');
  const surahNumber = Number(surahPart);
  const ayahNumber = Number(ayahPart);

  if (!Number.isInteger(surahNumber) || !Number.isInteger(ayahNumber)) {
    return null;
  }

  return { ayahNumber, surahNumber };
}

function NowPlayingControls({
  ayahNumber,
  sidebarOpen,
  surahName,
  surahNumber,
}: NowPlayingBarProps & ParsedAyahId) {
  const player = useAudioPlayer(surahNumber, ayahNumber);
  const title = surahName || `Surah ${surahNumber}`;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-14 right-0 z-40 border-t border-border-light bg-bg-elevated/95 shadow-[0_-8px_24px_rgba(45,58,51,0.12)] backdrop-blur-md transition-[left]',
        sidebarOpen && 'md:left-[344px]',
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            aria-label={player.isPlaying ? 'Pause current audio' : 'Play current audio'}
            className="h-10 w-10 shrink-0 rounded-full"
            size="icon"
            variant="solid"
            onClick={player.toggle}
          >
            {player.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : player.isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">{title}</p>
            <p className="text-xs font-medium text-accent-gold">Ayah {ayahNumber}</p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3">
          <span className="text-right text-xs tabular-nums text-text-secondary">
            {formatAudioTime(player.currentTime)}
          </span>
          <AudioProgress
            disabled={player.duration <= 0}
            progress={player.progress}
            onSeek={player.seek}
          />
          <span className="text-xs tabular-nums text-text-secondary">
            {formatAudioTime(player.duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function NowPlayingBar({ sidebarOpen, surahName }: NowPlayingBarProps) {
  const activeAyahId = useAudioStore((state) => state.playingAyahId ?? state.loadingAyahId);
  const parsedAyahId = parseAyahId(activeAyahId);

  if (!parsedAyahId) {
    return null;
  }

  return (
    <NowPlayingControls
      key={`${parsedAyahId.surahNumber}:${parsedAyahId.ayahNumber}`}
      ayahNumber={parsedAyahId.ayahNumber}
      sidebarOpen={sidebarOpen}
      surahName={surahName}
      surahNumber={parsedAyahId.surahNumber}
    />
  );
}
