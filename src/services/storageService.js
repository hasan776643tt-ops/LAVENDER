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


    } catch(error) {


      console.error(
        "Storage save failed:",
        error
      );


      return false;

    }

  }




  load(name, defaultValue = null) {

    try {


      const item =
        localStorage.getItem(
          this.key(name)
        );


      if (!item) {

        return defaultValue;

      }


      const parsed =
        JSON.parse(item);


      return (
        parsed.data ??
        defaultValue
      );


    } catch(error) {


      console.error(
        "Storage load failed:",
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





  remove(name) {

    try {

      localStorage.removeItem(
        this.key(name)
      );


      return true;


    } catch(error) {


      console.error(
        "Storage remove failed:",
        error
      );


      return false;


    }

  }





  clear() {

    try {


      Object.keys(localStorage)

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


      return true;


    } catch(error) {


      return false;


    }

  }





  backup() {

    const backup = {};


    Object.keys(localStorage)

    .filter(key =>

      key.startsWith(
        `${this.prefix}:`
      )

    )

    .forEach(key => {


      backup[key] =
        JSON.parse(
          localStorage.getItem(key)
        );


    });


    return backup;


  }





  restore(data) {


    if (!data || typeof data !== "object") {

      return false;

    }


    try {


      Object.entries(data)

      .forEach(([key,value])=>{


        localStorage.setItem(

          key,

          JSON.stringify(value)

        );


      });


      return true;


    } catch(error) {


      return false;


    }

  }





  getStats() {


    const keys =

      Object.keys(localStorage)

      .filter(key =>

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



// Singleton Storage Instance

const storageService =
  new StorageService();



export default storageService;
