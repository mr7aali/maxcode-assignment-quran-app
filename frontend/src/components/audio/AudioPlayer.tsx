'use client';

import { Loader2, Pause, Play } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Button } from '@/components/ui/Button';

interface AudioPlayerProps {
  surahNumber: number;
  ayahNumber: number;
  compact?: boolean;
  controls?: {
    isPlaying: boolean;
    isLoading: boolean;
    toggle: () => void;
  };
}

export function AudioPlayer({ surahNumber, ayahNumber, compact = false, controls }: AudioPlayerProps) {
  const fallback = useAudioPlayer(surahNumber, ayahNumber);
  const { isPlaying, isLoading, toggle } = controls ?? fallback;

  return (
    <Button
      aria-label={isPlaying ? 'Pause ayah audio' : 'Play ayah audio'}
      className={compact ? 'h-8 w-8 rounded-full' : 'rounded-full'}
      size="icon"
      variant={isPlaying ? 'solid' : 'ghost'}
      onClick={toggle}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
    </Button>
  );
}
