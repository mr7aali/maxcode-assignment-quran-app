'use client';

import { BookOpen, Bookmark, Home, List, Moon, Search, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function IconSidebar() {
  const toggleSurahSidebar = useAppStore((state) => state.toggleSurahSidebar);
  const setSearchOpen = useAppStore((state) => state.setSearchOpen);
  const setFontPanelOpen = useAppStore((state) => state.setFontPanelOpen);
  const isFontPanelOpen = useAppStore((state) => state.isFontPanelOpen);

  return (
    <nav className="fixed left-0 top-0 z-40 flex h-screen w-14 flex-col items-center border-r border-[color-mix(in_srgb,var(--sidebar-icon-hover)_70%,black)] bg-[var(--sidebar-icon-bg)] py-3">
      <Link
        aria-label="Quran app home"
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-gold to-accent-gold-light text-[var(--sidebar-icon-bg)] shadow-[0_8px_24px_rgba(201,168,76,0.18)]"
        href="/"
      >
        <Moon className="h-5 w-5" />
      </Link>

      <div className="flex flex-1 flex-col items-center gap-2">
        <Tooltip label="Home">
          <Link
            aria-label="Home"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--sidebar-icon-text)] transition hover:bg-[var(--sidebar-icon-hover)] hover:text-[var(--sidebar-icon-active)]"
            href="/"
          >
            <Home className="h-5 w-5" />
          </Link>
        </Tooltip>
        <Tooltip label="Surahs">
          <Button
            aria-label="Toggle surah list"
            className="text-[var(--sidebar-icon-text)] hover:bg-[var(--sidebar-icon-hover)] hover:text-[var(--sidebar-icon-active)]"
            size="icon"
            variant="ghost"
            onClick={toggleSurahSidebar}
          >
            <List className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip label="Search">
          <Button
            aria-label="Open search"
            className="text-[var(--sidebar-icon-text)] hover:bg-[var(--sidebar-icon-hover)] hover:text-[var(--sidebar-icon-active)]"
            size="icon"
            variant="ghost"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip label="Bookmarks">
          <Button
            aria-label="Bookmarks unavailable"
            className="text-[var(--sidebar-icon-text)]"
            disabled
            size="icon"
            variant="ghost"
          >
            <Bookmark className="h-5 w-5" />
          </Button>
        </Tooltip>
        <Tooltip label="Settings">
          <Button
            aria-label="Open settings"
            className={cn(
              'text-[var(--sidebar-icon-text)] hover:bg-[var(--sidebar-icon-hover)] hover:text-[var(--sidebar-icon-active)]',
              isFontPanelOpen && 'text-[var(--sidebar-icon-active)]',
            )}
            size="icon"
            variant="ghost"
            onClick={() => setFontPanelOpen(!isFontPanelOpen)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>

      <div className="mb-4 flex rotate-90 justify-center">
        <ThemeToggle className="scale-75 border-[color-mix(in_srgb,var(--sidebar-icon-hover)_80%,white)]" />
      </div>
      <BookOpen className="h-5 w-5 text-[var(--sidebar-icon-active)] opacity-75" aria-hidden="true" />
    </nav>
  );
}
