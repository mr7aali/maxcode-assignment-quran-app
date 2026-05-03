'use client';

import { BookOpen, Bookmark, Home, List, Moon, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function IconSidebar() {
  const toggleSurahSidebar = useAppStore((state) => state.toggleSurahSidebar);
  const setSearchOpen = useAppStore((state) => state.setSearchOpen);
  const setFontPanelOpen = useAppStore((state) => state.setFontPanelOpen);
  const isFontPanelOpen = useAppStore((state) => state.isFontPanelOpen);

  return (
    <nav className="fixed left-0 top-0 z-40 flex h-screen w-14 flex-col items-center border-r border-border-default bg-bg-sidebar py-3">
      <Link
        aria-label="Quran app home"
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-gold to-accent-gold-light text-bg-primary shadow-lg shadow-accent-gold/10"
        href="/"
      >
        <Moon className="h-5 w-5" />
      </Link>

      <div className="flex flex-1 flex-col items-center gap-2">
        <Tooltip label="Home">
          <Link
            aria-label="Home"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition hover:bg-bg-tertiary hover:text-accent-gold"
            href="/"
          >
            <Home className="h-5 w-5" />
          </Link>
        </Tooltip>
        <Tooltip label="Surahs">
          <Button aria-label="Toggle surah list" size="icon" variant="ghost" onClick={toggleSurahSidebar}>
            <List className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip label="Search">
          <Button aria-label="Open search" size="icon" variant="ghost" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip label="Bookmarks">
          <Button aria-label="Bookmarks unavailable" disabled size="icon" variant="ghost">
            <Bookmark className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip label="Settings">
          <Button
            aria-label="Open settings"
            className={cn(isFontPanelOpen && 'text-accent-gold')}
            size="icon"
            variant="ghost"
            onClick={() => setFontPanelOpen(!isFontPanelOpen)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>

      <BookOpen className="h-5 w-5 text-accent-gold/70" aria-hidden="true" />
    </nav>
  );
}
