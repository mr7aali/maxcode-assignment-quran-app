'use client';

import { useCallback, useEffect } from 'react';
import { useAppStore, type Theme } from '@/store/useAppStore';

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('light-paper-texture', theme === 'light');
}

function readStoredTheme(): Theme | null {
  const stored = window.localStorage.getItem('quran-theme');
  return stored === 'light' || stored === 'dark' ? stored : null;
}

export function useTheme() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    if (storedTheme && storedTheme !== theme) {
      applyTheme(storedTheme);
      setTheme(storedTheme);
      return;
    }

    applyTheme(theme);
    window.localStorage.setItem('quran-theme', theme);
  }, [setTheme, theme]);

  const setAndApplyTheme = useCallback(
    (nextTheme: Theme) => {
      applyTheme(nextTheme);
      window.localStorage.setItem('quran-theme', nextTheme);
      setTheme(nextTheme);
    },
    [setTheme],
  );

  const toggleAndApplyTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    window.localStorage.setItem('quran-theme', nextTheme);
    toggleTheme();
  }, [theme, toggleTheme]);

  return {
    theme,
    isDark: theme === 'dark',
    setTheme: setAndApplyTheme,
    toggleTheme: toggleAndApplyTheme,
  };
}

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useTheme();
  return children;
}
