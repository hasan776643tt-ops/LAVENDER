// src/services/storageService.js

class StorageService {

  constructor(prefix = "lavender") {

    this.prefix = prefix;

  }



  key(name) {

    return `${this.prefix}:${name}`;

  }



  save(name, data) {

    try {

      const payload = {

        data,

        updatedAt:
          new Date().toISOString()

      };

      localStorage.setItem(
        this.key(name),
        JSON.stringify(payload)
      );

      return true;

    } catch (error) {

      console.error(
        "Storage Save Error:",
        error
      );

      return false;

    }

  }



  load(
    name,
    defaultValue = null
  ) {

    try {

      const value =
        localStorage.getItem(
          this.key(name)
        );

      if (!value)
        return defaultValue;

      const parsed =
        JSON.parse(value);

      return parsed.data;

    } catch (error) {

      console.error(
        "Storage Load Error:",
        error
      );

      return defaultValue;

    }

  }



  exists(name) {

    return (
      localStorage.getItem(
        this.key(name)
      ) !== null
    );

  }



  update(name, updates) {

    const current =
      this.load(name, {});

    const updated = {

      ...current,

      ...updates

    };

    return this.save(
      name,
      updated
    );

  }



  remove(name) {

    localStorage.removeItem(
      this.key(name)
    );

  }



  clear() {

    Object.keys(
      localStorage
    )
      .filter(key =>
        key.startsWith(
          `${this.prefix}:`
        )
      )
      .forEach(key =>
        localStorage.removeItem(
          key
        )
      );

  }



  backup() {

    const backup = {};

    Object.keys(
      localStorage
    )
      .filter(key =>
        key.startsWith(
          `${this.prefix}:`
        )
      )
      .forEach(key => {

        backup[key] =
          localStorage.getItem(
            key
          );

      });

    return backup;

  }



  getStats() {

    const keys =
      Object.keys(
        localStorage
      ).filter(key =>
        key.startsWith(
          `${this.prefix}:`
        )
      );

    return {

      totalKeys:
        keys.length,

      keys

    };

  }

}



export const storageService =
  new StorageService();

export default storageService;
