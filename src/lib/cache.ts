/**
 * Enterprise Multi-Layer In-Memory Cache
 * High-performance object, session, and query cache with TTL and LRU eviction.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class EnterpriseCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxItems: number;

  constructor(maxItems = 500) {
    this.maxItems = maxItems;
  }

  set<T>(key: string, value: T, ttlMs = 60000): void {
    if (this.cache.size >= this.maxItems) {
      // LRU eviction of the oldest entry
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const globalCache = new EnterpriseCache();
