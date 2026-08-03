// src/services/storageService.js

class StorageService {


  constructor(prefix = "lavender") {

    this.prefix = prefix;

  }



  key(name) {

    return `${this.prefix}:${name}`;

  }



  save(name, data) {

    if (!name) {

      return false;

    }


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


    } catch(error) {


      return false;

    }

  }



  load(name, defaultValue = []) {


    if (!name) {

      return defaultValue;

    }


    try {


      const value =
        localStorage.getItem(
          this.key(name)
        );


      if (!value) {

        return defaultValue;

      }


      const parsed =
        JSON.parse(value);



      return (
        parsed?.data ??
        parsed
      );


    } catch(error) {


      return defaultValue;

    }

  }



  exists(name) {


    if (!name) {

      return false;

    }


    return (
      localStorage.getItem(
        this.key(name)
      ) !== null
    );

  }



  remove(name) {


    if (!name) {

      return false;

    }


    try {


      localStorage.removeItem(
        this.key(name)
      );


      return true;


    } catch(error) {


      return false;

    }

  }



  clear() {


    try {


      Object.keys(localStorage)

        .filter(
          key =>
            key.startsWith(
              `${this.prefix}:`
            )
        )

        .forEach(
          key =>
            localStorage.removeItem(key)
        );


      return true;


    } catch(error) {


      return false;

    }

  }



  getStats() {


    const keys =

      Object.keys(localStorage)

        .filter(
          key =>
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


export default Object.freeze(
  new StorageService()
);
