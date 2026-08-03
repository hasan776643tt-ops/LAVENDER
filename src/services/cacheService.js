// src/services/cacheService.js


class CacheService {



  constructor(){

    this.cache =
      new Map();

  }



  set(
    key,
    value,
    ttl = null
  ){


    if (!key) {

      throw new Error(
        "CACHE_KEY_REQUIRED"
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



  get(key){


    const item =
      this.cache.get(
        key
      );


    if (!item) {

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


      return null;

    }



    return item.value;

  }



  has(key){


    return (
      this.get(key) !== null
    );

  }



  remove(key){


    return this.cache.delete(
      key
    );

  }



  clear(){


    this.cache.clear();


    return true;

  }



  keys(){


    return [
      ...this.cache.keys()
    ];

  }



  values(){


    return [

      ...this.cache.values()

    ]
    .map(
      item =>
        item.value
    );

  }



  size(){


    return this.cache.size;

  }



  getInfo(){


    return {

      size:
        this.cache.size,


      keys:
        this.keys()

    };

  }


}



export default Object.freeze(
  new CacheService()
);
