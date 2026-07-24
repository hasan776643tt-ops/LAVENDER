class StorageService {
  constructor(prefix = "lavender") {
    this.prefix = prefix;
  }

  key(name) {
    return `${this.prefix}:${name}`;
  }

  save(name, data) {
    localStorage.setItem(
      this.key(name),
      JSON.stringify(data)
    );
  }

  load(name, defaultValue = null) {
    const value = localStorage.getItem(
      this.key(name)
    );

    if (!value) return defaultValue;

    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }

  remove(name) {
    localStorage.removeItem(this.key(name));
  }

  clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${this.prefix}:`))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export const storageService = new StorageService();
