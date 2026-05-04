'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ReciterKey } from '@/types/audio.types';
import type { BookmarkItem } from '@/types/quran.types';
import type { AppSettings, ArabicFont } from '@/types/settings.types';

export type Theme = 'light' | 'dark';

interface AppStore {
  settings: AppSettings;
  theme: Theme;
  bookmarks: BookmarkItem[];
  isSurahSidebarOpen: boolean;
  isFontPanelOpen: boolean;
  isSearchOpen: boolean;
  isBookmarksOpen: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleBookmark: (bookmark: BookmarkItem) => void;
  removeBookmark: (bookmarkId: string) => void;
  clearBookmarks: () => void;
  setArabicFont: (font: ArabicFont) => void;
  setArabicFontSize: (size: number) => void;
  setTranslationFontSize: (size: number) => void;
  setShowTranslation: (show: boolean) => void;
  setReciter: (reciter: ReciterKey) => void;
  setSurahSidebarOpen: (open: boolean) => void;
  toggleSurahSidebar: () => void;
  setFontPanelOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setBookmarksOpen: (open: boolean) => void;
  toggleBookmarksOpen: () => void;
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
      bookmarks: [],
      isSurahSidebarOpen: true,
      isFontPanelOpen: false,
      isSearchOpen: false,
      isBookmarksOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      toggleBookmark: (bookmark) =>
        set((state) => {
          const exists = state.bookmarks.some((item) => item.id === bookmark.id);
          return {
            bookmarks: exists
              ? state.bookmarks.filter((item) => item.id !== bookmark.id)
              : [bookmark, ...state.bookmarks],
          };
        }),
      removeBookmark: (bookmarkId) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((item) => item.id !== bookmarkId),
        })),
      clearBookmarks: () => set({ bookmarks: [] }),
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
      setFontPanelOpen: (open) =>
        set((state) => ({
          isFontPanelOpen: open,
          isBookmarksOpen: open ? false : state.isBookmarksOpen,
        })),
      setSearchOpen: (open) =>
        set((state) => ({
          isSearchOpen: open,
          isBookmarksOpen: open ? false : state.isBookmarksOpen,
        })),
      setBookmarksOpen: (open) =>
        set((state) => ({
          isBookmarksOpen: open,
          isFontPanelOpen: open ? false : state.isFontPanelOpen,
          isSearchOpen: open ? false : state.isSearchOpen,
        })),
      toggleBookmarksOpen: () =>
        set((state) => ({
          isBookmarksOpen: !state.isBookmarksOpen,
          isFontPanelOpen: state.isBookmarksOpen ? state.isFontPanelOpen : false,
          isSearchOpen: state.isBookmarksOpen ? state.isSearchOpen : false,
        })),
      closePanels: () => set({ isFontPanelOpen: false, isSearchOpen: false, isBookmarksOpen: false }),
    }),
    {
      name: 'quran-app-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        theme: state.theme,
        bookmarks: state.bookmarks,
        isSurahSidebarOpen: state.isSurahSidebarOpen,
      }),
    },
  ),
);
