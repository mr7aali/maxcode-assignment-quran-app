'use client';

import { Loader2, Pause, Play } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Button } from '@/components/ui/Button';

export interface AudioControls {
  isPlaying: boolean;
  isLoading: boolean;
  toggle: () => void;
}

interface AudioPlayerProps {
  surahNumber: number;
  ayahNumber: number;
  compact?: boolean;
  controls?: AudioControls;
}

interface AudioPlayerButtonProps {
  compact?: boolean;
  controls: AudioControls;
}

export function AudioPlayerButton({ compact = false, controls }: AudioPlayerButtonProps) {
  const { isPlaying, isLoading, toggle } = controls;
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

function AudioPlayerWithHook({
  ayahNumber,
  compact = false,
  surahNumber,
}: Omit<AudioPlayerProps, 'controls'>) {
  const controls = useAudioPlayer(surahNumber, ayahNumber);

  return <AudioPlayerButton compact={compact} controls={controls} />;
}

export function AudioPlayer({
  surahNumber,
  ayahNumber,
  compact = false,
  controls,
}: AudioPlayerProps) {
  if (controls) {
    return <AudioPlayerButton compact={compact} controls={controls} />;
  }

  return (
    <AudioPlayerWithHook ayahNumber={ayahNumber} compact={compact} surahNumber={surahNumber} />
  );
}
