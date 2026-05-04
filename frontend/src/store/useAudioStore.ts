'use client';

import { create } from 'zustand';

interface AudioStore {
  playingAyahId: string | null;
  loadingAyahId: string | null;
  currentTime: number;
  duration: number;
  progress: number;
  setPlayingAyahId: (id: string) => void;
  setLoadingAyahId: (id: string | null) => void;
  setAudioTiming: (currentTime: number, duration: number) => void;
  setProgress: (progress: number) => void;
  clearPlaying: () => void;
}

function getSafeAudioTiming(currentTime: number, duration: number) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrentTime =
    Number.isFinite(currentTime) && currentTime > 0
      ? Math.min(currentTime, safeDuration || currentTime)
      : 0;

  return {
    currentTime: safeCurrentTime,
    duration: safeDuration,
    progress: safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0,
  };
}

export const useAudioStore = create<AudioStore>((set) => ({
  playingAyahId: null,
  loadingAyahId: null,
  currentTime: 0,
  duration: 0,
  progress: 0,
  setPlayingAyahId: (id) => set({ playingAyahId: id }),
  setLoadingAyahId: (id) => set({ loadingAyahId: id }),
  setAudioTiming: (currentTime, duration) => set(getSafeAudioTiming(currentTime, duration)),
  setProgress: (progress) => set({ progress }),
  clearPlaying: () =>
    set({ currentTime: 0, duration: 0, loadingAyahId: null, playingAyahId: null, progress: 0 }),
}));
