interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class LruCache {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  public constructor(
    private readonly maxEntries = 500,
    private readonly defaultTtlMs = 60 * 60 * 1000,
  ) {}

  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value as T;
  }

  public set<T>(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });

    while (this.store.size > this.maxEntries) {
      const oldestKey = this.store.keys().next().value as string | undefined;
      if (!oldestKey) {
        break;
      }
      this.store.delete(oldestKey);
    }
  }

  public delete(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }
}

export const sharedCache = new LruCache();
export const SURAH_TTL_MS = 60 * 60 * 1000;
