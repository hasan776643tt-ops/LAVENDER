// src/services/cacheService.js


import {
  createError
}
from "../utils/errorHandler.js";



class CacheService {



  constructor() {


    this.cache =
      new Map();


    this.stats = {


      hits:
        0,


      misses:
        0


    };


  }





  set(
    key,
    value,
    ttl = null
  ) {


    this.validateKey(
      key
    );


    this.validateTTL(
      ttl
    );



    this.cache.set(

      key,

      {

        value,


        ttl,


        createdAt:
          Date.now()

      }

    );



    return value;


  }





  get(key) {


    this.validateKey(
      key
    );



    const item =
      this.cache.get(
        key
      );



    if (!item) {


      this.stats.misses++;


      return null;


    }



    if (

      item.ttl !== null &&

      Date.now() -
      item.createdAt >=
      item.ttl

    ) {


      this.remove(
        key
      );


      this.stats.misses++;


      return null;


    }



    this.stats.hits++;



    return item.value;


  }





  has(key) {


    this.validateKey(
      key
    );



    return this.get(key) !== null;


  }





  remove(key) {


    this.validateKey(
      key
    );



    return this.cache.delete(
      key
    );


  }





  clear() {


    this.cache.clear();



    this.stats = {


      hits:
        0,


      misses:
        0


    };



    return true;


  }





  cleanup() {


    for (

      const key of this.keys()

    ) {


      this.get(
        key
      );


    }



    return true;


  }





  keys() {


    return [

      ...this.cache.keys()

    ];


  }





  values() {


    return [

      ...this.cache.values()

    ]

    .map(

      item =>

        item.value

    );


  }





  size() {


    return this.cache.size;


  }





  getInfo() {


    return {


      size:
        this.cache.size,


      keys:
        this.keys(),


      stats:
        {

          ...this.stats

        }


    };


  }





  resetStats() {


    this.stats = {


      hits:
        0,


      misses:
        0


    };



    return true;


  }





  validateKey(key) {


    if (

      !key ||

      typeof key !== "string"

    ) {


      throw createError(

        "Cache key is required",

        "CACHE_KEY_REQUIRED"

      );


    }



    return true;


  }





  validateTTL(ttl) {


    if (

      ttl !== null &&

      (

        typeof ttl !== "number" ||

        ttl < 0

      )

    ) {


      throw createError(

        "Cache ttl is invalid",

        "CACHE_TTL_INVALID"

      );


    }



    return true;


  }



}



export default Object.freeze(

  new CacheService()

);
