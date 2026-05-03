'use client';

import { create } from 'zustand';

interface AudioStore {
  playingAyahId: string | null;
  setPlayingAyahId: (id: string) => void;
  clearPlaying: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  playingAyahId: null,
  setPlayingAyahId: (id) => set({ playingAyahId: id }),
  clearPlaying: () => set({ playingAyahId: null }),
}));
