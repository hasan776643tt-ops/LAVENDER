// src/services/storageService.js


import {
  createError
}
from "../utils/errorHandler.js";



class StorageService {



  constructor(prefix = "lavender") {


    this.prefix =
      prefix;


    this.version =
      "3.0.0";


  }





  key(name) {


    if (!name) {


      throw createError(

        "Storage key is required",

        "STORAGE_KEY_REQUIRED"

      );


    }



    return `${this.prefix}:${name}`;


  }





  async save(
    name,
    data
  ) {


    const storage =
      this.getStorage();



    const payload = {


      version:
        this.version,


      data,


      updatedAt:
        new Date().toISOString()


    };



    try {


      storage.setItem(

        this.key(name),

        JSON.stringify(payload)

      );



      return true;



    } catch(error) {


      throw createError(

        error.message,

        "STORAGE_SAVE_FAILED"

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


      const value =

        this.getStorage()

        .getItem(

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





  async update(
    name,
    updater
  ) {


    if (
      typeof updater !== "function"
    ) {


      throw createError(

        "Storage updater is required",

        "STORAGE_UPDATER_REQUIRED"

      );


    }



    const current =
      await this.load(
        name,
        []
      );



    const updated =
      await updater(
        current
      );



    return this.save(
      name,
      updated
    );


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

          storage.removeItem(
            key
          )

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


      throw createError(

        "Local storage is not available",

        "LOCAL_STORAGE_NOT_AVAILABLE"

      );


    }



    return localStorage;


  }



}



export default Object.freeze(

  new StorageService()

);
