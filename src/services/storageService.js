// src/services/storageService.js


class StorageService {


  constructor(prefix = "lavender") {


    this.prefix =
      prefix;


    this.version =
      "3.0.0";


  }





  key(name) {


    return `${this.prefix}:${name}`;


  }





  async save(name, data) {


    if (!name) {


      throw new Error(

        "STORAGE_KEY_REQUIRED"

      );


    }



    try {


      const payload = {



        version:
          this.version,



        data,



        updatedAt:
          new Date().toISOString()



      };



      this.getStorage()

        .setItem(

          this.key(name),

          JSON.stringify(payload)

        );



      return true;



    } catch(error) {


      throw new Error(

        `STORAGE_SAVE_FAILED: ${error.message}`

      );


    }


  }





  async load(
    name,
    defaultValue = []
  ) {


    if (!name) {


      return defaultValue;


    }



    try {


      const storage =
        this.getStorage();



      const value =

        storage.getItem(

          this.key(name)

        );



      if (!value) {


        return defaultValue;


      }



      const parsed =
        JSON.parse(value);



      return (

        parsed?.data

        ??

        parsed

      );



    } catch(error) {


      return defaultValue;


    }


  }





  async exists(name) {


    if (!name) {


      return false;


    }



    return (

      this.getStorage()

      .getItem(

        this.key(name)

      )

      !== null

    );


  }





  async remove(name) {


    if (!name) {


      return false;


    }



    try {


      this.getStorage()

        .removeItem(

          this.key(name)

        );



      return true;



    } catch(error) {


      return false;


    }


  }





  async clear() {


    try {


      const storage =
        this.getStorage();



      Object.keys(storage)

        .filter(

          key =>

          key.startsWith(

            `${this.prefix}:`

          )

        )

        .forEach(

          key =>

          storage.removeItem(key)

        );



      return true;



    } catch(error) {


      return false;


    }


  }





  async getStats() {


    const storage =
      this.getStorage();



    const keys =


      Object.keys(storage)

      .filter(

        key =>

        key.startsWith(

          `${this.prefix}:`

        )

      );



    return {


      version:
        this.version,



      totalKeys:
        keys.length,



      keys


    };


  }





  getStorage() {


    if (

      typeof localStorage === "undefined"

    ) {


      throw new Error(

        "LOCAL_STORAGE_NOT_AVAILABLE"

      );


    }



    return localStorage;


  }



}



export default Object.freeze(

  new StorageService()

);
