'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useKeyboard(): void {
  const setSearchOpen = useAppStore((state) => state.setSearchOpen);
  const closePanels = useAppStore((state) => state.closePanels);
  const setSurahSidebarOpen = useAppStore((state) => state.setSurahSidebarOpen);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      const isSearchShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (isSearchShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === 'Escape') {
        closePanels();
        if (window.innerWidth < 768) {
          setSurahSidebarOpen(false);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePanels, setSearchOpen, setSurahSidebarOpen]);
}
