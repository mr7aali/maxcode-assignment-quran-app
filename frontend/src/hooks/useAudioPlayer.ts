'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { useAudioStore } from '@/store/useAudioStore';

let activeAudio: HTMLAudioElement | null = null;
let activeAudioId: string | null = null;
let activePlaybackToken = 0;
let activeProgressFrameId: number | null = null;

function getAyahId(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}:${ayahNumber}`;
}

function stopProgressUpdates(): void {
  if (activeProgressFrameId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(activeProgressFrameId);
  }
  activeProgressFrameId = null;
}

function stopActiveAudio(): void {
  stopProgressUpdates();
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
  }
  activeAudio = null;
  activeAudioId = null;
}

function cancelActivePlayback(): void {
  activePlaybackToken += 1;
  stopActiveAudio();
}

function startProgressUpdates(
  audio: HTMLAudioElement,
  id: string,
  token: number,
  setAudioTiming: (currentTime: number, duration: number) => void,
): void {
  stopProgressUpdates();

  const updateProgress = () => {
    if (token !== activePlaybackToken || activeAudioId !== id) {
      activeProgressFrameId = null;
      return;
    }

    setAudioTiming(audio.currentTime, audio.duration);
    activeProgressFrameId = window.requestAnimationFrame(updateProgress);
  };

  activeProgressFrameId = window.requestAnimationFrame(updateProgress);
}

export function useAudioPlayer(
  surahNumber: number,
  ayahNumber: number,
  lastAyahNumber = ayahNumber,
) {
  const reciter = useAppStore((state) => state.settings.reciter);
  const id = useMemo(() => getAyahId(surahNumber, ayahNumber), [surahNumber, ayahNumber]);
  const sequenceEndAyahNumber = useMemo(
    () => Math.max(ayahNumber, lastAyahNumber),
    [ayahNumber, lastAyahNumber],
  );
  const isPlaying = useAudioStore((state) => state.playingAyahId === id);
  const isLoading = useAudioStore((state) => state.loadingAyahId === id);
  const currentTime = useAudioStore((state) =>
    state.playingAyahId === id ? state.currentTime : 0,
  );
  const duration = useAudioStore((state) => (state.playingAyahId === id ? state.duration : 0));
  const progress = useAudioStore((state) => (state.playingAyahId === id ? state.progress : 0));
  const setPlayingAyahId = useAudioStore((state) => state.setPlayingAyahId);
  const setLoadingAyahId = useAudioStore((state) => state.setLoadingAyahId);
  const setAudioTiming = useAudioStore((state) => state.setAudioTiming);
  const setProgress = useAudioStore((state) => state.setProgress);
  const clearPlaying = useAudioStore((state) => state.clearPlaying);

  const seek = useCallback(
    (value: number) => {
      if (activeAudio && activeAudioId === id && activeAudio.duration > 0) {
        const nextTime = (value / 100) * activeAudio.duration;
        activeAudio.currentTime = nextTime;
        setAudioTiming(nextTime, activeAudio.duration);
      }
    },
    [id, setAudioTiming],
  );

  const stopPlayback = useCallback(() => {
    cancelActivePlayback();
    setLoadingAyahId(null);
    setProgress(0);
    clearPlaying();
  }, [clearPlaying, setLoadingAyahId, setProgress]);

  const playAyahSequence = useCallback(
    async function playAyahSequence(currentAyahNumber: number, token: number): Promise<void> {
      const currentId = getAyahId(surahNumber, currentAyahNumber);

      stopActiveAudio();
      setProgress(0);
      setAudioTiming(0, 0);
      setLoadingAyahId(currentId);
      setPlayingAyahId(currentId);

      try {
        const audioData = await api.getAudioUrl(surahNumber, currentAyahNumber, reciter);

        if (token !== activePlaybackToken) {
          return;
        }

        const audio = new Audio(audioData.url);
        audio.preload = 'auto';
        activeAudio = audio;
        activeAudioId = currentId;

        const finishLoading = () => {
          if (token === activePlaybackToken && activeAudioId === currentId) {
            setLoadingAyahId(null);
          }
        };
        const updateTiming = () => {
          if (token === activePlaybackToken && activeAudioId === currentId) {
            setAudioTiming(audio.currentTime, audio.duration);
          }
        };

        audio.addEventListener('timeupdate', () => {
          if (token === activePlaybackToken && activeAudioId === currentId && audio.duration > 0) {
            setAudioTiming(audio.currentTime, audio.duration);
          }
        });

        audio.addEventListener('loadedmetadata', updateTiming);
        audio.addEventListener('durationchange', updateTiming);
        audio.addEventListener('ended', () => {
          if (token !== activePlaybackToken || activeAudioId !== currentId) {
            return;
          }

          stopActiveAudio();
          setProgress(0);
          setAudioTiming(0, 0);

          if (currentAyahNumber < sequenceEndAyahNumber) {
            void playAyahSequence(currentAyahNumber + 1, token);
            return;
          }

          clearPlaying();
        });

        audio.addEventListener('canplay', finishLoading);
        audio.addEventListener('playing', finishLoading);
        audio.addEventListener('error', () => {
          if (token !== activePlaybackToken || activeAudioId !== currentId) {
            return;
          }

          stopPlayback();
        });

        await audio.play();
        finishLoading();
        updateTiming();
        startProgressUpdates(audio, currentId, token, setAudioTiming);
      } catch {
        if (token === activePlaybackToken) {
          setLoadingAyahId(null);
          setAudioTiming(0, 0);
          setProgress(0);
          clearPlaying();
          stopActiveAudio();
        }
      }
    },
    [
      clearPlaying,
      reciter,
      sequenceEndAyahNumber,
      setAudioTiming,
      setLoadingAyahId,
      setPlayingAyahId,
      setProgress,
      stopPlayback,
      surahNumber,
    ],
  );

  const toggle = useCallback(() => {
    if (isPlaying || activeAudioId === id) {
      stopPlayback();
      return;
    }

    const token = activePlaybackToken + 1;
    activePlaybackToken = token;
    stopActiveAudio();
    void playAyahSequence(ayahNumber, token);
  }, [ayahNumber, id, isPlaying, playAyahSequence, stopPlayback]);

  useEffect(() => {
    return () => {
      if (activeAudioId === id) {
        stopPlayback();
      }
    };
  }, [id, stopPlayback]);

  return { currentTime, duration, isPlaying, isLoading, progress, toggle, seek };
}
