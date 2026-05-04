'use client';

import { Bookmark, BookmarkX, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

function formatSavedDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function BookmarksPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = useAppStore((state) => state.isBookmarksOpen);
  const bookmarks = useAppStore((state) => state.bookmarks);
  const setBookmarksOpen = useAppStore((state) => state.setBookmarksOpen);
  const removeBookmark = useAppStore((state) => state.removeBookmark);
  const clearBookmarks = useAppStore((state) => state.clearBookmarks);

  useEffect(() => {
    function onPointerDown(event: PointerEvent): void {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setBookmarksOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener('pointerdown', onPointerDown);
    }

    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, setBookmarksOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="fixed bottom-3 left-3 right-3 z-50 flex max-h-[72vh] animate-fade-scale flex-col overflow-hidden rounded-xl border border-border-default bg-bg-surah-list shadow-[var(--shadow-lg)] md:bottom-4 md:left-16 md:right-auto md:top-4 md:max-h-none md:w-[390px]"
      role="dialog"
      aria-modal="false"
      aria-label="Bookmarks"
    >
      <header className="flex h-16 items-center justify-between gap-3 border-b border-border-default px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--accent-gold-border)] bg-accent-gold-bg text-accent-gold">
            <Bookmark className="h-4 w-4 fill-current" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">Bookmarks</p>
            <p className="text-xs text-text-muted">{bookmarks.length} saved</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {bookmarks.length > 0 && (
            <Button aria-label="Clear bookmarks" size="icon" variant="ghost" onClick={clearBookmarks}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button aria-label="Close bookmarks" size="icon" variant="ghost" onClick={() => setBookmarksOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {bookmarks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center text-text-secondary">
          <BookmarkX className="mb-3 h-9 w-9 text-text-muted" />
          <p className="text-sm font-medium text-text-primary">No bookmarks saved</p>
        </div>
      ) : (
        <div className="gold-scrollbar flex-1 overflow-y-auto p-2">
          {bookmarks.map((bookmark) => {
            const savedDate = formatSavedDate(bookmark.createdAt);

            return (
              <article
                key={bookmark.id}
                className="group grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-transparent px-3 py-3 transition hover:border-border-default hover:bg-bg-secondary"
              >
                <Link
                  className="min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold"
                  href={`/surah/${bookmark.surahNumber}#ayah-${bookmark.ayahNumber}`}
                  onClick={() => setBookmarksOpen(false)}
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                    <span className="rounded-full border border-[var(--accent-gold-border)] bg-accent-gold-bg px-2 py-0.5 font-medium text-accent-gold">
                      {bookmark.surahNumber}:{bookmark.ayahNumber}
                    </span>
                    <span className="font-medium text-text-secondary">{bookmark.surahName}</span>
                    {savedDate && <span>{savedDate}</span>}
                  </div>

                  <p className="arabic-text line-clamp-2 text-right text-xl text-text-arabic" dir="rtl">
                    {bookmark.arabicText}
                  </p>

                  {bookmark.englishTranslation && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                      {bookmark.englishTranslation}
                    </p>
                  )}
                </Link>

                <Button
                  aria-label={`Remove ${bookmark.surahNumber}:${bookmark.ayahNumber} bookmark`}
                  className={cn(
                    'self-start text-text-muted opacity-100 md:opacity-0 md:group-hover:opacity-100',
                  )}
                  size="icon"
                  variant="ghost"
                  onClick={() => removeBookmark(bookmark.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
