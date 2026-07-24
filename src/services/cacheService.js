class CacheService {
  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, value);
    return value;
  }

  get(key) {
    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  remove(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  keys() {
    return [...this.cache.keys()];
  }

  values() {
    return [...this.cache.values()];
  }
}

export const cacheService = new CacheService();
