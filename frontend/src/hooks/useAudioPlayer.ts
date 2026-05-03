'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { useAudioStore } from '@/store/useAudioStore';

let activeAudio: HTMLAudioElement | null = null;
let activeAudioId: string | null = null;

function stopActiveAudio(): void {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }
  activeAudio = null;
  activeAudioId = null;
}

export function useAudioPlayer(surahNumber: number, ayahNumber: number) {
  const reciter = useAppStore((state) => state.settings.reciter);
  const playingAyahId = useAudioStore((state) => state.playingAyahId);
  const setPlayingAyahId = useAudioStore((state) => state.setPlayingAyahId);
  const clearPlaying = useAudioStore((state) => state.clearPlaying);
  const id = useMemo(() => `${surahNumber}:${ayahNumber}`, [surahNumber, ayahNumber]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPlaying = playingAyahId === id;

  const seek = useCallback(
    (value: number) => {
      if (localAudioRef.current && isPlaying) {
        localAudioRef.current.currentTime = (value / 100) * localAudioRef.current.duration;
        setProgress(value);
      }
    },
    [isPlaying],
  );

  const toggle = useCallback(async () => {
    if (isPlaying && localAudioRef.current) {
      localAudioRef.current.pause();
      clearPlaying();
      return;
    }

    stopActiveAudio();
    clearPlaying();
    setIsLoading(true);

    try {
      const audioData = await api.getAudioUrl(surahNumber, ayahNumber, reciter);
      const audio = new Audio(audioData.url);
      audio.preload = 'auto';
      localAudioRef.current = audio;
      activeAudio = audio;
      activeAudioId = id;
      setPlayingAyahId(id);

      audio.addEventListener('timeupdate', () => {
        if (audio.duration > 0) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      });

      audio.addEventListener('ended', () => {
        if (activeAudioId === id) {
          setProgress(0);
          clearPlaying();
          stopActiveAudio();
        }
      });

      audio.addEventListener('canplay', () => {
        setIsLoading(false);
      });

      audio.addEventListener('playing', () => {
        setIsLoading(false);
      });

      audio.addEventListener('error', () => {
        if (activeAudioId === id) {
          setIsLoading(false);
          setProgress(0);
          clearPlaying();
          stopActiveAudio();
        }
      });

      await audio.play();
    } catch {
      setIsLoading(false);
      clearPlaying();
      stopActiveAudio();
    }
  }, [ayahNumber, clearPlaying, id, isPlaying, reciter, setPlayingAyahId, surahNumber]);

  useEffect(() => {
    if (!isPlaying && localAudioRef.current && activeAudioId === id) {
      localAudioRef.current.pause();
      localAudioRef.current = null;
      setProgress(0);
    }
  }, [id, isPlaying]);

  useEffect(() => {
    return () => {
      if (activeAudioId === id) {
        clearPlaying();
        stopActiveAudio();
      }
    };
  }, [clearPlaying, id]);

  return { isPlaying, isLoading, progress, toggle, seek };
}
