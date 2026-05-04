'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ReciterKey } from '@/types/audio.types';
import type { AppSettings, ArabicFont } from '@/types/settings.types';

export type Theme = 'light' | 'dark';

interface AppStore {
  settings: AppSettings;
  theme: Theme;
  isSurahSidebarOpen: boolean;
  isFontPanelOpen: boolean;
  isSearchOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setArabicFont: (font: ArabicFont) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setShowTranslation: (show: boolean) => void;
  setReciter: (reciter: ReciterKey) => void;
  setSurahSidebarOpen: (open: boolean) => void;
  toggleSurahSidebar: () => void;
  setFontPanelOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  closePanels: () => void;
}

const defaultSettings: AppSettings = {
  arabicFont: 'KFGQPC',
  arabicFontSize: 28,
  translationFontSize: 16,
  showTranslation: true,
  reciter: 'Alafasy_128kbps',
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      theme: 'dark',
      isSurahSidebarOpen: true,
      isFontPanelOpen: false,
      isSearchOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setArabicFont: (font) =>
        set((state) => ({ settings: { ...state.settings, arabicFont: font } })),
      setArabicFontSize: (size) =>
        set((state) => ({ settings: { ...state.settings, arabicFontSize: size } })),
      setTranslationFontSize: (size) =>
        set((state) => ({ settings: { ...state.settings, translationFontSize: size } })),
      setShowTranslation: (show) =>
        set((state) => ({ settings: { ...state.settings, showTranslation: show } })),
      setReciter: (reciter) =>
        set((state) => ({ settings: { ...state.settings, reciter } })),
      setSurahSidebarOpen: (open) => set({ isSurahSidebarOpen: open }),
      toggleSurahSidebar: () =>
        set((state) => ({ isSurahSidebarOpen: !state.isSurahSidebarOpen })),
      setFontPanelOpen: (open) => set({ isFontPanelOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      closePanels: () => set({ isFontPanelOpen: false, isSearchOpen: false }),
    }),
    {
      name: 'quran-app-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        theme: state.theme,
        isSurahSidebarOpen: state.isSurahSidebarOpen,
      }),
    },
  ),
);
