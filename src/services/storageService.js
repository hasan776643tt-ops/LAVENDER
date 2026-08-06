// src/storage/storageService.js


import {
  createError
}
from "../utils/errorHandler.js";



class StorageService {



  constructor(prefix = "lavender") {


    this.prefix = prefix;


    this.version = "3.0.0";


  }




  createKey(name) {


    if (!name) {


      throw createError(

        "Storage key is required",

        "STORAGE_KEY_REQUIRED"

      );

    }


    return `${this.prefix}:${name}`;


  }





  getStorage() {


    if (

      typeof window === "undefined"

      ||

      !window.localStorage

    ) {


      throw createError(

        "Local storage is unavailable",

        "LOCAL_STORAGE_NOT_AVAILABLE"

      );

    }


    return window.localStorage;


  }





  async save(name, data) {


    try {


      const payload = {


        version: this.version,


        data,


        createdAt:
          new Date().toISOString(),


        updatedAt:
          new Date().toISOString()


      };



      this.getStorage().setItem(

        this.createKey(name),

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


    try {


      const item =

        this.getStorage().getItem(

          this.createKey(name)

        );



      if (!item) {


        return defaultValue;


      }



      const parsed =

        JSON.parse(item);



      return (

        parsed.data

        ??

        defaultValue

      );



    } catch(error) {


      return defaultValue;


    }


  }





  async update(
    name,
    callback
  ) {


    if (

      typeof callback !== "function"

    ) {


      throw createError(

        "Update callback is required",

        "STORAGE_UPDATE_REQUIRED"

      );


    }



    const current =

      await this.load(

        name,

        []

      );



    const updated =

      await callback(current);



    return this.save(

      name,

      updated

    );


  }





  async exists(name) {


    return (

      this.getStorage()

      .getItem(

        this.createKey(name)

      )

      !== null

    );


  }





  async remove(name) {


    try {


      this.getStorage()

      .removeItem(

        this.createKey(name)

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



}



const storageService =

  new StorageService();



export default Object.freeze(

  storageService

);
