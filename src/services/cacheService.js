// src/services/cacheService.js


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


    if (
      ttl !== null &&
      ttl < 0
    ) {

      throw new Error(
        "CACHE_TTL_INVALID"
      );

    }



    this.cache.set(

      key,

      {

        value,


        createdAt:
          Date.now(),


        ttl

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


    return this.get(key) !== null;


  }





  remove(key) {


    return this.cache.delete(
      key
    );


  }





  clear() {


    this.cache.clear();


    return true;


  }





  cleanup() {


    const keys =
      this.keys();



    keys.forEach(

      key =>

      this.get(key)

    );


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
        this.stats


    };


  }





  validateKey(key) {


    if (
      !key ||
      typeof key !== "string"
    ) {


      throw new Error(
        "CACHE_KEY_REQUIRED"
      );


    }


    return true;


  }


}



export default Object.freeze(

  new CacheService()

);
